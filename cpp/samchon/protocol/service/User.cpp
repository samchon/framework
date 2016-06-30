#include <samchon/protocol/service/User.hpp>

#include <samchon/protocol/service/Server.hpp>
#include <samchon/protocol/service/Client.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::service;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
User::User()
{
}
User::~User()
{
}

void User::erase_client(Client *client)
{
	size_t left_size;
	{
		UniqueWriteLock w_uk(client_map_mtx);
		left_size = client_map.erase(client->no);
	}

	// NO CLIENT, THEN ERASE THIS USER.
	if (left_size == 0)
		server->erase_user(this);
}

/* ---------------------------------------------------------
	ACCESSORS
--------------------------------------------------------- */
void User::setAccount(const string &account, int authority)
{
	if (this->account == account) // SAME WITH BEFORE
		return;
	else if (this->account.empty() == false) // ACCOUNT IS CHANGED
	{
		// ERASE FROM ORDINARY ACCOUNT_MAP
		UniqueWriteLock uk(server->account_map_mtx);
		server->account_map.erase(this->account);
	}

	// SET
	this->account = account;
	this->authority = authority;

	// REGISTER TO ACCOUNT_MAP IN ITS SERVER
	UniqueWriteLock uk(server->account_map_mtx);
	server->account_map.set(account, my_weak_ptr.lock());
}

/* ---------------------------------------------------------
	MESSAGE CHAIN
--------------------------------------------------------- */
void User::sendData(shared_ptr<Invoke> invoke)
{
	client_map_mtx.readLock();
	auto clients = this->client_map;
	client_map_mtx.readUnlock();

	for (auto it = clients.begin(); it != clients.end(); it++)
		it->second->sendData(invoke);
}

