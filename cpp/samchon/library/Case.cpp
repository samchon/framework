#include <samchon/library/Case.hpp>

using namespace std;
using namespace samchon::library;

/* ---------------------------------------------------------
	NORMAL METHODS
--------------------------------------------------------- */
//CONSTRUCTOR
Case::Case(size_t indexSize, size_t levelSize)
{
	this->indexSize = indexSize;
	this->levelSize = levelSize;
	this->size_ = (size_t)pow(indexSize, levelSize);

	dividerArray.assign(levelSize, NULL);
	for (size_t i = 0; i < levelSize; i++)
	{
		size_t x = levelSize - (i + 1);
		dividerArray[i] = (size_t)pow(indexSize, x);
	}
}

auto Case::getIndexSize() const -> size_t
{
	return indexSize;
}
auto Case::getLevelSize() const -> size_t
{
	return levelSize;
}

//ACCESSORS
auto Case::size() const -> size_t
{
	return size_;
}
auto Case::at(size_t x) const -> vector<size_t>
{
	vector<size_t> row(levelSize, 0);
	fetchRow(row, x);

	return move(row);
}
auto Case::operator[](size_t x) const -> vector<size_t>
{
	return move(at(x));
}

//FETCHERS
void Case::fetchRow(vector<size_t> &row, size_t x) const
{
	for (size_t i = 0; i < row.size(); i++)
		row[i] = (x / dividerArray[i]) % indexSize;
}
auto Case::isValid(size_t x) const -> bool
{
	return isValid(at(x));
}

/* ---------------------------------------------------------
	MATRIX METHOD
--------------------------------------------------------- */
auto Case::toMatrix() const -> vector<vector<size_t>>
{
	vector<vector<size_t>> matrix(MATRIX_SIZE(), vector<size_t>(levelSize, 0));
	size_t matrixSize = MATRIX_SIZE();
	size_t x = 0;

	for (size_t i = 0; i < size_; i++)
	{
		vector<size_t> &row = matrix[x];
		fetchRow(row, i);

		if (isValid(row) == true)
			x++;
	}
	return move(matrix);
}