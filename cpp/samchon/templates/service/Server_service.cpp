#include <samchon/templates/service/Server.hpp>

#include <samchon/templates/service/User.hpp>
#include <samchon/templates/service/Client.hpp>
#include <samchon/templates/service/Service.hpp>

#include <samchon/protocol/WebClientDriver.hpp>

#include <chrono>
#include <thread>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::templates::service;

Server::Server()
	: super()
{
	std::system("pause");
}
Server::~Server()
{
}

void Server::addClient(shared_ptr<protocol::ClientDriver> driver)
{
	shared_ptr<protocol::WebClientDriver> web_driver = dynamic_pointer_cast<protocol::WebClientDriver>(driver);
	
	// IDENTIFIERS
	const std::string &session_id = web_driver->getSessionID(); // SESSION_ID -> USER
	const std::string &path = web_driver->getPath(); // PATH -> SERVICE

	///////
	// CONSTRUCT USER
	///////
	shared_ptr<User> user;
	HashMap<std::string, std::shared_ptr<User>>::iterator it;
	{
		UniqueReadLock uk(session_map_mtx);
		it = session_map.find(session_id);
	}

	if (it == session_map.end())
	{
		// CREATE USER
		user.reset(this->createUser());
		user->my_weak_ptr = user;
		
		// REGISTER TO THIS SERVER
		UniqueWriteLock uk(session_map_mtx);
		session_map.insert({ session_id, user });
	}
	else
		user = it->second; // FETCH ORDINARY USER

	///////
	// CREATE CLIENT
	///////
	shared_ptr<Client> client(user->createClient());
	client->my_weak_ptr = client;

	// REGISTER TO USER
	{
		UniqueWriteLock uk(user->client_map_mtx);

		client->no = ++user->sequence;
		user->client_map.insert({client->no, client});
	}

	///////
	// CREATE SERVICE
	///////
	Service *service = client->createService(path);
	service->client = client.get();
	service->path = path;

	// REGISTER TO CLIENT
	client->service.reset(service);

	///////
	// BEGINS COMMUNICATION
	///////
	client->driver->listen(client.get());

	// DISCONNECTED - ERASE CLIENT.
	// IF THE USER HAS NO CLIENT LEFT, THEN THE USER WILL ALSO BE ERASED.
	user->erase_client(client.get());
}

void Server::erase_user(User *user)
{
	// USER DOESN'T BE ERASED AT THAT TIME
	// IT WAITS UNTIL 30 SECONDS TO KEEP SESSION
	this_thread::sleep_for(chrono::seconds(30));

	
	UniqueReadLock r_uk(user->client_map_mtx);
	if (user->client_map.empty() == false)
	{
		r_uk.unlock();

		// ERASE FROM ACCOUNT_MAP
		if (user->account.empty() == false)
		{
			UniqueWriteLock w_uk(account_map_mtx);
			account_map.erase(user->account);
		}

		// ERASE FROM SESSION_MAP
		{
			UniqueWriteLock w_uk(session_map_mtx);
			session_map.erase(user->session_id);
		}
	}
}

void Server::sendData(shared_ptr<protocol::Invoke> invoke)
{
	session_map_mtx.readLock();
	auto users = this->session_map;
	session_map_mtx.readUnlock();

	for (auto it = users.begin(); it != users.end(); it++)
		it->second->sendData(invoke);
}