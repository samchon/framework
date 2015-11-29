#include <iostream>
#include <samchon/library/Charset.hpp>

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

using namespace std;
using namespace samchon;
using namespace samchon::library;

void main()
{
	string s1 = "æ»≥Á«œººø‰";
	s1 = Charset::toUTF8(s1);

	string s2 = u8"æ»≥Á«œººø‰";

	cout << s1 << endl;
	cout << s2 << endl;
	cout << (s1 == s2) << endl;

	cout << Charset::toMultibyte(s2) << endl;

	system("pause");
}