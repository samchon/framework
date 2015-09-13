#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <string>
#include <memory>

namespace samchon
{
	using namespace std;

	template <typename C> class SAMCHON_LIBRARY_API BasicEntity;
	typedef BasicEntity<char> Entity;
	typedef BasicEntity<wchar_t> WEntity;

	template <typename C> class BasicXML;
	template <typename C> class BasicInvoke;
	template <typename C> class BasicSQLStatement;

	typedef BasicXML<char> XML;
	typedef BasicInvoke<char> Invoke;
	typedef BasicSQLStatement<char> SQLStatement;

	typedef BasicXML<wchar_t> WXML;
	typedef BasicInvoke<wchar_t> WInvoke;
	typedef BasicSQLStatement<wchar_t> WSQLStatement;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicEntity
	{
	public:
		virtual auto tag() const -> basic_string<C>;
		virtual auto key() const -> basic_string<C>;
		virtual auto listener() const -> basic_string<C>;

	public:
		BasicEntity();
		virtual void construct(shared_ptr<BasicXML<C>> xml);
		virtual ~BasicEntity();

		virtual void load(BasicSQLStatement<C>* = nullptr);
		virtual void archive(BasicSQLStatement<C>* = nullptr);

		virtual auto toXML() const -> shared_ptr<BasicXML<C>>;
		virtual auto toSQL() const -> basic_string<C>;
		virtual auto toHTML() const -> basic_string<C>;
		virtual auto toInvoke() const -> shared_ptr<BasicInvoke<C>>;
	};
};