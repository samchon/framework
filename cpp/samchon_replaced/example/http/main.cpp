#include <iostream>
#include <vector>
#include <string>

#include <samchon/library/HTTPLoader.hpp>
#include <samchon/library/URLVariables.hpp>

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

void main()
{
	HTTPLoader loader("http://www.bomtvbiz.com/ad/?c=login", HTTPLoader::POST);
	URLVariables data;

	data["m_id"] = "rprt01";
	data["password"] = "1234";

	auto &binary = loader.load(data);

	string &str = binary.read<string>();
	cout << str.substr(0, 500) << endl;

	system("pause");
}