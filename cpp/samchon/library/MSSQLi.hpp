#pragma once
#include <samchon/library/SQLi.hpp>

namespace samchon
{
	namespace library
	{
		class SQLStatement;

		class SAMCHON_FRAMEWORK_API MSSQLi
			: public SQLi
		{
		protected:
			virtual auto DRIVER() const -> String;
			virtual auto PORT() const -> long;

		public:
			MSSQLi();
			virtual ~MSSQLi();

			virtual auto createStatement() -> std::shared_ptr<SQLStatement>;
		};
	};
};