#include <samchon/library/StringUtil.hpp>

#include <iostream>

using namespace std;
using namespace samchon::library;

#ifdef _WIN64
#	ifdef _DEBUG
#		pragma comment(lib, "x64/Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "x64/Release/SamchonFramework.lib")
#	endif
#else
#	ifdef _DEBUG
#		pragma comment(lib, "Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "Release/SamchonFramework.lib")
#	endif
#endif

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