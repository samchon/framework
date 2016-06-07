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

	loadPage();

	system("pause");
}

void loadPage()
{
	HTTPLoader loader("http://samchon.org/simulation/php/corporate/list.php", HTTPLoader::GET);
	URLVariables data;
	{
		data["c"] = "order";
		data["a"] = "outsourcing";
		data["page"] = "2";
	}

	//cout << "#size: " << loader.load(data).size() << endl;
	string &str = loader.load(data).read<string>();
}