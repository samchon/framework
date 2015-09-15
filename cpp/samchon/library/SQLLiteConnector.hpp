#pragma once
#include <samchon/library/SQLi.hpp>

namespace samchon
{
	namespace library
	{
		class SQLStatement;

		class  SQLLiteConnector
			: public SQLi
		{
		public:
			SQLLiteConnector(int port = 1433);
			virtual ~SQLLiteConnector();
		};
	};
};