#include <samchon/examples/console_chat_server/ChatServer.hpp>
#include <samchon/examples/console_chat_server/ChatClient.hpp>

#include <thread>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::examples::console_chat_server;

ChatServer::ChatServer()
	: super()
{
}
void ChatServer::addClient(Socket *socket)
{
	ChatClient *client = new ChatClient(this, socket);

	WriteUniqueLock uk(rwMutex);
	clientSet.insert(client);

	thread(&ChatClient::listen, client).detach();
}
void ChatServer::eraseClient(ChatClient *client)
{
	WriteUniqueLock uk(rwMutex);
	clientSet.erase(client);
}

void ChatServer::replyData(shared_ptr<Invoke> invoke)
{
	sendData(invoke);
}
void ChatServer::sendData(shared_ptr<Invoke> invoke)
{
	ReadUniqueLock uk(rwMutex);

	for(auto it = clientSet.begin(); it != clientSet.end(); it++)
		(*it)->sendData(invoke);
}