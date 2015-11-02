#include <samchon/protocol/IWebClient.hpp>

#include <mutex>
#include <boost/asio.hpp>

#include <samchon/ByteArray.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::protocol;

IWebClient::IWebClient()
	: super()
{
}

void IWebClient::listen()
{
	super::listen();
}
auto IWebClient::listenString(ByteArray &data) -> shared_ptr<Invoke>
{
	return nullptr;
}
void listenBinary(ByteArray &data, shared_ptr<Invoke> invoke)
{

}

void IWebClient::sendData(shared_ptr<Invoke> invoke)
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
void IWebClient::sendString(const string &data, boost::system::error_code &error)
{
	ByteArray header;
	header.write((unsigned char)129); //1000 0001

	if (data.size() < 126)
	{
		//DO NOTHING
	}
	else if (data.size() <= 66535)
	{
		header.write((unsigned char)126);
		header.writeReversely((unsigned short)data.size());
	}
	else
	{
		header.write((unsigned char)127);
		header.writeReversely((unsigned long long)data.size());
	}

	socket->write_some(boost::asio::buffer(data), error);	if (error) return;
	socket->write_some(boost::asio::buffer(data), error);	if (error) return;
}
void IWebClient::sendBinary(const ByteArray &data, boost::system::error_code &error)
{
	ByteArray header;
	header.write((unsigned char)130); //1000 0010

	if (data.size() < 126)
	{
		//DO NOTHING
	}
	else if (data.size() <= 66535)
	{
		header.write((unsigned char)126);
		header.writeReversely((unsigned short)data.size());
	}
	else
	{
		header.write((unsigned char)127);
		header.writeReversely((unsigned long long)data.size());
	}

	socket->write_some(boost::asio::buffer(data), error);	if (error) return;
	socket->write_some(boost::asio::buffer(data), error);	if (error) return;
}