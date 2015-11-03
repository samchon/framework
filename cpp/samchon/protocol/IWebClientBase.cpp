#include <samchon/protocol/IWebClientBase.hpp>

#include <memory>
#include <mutex>
#include <boost/asio.hpp>

#include <samchon/ByteArray.hpp>
#include <samchon/WeakString.hpp>
#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* -----------------------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------------------- */
IWebClientBase::IWebClientBase()
	: super()
{
}

/* -----------------------------------------------------------------------
	LISTEN MESSAGE
----------------------------------------------------------------------- */
void IWebClientBase::listen()
{
	shared_ptr<Invoke> binaryInvoke;

	// CLIENT ADDS MASK
	unsigned char mask = DIRECTION() == SERVER ? 128 : 0;

	while (true)
	{
		ByteArray piece;
		boost::system::error_code error;

		piece.assign(BUFFER_SIZE(), NULL);
		socket->read_some(boost::asio::buffer(piece), error);

		while (piece.getPosition() != piece.size())
		{
			if (error)
				return;

			// GET TYPE
			unsigned char typeHeader = piece.read<unsigned char>();
			if (piece.leftSize() == 0)
				continue;

			// GET SIZE TYPE
			unsigned char sizeHeader = piece.read<unsigned char>() - mask;
			if (piece.leftSize() == 0)
				continue;

			// GET SIZE
			size_t size = 125;
			if (sizeHeader == 126)
			{
				if (piece.leftSize() < sizeof(unsigned short))
					listenMoreBytes(piece, error);

				if (error)
					break;

				size = (size_t)piece.readReversely<unsigned short>();
			}
			else if (sizeHeader == 127)
			{
				if (piece.leftSize() < sizeof(unsigned long long))
					listenMoreBytes(piece, error);

				if (error)
					break;

				size = (size_t)piece.readReversely<unsigned long long>();
			}

			// GET DATA FOLLOWING TYPE
			if (typeHeader == (unsigned char)129)
				binaryInvoke = listenString(size, piece, error);
			else if (typeHeader == (unsigned char)130 && binaryInvoke != nullptr)
				listenBinary(size, piece, binaryInvoke, error);
			else
				break;
		}
	}
}
auto IWebClientBase::listenString(size_t size, ByteArray &piece, boost::system::error_code &error) -> shared_ptr<Invoke>
{
	string data;

	data.reserve(size);
	data.append(piece.read<string>());
	
	//LISTEN UNTIL TO MEET THE CAPACITY
	while (data.size() < size)
	{
		piece.assign(BUFFER_SIZE(), 1000);
		socket->read_some(boost::asio::buffer(piece), error);
		
		data.append(piece.read<string>());
	}

	// CONSTRUCT INVOKE MESSAGES
	size_t start = data.find("<invoke listener=");
	size_t end = data.rfind("</invoke>");
	if (start == string::npos || end == string::npos)
		return nullptr;

	WeakString wstr(&data[0], &data[end + string("</invoke").size()]);
	shared_ptr<XML> xml(new XML(wstr));

	shared_ptr<Invoke> invoke(new Invoke());
	invoke->construct(xml);

	for (size_t i = 0; i < invoke->size(); i++)
		if (invoke->at(i)->getType() == "ByteArray")
			return invoke;

	_replyData(invoke);
	return nullptr;
}
void IWebClientBase::listenBinary(size_t size, ByteArray &piece, shared_ptr<Invoke> invoke, boost::system::error_code &error)
{
	ByteArray *data = nullptr;
	size_t paramIndex;

	for (paramIndex = 0; paramIndex < invoke->size(); paramIndex++)
		if (invoke->at(paramIndex)->getType() == "ByteArray")
		{
			const ByteArray &byteArray = invoke->at(paramIndex)->referValue<ByteArray>();
			if (byteArray.size() == 0 && byteArray.capacity() == size)
			{
				data = (ByteArray*)&byteArray;
				break;
			}
		}

	if (data == nullptr)
		return;

	data->insert
	(
		data->end(), 
		piece.begin(),
		piece.begin() + std::min(piece.size(), size)
	);

	while (data->size() < size)
	{
		piece.assign(BUFFER_SIZE(), 1000);
		socket->read_some(boost::asio::buffer(piece), error);

		data->insert
		(
			data->end(), 
			piece.begin(), 
			piece.begin() + std::min(piece.size(), size - data->size())
		);
	}

	for(size_t i = paramIndex + 1; i < invoke->size(); i++)
		if(invoke->at(i)->getType() == "ByteArray")
			return;

	_replyData(invoke);
}

void IWebClientBase::listenMoreBytes(ByteArray &piece, boost::system::error_code &error)
{
	ByteArray myPiece;
	myPiece.assign(BUFFER_SIZE(), NULL);

	socket->read_some(boost::asio::buffer(piece), error);
	if (error)
		return;

	piece.write(myPiece);
}

void IWebClientBase::sendData(shared_ptr<Invoke> invoke)
{
	unique_lock<mutex> uk(*sendMtx);
	boost::system::error_code error;

	sendString(invoke->toXML()->toString(), error);

	if (error)
		return;

	for (size_t i = 0; i < invoke->size(); i++)
		if (invoke->at(i)->getType() == "ByteArray")
		{
			sendBinary(invoke->at(i)->referValue<ByteArray>(), error);

			if (error)
				return;
		}
}

/* -----------------------------------------------------------------------
	SEND MESSAGE
----------------------------------------------------------------------- */
void IWebClientBase::sendSizeHeader(unsigned char type, size_t size, boost::system::error_code &error)
{
	ByteArray header;
	header.write(type); //1000 0001

	unsigned char mask = (DIRECTION() == CLIENT) ? 128 : 0;

	if (size < 126)
	{
		header.write((unsigned char)size + mask);
	}
	else if (size <= 66535)
	{
		header.write((unsigned char)126 + mask);
		header.writeReversely((unsigned short)size);
	}
	else
	{
		header.write((unsigned char)127 + mask);
		header.writeReversely((unsigned long long)size);
	}

	socket->write_some(boost::asio::buffer(header), error);
}

void IWebClientBase::sendString(const string &data, boost::system::error_code &error)
{
	sendSizeHeader(TEXT_HEADER, data.size(), error);

	if (error)
		return;

	socket->write_some(boost::asio::buffer(data),  error);		if (error) return;
}
void IWebClientBase::sendBinary(const ByteArray &data, boost::system::error_code &error)
{
	sendSizeHeader(BINARY_HEADER, data.size(), error);

	if (error)
		return;

	socket->write_some(boost::asio::buffer(data),  error);		if (error) return;
}