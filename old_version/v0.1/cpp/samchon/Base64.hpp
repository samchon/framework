#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <array>
#include <string>
#include <vector>

namespace samchon
{
	using namespace std;

	class SAMCHON_LIBRARY_API Base64
	{
	private:
		static array<char, 64> base64CharArray;
		static array<int, 256> base64DecodeArray;

	public:
		static auto encode(const vector<unsigned char>&) -> string;
		static auto decode(const string &) -> vector<unsigned char>;
	};

	class SAMCHON_LIBRARY_API WBase64
	{
	public:
		static auto encode(const vector<unsigned char>&) -> wstring;
		static auto decode(const wstring &) -> vector<unsigned char>;
	};
}