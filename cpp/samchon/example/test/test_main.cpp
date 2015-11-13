#include <iostream>
#include <vector>
#include <string>
#include <thread>

#include <samchon/WeakString.hpp>

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

void main()
{
	string str = "<span style=\"color:#6666ff\">(¸ùºí¶û)</span>";
	WeakString wstr = str;

	wstr = wstr.between("<span ", "</span>");
	wstr = wstr.between(">");

	cout << str.size() << ", " << wstr.size() << endl;
	cout << wstr.str() << endl;

	system("pause");
}