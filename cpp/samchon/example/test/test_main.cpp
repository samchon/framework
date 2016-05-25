#include <iostream>
#include <thread>
#include <string>
#include <samchon/library/TSQLi.hpp>
#include <samchon/library/SQLStatement.hpp>

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
using namespace samchon::library;

void main()
{
	TSQLi sqli;
	sqli.connect("127.0.0.1", "master", "sa", "team8");

	auto stmt = sqli.createStatement();
	int val1 = 4;
	double val2 = 5.0;
	wstring val3 = L"a value";

	stmt->prepare("SELECT ?, ?, ?", val1, val2, val3);
	stmt->execute();

	stmt->fetch();
	cout << stmt->at<int>(0) << endl;
	cout << stmt->at<double>(1) << endl;
	wcout << "'" << stmt->at<wstring>(2) << "'" << endl;

	system("pause");
}