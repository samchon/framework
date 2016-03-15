#include <API.hpp>

using namespace std;
using namespace samchon::library;

/* ---------------------------------------------------------
	NORMAL METHODS
--------------------------------------------------------- */
CaseGenerator::CaseGenerator(size_t n, size_t r)
{
	this->n_ = n;
	this->r_ = r;
}

/* ---------------------------------------------------------
	ACCESSORS
--------------------------------------------------------- */
auto CaseGenerator::size() const -> size_t
{
	return size_;
}
auto CaseGenerator::at(size_t index) const -> vector<size_t>
{
	return move(operator[](index));
}

/* ---------------------------------------------------------
	GETTERS
--------------------------------------------------------- */
auto CaseGenerator::n() const -> size_t
{
	return n_;
}
auto CaseGenerator::r() const -> size_t
{
	return r_;
}

/* ---------------------------------------------------------
	MATRIX METHOD
--------------------------------------------------------- */
auto CaseGenerator::toMatrix() const -> vector<vector<size_t>>
{
	vector<vector<size_t>> matrix(size_, vector<size_t>(r_, 0));

	for (size_t i = 0; i < size_; i++)
		matrix[i] = move(at(i));
	
	return move(matrix);
}