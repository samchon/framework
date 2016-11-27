//#include <samchon/library.hpp>
//#include <samchon/protocol.hpp>
//#include <samchon/templates.hpp>
//
//#include <samchon/library/TSQLi.hpp>
//
//using namespace std;
//using namespace samchon;
//
//class MyExt : public templates::distributed::DistributedSystemArrayMediator<>
//{
//};
//
//void main()
//{
//	library::FactorialGenerator pg(5);
//	cout << pg.size() << endl;
//
//	system("pause");
//}

#include <iostream>

#include <samchon/library/HTTPLoader.hpp>
#include <samchon/WeakString.hpp>
#include <samchon/library/URLVariables.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

int main(int argc, char *argv[])
{
	HTTPLoader loader("http://127.0.0.1:37562/something");

	//WeakString file = argv[2];
	//WeakString material = argv[3];

	//if (file.find(";") != WeakString::npos)
	//	file = file.between("", ";");

	URLVariables data;
	{
		data.set("file", "something.plt");
		data.set("material", "some material");
	}

	const ByteArray &binary = loader.load(data);
	cout << binary.read<std::string>() << endl;

	system("pause");
	return 0;
}