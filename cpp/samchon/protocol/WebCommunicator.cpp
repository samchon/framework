#include <samchon/protocol/WebCommunicator.hpp>

#include <array>
#include <boost/asio.hpp>
#include <samchon/protocol/WebSocketUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

WebCommunicator::WebCommunicator(bool is_server)
	: Communicator()
{
	this->is_server = is_server;
}
WebCommunicator::~WebCommunicator()
{
}

/* =========================================================
	SOCKET I/O
		- READ
		- WRITE
============================================================
	READ
--------------------------------------------------------- */
namespace samchon
{
namespace protocol
{
namespace websocket
{
	template <class Container> void listen_data(shared_ptr<Socket> socket, Container &data);
	template <class Container> void listen_masked_data(shared_ptr<Socket> socket, Container &data);
}
}
}

void WebCommunicator::listen_message()
{
	shared_ptr<Invoke> binary_invoke = nullptr;
	queue<shared_ptr<InvokeParameter>> binary_parameters;

	while (true)
	{
		try
		{
			const std::pair<unsigned char, size_t> &header = listen_header();

			// EXIT CODE
			if (header.first == WebSocketUtil::DISCONNECT)
				break;

			// READ DATA
			if (header.first == WebSocketUtil::TEXT)
			{
				shared_ptr<Invoke> invoke = listen_string(header.second);

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
			else if (header.first == WebSocketUtil::BINARY)
			{
				shared_ptr<InvokeParameter> parameter = binary_parameters.front();
				listen_binary(header.second, parameter);
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

auto WebCommunicator::listen_header() -> pair<unsigned char, size_t>
{
	unsigned char mask = is_server ? WebSocketUtil::MASK : 0;

	array<unsigned char, 2> header_bytes;
	unsigned char op_code; // false then binary
	unsigned char size_header;

	size_t content_size = 0;

	// READ HEADER BYTES
	websocket::listen_data(socket, header_bytes);
	op_code = header_bytes[0];
	size_header = header_bytes[1];

	// INSPECT MASK VALIDATION
	if (is_server == true)
	{
		if (size_header < WebSocketUtil::MASK)
			throw domain_error("masked message from server has delivered.");
	}
	else
	{
		if (size_header >= WebSocketUtil::MASK)
			throw domain_error("masked message from server has delivered.");
	}

	// EXIT CODE
	if (op_code == WebSocketUtil::DISCONNECT)
		return{ op_code, 0 }; // DISCONNECTION SIGNAL HAS ARRIVED

	// READ CONTENT SIZE
	if (is_server)
		size_header -= WebSocketUtil::MASK; // CLIENT SENDS MASKED DATA, DETACH THE MASK

	if (size_header == (unsigned char)WebSocketUtil::TWO_BYTES)
	{
		// SIZE HEADER IS 2 BYTES
		array<unsigned char, 2> size_bytes;
		websocket::listen_data(socket, size_bytes);

		for (size_t c = 0; c < size_bytes.size(); c++)
			content_size += size_bytes[c] << (8 * (size_bytes.size() - 1 - c));
	}
	else if (size_header == (unsigned char)WebSocketUtil::EIGHT_BYTES)
	{
		// SIZE HEADER IS 8 BYTES
		array<unsigned char, 8> size_bytes;
		websocket::listen_data(socket, size_bytes);

		for (size_t c = 0; c < size_bytes.size(); c++)
			content_size += size_bytes[c] << (8 * (size_bytes.size() - 1 - c));
	}
	else
		content_size = (size_t)size_header;

	return{ op_code, content_size };
}

auto WebCommunicator::listen_string(size_t size) -> shared_ptr<Invoke>
{
	// READ CONTENT
	string data(size, (char)NULL);
	if (is_server) // CLIENT SENDS MASKED DATA
		websocket::listen_masked_data(socket, data);
	else
		websocket::listen_data(socket, data);

	// CONSTRUCT INVOKE OBJECT
	shared_ptr<Invoke> invoke(new Invoke());
	invoke->construct(make_shared<XML>(data));

	return invoke;
}

void WebCommunicator::listen_binary(size_t size, shared_ptr<InvokeParameter> parameter)
{
	// FETCH BYTE_ARRAY
	ByteArray &data = (ByteArray&)parameter->referValue<ByteArray>();

	// READ CONTENT
	if (is_server) // CLIENT SENDS MASKED DATA
		websocket::listen_masked_data(socket, data);
	else
		websocket::listen_data(socket, data);
}

namespace samchon
{
namespace protocol
{
namespace websocket
{
	template <typename Container>
	void listen_data(shared_ptr<Socket> socket, Container &data)
	{
		size_t completed = 0;

		if (completed < data.size())
			completed += socket->read_some(boost::asio::buffer((unsigned char*)data.data() + completed, data.size() - completed));
	}

	template <class Container>
	void listen_masked_data(shared_ptr<Socket> socket, Container &data)
	{
		// READ MASK
		array<unsigned char, 4> mask;
		socket->read_some(boost::asio::buffer(mask));

		// READ DATA
		websocket::listen_data(socket, data);

		// UNMASK
		for (size_t i = 0; i < data.size(); i++)
			data[i] = data[i] ^ mask[i % 4];
	}
}
}
}

/* ---------------------------------------------------------
	WRITE
--------------------------------------------------------- */
namespace samchon
{
namespace protocol
{
namespace websocket
{
	template <class Container> void send_data(shared_ptr<Socket> socket, const Container &data);
	template <class Container> void send_masked_data(shared_ptr<Socket> socket, const Container &data);
}
}
}

void WebCommunicator::sendData(shared_ptr<Invoke> invoke)
{
	unique_lock<mutex> uk(send_mtx);

	// SEND INVOKE
	const std::string &str = invoke->toXML()->toString();
	if (is_server)
		websocket::send_data(socket, str);
	else // CLIENT MASKS ON SENDING DATA
		websocket::send_masked_data(socket, str);

	// SEND BINARY
	for (size_t i = 0; i < invoke->size(); i++)
		if (invoke->at(i)->getType() == "ByteArray")
			if (is_server)
				websocket::send_data(socket, invoke->at(i)->referValue<ByteArray>());
			else // CLIENT MASKS ON SENDING DATA
				websocket::send_masked_data(socket, invoke->at(i)->referValue<ByteArray>());
}

namespace samchon
{
namespace protocol
{
namespace websocket
{
	// ----------
	//	SERVER DOES NOT MASK ON SENDING DATA
	// ----------
	template <class Container>
	void send_data(shared_ptr<Socket> socket, const Container &data)
	{
		unsigned char op_code = std::is_same<std::string, Container>()
			? WebSocketUtil::TEXT
			: WebSocketUtil::BINARY;
		size_t size = data.size();

		///////
		// SEND HEADER
		///////
		ByteArray header;
		header.write(op_code);

		if (size < 126)
			header.write((unsigned char)size);
		else if (size < 0xFFFF)
		{
			header.write((unsigned char)(WebSocketUtil::TWO_BYTES));
			header.writeReversely((unsigned short)size);
		}
		else
		{
			header.write((unsigned char)(WebSocketUtil::EIGHT_BYTES));
			header.writeReversely((unsigned long long)size);
		}

		socket->write_some(boost::asio::buffer(header)); // SEND HEADER
		socket->write_some(boost::asio::buffer(data)); // SEND DATA
	}

	// ----------
	//	CLIENT MASKS ON SENDING DATA
	// ----------
	template <class Container>
	void send_masked_data(shared_ptr<Socket> socket, const Container &data)
	{
		unsigned char op_code = std::is_same<std::string, Container>()
			? WebSocketUtil::TEXT
			: WebSocketUtil::BINARY;
		size_t size = data.size();

		///////
		// SEND HEADER
		///////
		ByteArray header;
		header.write(op_code);

		if (size < 126)
			header.write((unsigned char)(size + WebSocketUtil::MASK));
		else if (size < 0xFFFF)
		{
			header.write((unsigned char)(WebSocketUtil::TWO_BYTES + WebSocketUtil::MASK));
			header.writeReversely((unsigned short)size);
		}
		else
		{
			header.write((unsigned char)(WebSocketUtil::EIGHT_BYTES + WebSocketUtil::MASK));
			header.writeReversely((unsigned long long)size);
		}

		///////
		// SEND DATA
		///////
		static uniform_int_distribution<unsigned short> distribution(0, 255);
		static random_device device;

		// CONSTRUCT MASK
		array<unsigned char, 4> mask;
		for (size_t i = 0; i < mask.size(); i++)
			mask[i] = (unsigned char)distribution(device);

		// TO BE MASKED
		vector<unsigned char> masked_data(data.size());
		for (size_t i = 0; i < masked_data.size(); i++)
			masked_data[i] = data[i] ^ mask[i % 4];

		// SEND
		socket->write_some(boost::asio::buffer(header)); // SEND HEADER
		socket->write_some(boost::asio::buffer(mask)); // SEND MASK
		socket->write_some(boost::asio::buffer(masked_data)); // SEND MASKED DATA
	}
}
}
}