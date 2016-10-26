#include <samchon/library/Charset.hpp>

#include <codecvt>
#include <atlstr.h>

using namespace std;
using namespace samchon::library;

/* -------------------------------------------------------------------
	TO MULTIBYTE
------------------------------------------------------------------- */
auto Charset::toMultibyte(const string &source) -> string
{
	wstring &wstr = toUnicode(source, UTF8);
	string &dest = toMultibyte(wstr);

	return dest;
}

auto Charset::toMultibyte(const wstring &source) -> string
{
	int len = WideCharToMultiByte(CP_ACP, 0, &source[0], -1, NULL, 0, NULL, NULL);
	std::string str(len, 0);
	WideCharToMultiByte(CP_ACP, 0, &source[0], -1, &str[0], len, NULL, NULL);

	return str;

	/*typedef codecvt<wchar_t, char, mbstate_t> codecvt_t;

	locale &loc = locale("");

	codecvt_t const& codecvt = use_facet<codecvt_t>(loc);
	mbstate_t state = mbstate_t();
	vector<char> buf(source.size() * codecvt.max_length());
	wchar_t const* in_next = source.c_str();
	char* out_next = &buf[0];

	codecvt_base::result r =
		codecvt.out
		(
			state,
			source.c_str(), source.c_str() + source.size(), in_next,
			&buf[0], &buf[0] + buf.size(), out_next
		);

	if (r == codecvt_base::error)
		throw runtime_error("can't convert wstring to string");

	return string(buf.begin(), buf.end());*/
}

/* -------------------------------------------------------------------
	TO UTF-8
------------------------------------------------------------------- */
auto Charset::toUTF8(const string &source) -> string
{
	wstring &wstr = toUnicode(source, MULTIBYTE);
	string &dest = toUTF8(wstr);

	if (dest.back() == NULL)
		dest.pop_back();

	return dest;
}

auto Charset::toUTF8(const wstring &source) -> string
{
	wstring_convert<codecvt_utf8_utf16<wchar_t>> utf8Converter;
	
	return utf8Converter.to_bytes(source);
}

/* -------------------------------------------------------------------
	TO UNICODE
------------------------------------------------------------------- */
auto Charset::toUnicode(const string &source, int charset) -> wstring
{
	if (charset == MULTIBYTE)
	{
		locale &loc = locale("");

		typedef codecvt<wchar_t, char, mbstate_t> codecvt_t;
		codecvt_t const& codecvt = use_facet<codecvt_t>(loc);
		mbstate_t state = mbstate_t();
		vector<wchar_t> buf(source.size());
		char const* in_next = source.c_str();
		wchar_t* out_next = &buf[0];
		
		codecvt_base::result r =
			codecvt.in
			(
				state,
				source.c_str(), source.c_str() + source.size(), in_next,
				&buf[0], &buf[0] + buf.size(), out_next
			);

		if (r == codecvt_base::error)
			throw runtime_error("can't convert string to wstring");

		return wstring(buf.begin(), buf.end());
	}
	else if (charset == UTF8)
	{
		wstring_convert<codecvt_utf8_utf16<wchar_t>> utf8Converter;
		wstring &wstr = move(utf8Converter.from_bytes(source));

		return wstr;
	}
	else
		return L"";
}