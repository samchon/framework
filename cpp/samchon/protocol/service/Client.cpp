#include <samchon/protocol/service/Client.hpp>
#	include <samchon/protocol/service/Server.hpp>
#	include <samchon/protocol/service/User.hpp>
#	include <samchon/protocol/service/Service.hpp>

#include <boost/asio.hpp>
#include <boost/bind.hpp>

#include <samchon/library/SQLi.hpp>
#include <samchon/library/SQLStatement.hpp>
#include <samchon/library/XML.hpp>

#include <samchon/protocol/Invoke.hpp>

using namespace std;

using namespace boost::asio;
using namespace boost::asio::ip;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::service;

/* --------------------------------------------------------
	CONSTRUCTORS
-------------------------------------------------------- */
Client::Client(User *user, long no, tcp::socket *socket)
	: super()
{
	this->user = user;
	this->no = no;

	this->socket = socket;
}
Client::~Client()
{
	delete service;
}

auto Client::__keepAlive() -> ServiceKeeper
{
	return ServiceKeeper(user, this);
}

/* --------------------------------------------------------
	GETTERS
-------------------------------------------------------- */
auto Client::getUser() const -> User*
{
	return user;
}
auto Client::getService() const -> Service*
{
	return service;
}
auto Client::getNo() const -> long
{
	return no;
}

/* --------------------------------------------------------
	SOCKET
-------------------------------------------------------- */
void Client::listen()
{
	KEEP_CLIENT_ALIVE;

	super::listen();
}

void Client::sendData(shared_ptr<Invoke> invoke)
{
	KEEP_CLIENT_ALIVE;

	super::sendData(invoke);
}
// void Client::sendData(shared_ptr<Invoke> invoke, const vector<unsigned char> &data)
// {
// 	KEEP_CLIENT_ALIVE;
// 
// 	invoke->push_back(new InvokeParameter(_T("data"), _T("byteArray"), _T("")));
// 	invoke->push_back(new InvokeParameter(_T("size"), (long long)data.size()));
// 
// 	boost::system::error_code error;
// 	String &header = invoke->toXML()->toString();
// 
// 	socketMutex.lock();
// 	do
// 	{
// 		socket->write_some(boost::asio::buffer(header), error);
// 		if (error)
// 			break;
// 
// 		socket->write_some(boost::asio::buffer(data), error);
// 	} while (false);
// 	socketMutex.unlock();
// }
void Client::sendError(const long errorID)
{
// 	SQLi *sqli;
// 	shared_ptr<SQLStatement> stmt;

	//FIELDS
	long serviceID;
	//long errorID;
	String &userID = user->getID();

	if (service == nullptr)
	{
		//sqli = getUser()->getServer()->getSQLi();
		serviceID = LONG_MIN;
	}
	else
	{
		//sqli = service->getSQLi();
		serviceID = service->ID();
	}
	//stmt = sqli->createStatement();

// 	if (sqli != nullptr)
// 	{
// 		try
// 		{
// 			stmt->prepare
// 			(
// 				_T("goInsertError ?, ?, ?"), serviceID, errorID, userID
// 			);
// 			stmt->execute();
// 		}
// 		catch (exception &e)
// 		{
// 			//DO NOTHING
// 		}
// 		stmt.reset();
// 	}

	shared_ptr<Invoke> invoke(new Invoke(_T("handleError")));
	invoke->push_back(new InvokeParameter(_T("serviceID"), serviceID));
	invoke->push_back(new InvokeParameter(_T("id"), errorID));

	sendData(invoke);
}
void Client::replyData(shared_ptr<Invoke> invoke)
{
	//archiveReplyDataHistory(invoke);

	String &listener = invoke->getListener();
	if (listener == _T("goService") || listener == _T("goAuthorization"))
	{
		goService(invoke->at(0)->getValue<String>());
	}
	else if (listener == _T("goLogin"))
		((User*)user)->goLogin(this, invoke);
	else if (listener == _T("goLogout"))
		((User*)user)->goLogout(this);
	else if (listener == _T("goJoin"))
		((User*)user)->goJoin(this, invoke);
	else
	{
		if (service != nullptr)
			service->replyData(invoke);
	}
}

void Client::goService(const String &name)
{
	if (service != nullptr)
		return;

	long authority;
	bool satisfactory;

	service = createService(name);
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

	shared_ptr<Invoke> replyInvoke(new Invoke(_T("handleAuthority")));
	replyInvoke->push_back(new InvokeParameter(_T("authority"), authority));
	replyInvoke->push_back(new InvokeParameter(_T("satisfactory"), satisfactory));

	sendData(replyInvoke);
}
// void Client::archiveReplyDataHistory(shared_ptr<Invoke> invoke)
// {
// 	SQLi *sqli;
// 	shared_ptr<SQLStatement> stmt;
// 
// 	long serviceID;
// 	String &listener = invoke->getListener();
// 	String &userID = getUser()->getID();
// 
// 	if (service == nullptr)
// 	{
// 		sqli = getUser()->getServer()->getSQLi();
// 		serviceID = 0;
// 	}
// 	else
// 	{
// 		sqli = service->getSQLi();
// 		serviceID = service->ID();
// 	}
// 
// 	if (sqli == nullptr)
// 		return;
// 
// 	stmt = sqli->createStatement();
// 
// 	try
// 	{
// 		stmt->prepare(invoke->toSQL(), serviceID, listener, userID);
// 		stmt->execute();
// 	}
// 	catch (exception &e)
// 	{
// 		//DO NOTHING
// 	}
// }