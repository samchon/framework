#include <samchon/protocol/WebSocketUtil.hpp>

#include <boost/uuid/sha1.hpp>

#include <samchon/ByteArray.hpp>
#include <samchon/library/Base64.hpp>
#include <samchon/library/Date.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

const string WebSocketUtil::GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

auto WebSocketUtil::generate_base64_certification_key() -> string
{
	static uniform_int_distribution<unsigned short> distribution(0, 255);
	static random_device device;

	string certification_key(16, NULL);
	for (size_t i = 0; i < certification_key.size(); i++)
		certification_key[i] = (unsigned char)distribution(device);

	ByteArray byte_array;
	byte_array.assign(certification_key.begin(), certification_key.end());

	return Base64::encode(byte_array);
}

auto WebSocketUtil::encode_certification_key(const string &base64) -> string
{
	string acceptKey = base64 + GUID;

	boost::uuids::detail::sha1 hash;
	hash.process_bytes(acceptKey.c_str(), acceptKey.size());

	ByteArray bytes;
	unsigned int digest[5];
	hash.get_digest(digest);

	for (size_t index = 0; index < 5; index++)
		bytes.writeReversely //ENDIAN REVERSING
		(
			digest[index]
		);

	return Base64::encode(bytes);
}