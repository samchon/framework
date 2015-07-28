#pragma once
#include <samchon\API.hpp>

#include <string>
#include <codecvt>
#include <vector>

namespace samchon
{
	namespace library
	{
		template <typename C> class SAMCHON_FRAMEWORK_API BasicCharset;
		typedef BasicCharset<char> Charset;
		typedef BasicCharset<wchar_t> WCharset;

		template <typename C>
		class SAMCHON_FRAMEWORK_API BasicCharset
		{
		public:
			static const long MULTIBYTE = 4;
			static const long UTF8 = 8;
			static const long UTF16 = 16;

			//static basic_string<C> UTF8_HEADER;

			BasicCharset();

			static auto toMultibyte(const std::basic_string<C> &) -> std::string;
			static auto toUTF8(const std::basic_string<C> &) -> std::string;
			static auto toUnicode(const std::basic_string<C> &, long charset = NULL) -> std::wstring;
		};
	}
};