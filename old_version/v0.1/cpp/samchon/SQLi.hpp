#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <string>
#include <mutex>

namespace std
{
	class mutex;
};
namespace samchon
{
	using namespace std;

	template <typename C> class SAMCHON_LIBRARY_API BasicSQLi;
	typedef BasicSQLi<char> SQLi;
	typedef BasicSQLi<wchar_t> WSQLi;

	template<typename C> class BasicSQLStatement;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicSQLi
	{
		template<typename T> friend class BasicSQLStatement;
	protected:
		virtual auto DRIVER() const -> basic_string<C> = NULL;
		virtual auto PORT() const -> long = NULL;

		virtual auto getErrorMessage(short type) const -> string;

	private:
		void *hdbc;
		BasicSQLStatement<C> *stmt;

		mutex *stmtMutex;

	public:
		enum
		{
			NUM_NULL = LONG_MIN
		};

		BasicSQLi();
		virtual ~BasicSQLi();
		
		virtual void connect
		(
			const basic_string<C> &ip, const basic_string<C> &db, 
			const basic_string<C> &id, const basic_string<C> &pwd
		);
		virtual void disconnect();

		virtual auto createStatement() -> BasicSQLStatement<C>* = NULL;
	};

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicSQLi<char>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicSQLi<wchar_t>;
};
