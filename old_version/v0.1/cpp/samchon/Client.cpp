#include <samchon/Client.hpp>
#include <samchon/Server.hpp>
#include <samchon/User.hpp>
#include <samchon/UserClientPair.hpp>

#include <boost/asio.hpp>
#include <boost/bind.hpp>
#include <samchon/Service.hpp>
#include <samchon/SQLi.hpp>
#include <samchon/SQLStatement.hpp>

#include <samchon/Invoke.hpp>
#include <samchon/XML.hpp>
#include <samchon/StringUtil.hpp>

namespace samchon
{
	/* --------------------------------------------------------
		CONSTRUCTORS
	-------------------------------------------------------- */
	Client::BasicClient(const User *user, long no, void *socket)
		: IInvoke()
	{
		this->user = user;
		this->no = no;
		this->socket = (boost::asio::ip::tcp::socket*)socket;
	}
	template<> Client::~BasicClient() 
	{
		socket->close();
	}

	template<> auto Client::__keepAlive() -> UserClientPair
	{
		return UserClientPair(((User*)user), this);
	}

	/* --------------------------------------------------------
		GETTERS
	-------------------------------------------------------- */	
	template<> auto Client::getUser() const -> const User*
	{
		return user;
	}
	template<> auto Client::getService() const -> Service*
	{
		return service.get();
	}
	template<> auto Client::getNo() const -> long
	{
		return no;
	}

	/* --------------------------------------------------------
		SOCKET
	-------------------------------------------------------- */
	template<> void Client::listen()
	{
		KEEP_CLIENT_ALIVE;

		string data;
		vector<char> piece;
		boost::system::error_code error;

		while (true)
		{
			piece.assign(BUFFER_SIZE(), NULL);
			socket->read_some(boost::asio::buffer(&piece[0], BUFFER_SIZE()), error);
			if (error) 
				break;

			data.append(piece.data());
			if (data.rfind("</invoke>") == string::npos)
				continue;

			vector<string> &invokeArray = StringUtil::betweens(data, "<invoke", "</invoke>");
			for (size_t i = 0; i < invokeArray.size(); i++)
			{
				string &message = "<invoke" + invokeArray[i] + "</invoke>";

				shared_ptr<XML> xml(new XML(message));
				shared_ptr<Invoke> invoke(new Invoke(xml));

				try
				{
					replyData(invoke);
				}
				catch (const long errorID)
				{
					sendError(errorID);
				}
			}
			data = move(data.substr(data.rfind("</invoke>") + string("</invoke>").size()));
		}
	}

	template<> void Client::sendData(shared_ptr<Invoke> invoke)
	{
		KEEP_CLIENT_ALIVE;

		boost::system::error_code error;
		string &data = invoke->toXML()->to_string();

		socketMutex.lock();
		socket->write_some(boost::asio::buffer(data), error);
		socketMutex.unlock();
	}
	template<> void Client::sendData(shared_ptr<Invoke> invoke, const vector<unsigned char> &data)
	{
		KEEP_CLIENT_ALIVE;

		invoke->add("data", "byteArray", "");
		invoke->add("size", "size_t", to_string(data.size()));

		boost::system::error_code error;
		string &header = invoke->toXML()->to_string();

		socketMutex.lock();
		do
		{
			socket->write_some(boost::asio::buffer(header), error);
			if (error)
				break;

			socket->write_some(boost::asio::buffer(data), error);
		} 
		while (false);
		socketMutex.unlock();
	}
	template<> void Client::sendError(const long errorID)
	{
		SQLi *sqli;
		SQLStatement *stmt;

		//FIELDS
		long serviceID;
		//long errorID;
		string &userID = user->getID();

		if (service == nullptr)
		{
			sqli = getUser()->getServer()->getSQLi();
			serviceID = LONG_MIN;
		}
		else
		{
			sqli = service->getSQLi();
			serviceID = service->ID();
		}
		stmt = sqli->createStatement();

		if (sqli != nullptr)
		{
			try
			{
				stmt->prepare
					(
					"goInsertError ?, ?, ?",
					serviceID,
					errorID,
					userID
					);
				stmt->execute();
			}
			catch (exception &e)
			{
				//DO NOTHING
			}
			delete stmt;
		}

		shared_ptr<Invoke> invoke(new Invoke("handleError"));
		invoke->add("serviceID", "long", to_string(serviceID));
		invoke->add("id", "long", to_string(errorID));

		sendData(invoke);
	}
	template<> void Client::replyData(shared_ptr<Invoke> invoke)
	{
		archiveReplyDataHistory(invoke);

		string &listener = invoke->getListener();
		if (listener == "goService" || listener == "goAuthorization")
		{
			goService(invoke->at(0)->getValue());
		}
		else if (listener == "goLogin")
			((User*)user)->goLogin(this, invoke);
		else if (listener == "goLogout")
			((User*)user)->goLogout(this);
		else if (listener == "goJoin")
			((User*)user)->goJoin(this, invoke);
		else
		{
			if (service != nullptr)
				service->replyData(invoke);
		}
	}

	template<> void Client::goService(const string &name)
	{
		long authority;
		bool satisfactory;

		service.reset(createService(name));
		if (service == nullptr)
		{
			authority = 0;
			satisfactory = false;
		}
		else
		{
			authority = user->getAuthority();
			satisfactory = (authority >= service->REQUIRE_AUTHORITY());
		}

		shared_ptr<Invoke> replyInvoke(new Invoke("handleAuthority"));
		replyInvoke->add("authority", "long", to_string(authority));
		replyInvoke->add("satisfactory", "long", to_string(satisfactory));

		sendData(replyInvoke);
	}
	template<> void Client::archiveReplyDataHistory(shared_ptr<Invoke> invoke)
	{
		SQLi *sqli;
		SQLStatement *stmt;

		long serviceID;
		string &listener = invoke->getListener();
		string &userID = getUser()->getID();

		if (service == nullptr)
		{
			sqli = getUser()->getServer()->getSQLi();
			serviceID = 0;
		}
		else
		{
			sqli = service->getSQLi();
			serviceID = service->ID();
		}

		if (sqli == nullptr)
			return;

		stmt = sqli->createStatement();

		try
		{
			stmt->prepare(invoke->toSQL(), serviceID, listener, userID);
			stmt->execute();
		}
		catch (exception &e)
		{
			//DO NOTHING
		}
		delete stmt;
	}
};