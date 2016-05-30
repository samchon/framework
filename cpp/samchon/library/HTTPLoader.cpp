#include <samchon/library/HTTPLoader.hpp>

#include <iostream>
#include <array>
#include <random>

#include <chrono>
#include <thread>
#include <boost/asio.hpp>

#include <samchon/library/Date.hpp>
#include <samchon/library/URLVariables.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

HashMap<string, string> HTTPLoader::cookie_map;

void toClipboard(const string &);

/* ------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------ */
HTTPLoader::HTTPLoader(int method)
{
	this->method = method;
}
HTTPLoader::HTTPLoader(const string &url, int method)
	: HTTPLoader(method)
{
	this->url = url;
}

/* ------------------------------------------------------------
	SETTERS & GETTERS
------------------------------------------------------------ */
void HTTPLoader::setURL(const string &url)
{
	this->url = url;
}
void HTTPLoader::setMethod(int method)
{
	this->method = method;
}

auto HTTPLoader::getURL() const -> string
{
	return url;
}
auto HTTPLoader::getMethod() const -> int
{
	return method;
}

auto HTTPLoader::getCookie(const string &host) const -> string
{
	auto it = cookie_map.find(host);

	if (it == cookie_map.end())
		return "";
	else
		return it->second;

	/*static string session;
	if (session.empty() == false)
		return session;

	static vector<char> ALPHA_CHAR_CODES = {48, 49, 50, 51, 52, 53, 54, 
		55, 56, 57, 65, 66, 67, 68, 69, 70};

	static random_device device;
	static uniform_int_distribution<size_t> distribution(0, ALPHA_CHAR_CODES.size() - 1);
	
	string val;
	size_t i, j;
	Date now;

	for (i = 0; i < 8; i++)
		val.push_back(ALPHA_CHAR_CODES[distribution(device)]);

	for (i = 0; i < 3; i++)
	{
		val.push_back('-');

		for (j = 0; j < 4; j++)
			val.push_back(ALPHA_CHAR_CODES[distribution(device)]);
	}
	val.push_back('-');
	val.append(toString(now.toLinuxTime()));

	session = "s_pers=" + URLVariables::encode(" s_fid=" + val + ";");
	return session;*/
}

