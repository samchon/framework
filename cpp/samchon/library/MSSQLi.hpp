#pragma once
#include <samchon/library/SQLi.hpp>

namespace samchon
{
	namespace library
	{
		class SQLStatement;

		class  MSSQLi
			: public SQLi
		{
		public:
			MSSQLi(int port = 1433);
			virtual ~MSSQLi();

			virtual auto createStatement() -> std::shared_ptr<SQLStatement>;
		};
	};
};