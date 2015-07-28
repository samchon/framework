#pragma once
#include <samchon\API.hpp>

#include <vector>
#include <memory>
#include <samchon/Map.hpp>
#include <samchon/String.hpp>

/*#ifdef _WIN64
SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API samchon::Map<size_t, long long>;
#else
SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API samchon::Map<size_t, long>;
#endif*/

namespace samchon
{
	namespace library
	{
		class SQLi;
		class XML;
		
		class SAMCHON_FRAMEWORK_API SQLStatement
		{
			friend class SQLi;
		private:
#ifdef _WIN64
			typedef long long SQL_SIZE_T;
#else
			typedef long SQL_SIZE_T;
#endif

		protected:
			SQLi *sqli;

			void *hstmt;

			size_t bindParameterCount;
			Map<size_t, SQL_SIZE_T> bindParameterBASizeMap;
			//vector<void*> bindResultArray;

		public:
			SQLStatement(SQLi *sqli);
			virtual ~SQLStatement();

			void reset(SQLi *sqli);
			void free();
			void refresh();

			void prepare(const String &str);
			template <typename T, typename ... Types> void prepare(const String &str, const T& val, const Types& ... args)
			{
				prepare(str);
				bindParameter(val);
				bindParameter(args...);
			};
			template <typename T> void prepare(const String &str, const T& val)
			{
				prepare(str);
				bindParameter(val);
			};
			void execute();
			void executeDirect(const String&);

			auto toNextStatement() const -> bool;
			auto fetch() const -> bool;

			auto getDataAsINT32(short) const -> long;
			auto getDataAsINT64(short) const -> long long;
			auto getDataAsFloat(short) const -> float;
			auto getDataAsDouble(short) const -> double;
			auto getDataAsString(short) const -> String;

			virtual auto getDataAsByteArray(short) const -> std::vector<unsigned char>;
			virtual auto toXML() const -> std::shared_ptr<XML>;

		private:
			template <typename T, typename ... Types>
			void bindParameter(const T& val, const Types& ... args)
			{
				bindParameter(val);
				bindParameter(args...);
			};

			void bindParameter(const long double &);
			void bindParameter(const double &);
			void bindParameter(const float &);
			void bindParameter(const unsigned int &);
			void bindParameter(const int &);
			void bindParameter(const unsigned long long &);
			void bindParameter(const long long &);
			void bindParameter(const unsigned long &);
			void bindParameter(const long &);
			void bindParameter(const bool &);
			void bindParameter(const String &);

		protected:
			virtual void bindParameter(const std::vector<unsigned char> &);
		};
	};
};