/* ------------------------------------------------------------
	LOADERS
------------------------------------------------------------ */
auto HTTPLoader::load(const URLVariables &parameters) const -> ByteArray
{
	//////////////////////////////////////////////////
	//	SENDING REQUEST HEADER
	//////////////////////////////////////////////////
	// FOR HEADER
	WeakString host = url;
	string path;

	if (host.find("://") != string::npos)
		host = host.between("://");
	if (host.find("/") != string::npos)
	{
		path = "/" + host.between("/").str();
		host = host.between("", "/");
	}

	// ENCODIG PATH
	{
		size_t idx = path.find('?');
		if (idx == string::npos)
			path = URLVariables::encode(path);
		else
		{
			string &front = path.substr(0, idx);
			string &back = path.substr(idx + 1);

			path = URLVariables::encode(front) + "?" + back;
		}
	}

	string header;
	if (method == GET)
	{
		header = StringUtil::substitute
		(
			string("") +
			"GET {2}{3} HTTP/1.1\n" +
			"Host: {1}\n" +
			"Accept: */*\n" +
			"Accept-Encoding: gzip, deflate\n"

			"Connection: Keep-Alive\n" +
			"Cookie: {4}\n"
			"\n",

			host.str(), path,
			((parameters.empty() == true) 
				? string("") 
				: "?" + parameters.toString()),
			getCookie(host)
		);
	}
	else
	{
		std::string &parameterStr = parameters.toString();

		header = StringUtil::substitute
		(
			string("") +
			"POST {2} HTTP/1.1\n" +
			"Host: {1}\n" +
			"Accept: */*\n" +
			"Connection: Keep-Alive\n" +

			/*"Accept-Language: en-US\n" +
			"Accept-Encoding: gzip, deflate\n" +
			"User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko\n" +*/
			
			"Content-Type: application/x-www-form-urlencoded\n" +
			"Content-Length: {3}\n" +
			"Cookie: {5}\n"
			"\n" +
			"{4}",

			host.str(), path, 
			parameterStr.size(), parameterStr,
			getCookie(host)
		);
	}
	
	// PREPARE & GET IP ADDRESS
	boost::asio::io_service ioService;

	boost::asio::ip::tcp::resolver resolver(ioService);
	boost::asio::ip::tcp::resolver::query query(host, "http");
	boost::asio::ip::tcp::resolver::iterator endpoint_iterator = resolver.resolve(query);

	// SOCKET - CONNECT AND SEND HEADER
	boost::asio::ip::tcp::socket socket(ioService);
	socket.connect(*endpoint_iterator);

	socket.write_some(boost::asio::buffer(header));

	//////////////////////////////////////////////////
	//	LISTEN HEADER FROM SERVER
	//////////////////////////////////////////////////
	HashMap<string, string> headerMap;
	{
		header.clear();

		while (true)
		{
			array<char, 1> buffer;

			socket.read_some(boost::asio::buffer(buffer));
			header += buffer[0];

			if (header.size() > 4 && header.substr(header.size() - 4) == "\r\n\r\n")
				break;
		}

		WeakString wstr = header;
		vector<WeakString> wstrArray = wstr.split("\r\n");

		for (size_t i = 0; i < wstrArray.size(); i++)
		{
			WeakString wstr = wstrArray[i];
			size_t index = wstr.find(":");

			if (index == string::npos)
				continue;

			headerMap.set(wstr.substr(0, index), wstr.substr(index + 1).trim());
		}
	}

	// REGISTER COOKIE
	if (headerMap.has("Set-Cookie") == true)
	{
		string &cookie = headerMap.get("Set-Cookie");

		((HashMap<string, string>*)&cookie_map)->set(host, cookie);
	}

	// CONTENT-LENGTH
	bool reserved = headerMap.has("Content-Length");
	bool chunked = headerMap.has("Transfer-Encoding") && headerMap.get("Transfer-Encoding") == "chunked";

	/*boost::asio::streambuf response;
	{
		boost::asio::read_until(socket, response, "\r\n\r\n");

		std::istream response_stream(&response);
		string item;

		while (std::getline(response_stream, item) && item != "\r")
		{
			size_t index = item.find(":");
			if (index == string::npos)
				continue;

			string &key = item.substr(0, index);
			string &value = item.substr(index + 2);

			if (value.back() == '\r')
				value.pop_back();

			headerMap.insert({ key, value });
		}

		// REGISTER COOKIE
		if (headerMap.has("Set-Cookie") == true)
		{
			string &cookie = headerMap.get("Set-Cookie");

			((TreeMap<string, string>*)&cookie_map)->set(host, cookie);
		}
	}*/

	//////////////////////////////////////////////////
	//	GET DATA
	//////////////////////////////////////////////////
	ByteArray data;

	if (reserved == true) 
	{
		// CONTENT-LENGTH
		data.reserve((size_t)stoull(headerMap.get("Content-Length")));

		while (true)
		{
			array<unsigned char, 1000> piece;
			boost::system::error_code error;

			size_t size = socket.read_some(boost::asio::buffer(piece), error);
			if (size == 0 || error)
				break;

			data.insert
				(
					data.end(),
					piece.begin(), piece.begin() + size
				);

			if (data.size() == data.capacity())
				break;
		}
	}

	/*else if (chunked == true)
	{
		while (true)
		{
			string chunk;
			boost::system::error_code error;

			while (true)
			{
				array<char, 1> chunkPiece;
				socket.read_some(boost::asio::buffer(chunkPiece), error);

				if (error)
					return data;

				chunk += chunkPiece[0];
				if (chunk.size() > 2 && chunk.substr(chunk.size() - 2) == "\r\n")
					break;
			}
			
			size_t size = (size_t)stoull(chunk.substr(0, chunk.size() - 1), 0, 16);
			if (size == 0)
				break;

			vector<unsigned char> piece(size + 2, NULL);
			socket.read_some(boost::asio::buffer(piece), error);

			if (error)
				break;

			data.insert(data.end(), piece.begin(), piece.begin() + size);
		}
	}*/

	else if (chunked == true)
	{
		vector<unsigned char> prevData;

		while (true)
		{
			array<char, 1000> piece;
			boost::system::error_code error;

			size_t size = socket.read_some(boost::asio::buffer(piece), error);
			if (size == 0 || error)
				break;

			prevData.insert(prevData.end(), piece.begin(), piece.begin() + size);

			// HANDLING LAST
			WeakString wstr((const char*)&prevData[0], (const char*)&prevData[0] + prevData.size());
			
			if (wstr.substring(wstr.size() - 7, wstr.size()) == "\r\n0\r\n\r\n")
			{
				// FINDS ALL \R\N
				/*vector<WeakString> wstrArray = wstr.split("\r\n");

				for (size_t i = 0; i < wstrArray.size(); i++)
				{
					WeakString wstr = wstrArray[i];
					bool isChunkLine = true;

					for (size_t j = 0; j < wstr.size(); j++)
					{
						char ch = wstr[j];

						if (!(('0' <= ch && ch <= '9') || ('a' <= ch && ch <= 'f')))
						{
							isChunkLine = false;
							break;
						}
					}

					if (isChunkLine == false)
						postStr += wstr.str() + "\r\n";
					else
						cout << wstr.str() << endl;
				}*/

				size_t startIndex = 0;
				size_t endIndex;

				while (true)
				{
					size_t pos = wstr.find("\r\n", startIndex);
					WeakString piece = wstr.substr(startIndex, pos);
					
					size_t size = stoull(piece, 0, 16);
					if (size == 0)
						break;
					
					startIndex = pos + 2;
					endIndex = std::min(startIndex + size, prevData.size());

					data.insert(data.end(), prevData.begin() + startIndex, prevData.begin() + endIndex);
					startIndex = endIndex + 2;
				}
				
				break;
			}
		}

		/*ByteArray data;
		data.write(postStr);

		return data;*/
	}
	else
	{
		while (true)
		{
			array<unsigned char, 1000> piece;
			boost::system::error_code error;

			size_t size = socket.read_some(boost::asio::buffer(piece), error);
			if (size == 0 || error)
				break;

			data.insert
				(
					data.end(),
					piece.begin(), piece.begin() + size
				);
		}
	}

	// RETURN
	return data;
}

/*#include <Windows.h>

void toClipboard(const string &str)
{
	OpenClipboard(0);
	EmptyClipboard();
	HGLOBAL hg = GlobalAlloc(GMEM_MOVEABLE, str.size());

	if (!hg)
	{
		CloseClipboard();
		return;
	}
	memcpy(GlobalLock(hg), str.c_str(), str.size());

	GlobalUnlock(hg);
	SetClipboardData(CF_TEXT, hg);
	CloseClipboard();
	GlobalFree(hg);
}*/