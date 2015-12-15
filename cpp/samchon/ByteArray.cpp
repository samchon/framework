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

// SEMI-CONSTRUCTORS
auto ByteArray::operator=(const ByteArray &byteArray) -> ByteArray&
{
	assign(byteArray.begin(), byteArray.end());
	position = byteArray.position;

	return *this;
}

auto ByteArray::operator=(ByteArray &&byteArray) -> ByteArray&
{
	super::operator=(move(byteArray));
	position = byteArray.position;

	return *this;
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