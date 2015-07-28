#include <samchon/library/MSSQLi.hpp>
#include <samchon/library/MSSQLStatement.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

auto MSSQLi::DRIVER() const -> String
{
	return _T("{SQL Server}");
}
auto MSSQLi::PORT() const -> long
{
	return 1433;
}

MSSQLi::MSSQLi()
	: SQLi() {}
MSSQLi::~MSSQLi() {}

auto MSSQLi::createStatement() -> shared_ptr<SQLStatement>
{
	return shared_ptr<SQLStatement>(new MSSQLStatement(this));
}