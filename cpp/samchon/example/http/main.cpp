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
	HTTPLoader loader("http://125.141.234.148/ad", HTTPLoader::POST);
	URLVariables data;
	data["dummy"] = "1";
	
	auto &binary = loader.load(data);

	string &str = binary.read<string>();
	cout << str << endl;

	system("pause");
}