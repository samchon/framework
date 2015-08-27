#pragma once
#include <samchon\API.hpp>

#include <vector>
#include <memory>
#include <samchon/Map.hpp>
#include <samchon/String.hpp>

namespace samchon
{
	namespace library
	{
		class SQLi;
		class XML;
		
		/**
		 * @brief The sql statement
		 *
		 * @details
		 * \par
		 * A SQLStatement instance is used to executing a SQL statement and returning
		 * the results it produces against a SQL database that is opened through a SQLi 
		 * instance.
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API SQLStatement
		{
			friend class SQLi;
		/*private:
#ifdef _WIN64
			typedef long long SQL_SIZE_T;
#else
			typedef long SQL_SIZE_T;
#endif*/

		protected:
			/**
			 * @brief SQLi who created the SQLStatement
			 */
			SQLi *sqli;
			
			/**
			 * @brief Handler of sql statement (OBDC)
			 */
			void *hstmt;

			/**
			 * @brief Count of binded parameters\n
			 */
			size_t bindParameterCount;

		protected:
			/**
			 * @brief Protected Constructor 
			 *
			 * @details
			 * \par
			 * SQLStatement's constructor have to created by SQLi::createStatement().
			 * 
			 * @warning 
			 * Don't create SQLStatement by yourself.\n
			 * SQLStatement has to be created by SQLi::createStatement().
			 *
			 * @param sqli Parent SQLi who created the SQLStatement
			 */
			SQLStatement(SQLi *sqli);
			void reset(SQLi *sqli);

		public:
			virtual ~SQLStatement();

		public:
			/**
			 * @brief Free the sql statement
			 * 
			 * @details
			 * 
			 */
			void free();

			/**
			 * @brief Refresh the sql statement
			 *
			 * @details
			 * 
			 * 
			 */
			void refresh();
			
			/**
			 * @brief Prepare a sql statement
			 *
			 * @details
			 * \par 
			 * Prepare a sql statement with parameters to bind for execution
			 *
			 * @warning
			 * \par Be careful for destructions of binded parameters
			 *
			 * @param sql A sql-statement to prepare
			 * @param ... args The parameters to bind
			 */
			template <typename _Ty, typename ... _Args> 
			void prepare(const String &sql, const _Ty& val, const _Args& ... args)
			{
				prepare(sql);

				bindParameter(val);
				bindParameter(args...);
			};
			template <typename _Ty> void prepare(const String &str, const _Ty& val)
			{
				prepare(str);

				bindParameter(val);
			};
			void prepare(const String &);

			/**
			 * @brief Execute the prepared sql statement
			 *
			 * @details 
			 * Executes the prepared sql statement.
			 * 
			 * 
			 * @throw exception Error message from DBMS
			 */
			void execute();

			/**
			 * @brief Execute sql-statement direclty 
			 *
			 * @details
			 * \par
			 * Executes the given sql-statement without preparing or binding any parameter
			 *
			 * @warning
			 *	\li 
			 *		\par Cannot use if prepare has already called.
			 *		\par Use execute instead.
			 *  \li 
			 *		\par
			 *		Not recommended when the case of dynamic sql and the sql-statement 
			 *		is not for procedure but for direct access to table. 
			 * 
			 *		\par
			 *		Use prepare and execute instead.
			 * 
			 * @param sql sql-statement you want to execute
			 * @throw exception Error message from DBMS
			 * @throw exception Method prepare is already called
			 */
			void executeDirectly(const String&);

			/**
			 * @brief Fetch a record
			 * @details
			 * 
			 * 
			 * @return 
			 * \par Whether succeded to fetch a record or not\n
			 * \par False means there's not any record or previous record was the last
			 */
			auto fetch() const -> bool;

			/**
			 * Moves fetching pointer to the next sql-statement\n
			 * \n
			 * @return Whether succeded to move pointer to the next statement or not
			 */
			auto next() const -> bool;

			/**
			 * @brief Get column's data by its index
			 * @details Returns column's data from fetched-record by specified column index
			 * 
			 * @param index Index number of a column wants to get
			 * @return Data stored in the record at the position of specifield column
			 */
			template <typename _Ty> auto at(size_t) const -> _Ty;
			template<> auto at(size_t) const -> bool;
			template<> auto at(size_t) const -> char;
			template<> auto at(size_t) const -> short;
			template<> auto at(size_t) const -> int;
			template<> auto at(size_t) const -> long;
			template<> auto at(size_t) const -> long long;
			template<> auto at(size_t) const -> float;
			template<> auto at(size_t) const -> double;
			template<> auto at(size_t) const -> unsigned char;
			template<> auto at(size_t) const -> unsigned short;
			template<> auto at(size_t) const -> unsigned int;
			template<> auto at(size_t) const -> unsigned long;
			template<> auto at(size_t) const -> unsigned long long;
			template<> auto at(size_t) const -> long double;
			template<> auto at(size_t) const -> std::string;
			template<> auto at(size_t) const -> std::wstring;

			/**
			 * @brief Get column data by its name
			 * @details Returns column's data from fetchched-recrod by specified column name 
			 *
			 * @details
			 * Get data from fetched-record by specified column name
			 * 
			 * @param name Name of a column wants to get
			 * @return Data stored in the record at the position of specifield column
			 */
			template <typename _Ty> auto get(const String &) const -> _Ty;
			template<> auto get(const String &) const -> bool;
			template<> auto get(const String &) const -> char;
			template<> auto get(const String &) const -> short;
			template<> auto get(const String &) const -> int;
			template<> auto get(const String &) const -> long;
			template<> auto get(const String &) const -> long long;
			template<> auto get(const String &) const -> float;
			template<> auto get(const String &) const -> double;
			template<> auto get(const String &) const -> unsigned char;
			template<> auto get(const String &) const -> unsigned short;
			template<> auto get(const String &) const -> unsigned int;
			template<> auto get(const String &) const -> unsigned long;
			template<> auto get(const String &) const -> unsigned long long;
			template<> auto get(const String &) const -> long double;
			template<> auto get(const String &) const -> std::string;
			template<> auto get(const String &) const -> std::wstring;

			/**
			 * @brief Result sets to XML
			 *
			 * @details
			 * \par Converts the records of current sql-statement to XML
			 * \par Recommends to override for each DBMS's domain XML rule
			 * 
			 * @return XML representing records of the statement
			 */
			virtual auto toXML() const -> std::shared_ptr<XML>;

		private:
			template <typename _Ty, typename ... _Args>
			void bindParameter(const _Ty& val, const _Args& ... args)
			{
				bindParameter(val);
				bindParameter(args...);
			};
			template <typename _Ty> void bindParameter(const _Ty &);
		};
	};
};