#pragma once
#include <samchon/API.hpp>

#include <samchon/library/SQLi.hpp>

namespace samchon
{
	namespace library
	{
		class SQLStatement;

		class SAMCHON_FRAMEWORK_API MySQLi
			: public SQLi
		{
		public:
			MySQLi(int port = 3306);
			virtual ~MySQLi();
		};
	};
};