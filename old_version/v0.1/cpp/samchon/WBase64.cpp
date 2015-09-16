#include <samchon/Base64.hpp>

namespace samchon
{
	auto WBase64::encode(const vector<unsigned char> &byteArray) -> wstring
	{
		string &str = Base64::encode(byteArray);
		wstring wstr(str.begin(), str.end());

		return move(wstr);
	}
	auto WBase64::decode(const wstring &wstr) -> vector<unsigned char>
	{
		string str(wstr.begin(), wstr.end());
		vector<unsigned char> &data = Base64::decode(str);

		return move(data);
	}
}