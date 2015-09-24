#include "ChatMessage.hpp"

#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::example::chat_service;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
ChatMessage::ChatMessage()
	: super()
{
}
void ChatMessage::construct(shared_ptr<XML> xml)
{
	this->orator = xml->getProperty("orator");
	this->message = xml->getProperty("message");

	if(xml->hasProperty("listener") == true)
		this->listener = xml->getProperty("listener");
	else
		this->listener.clear();
}

/* -----------------------------------------------------------
	GETTERS
----------------------------------------------------------- */
auto ChatMessage::getListener() const -> string
{
	return listener;
}
auto ChatMessage::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("orator", orator);
	xml->setProperty("message", message);

	if(listener.empty() == false)
		xml->setProperty("listener", listener);
	return xml;
}

