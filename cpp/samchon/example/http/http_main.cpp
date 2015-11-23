#include <iostream>
#include <fstream>

#include <vector>
#include <string>
#include <thread>

#include <samchon/library/HTTPLoader.hpp>
#include <samchon/library/URLVariables.hpp>
#include <samchon/library/Charset.hpp>

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
void loadFile();

void toClipboard(const std::string &);

void main()
{
	setlocale(LC_ALL, "korean");

	login();
	loadPage();
	loadFile();

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
	HTTPLoader loader("http://samchon.org/simulation/php/corporate/list.php", HTTPLoader::GET);
	URLVariables data;
	{
		data["c"] = "order";
		data["a"] = "outsourcing";
		data["page"] = "2";
	}

	//cout << "#size: " << loader.load(data).size() << endl;
	string &str = loader.load(data).read<string>();
	toClipboard(str);
}
void loadFile()
{
	HTTPLoader loader(Charset::toUTF8("http://www.bomtvbiz.com/dt/order_print/1448241706869/20151123_1448241706869_±èÇö¿ì_2¸í_±è ½Â ÁÖ.pdf"), HTTPLoader::GET);
	ByteArray &data = loader.load({});

	// ÆÄÀÏ ÀúÀå
	ofstream file("E:\\test.pdf", ios::out | ios::binary);
	file.write((const char*)&data[0], data.size());

	file.close();
}

void toClipboard(const string &str)
{
	OpenClipboard(0);
	EmptyClipboard();
	HGLOBAL hg = GlobalAlloc(GMEM_MOVEABLE, str.size() + 1);

	if (!hg)
	{
		CloseClipboard();
		return;
	}
	memcpy(GlobalLock(hg), str.c_str(), str.size() + 1);

	GlobalUnlock(hg);
	SetClipboardData(CF_TEXT, hg);
	CloseClipboard();
	GlobalFree(hg);
}