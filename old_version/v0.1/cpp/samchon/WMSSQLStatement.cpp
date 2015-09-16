#include <samchon/MSSQLStatement.hpp>

#include <samchon/SQLi.hpp>
#include <samchon/XML.hpp>

#include <memory>
#include <vector>

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <stdio.h>
#include <sql.h>
#include <sqlext.h>

#define _SQLNCLI_ODBC_
#include <sqlncli.h>

namespace samchon
{
	WMSSQLStatement::BasicMSSQLStatement(WSQLi *sqli)
		: WSQLStatement(sqli) {}
	template<> WMSSQLStatement::~BasicMSSQLStatement() {}

	template<> auto WMSSQLStatement::toXML() const -> shared_ptr<WXML>
	{
		fetch();
		wstring &str = getDataAsString(1);

		shared_ptr<WXML> xml(new WXML(str));
		return xml;
	}
};