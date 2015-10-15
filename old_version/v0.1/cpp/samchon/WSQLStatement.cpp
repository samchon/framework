#include <samchon/SQLStatement.hpp>
#include <samchon/SQLi.hpp>

#include <memory>
#include <mutex>
#include <vector>
#include <samchon/CriticalSet.hpp>
#include <samchon/XML.hpp>

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <stdio.h>
#include <sql.h>
#include <sqlext.h>

#define _SQLNCLI_ODBC_
#include <sqlncli.h>

namespace samchon
{
	WSQLStatement::BasicSQLStatement(WSQLi *sqli)
	{this->sqli = sqli;
		bindedCount = 0;
		sizeMap = new Map<size_t, SQL_SIZE_T>();
		
		SQLAllocHandle(SQL_HANDLE_STMT, sqli->hdbc, &hstmt);
	}
	template<> WSQLStatement::~BasicSQLStatement()
	{
		free();
		delete sizeMap;
	}

	template<> void WSQLStatement::reset(WSQLi *sqli)
	{
		free();
		this->sqli = sqli;

		SQLAllocHandle(SQL_HANDLE_STMT, sqli->hdbc, &hstmt);
	}
	template<> void WSQLStatement::free()
	{
		SQLFreeHandle(SQL_HANDLE_STMT, hstmt);

		bindedCount = 0;
		sizeMap->clear();

		if (sqli == nullptr || sqli->stmt != this)
			return;
		
		sqli->stmt = nullptr;
		sqli->stmtMutex->unlock();
	}
	template<> void WSQLStatement::refresh()
	{
		reset(this->sqli);
	}

	template<> void WSQLStatement::prepare(const wstring &sql)
	{
		refresh();

		sqli->stmtMutex->lock();
		sqli->stmt = this;

		SQLPrepareW(hstmt, (wchar_t*)&sql[0], SQL_NTS);
	}
	template<> void WSQLStatement::execute()
	{
		SQLRETURN res = SQLExecute(hstmt);
		if (res == SQL_ERROR)
			throw exception(sqli->getErrorMessage(SQL_HANDLE_STMT).c_str());
	}
	template<> void WSQLStatement::executeDirect(const wstring &sql)
	{
		refresh();

		sqli->stmtMutex->lock();
		sqli->stmt = this;

		SQLRETURN res = SQLExecDirectW(sqli->hdbc, (SQLWCHAR*)sql.c_str(), sql.size());
		if (res == SQL_ERROR)
			throw exception(sqli->getErrorMessage(SQL_HANDLE_STMT).c_str());
	}

	/* --------------------------------------------------------------------------------------
		GET DATA
	-------------------------------------------------------------------------------------- */
	template<> auto WSQLStatement::toNextStatement() const -> bool
	{
		return (SQLMoreResults(hstmt) != SQL_NO_DATA);
	}
	template<> auto WSQLStatement::fetch() const -> bool
	{
		do
		{
			SQLSMALLINT colSize;
			SQLNumResultCols(hstmt, &colSize);

			if (colSize > 0)
				break;
		} while (toNextStatement() == true);

		return (SQLFetch(hstmt) == SQL_SUCCESS);
	}
		
	template<> auto WSQLStatement::getDataAsINT32(short col) const -> long
	{
		long value;
		SQLGetData(hstmt, col, SQL_C_LONG, &value, 0, NULL);
		
		return value;
	}
	template<> auto WSQLStatement::getDataAsINT64(short col) const -> long long
	{
		long long value;

		SQLGetData(hstmt, col, SQL_C_SBIGINT, &value, 0, NULL);
		return value;
	}
	template<> auto WSQLStatement::getDataAsFloat(short col) const -> float
	{
		float value;

		SQLGetData(hstmt, col, SQL_C_FLOAT, &value, 0, NULL);
		return value;
	}
	template<> auto WSQLStatement::getDataAsDouble(short col) const -> double
	{
		double value;

		SQLGetData(hstmt, col, SQL_C_DOUBLE, &value, 0, NULL);
		return value;
	}
	template<> auto WSQLStatement::getDataAsString(short col) const -> wstring
	{
		vector<wchar_t> str(1, NULL);
		SQL_SIZE_T size = 0;

		if (SQLGetData(hstmt, col, SQL_C_WCHAR, &str[0], 0, &size) != SQL_SUCCESS && size != 0)
		{
			str.assign((size_t)size, NULL);
			SQLGetData(hstmt, col, SQL_C_WCHAR, &str[0], sizeof(wchar_t)*size, NULL);
		}
		return str.data();
	}
	template<> auto WSQLStatement::getDataAsByteArray(short col) const -> vector<unsigned char>
	{
		vector<unsigned char> data = { NULL };
		SQL_SIZE_T size = 0;

		if (SQLGetData(hstmt, col, SQL_C_BINARY, &data[0], 0, &size) != SQL_SUCCESS && size != 0)
		{
			data.assign(size, NULL);
			SQLGetData(hstmt, col, SQL_C_BINARY, &data[0], data.size(), NULL);
		}
		return move(data);
	}

