#pragma once
#include <samchon/protocol/Communicator.hpp>

#include <array>
#include <queue>
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
	close();
}

void Communicator::close()
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

void Communicator::listen_message()
{
	shared_ptr<Invoke> binary_invoke = nullptr;
	queue<shared_ptr<InvokeParameter>> binary_parameters;

	while (true)
	{
		try
		{
			// READ CONTENT SIZE
			size_t content_size = listen_size();

			// READ CONTENT
			if (binary_invoke == nullptr)
			{
				shared_ptr<Invoke> invoke = listen_string(content_size);

				for (size_t i = 0; i < invoke->size(); i++)
				{
					shared_ptr<InvokeParameter> &parameter = invoke->at(i);
					if (parameter->getType() != "ByteArray")
						continue;

					if (binary_invoke == nullptr)
						binary_invoke = invoke;
					binary_parameters.push(parameter);
				}

				// NO BINARY, THEN REPLY DIRECTLY
				if (binary_invoke == nullptr)
					this->replyData(invoke);
			}
			else
			{
				shared_ptr<InvokeParameter> parameter = binary_parameters.front();
				listen_binary(content_size, parameter);
				binary_parameters.pop();

				if (binary_parameters.empty() == true)
				{
					// NO BINARY PARAMETER LEFT,
					shared_ptr<Invoke> invoke = binary_invoke;
					binary_invoke = nullptr;

					// THEN REPLY
					this->replyData(invoke);
				}
			}
		}
		catch (...)
		{
			break;
		}
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
	// READ CONTENT
	string data(size, (char)NULL);
	listen_data(socket, data);

	// CONSTRUCT INVOKE OBJECT
	shared_ptr<Invoke> invoke(new Invoke());
	invoke->construct(make_shared<XML>(data));

	return invoke;
}

void Communicator::listen_binary(size_t size, shared_ptr<InvokeParameter> parameter)
{
	// FETCH BYTE_ARRAY
	ByteArray &data = (ByteArray&)parameter->referValue<ByteArray>();

	// READ CONTENT
	listen_data(socket, data);
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
	unique_lock<mutex> uk(send_mtx);

	// SEND INVOKE
	send_data(socket, invoke->toXML()->toString());

	// SEND BINARY
	for (size_t i = 0; i < invoke->size(); i++)
		if (invoke->at(i)->getType() == "ByteArray")
			send_data(socket, invoke->at(i)->referValue<ByteArray>());
}