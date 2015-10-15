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

/* --------------------------------------------------------------------------------------
	QUERY
		- PREPARE
		- EXECUTE
		- EXECUTE_DIRECTLY
-------------------------------------------------------------------------------------- */
void SQLStatement::prepare(const std::string &sql)
{
	refresh();

	sqli->stmtMutex.lock();
	sqli->stmt = this;

	SQLPrepareA(hstmt, (SQLCHAR*)&sql[0], SQL_NTS);
}
void SQLStatement::execute()
{
	SQLRETURN res = SQLExecute(hstmt);
	if (res == SQL_ERROR)
		throw exception(sqli->getErrorMessage(SQL_HANDLE_STMT).c_str());
}
void SQLStatement::executeDirectly(const std::string &sql)
{
	sqli->stmtMutex.lock();
	sqli->stmt = this;

	SQLRETURN res = SQLExecDirectA(sqli->hdbc, (SQLCHAR*)sql.c_str(), (SQLINTEGER)sql.size());
	if (res == SQL_ERROR)
		throw exception(sqli->getErrorMessage(SQL_HANDLE_STMT).c_str());
}

/* --------------------------------------------------------------------------------------
	CURSOR
		- NEXT
		- FETCH
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

/* --------------------------------------------------------------------------------------
	GET DATA
		- SIZE
		- AT
		- GET
-------------------------------------------------------------------------------------- */
auto SQLStatement::size() const -> size_t
{
	SQLSMALLINT val = 0;

	SQLNumResultCols(hstmt, &val);
	return (size_t)val;
}

template<> auto SQLStatement::at(size_t index) const -> std::string
{
	index++;

	std::string str(1, NULL);
	SQLLEN size = 0;
	
	if (::SQLGetData(hstmt, (SQLUSMALLINT)index, SQL_C_CHAR, &str[0], 0, &size) != SQL_SUCCESS && size != 0)
	{
		str.assign((size_t)size, NULL);
		::SQLGetData(hstmt, (SQLUSMALLINT)index, SQL_C_CHAR, &str[0], sizeof(char)*size, NULL);
	}
	return move(str);
}
template<> auto SQLStatement::at(size_t index) const -> std::wstring
{
	index++;

	std::wstring str(1, NULL);
	SQLLEN size = 0;

	if (::SQLGetData(hstmt, (SQLUSMALLINT)index, SQL_C_WCHAR, &str[0], 0, &size) != SQL_SUCCESS && size != 0)
	{
		str.assign((size_t)size, NULL);
		::SQLGetData(hstmt, (SQLUSMALLINT)index, SQL_C_WCHAR, &str[0], sizeof(wchar_t)*size, NULL);
	}
	return move(str);
}
template<> auto SQLStatement::at(size_t index) const -> ByteArray
{
	index++;

	ByteArray data;
	SQLLEN size = 0;

	if (::SQLGetData(hstmt, (SQLUSMALLINT)index, SQL_C_BINARY, &data[0], 0, &size) != SQL_SUCCESS && size != 0)
	{
		data.assign(size, NULL);
		::SQLGetData(hstmt, (SQLUSMALLINT)index, SQL_C_BINARY, &data[0], data.size(), NULL);
	}
	return move(data);
}

/* -------------------------------------------------------------------
	TO_XML
------------------------------------------------------------------- */
auto SQLStatement::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> xml(new XML());
	return xml;
}

