#pragma once
#include <samchon/library/SQLi.hpp>

namespace samchon
{
	namespace library
	{
		class SQLStatement;

		class  MySQLi
			: public SQLi
		{
		public:
			MySQLi(int port = 3306);
			virtual ~MySQLi();
		};
	};
};