#include <samchon/library/SQLStatement.hpp>

#include <memory>
#include <mutex>
#include <vector>
#include <samchon/library/SQLi.hpp>
#include <samchon/library/CriticalSet.hpp>
#include <samchon/library/XML.hpp>

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <sql.h>
#include <sqlext.h>

#define _SQLNCLI_ODBC_
#include <sqlncli.h>

using namespace std;
using namespace samchon;
using namespace samchon::library;

SQLStatement::SQLStatement(SQLi *sqli)
{
	this->sqli = sqli;
	bindParameterCount = 0;

	SQLAllocHandle(SQL_HANDLE_STMT, sqli->hdbc, &hstmt);
}
SQLStatement::~SQLStatement()
{
	free();
}

void SQLStatement::reset(SQLi *sqli)
{
	free();
	this->sqli = sqli;

	SQLAllocHandle(SQL_HANDLE_STMT, sqli->hdbc, &hstmt);
}
void SQLStatement::free()
{
	SQLFreeHandle(SQL_HANDLE_STMT, hstmt);

	bindParameterCount = 0;

	if (sqli == nullptr || sqli->stmt != this)
		return;

	sqli->stmt = nullptr;
	sqli->stmtMutex.unlock();
}
void SQLStatement::refresh()
{
	reset(this->sqli);
}

void SQLStatement::prepare(const String &sql)
{
	refresh();

	sqli->stmtMutex.lock();
	sqli->stmt = this;

	SQLPrepare(hstmt, (SQLTCHAR*)&sql[0], SQL_NTS);
}
void SQLStatement::execute()
{
	SQLRETURN res = SQLExecute(hstmt);
	if (res == SQL_ERROR)
		throw exception(sqli->getErrorMessage(SQL_HANDLE_STMT).c_str());
}
void SQLStatement::executeDirectly(const String &sql)
{
	sqli->stmtMutex.lock();
	sqli->stmt = this;

	SQLRETURN res = SQLExecDirect(sqli->hdbc, (SQLTCHAR*)sql.c_str(), (SQLINTEGER)sql.size());
	if (res == SQL_ERROR)
		throw exception(sqli->getErrorMessage(SQL_HANDLE_STMT).c_str());
}

/* --------------------------------------------------------------------------------------
GET DATA
-------------------------------------------------------------------------------------- */
auto SQLStatement::next() const -> bool
{
	return (SQLMoreResults(hstmt) != SQL_NO_DATA);
}
auto SQLStatement::fetch() const -> bool
{
	do
	{
		SQLSMALLINT colSize;
		SQLNumResultCols(hstmt, &colSize);

		if (colSize > 0)
			break;
	} while (next() == true);

	return (SQLFetch(hstmt) == SQL_SUCCESS);
}

/* -------------------------------------------------------------------
	AT
------------------------------------------------------------------- */
template<> auto SQLStatement::at(size_t index) const -> long
{
	long value;
	SQLGetData(hstmt, index, SQL_C_LONG, &value, 0, NULL);

	return value;
}
template<> auto SQLStatement::at(size_t index) const -> long long
{
	long long value;

	SQLGetData(hstmt, index, SQL_C_SBIGINT, &value, 0, NULL);
	return value;
}
template<> auto SQLStatement::at(size_t index) const -> float
{
	float value;

	SQLGetData(hstmt, index, SQL_C_FLOAT, &value, 0, NULL);
	return value;
}
auto SQLStatement::at(size_t index) const -> double
{
	double value;

	SQLGetData(hstmt, index, SQL_C_DOUBLE, &value, 0, NULL);
	return value;
}
auto SQLStatement::at(size_t index) const -> String
{
	String str(1, NULL);
	SQL_SIZE_T size = 0;

	if (SQLGetData(hstmt, index, SQL_C_TCHAR, &str[0], 0, &size) != SQL_SUCCESS && size != 0)
	{
		str.assign((size_t)size, NULL);
		SQLGetData(hstmt, index, SQL_C_TCHAR, &str[0], sizeof(TCHAR)*size, NULL);
	}
	return move(str);
}
auto SQLStatement::at(size_t index) const -> vector<unsigned char>
{
	vector<unsigned char> data = { NULL };
	SQL_SIZE_T size = 0;

	if (SQLGetData(hstmt, index, SQL_C_BINARY, &data[0], 0, &size) != SQL_SUCCESS && size != 0)
	{
		data.assign(size, NULL);
		SQLGetData(hstmt, index, SQL_C_BINARY, &data[0], data.size(), NULL);
	}
	return move(data);
}

/* -------------------------------------------------------------------
	GET
------------------------------------------------------------------- */

auto SQLStatement::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> xml(new XML());
	return xml;
}

/* --------------------------------------------------------------------------------------
BIND PARAMETER
-------------------------------------------------------------------------------------- */
void SQLStatement::bindParameter(const long double &val)
{
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_DOUBLE, SQL_DOUBLE, 0, 0, (long double*)&val, 0, NULL);
}
void SQLStatement::bindParameter(const double &val)
{
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_DOUBLE, SQL_DOUBLE, 0, 0, (double*)&val, 0, NULL);
}
void SQLStatement::bindParameter(const float &val)
{
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_FLOAT, SQL_FLOAT, 0, 0, (float*)&val, 0, NULL);
}
void SQLStatement::bindParameter(const unsigned int &val)
{
#ifdef _WIN64
	bindParameter((const unsigned long long&)val);
#else
	bindParameter((const unsigned long&)val);
#endif
}
void SQLStatement::bindParameter(const int &val)
{
#ifdef _WIN64
	bindParameter((const unsigned long long&)val);
#else
	bindParameter((const unsigned long&)val);
#endif
}
void SQLStatement::bindParameter(const unsigned long long &val)
{
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_UBIGINT, SQL_BIGINT, 0, 0, (unsigned long long*)&val, 0, NULL);
}
void SQLStatement::bindParameter(const long long &val)
{
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_SBIGINT, SQL_BIGINT, 0, 0, (long long*)&val, 0, NULL);
}
void SQLStatement::bindParameter(const unsigned long &val)
{
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_ULONG, SQL_INTEGER, 0, 0, (unsigned long*)&val, 0, NULL);
}
void SQLStatement::bindParameter(const long &val)
{
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_LONG, SQL_INTEGER, 0, 0, (long*)&val, 0, NULL);
}
void SQLStatement::bindParameter(const bool &val)
{
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_BIT, SQL_BIT, 0, 0, (bool*)&val, 0, NULL);
}
void SQLStatement::bindParameter(const String &val)
{
#ifdef _UNICODE
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_WCHAR, SQL_WVARCHAR, val.size(), 0, (wchar_t*)&val[0], 0, NULL);
#else
	::SQLBindParameter(hstmt, (SQLSMALLINT)++bindedCount, SQL_PARAM_INPUT, SQL_C_TCHAR, SQL_VARCHAR, val.size(), 0, (char*)&val[0], 0, NULL);
#endif
}
void SQLStatement::bindParameter(const vector<unsigned char> &val)
{
	bindParameterBASizeMap.set(++bindParameterCount, (SQL_SIZE_T)val.size());
	::SQLBindParameter(hstmt, (SQLSMALLINT)bindParameterCount, SQL_PARAM_INPUT, SQL_C_BINARY, SQL_LONGVARBINARY, val.size(), 0, (unsigned char*)&val[0], 0, &bindParameterBASizeMap.get(bindParameterCount));
}
