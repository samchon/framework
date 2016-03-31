#include <samchon/library/PermutationGenerator.hpp>

using namespace std;
using namespace samchon::library;

PermutationGenerator::PermutationGenerator(size_t n, size_t r)
	: super(n, r)
{
	size_ = n;
	for (size_t i = n - 1; i > n - r; i--)
		size_ *= i;

	dividerArray.assign(n, NULL);
	for (size_t i = 0; i < n; i++)
		dividerArray[i] = i;
}
auto PermutationGenerator::operator[](size_t x) const -> vector<size_t>
{
	vector<size_t> atoms = this->dividerArray;
	vector<size_t> row(r_, NULL);

	for (size_t i = 0; i < row.size(); i++)
	{
		size_t item = x % atoms.size();
		x = (size_t)floor(x / (double)atoms.size());

		row[i] = atoms[item];
		atoms.erase(atoms.begin() + item);
	}
	return row;
}