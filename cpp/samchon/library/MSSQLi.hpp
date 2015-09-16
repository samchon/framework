#pragma once
#include <samchon/API.hpp>

#include <samchon/library/SQLi.hpp>

namespace samchon
{
	namespace library
	{
		class SQLStatement;

		class SAMCHON_FRAMEWORK_API MSSQLi
			: public SQLi
		{
		public:
			MSSQLi(int port = 1433);
			virtual ~MSSQLi();

			virtual auto createStatement() -> std::shared_ptr<SQLStatement>;
		};
	};
};