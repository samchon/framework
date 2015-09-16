#include <samchon/MSSQLStatement.hpp>
#include <samchon/SQLi.hpp>
#include <samchon/XML.hpp>

namespace samchon
{
	MSSQLStatement::BasicMSSQLStatement(SQLi *sqli)
		: SQLStatement(sqli) {}
	template<> MSSQLStatement::~BasicMSSQLStatement() {}

	template<> auto MSSQLStatement::toXML() const -> shared_ptr<XML>
	{
		fetch();
		string &str = getDataAsString(1);

		shared_ptr<XML> xml(new XML(str));
		return xml;
	}
};