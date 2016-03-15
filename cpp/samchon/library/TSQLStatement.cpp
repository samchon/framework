#include <API.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

TSQLStatement::TSQLStatement(SQLi *sqli)
	: SQLStatement(sqli) {}
TSQLStatement::~TSQLStatement() {}

auto TSQLStatement::toXML() const -> shared_ptr<XML>
{
	fetch();
	string &str = super::at<std::string>(0);

	shared_ptr<XML> xml(new XML(str));
	return xml;
}
