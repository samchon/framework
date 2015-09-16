#include <samchon/MSSQLi.hpp>
#include <samchon/MSSQLStatement.hpp>

#include <string>
using namespace std;

namespace samchon
{
	auto WMSSQLi::DRIVER() const -> wstring
	{
		return L"{SQL Server}";
	}
	auto WMSSQLi::PORT() const -> long
	{
		return 1433;
	}

	WMSSQLi::BasicMSSQLi()
		: WSQLi() {}
	template<> WMSSQLi::~BasicMSSQLi() {}

	template<> auto WMSSQLi::createStatement() -> WSQLStatement*
	{
		return new WMSSQLStatement(this);
	}
};