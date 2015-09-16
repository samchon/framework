#include <samchon/SQLi.hpp>
#include <samchon/SQLStatement.hpp>

#ifndef WIN32_LEAN_AND_MEAN 
#define WIN32_LEAN_AND_MEAN 
#endif 
#include <Windows.h>
#include <sqltypes.h>
#include <sql.h>
#include <sqlext.h>

#include <string>
#include <memory>
#include <mutex>

#include <samchon/StringUtil.hpp>

namespace samchon
{
	SQLi::BasicSQLi() 
	{
		stmtMutex = new mutex();
		stmt = nullptr;
	}
	template<> SQLi::~BasicSQLi()
	{
		disconnect();
		if (stmtMutex != nullptr)
			delete stmtMutex;
	}

	template<> void SQLi::connect(const string &ip, const string &db, const string &id, const string &pwd)
	{
		SQLRETURN res;
		SQLHANDLE environment;

		stmtMutex->lock();
		if ((res = SQLAllocHandle(SQL_HANDLE_ENV, SQL_NULL_HANDLE, &environment)) == SQL_SUCCESS)
			if ((res = SQLSetEnvAttr(environment, SQL_ATTR_ODBC_VERSION, (SQLPOINTER)SQL_OV_ODBC3, 0)) == SQL_SUCCESS)
				if ((res = SQLAllocHandle(SQL_HANDLE_DBC, environment, &hdbc)) == SQL_SUCCESS)
					res =
						SQLDriverConnectA
						(
							hdbc, NULL,
							(SQLCHAR *)&StringUtil::substitute
							(
								"DRIVER={0};SERVER={1}, {2};DATABASE={3};UID={4};PWD={5};",
								DRIVER(), ip, PORT(), db, id, pwd
							)[0],
							SQL_NTS, NULL, 1024, NULL, SQL_DRIVER_NOPROMPT
						);

		SQLFreeHandle(SQL_HANDLE_DBC, environment);
		stmtMutex->unlock();

		if (res != SQL_SUCCESS && res != SQL_SUCCESS_WITH_INFO)
		{
			disconnect();
			throw exception(getErrorMessage(SQL_HANDLE_DBC).c_str());
		}
	}
	template<> void SQLi::disconnect()
	{
		if (stmt != nullptr)
			stmt->free();

		if (stmtMutex != nullptr)
		{
			//FOR STATIC DESTRUCTION
			stmtMutex->lock();
			SQLDisconnect(hdbc);
			SQLFreeHandle(SQL_HANDLE_DBC, hdbc);
			stmtMutex->unlock();
		}
	}
	
	template<> auto SQLi::getErrorMessage(short type) const -> string
	{
		char state[1024];
		char message[1024];
		
		if (SQLGetDiagRecA(type, hdbc, 1, (SQLCHAR *)state, NULL, (SQLCHAR *)message, 1024, NULL) == SQL_SUCCESS)
			return string("SQLSTATE: ") + state + "\nMESSAGE: " + message;
		else
			return "Unknown";
	}
}