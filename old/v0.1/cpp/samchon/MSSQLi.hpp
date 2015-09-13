#pragma once
#include <samchon/SQLi.hpp>

namespace samchon
{
	using namespace std;

	template<typename C> class SAMCHON_LIBRARY_API BasicMSSQLi;
	typedef BasicMSSQLi<char> MSSQLi;
	typedef BasicMSSQLi<wchar_t> WMSSQLi;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicMSSQLi 
		: public BasicSQLi<C>
	{
	protected:
		virtual auto DRIVER() const -> basic_string<C>;
		virtual auto PORT() const -> long;

	public:
		BasicMSSQLi();
		virtual ~BasicMSSQLi();

		virtual auto createStatement() -> BasicSQLStatement<C>*;
	};
};