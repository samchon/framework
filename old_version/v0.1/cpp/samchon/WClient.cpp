#include <samchon/Client.hpp>
#include <samchon/Server.hpp>
#include <samchon/User.hpp>
#include <samchon/UserClientPair.hpp>

#include <iostream>
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
	WClient::BasicClient(const WUser *user, long no, void *socket)
		: super()
	{
		this->user = user;
		this->no = no;
		this->socket = (boost::asio::ip::tcp::socket *)socket;
	}
	template<> WClient::~BasicClient() 
	{
		socket->close();
	}

	template<> auto WClient::__keepAlive() -> WUserClientPair
	{
		return WUserClientPair((WUser*)user, this);
	}

	/* --------------------------------------------------------
		GETTERS
	-------------------------------------------------------- */
	template<> auto WClient::getUser() const -> const WUser*
	{
		return user;
	}
	template<> auto WClient::getService() const -> WService*
	{
		return service.get();
	}
	template<> auto WClient::getNo() const -> long
	{
		return no;
	}

	/* --------------------------------------------------------
		SOCKET
	-------------------------------------------------------- */
	template<> void WClient::listen()
	{
		KEEP_CLIENT_ALIVE;
		
		wstring data;
		vector<wchar_t> piece;
		boost::system::error_code error;

		//DO ITS OWN WORK
		while (true)
		{
			piece.assign(BUFFER_SIZE(), NULL);
			socket->read_some(boost::asio::buffer(&piece[0], BUFFER_SIZE()), error);
			if (error)
				break;

			data.append(piece.data());
			if (data.rfind(L"</invoke>") == wstring::npos)
				continue;

			vector<wstring> &invokeArray = WStringUtil::betweens(data, L"<invoke", L"</invoke>");
			for (size_t i = 0; i < invokeArray.size(); i++)
			{
				wstring &message = L"<invoke" + invokeArray[i] + L"</invoke>";

				shared_ptr<WXML> xml(new WXML(message));
				shared_ptr<WInvoke> invoke(new WInvoke(xml));

				try
				{
					replyData(invoke);
				}
				catch (const long errorID)
				{
					sendError(errorID);
				}
			}
			data = move( data.substr(data.rfind(L"</invoke>") + wstring(L"</invoke>").size()) );
		}
	}

	template<> void WClient::sendData(shared_ptr<WInvoke> invoke)
	{
		KEEP_CLIENT_ALIVE;

		boost::system::error_code error;
		wstring &data = invoke->toXML()->to_string();

		socketMutex.lock();
		socket->write_some(boost::asio::buffer(data), error);
		socketMutex.unlock();
	}
	template<> void WClient::sendData(shared_ptr<WInvoke> invoke, const vector<unsigned char> &data)
	{
		KEEP_CLIENT_ALIVE;

		invoke->add(L"data", L"byteArray", L"");
		invoke->add(L"size", L"size_t", to_wstring(data.size()));
		
		boost::system::error_code error;
		wstring &header = invoke->toXML()->to_string();

		socketMutex.lock();
		do
		{
			socket->write_some(boost::asio::buffer(header), error);
			if (error)
				break;

			socket->write_some(boost::asio::buffer(data), error);
		} while (false);
		socketMutex.unlock();

		if (error)
			return;
	}
	template<> void WClient::sendError(const long errorID)
	{
		WSQLi *sqli;
		WSQLStatement *stmt;

		//FIELDS
		long serviceID;
		//long errorID;
		wstring &userID = user->getID();

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
					L"goInsertError ?, ?, ?",
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

		shared_ptr<WInvoke> invoke(new WInvoke(L"handleError"));
		invoke->add(L"serviceID", L"long", to_wstring(serviceID));
		invoke->add(L"id", L"long", to_wstring(errorID));

		sendData(invoke);
	}
	template<> void WClient::replyData(shared_ptr<WInvoke> invoke)
	{
		archiveReplyDataHistory(invoke);

		wstring &listener = invoke->getListener();
		if (listener == L"goService" || listener == L"goAuthorization")
		{
			long authority;
			bool satisfactory;

			service.reset(createService(invoke->at(0)->getValue()));
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
 
			shared_ptr<WInvoke> replyInvoke(new WInvoke(L"handleAuthority"));
			replyInvoke->add(L"authority", L"long", to_wstring(authority));
			replyInvoke->add(L"satisfactory", L"long", to_wstring(satisfactory));

			sendData(replyInvoke);
		}
		else if (listener == L"goLogin")
			((WUser*)user)->goLogin(this, invoke);
		else if (listener == L"goLogout")
			((WUser*)user)->goLogout(this);
		else if (listener == L"goJoin")
			((WUser*)user)->goJoin(this, invoke);
		else
		{
			if (service != nullptr)
				service->replyData(invoke);
		}
	}

	template<> void WClient::goService(const wstring &name)
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

		shared_ptr<WInvoke> replyInvoke(new WInvoke(L"handleAuthority"));
		replyInvoke->add(L"authority", L"long", to_wstring(authority));
		replyInvoke->add(L"satisfactory", L"long", to_wstring(satisfactory));

		sendData(replyInvoke);
	}
	template<> void WClient::archiveReplyDataHistory(shared_ptr<WInvoke> invoke)
	{
		WSQLi *sqli;
		WSQLStatement *stmt;

		long serviceID;
		wstring &listener = invoke->getListener();
		wstring &userID = getUser()->getID();

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