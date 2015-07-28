#include <samchon/library/CombinedPermutation.hpp>

using namespace std;
using namespace samchon::library;

CombinedPermutation::CombinedPermutation(size_t indexSize, size_t levelSize)
	: super(indexSize, levelSize)
{
}

auto CombinedPermutation::isValid(const vector<size_t> &) const -> bool
{
	return true;
}
auto CombinedPermutation::MATRIX_SIZE() const -> size_t
{
	return size();
	//return (size_t)(getIndexSize(), getLevelSize());
}