#include "ChatRoom.hpp"
#include "ChatRoomArray.hpp"
#include "ChatMessage.hpp"

#include "ChatUser.hpp"
#include "ChatClient.hpp"
#include "ChatService.hpp"

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::example::chat_service;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
ChatRoom::ChatRoom(ChatRoomArray *roomArray, const string &name, ChatUser *host)
	: super(),
	IProtocol()
{
	this->roomArray = roomArray;

	this->name = name;
	this->host = host;
}

void ChatRoom::registerClient(ChatService *service)
{
	participants.insert(service);

	sendData(shared_ptr<Invoke>(new Invoke("handleRoom", toXML())));
	roomArray->notify();
}
void ChatRoom::eraseClient(ChatService *service)
{
	if (participants.erase(service) == 0)
		roomArray->erase(this->name);
	else
		sendData(shared_ptr<Invoke>(new Invoke("handleRoom", toXML())));

	roomArray->notify();
}

/* -----------------------------------------------------------
	CHAIN OF RESPONSIBILITY
----------------------------------------------------------- */
void ChatRoom::replyData(shared_ptr<Invoke> invoke)
{
	if(invoke->getListener() == "sendMessage")
	{
		shared_ptr<Invoke> ivk(new Invoke("handleMessage"));
		ivk->at(0) = invoke->at(0);

		sendData(ivk);
	}
}
void ChatRoom::sendData(shared_ptr<Invoke> invoke)
{
	UniqueReadLock uk(participants.get_allocator().getMutex());

	if(invoke->getListener() == "handleMessage")
	{
		ChatMessage message;
		message.construct(invoke->at(0)->getValueAsXML());

		if(message.getListener().empty() == true)
			for (auto it = participants.begin(); it != participants.end(); it++)
				(*it)->sendData(invoke);
		else
			for (auto it = participants.begin(); it != participants.end(); it++)
				if((*it)->getClient()->getUser()->getID() == message.getListener())
					(*it)->sendData(invoke);
	}
	else
		for (auto it = participants.begin(); it != participants.end(); it++)
			(*it)->sendData(invoke);
}

/* -----------------------------------------------------------
	EXPORTS
----------------------------------------------------------- */
auto ChatRoom::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("name", name);
	xml->setProperty("host", host->getID());

	for (auto it = participants.begin(); it != participants.end(); it++)
	{
		shared_ptr<XML> participant(new XML());
		participant->setTag("participant");
		participant->setValue((*it)->getClient()->getUser()->getID());

		xml->push_back(participant);
	}
	return xml;
}