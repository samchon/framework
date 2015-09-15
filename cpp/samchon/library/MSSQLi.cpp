#include <samchon/library/MSSQLi.hpp>
#include <samchon/library/MSSQLStatement.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

MSSQLi::MSSQLi(int port)
	: SQLi("{SQL Server}", port) 
{}
MSSQLi::~MSSQLi() {}

auto MSSQLi::createStatement() -> shared_ptr<SQLStatement>
{
	return shared_ptr<SQLStatement>(new MSSQLStatement(this));
}