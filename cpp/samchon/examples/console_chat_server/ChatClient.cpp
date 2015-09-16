#include <samchon/examples/console_chat_server/ChatClient.hpp>
#include <samchon/examples/console_chat_server/ChatServer.hpp>

#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::examples::console_chat_server;

ChatClient::ChatClient(ChatServer *server, Socket *socket)
	: super()
{
	this->server = server;
	this->socket = socket;
}
ChatClient::~ChatClient()
{
	server->eraseClient(this);
}

void ChatClient::replyData(shared_ptr<Invoke> invoke)
{
	server->replyData(invoke);
}