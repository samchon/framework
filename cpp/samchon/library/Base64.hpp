#pragma once
#include <samchon\API.hpp>

#include <array>
#include <string>
#include <vector>

namespace samchon
{
	namespace library
	{
		//SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API std::vector<unsigned char>;

		class SAMCHON_FRAMEWORK_API Base64
		{
		private:
			static std::array<char, 64> base64CharArray;
			static std::array<int, 256> base64DecodeArray;

		public:
			static auto encode(const std::vector<unsigned char>&)->std::string;
			static auto decode(const std::string &)->std::vector < unsigned char > ;
		};

		class SAMCHON_FRAMEWORK_API WBase64
		{
		public:
			static auto encode(const std::vector<unsigned char>&)->std::wstring;
			static auto decode(const std::wstring &)->std::vector < unsigned char > ;
		};
	};
};