/* --------------------------------------------------------------------------------------
	BIND PARAMETER
-------------------------------------------------------------------------------------- */
template<> void SQLStatement::bindParameter(const std::string &val)
{
	::SQLBindParameter(hstmt, (SQLUSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_TCHAR, SQL_VARCHAR, val.size(), 0, (char*)&val[0], 0, NULL);
}
template<> void SQLStatement::bindParameter(const std::wstring &val)
{
	::SQLBindParameter(hstmt, (SQLUSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_WCHAR, SQL_WVARCHAR, val.size(), 0, (wchar_t*)&val[0], 0, NULL);
}
template<> void SQLStatement::bindParameter(const ByteArray &val)
{
	bindParameterBASizeMap.set(++bindParameterCount, (SQL_SIZE_T)val.size());

	::SQLBindParameter(hstmt, (SQLUSMALLINT)bindParameterCount, SQL_PARAM_INPUT, SQL_C_BINARY, SQL_LONGVARBINARY, val.size(), 0, (unsigned char*)&val[0], 0, &bindParameterBASizeMap.get(bindParameterCount));
}

/* -------------------------------------------------------------------
	ODBC'S FUNCTION
------------------------------------------------------------------- */
void SQLStatement::sql_get_data(size_t index, short type, void *listener) const
{
	//SQLGetData(hstmt, index, SQL_C_FLOAT, &value, 0, NULL);
	::SQLGetData(hstmt, (SQLUSMALLINT)index, type, listener, 0, nullptr);
}
void SQLStatement::sql_bind_parameter(short cppType, short sqlType, void *val)
{
	//::SQLBindParameter(hstmt, (SQLSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, SQL_C_BIT, SQL_BIT, 0, 0, (bool*)&val, 0, NULL);
	::SQLBindParameter(hstmt, (SQLUSMALLINT)++bindParameterCount, SQL_PARAM_INPUT, cppType, sqlType, 0, 0, val, 0, nullptr);
}

/* -------------------------------------------------------------------
	C-TYPE
------------------------------------------------------------------- */
template<> auto SQLStatement::C_TYPE(const bool &) const -> short
{
	return SQL_C_BIT;
}
template<> auto SQLStatement::C_TYPE(const char &) const -> short
{
	return SQL_CHAR;
}
template<> auto SQLStatement::C_TYPE(const short &) const -> short
{
	return SQL_C_SSHORT;
}
template<> auto SQLStatement::C_TYPE(const long &) const -> short
{
	return SQL_C_SLONG;
}
template<> auto SQLStatement::C_TYPE(const long long &) const -> short
{
	return SQL_C_SBIGINT;
}
template<> auto SQLStatement::C_TYPE(const int &) const -> short
{
	return SQL_C_SLONG;
}
template<> auto SQLStatement::C_TYPE(const float &) const -> short
{
	return SQL_C_FLOAT;
}
template<> auto SQLStatement::C_TYPE(const double &) const -> short
{
	return SQL_C_DOUBLE;
}

template<> auto SQLStatement::C_TYPE(const unsigned char &) const -> short
{
	return SQL_C_BINARY;
}
template<> auto SQLStatement::C_TYPE(const unsigned short &) const -> short
{
	return SQL_C_USHORT;
}
template<> auto SQLStatement::C_TYPE(const unsigned long &) const -> short
{
	return SQL_C_ULONG;
}
template<> auto SQLStatement::C_TYPE(const unsigned long long &) const -> short
{
	return SQL_C_UBIGINT;
}
template<> auto SQLStatement::C_TYPE(const unsigned int &) const -> short
{
	return SQL_C_UBIGINT;
}
template<> auto SQLStatement::C_TYPE(const long double &) const -> short
{
	return SQL_C_DOUBLE;
}

template<> auto SQLStatement::C_TYPE(const string &) const -> short
{
	return SQL_C_CHAR;
}
template<> auto SQLStatement::C_TYPE(const wstring &) const -> short
{
	return SQL_C_WCHAR;
}
template<> auto SQLStatement::C_TYPE(const ByteArray &) const -> short
{
	return SQL_C_BINARY;
}

/* -------------------------------------------------------------------
	SQL-TYPE
------------------------------------------------------------------- */
template<> auto SQLStatement::SQL_TYPE(const bool &) const -> short
{
	return SQL_BIT;
}
template<> auto SQLStatement::SQL_TYPE(const char &) const -> short
{
	return SQL_CHAR;
}
template<> auto SQLStatement::SQL_TYPE(const short &) const -> short
{
	return SQL_TINYINT;
}
template<> auto SQLStatement::SQL_TYPE(const long &) const -> short
{
	return SQL_INTEGER;
}
template<> auto SQLStatement::SQL_TYPE(const long long &) const -> short
{
	return SQL_BIGINT;
}
template<> auto SQLStatement::SQL_TYPE(const int &) const -> short
{
	return SQL_INTEGER;
}
template<> auto SQLStatement::SQL_TYPE(const float &) const -> short
{
	return SQL_FLOAT;
}
template<> auto SQLStatement::SQL_TYPE(const double &) const -> short
{
	return SQL_DOUBLE;
}

template<> auto SQLStatement::SQL_TYPE(const unsigned char &) const -> short
{
	return SQL_BINARY;
}
template<> auto SQLStatement::SQL_TYPE(const unsigned short &) const -> short
{
	return SQL_TINYINT;
}
template<> auto SQLStatement::SQL_TYPE(const unsigned long &) const -> short
{
	return SQL_INTEGER;
}
template<> auto SQLStatement::SQL_TYPE(const unsigned long long &) const -> short
{
	return SQL_BIGINT;
}
template<> auto SQLStatement::SQL_TYPE(const unsigned int &) const -> short
{
	return SQL_INTEGER;
}
template<> auto SQLStatement::SQL_TYPE(const long double &) const -> short
{
	return SQL_DOUBLE;
}

template<> auto SQLStatement::SQL_TYPE(const string &) const -> short
{
	return SQL_CHAR;
}
template<> auto SQLStatement::SQL_TYPE(const wstring &) const -> short
{
	return SQL_WCHAR;
}
template<> auto SQLStatement::SQL_TYPE(const ByteArray &) const -> short
{
	return SQL_BINARY;
}