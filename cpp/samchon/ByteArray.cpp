#include <samchon/ByteArray.hpp>

using namespace std;
using namespace samchon;

/* --------------------------------------------------------------
	CONSTRUCTORS
-------------------------------------------------------------- */
ByteArray::ByteArray()
	: super()
{
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

/* --------------------------------------------------------------
	READ BYTES
-------------------------------------------------------------- */
template<> auto ByteArray::read() const -> string
{
	return "";
}
template<> auto ByteArray::read() const -> wstring
{
	return L"";
}
template<> auto ByteArray::read() const -> ByteArray
{
	return {};
}

/* --------------------------------------------------------------
	WRITE BYTES
-------------------------------------------------------------- */
template<> void ByteArray::write(const string &str)
{

}
template<> void ByteArray::write(const wstring &str)
{

}
template<> void ByteArray::write(const ByteArray &byteArray)
{

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
	return{};
}