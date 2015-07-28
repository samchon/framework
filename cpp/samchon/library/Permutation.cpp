#include <samchon/library/Permutation.hpp>
#include <samchon/Set.hpp>

using namespace std;
using namespace samchon::library;

Permutation::Permutation(size_t indexSize, size_t levelSize)
	: super(indexSize, levelSize)
{
}

auto Permutation::isValid(const vector<size_t> &row) const -> bool
{
	//DUPLICATION IS NOT PERMITTED
	Set<size_t> set;
	for (size_t i = 0; i < row.size(); i++)
		if (set.has(i) == true)
			return false;
		else
			set.insert(i);
	
	return true;
}
auto Permutation::MATRIX_SIZE() const -> size_t
{
	//nPr
	size_t val = 1;
	for (size_t i = 0; i < getLevelSize(); i++)
		val *= (getIndexSize() - i);

	return val;
}