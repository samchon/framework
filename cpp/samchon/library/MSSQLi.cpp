#include <samchon/library/TSQLi.hpp>
#include <samchon/library/TSQLStatement.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

TSQLi::TSQLi(int port)
	: SQLi("{SQL Server}", port) 
{}
TSQLi::~TSQLi() {}

auto TSQLi::createStatement() -> shared_ptr<SQLStatement>
{
	return shared_ptr<SQLStatement>(new TSQLStatement(this));
}