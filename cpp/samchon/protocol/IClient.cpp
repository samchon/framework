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
		size_t size = socket->read_some(boost::asio::buffer(piece), error);
		
		if (error)
			break;

		if(ba_invoke == nullptr)
			handle_string(piece, str, ba_invoke, size);
		else
			handle_binary(piece, str, ba_invoke, size);
	}
}
void IClient::handle_string(ByteArray &piece, string &str, shared_ptr<Invoke> &baInvoke, size_t size)
{
	static size_t CLOSED_PARENTHESIS = string("</invoke>").size();

	if (piece.get_position() >= size)
		return;

	// LIST OF INVOKE MESSAGES
	list<shared_ptr<Invoke>> invokeList;

	// READ STRING
	string &pieceString = piece.read<string>();
	str.append(pieceString);

	WeakString wstr = str;
	vector<WeakString> &wstrArray = wstr.betweens("<invoke ", "</invoke>");

	for (size_t i = 0; i < wstrArray.size(); i++)
	{
		string &message = "<invoke " + wstrArray[i].str() + "</invoke>";

		shared_ptr<Invoke> invoke( new Invoke() );
		invoke->construct(make_shared<XML>(message));

		invokeList.push_back(invoke);
	}

	/*list<shared_ptr<Invoke>> invokeList;
	pair<size_t, size_t> posPair = {-1, -1};
	pair<size_t, size_t> sizePair = {0, 0};
	pair<size_t, size_t> indexPair = {0, 0};

	size_t endIndex = -1;

	while (true)
	{
		// FIND WORDS
		pair<size_t, size_t> myPair = 
		{
			str.find("<invoke ", indexPair.first),
			str.find("</invoke>", indexPair.second)
		};

		// COUNTS
		if (myPair.first != -1)
		{
			sizePair.first++;
			indexPair.first = myPair.first + string("<invoke ").size();
		}
		if (myPair.second != -1)
		{
			sizePair.second++;
			indexPair.second = myPair.second + string("</invoke>").size();
		}
		
		// IF AN INVOKE MESSAGE HAS FOUND
		if (sizePair.first == sizePair.second && sizePair.first != 0)
		{
			if (posPair.first == -1 && posPair.second == -1)
				posPair = myPair;
			else
				posPair.second = myPair.second;

			endIndex = posPair.second + string("</invoke>").size();

			WeakString wstr(str.data() + posPair.first, str.data() + endIndex);
			shared_ptr<XML> xml(new XML(wstr));
			shared_ptr<Invoke> invoke(new Invoke());

			invoke->construct(xml);

			cout << invoke->toXML()->toString() << endl;

			invokeList.push_back(invoke);

			posPair = { -1, -1 };
		}
		else if (myPair.first != -1 && posPair.first == -1)
			posPair.first = myPair.first;
	}*/

	//BASIC DATA
	/*list<shared_ptr<Invoke>> invokeList;
	unique_ptr<pair<size_t, size_t>> indexPair(nullptr);
	pair<size_t, size_t> sizePair = {0, 0};
	size_t startIndex = 0;
	size_t endIndex = 0;

	while (true)
	{
		//FIND WORDS
		pair<size_t, size_t> iPair = 
		{
			str.find("<invoke ", startIndex),
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
		str = str.substr(endIndex);*/

	if (invokeList.empty() == true)
		return;

	/*str = str.substr(endIndex);
	cout << "#" << invokeList.size() << endl;*/

	// CUT USED STRING
	str = move(str.substr(str.rfind("</invoke>") + CLOSED_PARENTHESIS));

	//CALL REPLY_DATA
	auto last_it = --invokeList.end();
	for (auto it = invokeList.begin(); it != last_it; it++)
		_replyData(*it);
	
	//TEST WHETHER THE LAST CONTAINS BINARY DATA
	shared_ptr<Invoke> &lastInvoke = *last_it;
	for (size_t i = 0; i < lastInvoke->size(); i++)
	{
		//IF HAS, TO HANDLE_BINARY
		if (lastInvoke->at(i)->getType() == "ByteArray")
		{
			baInvoke = lastInvoke;

			piece.set_position
			(
				piece.get_position() - 
				(pieceString.size() - (pieceString.rfind("</invoke>") + CLOSED_PARENTHESIS))
			);

			//HANDLING LEFT BINARY PIECE
			handle_binary(piece, str, baInvoke, size);
			return;
		}
	}

	//ELSE, DOES NOT HAVE, CALL REPLY_DATA
	_replyData(lastInvoke);
}
void IClient::handle_binary(ByteArray &piece, string &str, shared_ptr<Invoke> &invoke, size_t size)
{
	if (piece.get_position() >= size)
		return;

	ByteArray *byte_array = nullptr;
	size_t position = piece.get_position();
	size_t param_index = 0;

	//FIND WHICH PARAMETER IS BINARY
	for (size_t i = 0; i < invoke->size(); i++)
		if (invoke->at(i)->getType() == "ByteArray")
		{
			const ByteArray &ba = invoke->at(i)->refer_value<ByteArray>();
		
			if (ba.size() < ba.capacity())
			{
				param_index = i;
				byte_array = (ByteArray*)&ba;

				break;
			}
		}

	//IF THERE'S NOT BINARY TYPE
	if(byte_array == nullptr)
		return;

	//CALCULATE SIZE
	size_t totalSize = byte_array->capacity();
	size_t left_size = totalSize - byte_array->size();
	size_t writeSize = std::min(size - position, left_size);

	//AND WRITES
	byte_array->insert
	(
		byte_array->end(), 
		piece.begin() + position, piece.begin() + (position + writeSize)
	);
	piece.set_position( position + writeSize );

	// IF NOT FULFILLED, RETURNS
	if (byte_array->size() < byte_array->capacity())
		return;

	//IF LAST BINARY
	for(size_t i = param_index + 1; i < invoke->size(); i++)
		if(invoke->at(i)->getType() == "ByteArray")
			return;

	// SHIFTS
	_replyData(invoke);

	//IS LAST BINARY, THEN CLEAR
	invoke.reset();

	//IF BYTES ARE LEFT, CALL HANDLE_STRING
	handle_string(piece, str, invoke, size);
}

/* -----------------------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
----------------------------------------------------------------------------------- */
void IClient::sendData(shared_ptr<Invoke> invoke)
{
	string &data = invoke->toXML()->toString();
	boost::system::error_code error;

	unique_lock<mutex> uk(*sendMtx);
	socket->write_some(boost::asio::buffer(data), error);

	if (error)
	{
		//cout << error.message() << endl;
		return;
	}

	for (size_t i = 0; i < invoke->size(); i++)
		if (invoke->at(i)->getType() == "ByteArray")
		{
			const ByteArray &byte_array = invoke->at(i)->refer_value<ByteArray>();
			socket->write_some(boost::asio::buffer(byte_array), error);

			if (error)
				return;
		}
}
void IClient::_replyData(shared_ptr<Invoke> invoke)
{
	replyData(invoke);
}