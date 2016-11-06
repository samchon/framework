#include "ChatRoomArray.hpp"
#include "ChatRoom.hpp"

#include "ChatServer.hpp"
#include "ChatUser.hpp"
#include "ChatClient.hpp"
#include "ListService.hpp"

#include <thread>
#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::example::chat_service;

ChatRoomArray::ChatRoomArray(ChatServer *server)
	: super(),
	IEntityGroup()
{
	this->server = server;
}

void ChatRoomArray::notify()
{
	shared_ptr<Invoke> &invoke = this->toInvoke();

	UniqueReadLock uk(get_allocator().getMutex());
	for (auto it = server->begin(); it != server->end(); it++)
	{
		auto user = it->second;

		for (auto u_it = user->begin(); u_it != user->end(); u_it++)
		{
			auto client = u_it->second;
			auto service = client->getService();

			if (dynamic_cast<ListService>(service) != nullptr)
				thread(&IProtocol::sendData, service, invoke).detach();
		}
	}
}

auto ChatRoomArray::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> xml(new XML());
	xml->setTag(TAG());

	UniqueReadLock uk(get_allocator().getMutex());
	for(auto it = begin(); it != end(); it++)
		xml->push_back(it->second->toXML());

	return xml;
}
auto ChatRoomArray::toInvoke() const -> shared_ptr<Invoke>
{
	Invoke *invoke = new Invoke("handleRoomArray", toXML());
	return shared_ptr<Invoke>(invoke);
}