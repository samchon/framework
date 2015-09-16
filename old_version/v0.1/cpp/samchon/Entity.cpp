#include <samchon/Entity.hpp>

#include <samchon/SQLStatement.hpp>
#include <samchon/XML.hpp>
#include <samchon/Invoke.hpp>

namespace samchon
{
	/* ---------------------------------------------------------------
		IDENTIFIERS
	--------------------------------------------------------------- */
	template<> auto Entity::tag() const -> string { return ""; }
	template<> auto Entity::key() const -> string { return ""; }
	template<> auto Entity::listener() const -> string { return ""; }

	/* ---------------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------------- */
	Entity::BasicEntity() {}
	template<> void Entity::construct(shared_ptr<XML> xml) {}
	template<> Entity::~BasicEntity() {}
	
	//LOAD & ARCHIVE
	template<> void Entity::load(SQLStatement *stmt) 
	{
		
	}
	template<> void Entity::archive(SQLStatement *stmt) 
	{

	}
		
	/* ---------------------------------------------------------------
		PROTOCOLS
	--------------------------------------------------------------- */
	template<> auto Entity::toXML() const -> shared_ptr<XML>
	{
		shared_ptr<XML> xml( new XML() );
		xml->setKey(tag());

		return xml;
	}
	template<> auto Entity::toSQL() const -> string
	{
		return "";
	}
	template<> auto Entity::toHTML() const -> string
	{
		return "";
	}
	template<> auto Entity::toInvoke() const -> shared_ptr<Invoke>
	{
		shared_ptr<Invoke> invoke(new Invoke(listener()));
		invoke->add("xml", toXML());

		return invoke;
	}
}