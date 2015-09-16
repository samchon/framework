#include <iostream>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

#pragma comment(lib, "Debug/SamchonFramework.lib")

void main()
{
	string str = string("") +
		"<memberList>\n" +
		"	<member id='jhnam88' pass='1231' />\n" +
		"	<member id='samchon' pass='1231'>Administrator</member>\n" +
		"	<group>3</group>\n" +
		"</memberList>";

	shared_ptr<XML> xml(new XML(str));
	shared_ptr<Invoke> invoke(new Invoke("login", "jhnam88", "1231", 4, xml));

	cout << "Invoke to XML: " << endl;
	cout << invoke->toXML()->toString() << endl << endl;

	cout << "-------------------------------------------------------------" << endl;
	cout << "	Parameters" << endl;
	cout << "-------------------------------------------------------------" << endl;
	cout << "1st param: " << invoke->at(0)->getValueAsString() << endl;
	cout << "2nd param: " << invoke->at(1)->getValueAsNumber() << endl;
	cout << "3rd param: " << invoke->at(2)->getValueAsNumber() << endl;
	cout << "4th param: " << endl << invoke->at(3)->getValueAsXML()->toString() << endl;

	system("pause");
}