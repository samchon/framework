#include <samchon/library/StringUtil.hpp>

#include <iostream>

using namespace std;
using namespace samchon::library;

void main()
{
	string name = "Samchon Framework";
	unsigned short major = 1;
	int minor = 0;
	long patch = 0;

	cout <<
		StringUtil::substitute
		(
			"{1}: v{2}.{3}.{4}; Since {5}, {6}",
			name, major, minor, patch,
			"December", 2012
		) << endl;

	system("pause");
}