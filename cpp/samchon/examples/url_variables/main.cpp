#include <iostream>
#include <samchon/library/URLVariables.hpp>

using namespace std;
using namespace samchon::library;

void main()
{
	URLVariables uv("name=Samchon+Framework&version=1.0&author=Jeongho+Nam");
	uv["since"] = "2011.09.16";
	uv["sections"] = "['library', 'protocol', 'nam-tree']";

	cout << uv.toString() << endl;
	system("pause");
}