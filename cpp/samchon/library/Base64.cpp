#include <samchon/library/Base64.hpp>
using namespace std;
using namespace samchon::library;

array<char, 64> Base64::base64CharArray =
{
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
	'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
	'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
	'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
	'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
	'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
	'w', 'x', 'y', 'z', '0', '1', '2', '3',
	'4', '5', '6', '7', '8', '9', '+', '/'
};

array<int, 256> Base64::base64DecodeArray =
{
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  /* 00-0F */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  /* 10-1F */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,  /* 20-2F */
	52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,  /* 30-3F */
	-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,  /* 40-4F */
	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,  /* 50-5F */
	-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,  /* 60-6F */
	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1,  /* 70-7F */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  /* 80-8F */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  /* 90-9F */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  /* A0-AF */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  /* B0-BF */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  /* C0-CF */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  /* D0-DF */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  /* E0-EF */
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1   /* F0-FF */
};

auto Base64::encode(const vector<unsigned char> &byteArray) -> string
{
	unsigned char *bytes = (unsigned char*)byteArray.data();
	string str;
	str.reserve(byteArray.size() * 4);

#ifdef _WIN64
	long long leftSize = (long long)byteArray.size();
#else
	long leftSize = (long)byteArray.size();
#endif

	size_t i = 0;
	size_t j = 0;
	array<unsigned char, 3> input;
	array<unsigned char, 4> output;

	while (leftSize--)
	{
		input[i++] = *(bytes++);
		if (i == 3)
		{
			output[0] = (input[0] & 0xfc) >> 2;
			output[1] = ((input[0] & 0x03) << 4) + ((input[1] & 0xf0) >> 4);
			output[2] = ((input[1] & 0x0f) << 2) + ((input[2] & 0xc0) >> 6);
			output[3] = input[2] & 0x3f;

			for (i = 0; (i < 4); i++)
				str += base64CharArray[output[i]];
			i = 0;
		}
	}

	if (i)
	{
		for (j = i; j < 3; j++)
			input[j] = '\0';

		output[0] = (input[0] & 0xfc) >> 2;
		output[1] = ((input[0] & 0x03) << 4) + ((input[1] & 0xf0) >> 4);
		output[2] = ((input[1] & 0x0f) << 2) + ((input[2] & 0xc0) >> 6);
		output[3] = input[2] & 0x3f;

		for (j = 0; (j < i + 1); j++)
			str += base64CharArray[output[j]];

		while ((i++ < 3))
			str += '=';

	}

	return move(str);
}
auto Base64::decode(const string &str) -> vector<unsigned char>
{
	vector<unsigned char> data;
	data.reserve(str.size() * 3);

	const char* cp;
	int space_idx = 0, phase;
	int d, prev_d = 0;
	unsigned char c;

	space_idx = 0;
	phase = 0;

	for (cp = &str[0]; *cp != '\0'; ++cp) {
		d = base64DecodeArray[(int)*cp];
		if (d != -1) {
			switch (phase) {
			case 0:
				++phase;
				break;
			case 1:
				c = ((prev_d << 2) | ((d & 0x30) >> 4));
				data.push_back(c);
				++phase;
				break;
			case 2:
				c = (((prev_d & 0xf) << 4) | ((d & 0x3c) >> 2));
				data.push_back(c);
				++phase;
				break;
			case 3:
				c = (((prev_d & 0x03) << 6) | d);
				data.push_back(c);
				phase = 0;
				break;
			}
			prev_d = d;
		}
	}
	return move(data);
}