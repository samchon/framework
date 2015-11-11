#include <samchon/library/HTTPLoader.hpp>

#include <iostream>
#include <array>
#include <random>

#include <chrono>
#include <thread>
#include <boost/asio.hpp>

#include <samchon/library/Datetime.hpp>
#include <samchon/library/URLVariables.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

Map<string, string> HTTPLoader::cookieMap;

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
	auto it = cookieMap.find(host);

	if (it == cookieMap.end())
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
	Datetime now;

	for (i = 0; i < 8; i++)
		val.push_back(ALPHA_CHAR_CODES[distribution(device)]);

	for (i = 0; i < 3; i++)
	{
		val.push_back('-');

		for (j = 0; j < 4; j++)
			val.push_back(ALPHA_CHAR_CODES[distribution(device)]);
	}
	val.push_back('-');
	val.append(to_string(now.toLinuxTime()));

	session = "s_pers=" + URLVariables::encode(" s_fid=" + val + ";");
	return session;*/
}

/* ------------------------------------------------------------
	LOADERS
------------------------------------------------------------ */
auto HTTPLoader::load(const URLVariables &parameters) const -> ByteArray
{
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

	// LISTEN RECEIVED-HEADER
	Map<string, string> headerMap;

	boost::asio::streambuf response;
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

		headerMap.insert({key, value});
	}

	// REGISTER COOKIE
	if (headerMap.has("Set-Cookie") == true)
	{
		string &cookie = headerMap.get("Set-Cookie");
		
		((Map<string, string>*)&cookieMap)->set(host, cookie);
	}

	// GET DATA
	ByteArray data;
	bool reserved = headerMap.has("Content-Length");

	if (reserved == true)
		data.reserve((size_t)stoull(headerMap.get("Content-Length")));

	while (true)
	{
		vector<unsigned char> piece(1000, 0);
		boost::system::error_code error;

		size_t size = socket.read_some(boost::asio::buffer(piece), error);
		if (size == 0 || error)
			break;

		data.insert
		(
			data.end(), piece.begin(),
			piece.begin() + size
		);
		
		if (reserved == true && data.size() == data.capacity())
			break;
	}

	// RETURN
	return move(data);
}

#include <Windows.h>

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
}