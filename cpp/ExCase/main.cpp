#include <iostream>
#include <memory>

#include <samchon/library/CombinedPermutationGenerator.hpp>
#include <samchon/library/PermutationGenerator.hpp>
#include <samchon/library/FactorialGenerator.hpp>

#pragma comment(lib, "../x64/Debug/SamchonFramework.lib")

using namespace std;
using namespace samchon::library;

void ithPermutation(const int n, int i)
{
	int j, k = 0;
	int *fact = (int *)calloc(n, sizeof(int));
	int *perm = (int *)calloc(n, sizeof(int));

	// compute factorial numbers
	fact[k] = 1;
	while (++k < n)
		fact[k] = fact[k - 1] * k;

	// compute factorial code
	for (k = 0; k < n; ++k)
	{
		perm[k] = i / fact[n - 1 - k];
		i = i % fact[n - 1 - k];
	}

	// readjust values to obtain the permutation
	// start from the end and check if preceding values are lower
	for (k = n - 1; k > 0; --k)
		for (j = k - 1; j >= 0; --j)
			if (perm[j] <= perm[k])
				perm[k]++;

	// print permutation
	for (k = 0; k < n; ++k)
		printf("%d ", perm[k]);
	printf("\n");

	free(fact);
	free(perm);
}

void print(const CaseGenerator &caseGenerator)
{
	auto &matrix = caseGenerator.toMatrix();

	for (size_t i = 0; i < matrix.size(); i++)
	{
		auto &row = matrix[i];

		cout << "\t" << row[0];
		for (size_t j = 1; j < row.size(); j++)
			cout << ", " << row[j];
		cout << endl;
	}
}
void main()
{
	cout << "Combined Permuation 3 and 3: " << endl;
	print(CombinedPermutationGenerator(3, 3));

	cout << "Permuation 4 and 2: " << endl;
	print(PermutationGenerator(4, 2));
	
	cout << "Factorial 3: " << endl;
	print(PermutationGenerator(3, 3));

	system("pause");
}