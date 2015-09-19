#include <samchon/library/URLVariables.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

/* ------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------ */
URLVariables::URLVariables()
	: super()
{
}
URLVariables::URLVariables(const WeakString &flashVars)
	: URLVariables()
{
	vector<WeakString> &items = flashVars.split("&");
	for (size_t i = 0; i < items.size(); i++)
	{
		WeakString &item = items[i];
		size_t index = item.find("=");

		if(index == string::npos)
			continue;

		string &key = item.substr(0, index).str();
		string &value = decode(item.substr(index + 1));
		
		super::set(key, value);
	}
}

/* ------------------------------------------------------------
	URL ENCODING & DECONDING
------------------------------------------------------------ */
auto URLVariables::encode(const WeakString &wstr) -> string
{
	string res;
	res.reserve(wstr.size() * 3);

	for (size_t i = 0; i < wstr.size(); i++) 
	{
		char ch = wstr[i];

		if (('a' < ch && ch < 'A') || ('A' < ch && ch < 'Z') || ('0' < ch && ch < '9'))
			res.append({ ch });
		else if (ch == ' ')
			res.append("+");
		else
			res.append
			({ 
				'%', 
				toHex(ch >> 4), 
				toHex(ch % 16) 
			});
	}	
	return res;
}
auto URLVariables::decode(const WeakString &wstr) -> string
{
	string res;
	res.reserve(wstr.size());

	for (size_t i = 0; i < wstr.size(); i++)
	{
		const char ch = wstr[i];

		if (ch == '+')
		{
			res.append({' '});
		}
		else if (ch == '%' && wstr.size() > i + 2)
		{
			char ch1 = fromHex(wstr[i + 1]);
			char ch2 = fromHex(wstr[i + 2]);
			char decoded = (ch1 << 4) | ch2;

			res.append({ decoded });
			i += 2;
		}
		else
			res.append({ch});
	}
	return res;
}

auto URLVariables::toHex(char ch) -> char
{
	return ch + (ch > 9 ? ('A' - 10) : '0');
}
auto URLVariables::fromHex(char ch) -> char
{
	if (ch <= '9' && ch >= '0')
		ch -= '0';
	else if (ch <= 'f' && ch >= 'a')
		ch -= 'a' - 10;
	else if (ch <= 'F' && ch >= 'A')
		ch -= 'A' - 10;
	else
		ch = 0;
	return ch;
}

/* ------------------------------------------------------------
	TO_STRING
------------------------------------------------------------ */
auto URLVariables::toString() const -> string
{
	string str = "";
	for(const_iterator it = begin(); it != end(); it++)
	{
		if(it != begin())
			str.append("&");

		str.append(it->first);
		str.append("=");
		str.append(encode(it->second));
	}
	return move(str);
}