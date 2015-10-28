#include <samchon/protocol/ExternalClient.hpp>

#include <thread>
#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ExternalClient::ExternalClient()
	: super()
{
}
void ExternalClient::start()
{
	listen();
}