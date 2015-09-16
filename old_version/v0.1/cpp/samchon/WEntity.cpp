#include <samchon/Entity.hpp>

#include <samchon/SQLStatement.hpp>
#include <samchon/XML.hpp>
#include <samchon/Invoke.hpp>

namespace samchon
{
	/* ---------------------------------------------------------------
		IDENTIFIERS
	--------------------------------------------------------------- */
	auto WEntity::tag() const -> wstring { return L""; }
	auto WEntity::key() const -> wstring { return L""; }
	auto WEntity::listener() const -> wstring { return L""; }

	/* ---------------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------------- */
	WEntity::BasicEntity() {}
	void WEntity::construct(shared_ptr<WXML> xml) {}
	template<> WEntity::~BasicEntity() {}

	//LOAD & ARCHIVE
	template<> void WEntity::load(WSQLStatement *stmt)
	{
	}
	template<> void WEntity::archive(WSQLStatement *stmt)
	{
	}

	/* ---------------------------------------------------------------
		PROTOCOLS
	--------------------------------------------------------------- */
	template<> auto WEntity::toXML() const -> shared_ptr<WXML>
	{
		shared_ptr<WXML> xml(new WXML());
		xml->setKey(tag());

		return xml;
	}
	template<> auto WEntity::toSQL() const -> wstring
	{
		return L"";
	}
	template<> auto WEntity::toHTML() const -> wstring
	{
		return L"";
	}
	template<> auto WEntity::toInvoke() const -> shared_ptr<WInvoke>
	{
		shared_ptr<WInvoke> invoke(new WInvoke(listener()));
		invoke->add(L"xml", toXML());

		return invoke;
	}
}