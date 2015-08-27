#include <samchon/library/CombinedPermutationGenerator.hpp>

using namespace std;
using namespace samchon::library;

CombinedPermutationGenerator::CombinedPermutationGenerator(size_t n, size_t r)
	: super(n, r)
{
	this->size_ = (size_t)pow(n, r);

	dividerArray.assign(r, NULL);
	for (size_t i = 0; i < r; i++)
	{
		size_t x = r - (i + 1);
		dividerArray[i] = (size_t)pow(n, x);
	}
}
auto CombinedPermutationGenerator::at(size_t x) const -> vector<size_t>
{
	vector<size_t> row(r, 0);
	for (size_t i = 0; i < row.size(); i++)
		row[i] = (x / dividerArray[i]) % n;

	return move(row);
}