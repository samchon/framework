#include "ChatRoom.hpp"
#include "ChatService.hpp"
#include "ChatMessage.hpp"

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::example::chat_service;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
ChatRoom::ChatRoom(const string &name, ChatUser *host)
	: super(), IProtocol()
{
	this->name = name;
	this->host = host;
}
void ChatRoom::construct(shared_ptr<XML>)
{
}

/* -----------------------------------------------------------
	CHAIN OF RESPONSIBILITY
----------------------------------------------------------- */
void ChatRoom::sendData(shared_ptr<Invoke> invoke)
{
	ChatMessage message;
	message.construct(invoke->at(0)->getValueAsXML());

	for (auto it = participants.begin(); it != participants.end(); it++)
	{

	}
}

void ChatRoom::registerClient(ChatService *service)
{
	participants.insert(service);
}
void ChatRoom::eraseClient(ChatService *service)
{
	participants.erase(service);
}

/* -----------------------------------------------------------
	GETTERS
----------------------------------------------------------- */