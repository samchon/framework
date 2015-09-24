#include <samchon/protocol/IClient.hpp>

#include <samchon/protocol/Invoke.hpp>
#include <samchon/library/StringUtil.hpp>
#include <samchon/library/XML.hpp>
#include <mutex>
#include <boost/asio.hpp>

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

using namespace std;
using namespace boost::asio;
using namespace boost::asio::ip;

auto IClient::BUFFER_SIZE() const -> size_t { return 1000; }

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

void IClient::listen()
{
	//SET BUFFER SIZE
	//socket->set_option(boost::asio::socket_base::send_buffer_size(BUFFER_SIZE()));	
	//socket->set_option(boost::asio::socket_base::receive_buffer_size(BUFFER_SIZE()));

	//VARIABLES
	std::string data;
	vector<char> piece;
	boost::system::error_code error;

	while (true)
	{
		//ASSIGN AND HANDLE DATA
		piece.assign(BUFFER_SIZE(), NULL);
		socket->read_some(boost::asio::buffer(piece), error);

		data.append(piece.data());
		if (data.rfind("</invoke>") == std::string::npos)
			continue;

		vector<std::string> &invokeArray = StringUtil::betweens(data, "<invoke", "</invoke>");
		for (size_t i = 0; i < invokeArray.size(); i++)
		{
			std::string &message = "<invoke" + invokeArray[i] + "</invoke>";

			shared_ptr<XML> xml(new XML(message));
			shared_ptr<Invoke> invoke(new Invoke(xml));

			try
			{
				replyData(invoke);
			}
			catch (const int errorID)
			{
				//sendError(errorID);
			}
		}
		data = move(data.substr(data.rfind("</invoke>") + std::string("</invoke>").size()));
	}
}

void IClient::sendData(shared_ptr<Invoke> invoke)
{
	std::string &data = invoke->toXML()->toString();
	boost::system::error_code error;

	unique_lock<mutex> uk(*sendMtx);
	socket->write_some(boost::asio::buffer(data), error);
}