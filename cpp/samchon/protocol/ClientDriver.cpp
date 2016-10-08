#include <samchon/protocol/ClientDriver.hpp>

using namespace std;
using namespace samchon::protocol;

ClientDriver::ClientDriver(shared_ptr<Socket> socket)
	: Communicator()
{
	this->socket = socket;
}
ClientDriver::~ClientDriver()
{
}

void ClientDriver::listen(IProtocol *listener)
{
	this->listener = listener;

	listen_message();
}