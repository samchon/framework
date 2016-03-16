#include <samchon/library/SQLi.hpp>

#ifndef WIN32_LEAN_AND_MEAN 
#	define WIN32_LEAN_AND_MEAN 
#endif

#include <Windows.h>
#include <sqltypes.h>
#include <sql.h>
#include <sqlext.h>

#include <iostream>
#include <memory>
#include <mutex>

#include <samchon/library/SQLStatement.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

SQLi::SQLi(const std::string &driver, int port)
{
	stmt = nullptr;

	this->driver = driver;
	this->port = port;
}
SQLi::~SQLi()
{
	disconnect();
}

auto SQLi::createStatement() -> shared_ptr<SQLStatement>
{
	return shared_ptr<SQLStatement>(new SQLStatement(this));
};

void SQLi::connect(const std::string &ip, const std::string &db, const std::string &id, const std::string &pwd)
{
	unique_lock<mutex> uk(stmtMutex);
	SQLRETURN res;
	SQLHANDLE environment;

	if ((res = SQLAllocHandle(SQL_HANDLE_ENV, SQL_NULL_HANDLE, &environment)) == SQL_SUCCESS)
		if ((res = SQLSetEnvAttr(environment, SQL_ATTR_ODBC_VERSION, (SQLPOINTER)SQL_OV_ODBC3, 0)) == SQL_SUCCESS)
			if ((res = SQLAllocHandle(SQL_HANDLE_DBC, environment, &hdbc)) == SQL_SUCCESS)
			{
				res =
					SQLDriverConnectA
					(
						hdbc, NULL,
						(SQLCHAR*)&StringUtil::substitute
						(
							"DRIVER={0};SERVER={1}, {2};DATABASE={3};UID={4};PWD={5};",
							driver, ip, port, db, id, pwd
						)[0],
						SQL_NTS, NULL, 1024, NULL, SQL_DRIVER_NOPROMPT
					);
			}

	SQLFreeHandle(SQL_HANDLE_DBC, environment);
	
	if (res != SQL_SUCCESS && res != SQL_SUCCESS_WITH_INFO)
	{
		disconnect();
		throw exception(getErrorMessage(SQL_HANDLE_DBC).c_str());
	}
}
void SQLi::disconnect()
{
	if (stmt != nullptr)
		stmt->free();

	//FOR STATIC DESTRUCTION
	stmtMutex.lock();
	SQLDisconnect(hdbc);
	SQLFreeHandle(SQL_HANDLE_DBC, hdbc);
	stmtMutex.unlock();
}

auto SQLi::getErrorMessage(short type) const -> string
{
	char state[1024];
	char message[1024];

	if (SQLGetDiagRecA(type, hdbc, 1, (SQLCHAR *)state, NULL, (SQLCHAR *)message, 1024, NULL) == SQL_SUCCESS)
		return string("SQLSTATE: ") + state + "\nMESSAGE: " + message;
	else
		return "Unknown";
}