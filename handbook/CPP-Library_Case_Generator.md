# Case Generator
Derived Types of CaseGenerator are:
  - <sub>n</sub>Π<sub>r</sub>: CombinedPermutationGeneration
  - <sub>n</sub>P<sub>r</sub>: PermutationGenerator
  - N!: FactorialGenerator

## Usage
```cpp
#include <iostream
#include <samchon/library/PermutationGenerator.hpp>

using namespace std;
using namespace samchon::library;

int main()
{
	// PERMUTATION CASE GENERATOR FOR 5P3 := 5 x 4 x 3
	PermutationGenerator case_gen(5, 3);
	
	for (size_t i = 0; i < case_gen.size(); i++)
	{
		// {i + 1} TH SINGLE CASE IN THE 5P3
		const vector<size_t> my_case = case_gen.at(i);
		
		for (size_t j = 0; j < my_case.size(); j++)
			cout << my_case[j] << "  " << endl;
		cout << endl;
	}
	return 0;
}
```