#include <samchon/protocol/ExternalSystemArray.hpp>

#include <samchon/protocol/ExternalSystemArrayServer.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ExternalSystemArray::ExternalSystemArray() 
	: super()
{
}

ExternalSystemArray::~ExternalSystemArray()
{
}

/* =========================================================
	NETWORK
		- SERVER AND CLIENT
		- MESSAGE I/O
============================================================
	SERVER AND CLIENT
--------------------------------------------------------- */
void ExternalSystemArray::open(int port)
{
	server.reset(createServer());
	server->open(port);
}

void ExternalSystemArray::connect()
{
	for (size_t i = 0; i < size(); i++)
		at(i)->connect();
}

/* ---------------------------------------------------------
	MESSAGE I/O
--------------------------------------------------------- */
void ExternalSystemArray::sendData(shared_ptr<Invoke> invoke)
{
	for (size_t i = 0; i < size(); i++)
		at(i)->sendData(invoke);
}

void ExternalSystemArray::replyData(shared_ptr<Invoke> invoke)
{
	for (size_t i = 0; i < size(); i++)
		at(i)->replyData(invoke);
}