#include <samchon/library/URLVariables.hpp>

#include <samchon/library/WeakString.hpp>
#include <sstream>

using namespace std;
using namespace samchon;
using namespace samchon::library;

/* ------------------------------------------------------------------------
CONSTRUCTORS
------------------------------------------------------------------------ */
URLVariablesA::BasicURLVariables()
	: super()
{
}
URLVariablesA::BasicURLVariables(const WeakString &flashVars)
	: super()
{
	vector<WeakString> &parameterArray = flashVars.split("&");
	for (size_t i = 0; i < parameterArray.size(); i++)
	{
		WeakString &parameter = parameterArray[i];
		size_t index = parameter.find("=");
		if (index == string::npos)
			continue;

		WeakString &name = parameter.substr(0, index);
		WeakString &value = parameter.substr(index + 1);

		set(name.str(), decode(value.str()));
	}
}

/* ------------------------------------------------------------------------
EN - DECODING
	REFERED http://dlib.net/dlib/server/server_http.cpp.html
------------------------------------------------------------------------ */
char to_hex(char ch)
{
	return ch + (ch > 9 ? ('A' - 10) : '0');
}
char from_hex(char ch)
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

template<> auto URLVariablesA::encode(const WeakString &wStr) -> string
{
	
	string res;
	res.reserve(wStr.size() * 3);

	for (size_t i = 0; i < wStr.size(); i++) 
	{
		const char ch = wStr[i];

		if (('a' < ch && ch < 'A') || ('A' < ch && ch < 'Z') || ('0' < ch && ch < '9'))
			res.append({ ch });
		else if (ch == ' ')
			res.append("+");
		else
			res.append
			({ 
				'%', 
				to_hex(ch >> 4), 
				to_hex(ch % 16) 
			});
	}	
	return res;
}
template<> auto URLVariablesA::decode(const WeakStringA &wStr) -> string
{
	string res;
	res.reserve(wStr.size());

	for (size_t i = 0; i < wStr.size(); ++i)
	{
		char ch = wStr[i];

		if (ch == '+')
		{
			res.append({' '});
		}
		else if (ch == '%' && wStr.size() > i + 2)
		{
			char ch1 = from_hex(wStr[i + 1]);
			char ch2 = from_hex(wStr[i + 2]);
			char decoded = (ch1 << 4) | ch2;

			res.append({ decoded });
			i += 2;
		}
		else
			res.append({ch});
	}
	return res;
}

/* ------------------------------------------------------------------------
EXPORTS
------------------------------------------------------------------------ */
template<> auto URLVariablesA::toString() const -> string
{
	string flashVars = "";
	for (auto it = begin(); it != end(); it++)
	{
		string parameter;
		if (it != begin())
			parameter += "&";

		parameter += it->first + "=";
		parameter += encode(it->second);

		flashVars.append(parameter);
	}
	return move(flashVars);
}