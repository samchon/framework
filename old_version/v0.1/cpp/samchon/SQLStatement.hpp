#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <vector>
#include <memory>

namespace samchon
{
	using namespace std;

	template<typename C> class BasicSQLi;
	template<typename K, typename T, typename O = less<K>, typename Alloc = allocator<pair<const K, T>>> class Map;
	template<typename C> class BasicXML;

	template<typename C> class SAMCHON_LIBRARY_API BasicSQLStatement;
	typedef BasicSQLStatement<char> SQLStatement;
	typedef BasicSQLStatement<wchar_t> WSQLStatement;

	template<typename C>
	class SAMCHON_LIBRARY_API BasicSQLStatement
	{
		friend class BasicSQLi<C>;
	private:
#ifdef _WIN64
		typedef long long SQL_SIZE_T;
#else
		typedef long SQL_SIZE_T;
#endif

	protected:
		BasicSQLi<C> *sqli;

		void *hstmt;
		size_t bindedCount;
		Map<size_t, SQL_SIZE_T> *sizeMap;

	public:
		BasicSQLStatement(BasicSQLi<C> *sqli);
		virtual ~BasicSQLStatement();
		
		void reset(BasicSQLi<C> *sqli);
		void free();
		void refresh();

		void prepare(const basic_string<C> &str);
		template <typename T, typename ... Types> void prepare(const basic_string<C> &str, const T& val, const Types& ... args)
		{
			prepare(str);
			bindParameter(val);
			bindParameter(args...);
		};
		template <typename T> void prepare(const basic_string<C> &str, const T& val)
		{
			prepare(str);
			bindParameter(val);
		};
		void execute();
		void executeDirect(const basic_string<C>&);

		auto toNextStatement() const -> bool;
		auto fetch() const -> bool;

		auto getDataAsINT32(short) const -> long;
		auto getDataAsINT64(short) const -> long long;
		auto getDataAsFloat(short) const -> float;
		auto getDataAsDouble(short) const -> double;
		auto getDataAsString(short) const -> basic_string<C>;
		
		virtual auto getDataAsByteArray(short) const -> vector<unsigned char>;
		virtual auto toXML() const -> shared_ptr<BasicXML<C>>;

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
		void bindParameter(const basic_string<C> &);

	protected:
		virtual void bindParameter(const vector<unsigned char> &);
	};
};