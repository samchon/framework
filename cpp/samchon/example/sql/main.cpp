#include <iostream>

#include <samchon/library/TSQLi.hpp>
#include <samchon/library/SQLStatement.hpp>

#include <samchon/library/XML.hpp>

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
	shared_ptr<SQLi> sqli(new TSQLi());

	try
	{
		sqli->connect("127.0.0.1", "BOMTV", "sa", "1231");

		auto stmt = sqli->createStatement();
		stmt->executeDirectly("EXEC getOrderArray");

		cout << stmt->to_XML()->to_string() << endl;
	}
	catch (exception &e)
	{
		cout << e.what() << endl;
	}

	system("pause");
}