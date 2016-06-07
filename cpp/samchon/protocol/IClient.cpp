#include <samchon/protocol/IClient.hpp>

#include <iostream>
#include <mutex>
#include <list>

#include <boost/asio.hpp>
#include <samchon/ByteArray.hpp>
#include <samchon/WeakString.hpp>

#include <samchon/protocol/Invoke.hpp>
#include <samchon/library/XML.hpp>

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

using namespace std;
using namespace boost::asio;
using namespace boost::asio::ip;

/* -----------------------------------------------------------------------------------
	SEMI STATIC GETTER
----------------------------------------------------------------------------------- */
auto IClient::BUFFER_SIZE() const -> size_t { return 10000; }

/* -----------------------------------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------------------------------- */
IClient::IClient()
{
	socket = nullptr;
	sendMtx = new mutex();
}
IClient::~IClient()
{
	if (socket != nullptr)
		socket->close();
	delete sendMtx;
}

/* -----------------------------------------------------------------------------------
	HIDDEN TEMPLATE METHODS
----------------------------------------------------------------------------------- */
template <typename Container>
auto listen_data(Socket *socket) -> Container
{
	Container data;

	array<unsigned char, 8> size_bytes;
	size_t content_size = 0;
	size_t completed = 0;

	// READ CONTENT SIZE
	socket->read_some(boost::asio::buffer(size_bytes));
	for (size_t c = 0; c < size_bytes.size(); c++)
		content_size += size_bytes[c] << (8 * (size_bytes.size() - 1 - c));

	data.assign(content_size, 0);

	// READ CONTENTS
	if (completed < content_size)
	{
		unsigned char *sub_data = (unsigned char*)data.data() + completed;

		completed += socket->read_some(boost::asio::buffer(sub_data, content_size - completed));
	}

	return data;
};

template <typename Container>
void write_data(Socket *socket, const Container &data)
{
	ByteArray size_header;
	size_header.writeReversely((unsigned long long)data.size());

	socket->write_some(boost::asio::buffer(size_header));
	socket->write_some(boost::asio::buffer(data));
};

/* -----------------------------------------------------------------------------------
	LISTENERS
----------------------------------------------------------------------------------- */
void IClient::listen()
{
	while (true)
		try
		{
			string &str = listen_data<string>(socket);
			shared_ptr<Invoke> invoke(new Invoke());

			invoke->construct(make_shared<XML>(str));

			for (size_t i = 0; i < invoke->size(); i++)
			{
				const shared_ptr<InvokeParameter> &parameter = invoke->at(i);

				if (parameter->getType() == "ByteArray")
				{
					ByteArray &binary = listen_data<ByteArray>(socket);
					parameter->setByteArray(move(binary));
				}
			}
			_replyData(invoke);
		}
		catch (exception &)
		{
			break;
		}
}

/* -----------------------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
----------------------------------------------------------------------------------- */
void IClient::sendData(shared_ptr<Invoke> invoke)
{
	string &data = invoke->toXML()->toString();
	unique_lock<mutex> uk(*sendMtx);;

	try
	{
		// SEND INVOKE MESSAGE
		write_data(socket, data);

		// SEND BINARY DATA
		for (size_t i = 0; i < invoke->size(); i++)
			if (invoke->at(i)->getType() == "ByteArray")
				write_data(socket, invoke->at(i)->referValue<ByteArray>());
	}
	catch (exception &)
	{
	}
}
void IClient::_replyData(shared_ptr<Invoke> invoke)
{
	replyData(invoke);
}