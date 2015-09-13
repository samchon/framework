#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <string>
#include <codecvt>
#include <vector>

namespace samchon
{
	using namespace std;

	template <typename C> class SAMCHON_LIBRARY_API BasicCharset;

	typedef BasicCharset<char> Charset;
	typedef BasicCharset<wchar_t> WCharset;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicCharset
	{
	public:
		enum
		{
			MULTIBYTE = 4,
			UTF8 = 8
		};

		//static basic_string<C> UTF8_HEADER;

		BasicCharset();
		static auto _t(const string &str) -> basic_string<C>;

		static auto toMultibyte(const basic_string<C> &) -> string;
		static auto toUTF8(const basic_string<C> &) -> string;
		static auto toUnicode(const basic_string<C> &, long charset = NULL) -> wstring;
	};

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicCharset<char>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicCharset<wchar_t>;
}