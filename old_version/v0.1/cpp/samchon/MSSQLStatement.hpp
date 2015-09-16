#pragma once
#include <samchon/SQLStatement.hpp>

namespace samchon
{
	using namespace std;

	template<typename C> class SAMCHON_LIBRARY_API BasicMSSQLStatement;
	typedef BasicMSSQLStatement<char> MSSQLStatement;
	typedef BasicMSSQLStatement<wchar_t> WMSSQLStatement;

	template<typename C>
	class SAMCHON_LIBRARY_API BasicMSSQLStatement
		: public BasicSQLStatement<C>
	{
	private:
		typedef BasicSQLStatement<C> super;

	public:
		BasicMSSQLStatement(BasicSQLi<C> *sqli);
		virtual ~BasicMSSQLStatement();

		//virtual auto getDataAsByteArray(short) -> vector<unsigned char>;
		virtual auto toXML() const -> shared_ptr<BasicXML<C>>;
	
	//protected:
		//virtual void bindParameter(const vector<unsigned char> &);
	};
};