#include <samchon/library/HTTPLoader.hpp>

#include <array>
#include <iostream>
#include <boost/asio.hpp>

#include <samchon/library/URLVariables.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

HTTPLoader::HTTPLoader(int method)
{
	this->method = method;
}
HTTPLoader::HTTPLoader(const string &url, int method)
	: HTTPLoader(method)
{
	this->url = url;
}

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

auto HTTPLoader::load(const URLVariables &parameters) const -> ByteArray
{
	// FOR HEADER
	WeakString host = url;
	string path;

	if (host.find("://") != string::npos)
		host = host.between("://");
	if (host.find("/") != string::npos)
	{
		path = host.between("/").str();
		host = host.between("", "/");
	}

	string header;
	if (method == GET)
	{
		header = StringUtil::substitute
		(
			string("") +
			"Host: {1}\n" +
			"GET {2}{3} HTTP/1.0\n" +
			"Accept: */*\n" +
			"Connection: Keep-Alive\n",

			host, path, 
			((parameters.empty() == true) ? "" : "?" + parameters.toString())
		);
	}
	else
	{
		header = StringUtil::substitute
		(
			string("") +
			"Host {1}\n" +
			"POST {2} HTTP/1.0\n" +
			"Accept: */*\n" +
			"Connection: Keep-Alive\n" + 
			"Content-Length: {3}\n\n" +
			"" +
			"{4}\n",

			host, path, 
			parameters.size(), parameters.toString() 
		);
	}

	// SOCKET - CONNECT
	boost::asio::io_service ioService;
	boost::asio::ip::tcp::endpoint endPoint(boost::asio::ip::address::from_string(host), 80);

	boost::asio::ip::tcp::socket socket(ioService, boost::asio::ip::tcp::v4());
	socket.connect(endPoint);

	socket.write_some(boost::asio::buffer(header));

	// LISTEN HEADER
	Map<string, string> headerMap;

	header.clear();
	array<unsigned char, 1> byte;

	while (true)
	{
		socket.read_some(boost::asio::buffer(byte));
		header += (char)byte[0];

		if (byte[0] == NULL)
			break;
	}

	vector<WeakString> &items = WeakString(header).split("\n");
	for (size_t i = 0; i < items.size(); i++)
	{
		WeakString &item = items[i];
		size_t index = item.find(":");

		if (index == string::npos)
			continue;

		headerMap.insert({item.substr(0, index), item.substr(index).trim().str()});
	}

	// GET DATA
	ByteArray data;
	boost::system::error_code error;

	bool reserved;

	if (headerMap.has("Content-Length") == true)
	{
		data.reserve((size_t)stoull(headerMap["Content-Length"]));
		reserved = true;
	}
	else
		reserved = false;

	while (true)
	{
		array<unsigned char, 1000> piece;
		socket.read_some(boost::asio::buffer(piece), error);

		if (error)
			break;

		if (reserved == true)
			data.insert
			(
				data.end(), piece.begin(), 
				piece.begin() + std::min(data.capacity() - data.size(), piece.size())
			);
		else
			data.insert(data.end(), piece.begin(), piece.end());
	}

	// (COMPRESS? &) RETURN
	if (headerMap.has("Content-Length") == true)
		return move(data.decompress());
	else
		return move(data);
}