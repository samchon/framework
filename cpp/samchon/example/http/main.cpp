#include <iostream>
#include <vector>
#include <string>
#include <thread>

#include <samchon/library/HTTPLoader.hpp>
#include <samchon/library/URLVariables.hpp>

#include <Windows.h>

using namespace std;
using namespace samchon;
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

void login();
void loadPage();

void toClipboard(const std::string &);

void main()
{
	login();
	loadPage();

	system("pause");
}

void login()
{
	HTTPLoader loader("http://www.bomtvbiz.com/ad/?c=login", HTTPLoader::POST);
	URLVariables data;
	{
		data["m_id"] = "rprt01";
		data["password"] = "1234";
	}

	string &str = loader.load(data).read<string>();
	cout << str << endl << endl;
	//cout << loader.load(data).read<string>() << endl << endl;
}
void loadPage()
{
	//http://www.bomtvbiz.com/ad/
	//http://samchon.org/simulation/php/corporate/list.php
	HTTPLoader loader("http://www.bomtvbiz.com/ad/", HTTPLoader::GET);
	URLVariables data;
	{
		data["c"] = "order";
		data["a"] = "outsourcing";
		data["page"] = "2";
	}

	string &str = loader.load(data).read<string>();
	toClipboard(str);
	//cout << str << endl << endl;
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