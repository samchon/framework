#pragma once
#include <samchon/protocol/Communicator.hpp>

#include <array>
#include <boost/asio.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

Communicator::Communicator()
{
	listener = nullptr;
}
Communicator::~Communicator()
{
	if (socket != nullptr && socket->is_open())
		socket->close();
}

void Communicator::replyData(shared_ptr<Invoke> invoke)
{
	listener->replyData(invoke);
}

/* =========================================================
	SOCKET I/O
		- READ
		- WRITE
============================================================
	READ
--------------------------------------------------------- */
template <class Container> 
void listen_data(shared_ptr<Socket> socket, Container &data)
{
	size_t completed = 0;

	if (completed < data.size())
		completed += socket->read_some(boost::asio::buffer((unsigned char*)data.data() + completed, data.size() - completed));
}

void Communicator::listen(IProtocol *listener)
{
	this->listener = listener;

	shared_ptr<Invoke> binary_invoke;

	while (true)
	{
		// READ CONTENT SIZE
		size_t content_size = listen_size();

		// READ CONTENT
		if (binary_invoke == nullptr)
			binary_invoke = listen_string(content_size);
		else
			listen_binary(content_size, binary_invoke);
	}
}

auto Communicator::listen_size() const -> size_t
{
	array<unsigned char, 8> size_header;
	listen_data(socket, size_header);

	size_t size = 0;
	for (size_t c = 0; c < size_header.size(); c++)
		size += size_header[c] << (8 * (size_header.size() - 1 - c));

	return size;
}

auto Communicator::listen_string(size_t size) -> shared_ptr<Invoke>
{
	///////
	// READ CONTENT
	///////
	string data(size, (char)NULL);
	listen_data(socket, data);

	shared_ptr<Invoke> invoke(new Invoke());
	invoke->construct(make_shared<XML>(data));

	///////
	// REPLY OR HOLD
	///////
	bool is_binary = std::any_of(invoke->begin(), invoke->end(), 
		[](const shared_ptr<InvokeParameter> &parameter) -> bool
		{
			return parameter->getType() == "ByteArray";
		}
	);

	if (is_binary == true)
		return invoke;
	else
	{
		replyData(invoke);
		return nullptr;
	}
}

void Communicator::listen_binary(size_t size, shared_ptr<Invoke> &invoke)
{
	ByteArray *data = nullptr;
	Invoke::iterator param_it;

	///////
	// FIND THE MATCHED PARAMETER
	///////
	param_it = find_if(invoke->begin(), invoke->end(),
		[size](const shared_ptr<InvokeParameter> &parameter) -> bool
		{
			if (parameter->getType() != "ByteArray")
				return false;

			const ByteArray &byte_array = parameter->referValue<ByteArray>();
			return byte_array.empty() == true && byte_array.capacity() == size;
		});

	if (param_it == invoke->end())
	{
		// FAILED TO FIND
		invoke = nullptr;
		return;
	}
	else
		data = (ByteArray*) &((*param_it)->referValue<ByteArray>());

	///////
	// READ CONTENT
	///////
	listen_data(socket, *data);

	///////
	// REPLY OR HOLD
	///////
	if (
		std::any_of(next(param_it), invoke->end(),
			[](const shared_ptr<InvokeParameter> &parameter) -> bool
			{
				return parameter->getType() == "ByteArray";
			}) == true
		)
		return;

	replyData(invoke);
	invoke = nullptr;
}

/* ---------------------------------------------------------
	WRITE
--------------------------------------------------------- */
template <class Container>
void send_data(shared_ptr<Socket> socket, const Container &data)
{
	ByteArray header;
	header.writeReversely((unsigned long long)data.size());

	socket->write_some(boost::asio::buffer(header));
	socket->write_some(boost::asio::buffer(data));
}

void Communicator::sendData(shared_ptr<Invoke> invoke)
{
	// SEND INVOKE
	send_data(socket, invoke->toXML()->toString());

	// SEND BINARY
	for (size_t i = 0; i < invoke->size(); i++)
		if (invoke->at(i)->getType() == "ByteArray")
			send_data(socket, invoke->at(i)->referValue<ByteArray>());
}