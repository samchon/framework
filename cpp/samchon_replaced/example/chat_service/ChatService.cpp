#include "ChatService.hpp"
#include "ChatRoom.hpp"

#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::protocol;
using namespace samchon::protocol::service;
using namespace samchon::example::chat_service;

ChatService::ChatService(Client *client)
	: super(client)
{
	
}
ChatService::~ChatService()
{
	if(room == nullptr)
		return;

	room->eraseClient(this);
}

void ChatService::replyData(shared_ptr<Invoke> invoke)
{
	if(invoke->getListener() == "sendMessage")
		room->replyData(invoke);
}