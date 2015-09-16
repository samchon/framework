#include <iostream>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

int main()
{
	string str = string("") +
		"<memberList>\n" +
		"	<member id='jhnam88' pass='1231' />\n" +
		"	<member id='samchon' pass='1231'>Administrator</member>\n" +
		"	<group>3</group>\n" +
		"</memberList>";

	shared_ptr<XML> xml(new XML(str));
	cout << Invoke::s_invoke()->toXML()->toString() << endl;

	system("pause");
	return 0;
}