#include <samchon/ByteArray.hpp>

using namespace std;
using namespace samchon;

/* --------------------------------------------------------------
	CONSTRUCTORS
-------------------------------------------------------------- */
ByteArray::ByteArray()
	: super()
{
	this->position = 0;
}
ByteArray::ByteArray(const ByteArray &byteArray)
	: super(byteArray)
{
	this->position = position;
}
ByteArray::ByteArray(ByteArray &&byteArray)
	: super(move(byteArray))
{
	this->position = byteArray.position;
	byteArray.position = 0;
}

/* --------------------------------------------------------------
	POSITION
-------------------------------------------------------------- */
auto ByteArray::getPosition() const -> size_t
{
	return position;
}
void ByteArray::setPosition(size_t val)
{
	this->position = val;
}

auto ByteArray::leftSize() const -> size_t
{
	return size() - position;
}

/* --------------------------------------------------------------
	READ BYTES
-------------------------------------------------------------- */
template<> auto ByteArray::read() const -> string
{
	string str = (char*)(data() + position);
	((ByteArray*)this)->position += str.size() + 1;

	return str;
}

/* --------------------------------------------------------------
	WRITE BYTES
-------------------------------------------------------------- */
template<> void ByteArray::write(const string &str)
{
	unsigned char *begin = (unsigned char*)str.data();

	insert(end(), begin, begin + str.size() + 1);
}
template<> void ByteArray::write(const ByteArray &byteArray)
{
	insert(end(), byteArray.begin(), byteArray.end());
}

/* --------------------------------------------------------------
	COMPRESS & DECOMPRESS
-------------------------------------------------------------- */
auto ByteArray::compress() const -> ByteArray
{
	return {};
}
auto ByteArray::decompress() const -> ByteArray
{
	return {};
}