#include <samchon/library/CaseGenerator.hpp>

using namespace std;
using namespace samchon::library;

/* ---------------------------------------------------------
	NORMAL METHODS
--------------------------------------------------------- */
CaseGenerator::CaseGenerator(size_t n, size_t r)
{
	this->n = n;
	this->r = r;
}

/* ---------------------------------------------------------
	ACCESSORS
--------------------------------------------------------- */
auto CaseGenerator::size() const -> size_t
{
	return size_;
}
auto CaseGenerator::operator[](size_t index) const -> vector<size_t>
{
	return move( at(index) );
}

/* ---------------------------------------------------------
	GETTERS
--------------------------------------------------------- */
auto CaseGenerator::getIndexSize() const -> size_t
{
	return n;
}
auto CaseGenerator::getLevelSize() const -> size_t
{
	return r;
}

/* ---------------------------------------------------------
	MATRIX METHOD
--------------------------------------------------------- */
auto CaseGenerator::toMatrix() const -> vector<vector<size_t>>
{
	vector<vector<size_t>> matrix(size_, vector<size_t>(r, 0));

	for (size_t i = 0; i < size_; i++)
		matrix[i] = move(at(i));
	
	return move(matrix);
}