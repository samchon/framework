#include <samchon/protocol/IClient.hpp>

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
auto IClient::BUFFER_SIZE() const -> size_t { return 1000; }

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
	LISTENERS
----------------------------------------------------------------------------------- */
void IClient::listen()
{
	//BASIC DATA
	string str = "";
	std::shared_ptr<Invoke> ba_invoke(nullptr);

	while (true)
	{
		ByteArray piece;
		boost::system::error_code error;

		piece.assign(BUFFER_SIZE(), NULL);
		socket->read_some(boost::asio::buffer(piece), error);
		
		if (error)
			break;

		if(ba_invoke == nullptr)
			handleString(piece, str, ba_invoke);
		else
			handleBinary(piece, str, ba_invoke);
	}
}
void IClient::handleString(ByteArray &piece, string &str, shared_ptr<Invoke> &baInvoke)
{
	//READ STRING
	str.append( piece.read<string>());

	//BASIC DATA
	list<shared_ptr<Invoke>> invokeList;
	unique_ptr<pair<size_t, size_t>> indexPair(nullptr);
	pair<size_t, size_t> sizePair = {0, 0};
	size_t startIndex = 0;
	size_t endIndex = 0;

	while (true)
	{
		//FIND WORDS
		pair<size_t, size_t> iPair = 
		{
			str.find("<invoke", startIndex),
			str.find("</invoke>", endIndex)
		};

		//COUNTS
		if (iPair.first != -1) sizePair.first++;
		if (iPair.second != -1) sizePair.second++;

		//IF IT MEANS THE START,
		if (indexPair.get() != nullptr && sizePair.first == 0)
		{
			//SPECIFY THE STARTING INDEX
			indexPair.reset(new pair<size_t, size_t>(iPair.first, string::npos)); 
		}

		//FAILED TO FIND NOTHING
		if(iPair.first == string::npos || iPair.second == string::npos)
			break;

		//AN INVOKE HAS FOUND
		if(indexPair.get() != nullptr && sizePair.first == sizePair.second)
		{
			//INDEX
			size_t start = indexPair->first;
			size_t end = indexPair->second + string("</invoke>").size();

			//CONSTRUCT INVOKE
			shared_ptr<XML> xml(new XML(str.substr(start, end - start)));
			shared_ptr<Invoke> invoke(new Invoke());
			invoke->construct(xml);

			invokeList.push_back(invoke);

			//CLEAR CURRENT INEX PAIR
			endIndex = end;
			indexPair.reset(nullptr);
		}

		//ADJUST INDEX
		startIndex = (iPair.second == string::npos) ? 
			iPair.first + 1 : iPair.second + 1;
	}

	//ERASE USED CHARACTERS
	if (endIndex != string::npos)
		str = str.substr(endIndex);

	//CALL REPLY_DATA
	auto last_it = --invokeList.end();
	for (auto it = invokeList.begin(); it != last_it; it++)
		_replyData(*it);
	
	//TEST WHETHER HAS BINARY DATA
	shared_ptr<Invoke> &lastInvoke = *last_it;
	for (size_t i = 0; i < lastInvoke->size(); i++)
	{
		//IF HAS, TO HANDLE_BINARY
		if (lastInvoke->at(i)->getType() == "ByteArray")
		{
			baInvoke = lastInvoke;

			//HANDLING LEFT BINARY PIECE
			handleBinary(piece, str, baInvoke);
			return;
		}
	}

	//ELSE, DOES NOT HAVE, CALL REPLY_DATA
	_replyData(lastInvoke);
}
void IClient::handleBinary(ByteArray &piece, string &str, shared_ptr<Invoke> &invoke)
{
	ByteArray *byteArray = nullptr;
	size_t position = piece.getPosition();
	size_t param_index = 0;

	//IF CALLED BY HANDLE_STRING, TEST WHETHER THE PIECE IS EMPTY
	if (position != 0)
	{
		bool isEmpty = true;

		for (size_t i = position; i < piece.size(); i++)
			if (piece[i] != 0)
			{
				isEmpty = false;
				break;
			}

		//IF EMPTY, TERMINATE
		if (isEmpty == true)
			return;
	}

	//FIND WHICH PARAMETER IS BINARY
	for (size_t i = 0; i < invoke->size(); i++)
		if (invoke->at(i)->getType() == "ByteArray")
		{
			const ByteArray &ba = invoke->at(i)->referValue<ByteArray>();
		
			if (ba.size() < ba.capacity())
			{
				param_index = i;
				byteArray = (ByteArray*)&ba;

				break;
			}
		}

	//IF THERE'S NOT BINARY TYPE
	if(byteArray == nullptr)
		return;

	//CALCULATE SIZE
	size_t totalSize = byteArray->capacity();
	size_t leftSize = totalSize - byteArray->size();
	size_t writeSize = std::min(piece.size() - position, leftSize);

	//AND WRITES
	byteArray->insert
	(
		byteArray->end(), 
		piece.begin() + position, piece.begin() + (position + writeSize)
	);
	piece.setPosition( position + writeSize );

	//IF LAST BINARY
	for(size_t i = param_index + 1; i < invoke->size(); i++)
		if(invoke->at(i)->getType() == "ByteArray")
			return;

	//IS LAST BINARY, THEN CLEAR
	invoke = nullptr;

	//IF BYTES ARE LEFT, CALL HANDLE_STRING
	if(piece.getPosition() < piece.size())
		handleString(piece, str, invoke);
}

/* -----------------------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
----------------------------------------------------------------------------------- */
void IClient::sendData(shared_ptr<Invoke> invoke)
{
	std::string &data = invoke->toXML()->toString();
	boost::system::error_code error;

	unique_lock<mutex> uk(*sendMtx);
	socket->write_some(boost::asio::buffer(data), error);

	if (error)
		return;

	for (size_t i = 0; i < invoke->size(); i++)
		if (invoke->at(i)->getType() == "ByteArray")
		{
			const ByteArray &byteArray = invoke->at(i)->referValue<ByteArray>();
			socket->write_some(boost::asio::buffer(byteArray), error);

			if (error)
				return;
		}
}
void IClient::_replyData(shared_ptr<Invoke> invoke)
{
	replyData(invoke);
}