#include <iostream>
#include <Windows.h>

#include "Scheduler.hpp"
#include "Travel.hpp"
#include "GeometryPoint.hpp"

using namespace std;
using namespace samchon::example::tsp;

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

void toClipboard(const string &);

void main()
{
	//GEOMETRY COORPORATES
	shared_ptr<Travel> travel(new Travel());
	for(int i = 0; i < 15; i++)
		travel->push_back(new GeometryPoint(i + 1));

	//OPTIMIZING
	struct GAParameters gaParameters = {.03, 50, 100, 300};
	
	Scheduler scheduler(travel, gaParameters);
	travel = scheduler.optimize();
	
	//PRINTING
	string &str = travel->toString();
	toClipboard(str);
	cout << str << endl;
	
	system("pause");
}

void toClipboard(const string &str)
{
	OpenClipboard(0);
	EmptyClipboard();
	HGLOBAL hg = GlobalAlloc(GMEM_MOVEABLE, str.size());

	if (!hg)
	{
		CloseClipboard();
		return;
	}
	memcpy(GlobalLock(hg), str.c_str(), str.size());

	GlobalUnlock(hg);
	SetClipboardData(CF_TEXT, hg);
	CloseClipboard();
	GlobalFree(hg);
}