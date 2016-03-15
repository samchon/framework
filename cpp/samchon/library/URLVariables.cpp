#include <API.hpp>

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
	: super()
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
		
		set(key, value);
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
		unsigned char ch = wstr[i];

		if 
			(
				('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z') 
				|| ('0' <= ch && ch <= '9') 
				|| ch == '-' || ch == '_' || ch == '.' || ch == '~' 
				|| ch == '@' || ch == ':' || ch == '/' || ch == '\\'
			)
			res.push_back(ch);
		else if (ch == ' ')
			res.append("%20");
		else
			res.append
			({
				'%',
				toHex( ch >> 4 ),
				toHex( ch & 0x0F )
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

		/*if (ch == '+')
		{
			res.append({' '});
		}
		else */
		if (ch == '%' && wstr.size() > i + 2)
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

auto URLVariables::toHex(unsigned char ch) -> char
{
	static const char lookup[] = "0123456789ABCDEF";

	return lookup[ch];
}
auto URLVariables::fromHex(unsigned char ch) -> char
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