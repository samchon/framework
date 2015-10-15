#include <iostream>
#include <samchon/library/PermutationGenerator.hpp>

#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon::library;

void main()
{
	shared_ptr<XML> xml(new XML("XML ¹®ÀÚ¿­"));

	cout << xml->get("parameter")->at(1)
		->get("memberist")->at(0)
		->get("member")->at(1)
			->getProperty("id") << endl;

	system("pause");
}