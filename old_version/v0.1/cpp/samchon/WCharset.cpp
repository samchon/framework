#include <samchon/Charset.hpp>

namespace samchon
{
	//wstring WCharset::UTF8_HEADER = { (wchar_t)0xEF, (wchar_t)0xBB, (wchar_t)0xBF };

	WCharset::BasicCharset() {}
	template<> auto WCharset::_t(const string &str) -> wstring
	{
		wstring val(str.size(), NULL);
		for (size_t i = 0; i < str.size(); i++)
			val[i] = str[i];

		return move(val);
	}

	template<> auto WCharset::toMultibyte(const wstring &source) -> string
	{
		locale &loc = locale("");

		typedef std::codecvt<wchar_t, char, std::mbstate_t> codecvt_t;
		codecvt_t const& codecvt = std::use_facet<codecvt_t>(loc);
		std::mbstate_t state = std::mbstate_t();
		std::vector<char> buf((source.size() + 1) * codecvt.max_length());
		wchar_t const* in_next = source.c_str();
		char* out_next = &buf[0];

		std::codecvt_base::result r = 
			codecvt.out
			(
				state,
				source.c_str(), source.c_str() + source.size(), in_next,
				&buf[0], &buf[0] + buf.size(), out_next
			);
		if (r == std::codecvt_base::error)
			throw std::runtime_error("can't convert wstring to string");

		return move(std::string(buf.begin(), buf.end()));
	}
	template<> auto WCharset::toUTF8(const wstring &source) -> string
	{
		std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> utf8Converter;
		return move(utf8Converter.to_bytes(source));
	}
	template<> auto WCharset::toUnicode(const wstring &source, long charset) -> wstring
	{
		return source;
	}
};