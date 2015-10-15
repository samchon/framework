#include <samchon/Charset.hpp>

namespace samchon
{
	//string Charset::UTF8_HEADER = { (char)0xEF, (char)0xBB, (char)0xBF };

	Charset::BasicCharset() {}
	template<> auto Charset::_t(const string &str) -> string
	{
		return str;
	}

	template<> auto Charset::toMultibyte(const string &source) -> string
	{
		std::wstring &wstr = toUnicode(source, UTF8);
		std::string &dest = WCharset::toMultibyte(wstr);

		return move(dest);
	}
	template<> auto Charset::toUTF8(const string &source) -> string
	{
		std::wstring &wstr = toUnicode(source, MULTIBYTE);
		std::string &dest = WCharset::toUTF8(wstr);

		return move(dest);
	}
	template<> auto Charset::toUnicode(const string &source, long charset) -> wstring
	{
		if (charset == MULTIBYTE)
		{
			locale &loc = locale("");

			typedef std::codecvt<wchar_t, char, std::mbstate_t> codecvt_t;
			codecvt_t const& codecvt = std::use_facet<codecvt_t>(loc);
			std::mbstate_t state = std::mbstate_t();
			std::vector<wchar_t> buf(source.size() + 1);
			char const* in_next = source.c_str();
			wchar_t* out_next = &buf[0];
			std::codecvt_base::result r = 
				codecvt.in
				(
					state,
					source.c_str(), source.c_str() + source.size(), in_next,
					&buf[0], &buf[0] + buf.size(), out_next
				);

			if (r == std::codecvt_base::error)
				throw std::runtime_error("can't convert string to wstring");

			return move(std::wstring(buf.begin(), buf.end()));
		}
		else if (charset == UTF8)
		{
			std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> utf8Converter;
			std::wstring &wstr = move(utf8Converter.from_bytes(source));

			return move(wstr);
		}
		else
			return L"";
	}
};