	template<> auto WSQLStatement::toXML() const -> shared_ptr<WXML>
	{
		shared_ptr<WXML> xml(new WXML());
		return xml;
	}

	/* --------------------------------------------------------------------------------------
		BIND PARAMETER
	-------------------------------------------------------------------------------------- */
	template<> void WSQLStatement::bindParameter(const long double &val)
	{
		::SQLBindParameter(hstmt, ++bindedCount, SQL_PARAM_INPUT, SQL_C_DOUBLE, SQL_DOUBLE, 0, 0, (long double*)&val, 0, NULL);
	}
	template<> void WSQLStatement::bindParameter(const double &val)
	{
		::SQLBindParameter(hstmt, ++bindedCount, SQL_PARAM_INPUT, SQL_C_DOUBLE, SQL_DOUBLE, 0, 0, (double*)&val, 0, NULL);
	}
	template<> void WSQLStatement::bindParameter(const float &val)
	{
		::SQLBindParameter(hstmt, ++bindedCount, SQL_PARAM_INPUT, SQL_C_FLOAT, SQL_FLOAT, 0, 0, (float*)&val, 0, NULL);
	}
	template<> void WSQLStatement::bindParameter(const unsigned int &val)
	{
#ifdef _WIN64
		bindParameter((const unsigned long long&)val);
#else
		bindParameter((const unsigned long&)val);
#endif
	}
	template<> void WSQLStatement::bindParameter(const int &val)
	{
#ifdef _WIN64
		bindParameter((const unsigned long long&)val);
#else
		bindParameter((const unsigned long&)val);
#endif
	}
	template<> void WSQLStatement::bindParameter(const unsigned long long &val)
	{
		::SQLBindParameter(hstmt, ++bindedCount, SQL_PARAM_INPUT, SQL_C_UBIGINT, SQL_BIGINT, 0, 0, (unsigned long long*)&val, 0, NULL);
	}
	template<> void WSQLStatement::bindParameter(const long long &val)
	{
		::SQLBindParameter(hstmt, ++bindedCount, SQL_PARAM_INPUT, SQL_C_SBIGINT, SQL_BIGINT, 0, 0, (long long*)&val, 0, NULL);
	}
	template<> void WSQLStatement::bindParameter(const unsigned long &val)
	{
		::SQLBindParameter(hstmt, ++bindedCount, SQL_PARAM_INPUT, SQL_C_ULONG, SQL_INTEGER, 0, 0, (unsigned long*)&val, 0, NULL);
	}
	template<> void WSQLStatement::bindParameter(const long &val)
	{
		::SQLBindParameter(hstmt, ++bindedCount, SQL_PARAM_INPUT, SQL_C_LONG, SQL_INTEGER, 0, 0, (long*)&val, 0, NULL);
	}
	template<> void WSQLStatement::bindParameter(const bool &val)
	{
		::SQLBindParameter(hstmt, ++bindedCount, SQL_PARAM_INPUT, SQL_C_BIT, SQL_BIT, 0, 0, (bool*)&val, 0, NULL);
	}
	template<> void WSQLStatement::bindParameter(const wstring &val)
	{
		::SQLBindParameter(hstmt, ++bindedCount, SQL_PARAM_INPUT, SQL_C_WCHAR, SQL_WVARCHAR, val.size(), 0, (wchar_t*)&val[0], 0, NULL);
	}
	template<> void WSQLStatement::bindParameter(const vector<unsigned char> &val)
	{
		sizeMap->set(++bindedCount, (SQL_SIZE_T)val.size());
		::SQLBindParameter(hstmt, bindedCount, SQL_PARAM_INPUT, SQL_C_BINARY, SQL_LONGVARBINARY, val.size(), 0, (unsigned char*)&val[0], 0, &sizeMap->get(bindedCount));
	}
}