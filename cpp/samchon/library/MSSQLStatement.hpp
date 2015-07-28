#pragma once
#include <samchon/library/SQLStatement.hpp>

namespace samchon
{
	namespace library
	{
		class SQLi;

		class SAMCHON_FRAMEWORK_API MSSQLStatement
			: public SQLStatement
		{
		private:
			typedef SQLStatement super;

		public:
			MSSQLStatement(SQLi *sqli);
			virtual ~MSSQLStatement();

			//virtual auto getDataAsByteArray(short) -> vector<unsigned char>;
			virtual auto toXML() const -> std::shared_ptr<XML>;
		};
	};
};