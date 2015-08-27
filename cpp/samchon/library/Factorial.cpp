#include <samchon/library/FactorialGenerator.hpp>

using namespace std;
using namespace samchon::library;

FactorialGenerator::FactorialGenerator(size_t n)
	: super(n, n)
{
}
/*FactorialGenerator::FactorialGenerator(size_t n)
	: super(n, n)
{
	size_ = n;
	for (size_t i = n - 1; i >= 1; i--)
		size_ *= i;
	
	dividerArray.assign(n, 1);
	for (size_t i = 1; i < n; i++)
		dividerArray[i] = dividerArray[i - 1] * i;
}
auto FactorialGenerator::at(size_t x) const -> vector<size_t>
{
	vector<size_t> row(n, NULL);
	long long i, j;
	long long n = (long long)this->n;

	for (i = 0; i < n; i++)
	{
		row[(size_t)i] = x / dividerArray[(size_t)(n - 1 - i)];
		x = x % dividerArray[(size_t)(n - 1 - i)];
	}

	for (i = n - 1; i > 0; --i)
		for (j = i - 1; j >= 0; --j)
			if (row[(size_t)j] <= row[(size_t)i])
				row[(size_t)i]++;

	return move(row);
}*/