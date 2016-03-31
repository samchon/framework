#include <samchon/protocol/service/IPUserPair.hpp>
#	include <samchon/protocol/service/Server.hpp>
#	include <samchon/protocol/service/User.hpp>

#include <boost/asio.hpp>
#include <mutex>
#include <thread>
#include <sstream>

#include <samchon/library/Datetime.hpp>
#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>
#include <samchon/protocol/InvokeParameter.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::service;

using namespace boost::asio;
using namespace boost::asio::ip;

IPUserPair::IPUserPair(Server *server, const string &ip)
{
	this->server = server;
	this->ip = ip;
}
auto IPUserPair::getSessionID(Socket *socket, size_t sequence) -> std::string
{
	std::string sessionID;

	//GET SESSION_ID FROM CLIENT'S COOKIE
	{
		boost::system::error_code error;

		//GET SESSION ID
		vector<unsigned char> piece(1000, NULL);
		socket->read_some(boost::asio::buffer(piece), error);

		if (error)
			return "";

		std::string str((char*)piece.data());
		shared_ptr<XML> xml(new XML(str));

		shared_ptr<Invoke> invoke(new Invoke());
		invoke->construct(xml);

		sessionID = invoke->at(0)->getValue<string>();
	}
	
	UniqueReadLock uk(server->mtx);
	if (sessionID.empty() == true || server->has(sessionID) == false)
	{
		//ISSUE SESSION ID
		sessionID = issueSessionID(sequence);

		//IF SESSION_ID IS NOT UNIQUE
		if (server->has(sessionID) == true)
			throw runtime_error("Session ID is not unique");

		uk.unlock();

		//NOTIFY TO CLIENT
		shared_ptr<Invoke> invoke( new Invoke("notifySessionID") );
		invoke->emplace_back( new InvokeParameter("id", sessionID) );
		
		std::string &data = invoke->toXML()->toString();
		boost::system::error_code error;

		socket->write_some(boost::asio::buffer(data), error);
		if (error)
			return "";
	}

	return sessionID;
}

auto IPUserPair::issueSessionID(size_t sequence) const -> std::string
{
	std::string &name = server->NAME();
	int port = server->PORT();
	long long linuxTime = Datetime().toLinuxTime();

	stringstream sstream;
	sstream << name << "::"
		<< hex << port << "::"
		<< hex << sequence << "::"
		<< hex << linuxTime;

	return sstream.str();
}