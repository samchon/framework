#include <samchon/MSSQLi.hpp>
#include <samchon/MSSQLStatement.hpp>

namespace samchon
{
	auto MSSQLi::DRIVER() const -> string
	{
		return "{SQL Server}";
	}
	auto MSSQLi::PORT() const -> long
	{
		return 1433;
	}

	MSSQLi::BasicMSSQLi()
		: SQLi() {}
	template<> MSSQLi::~BasicMSSQLi() {}

	template<> auto MSSQLi::createStatement() -> SQLStatement*
	{
		return new MSSQLStatement(this);
	}
};