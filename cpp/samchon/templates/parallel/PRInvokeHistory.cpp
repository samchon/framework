#include <samchon/templates/parallel/PRInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::parallel;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
PRInvokeHistory::PRInvokeHistory()
	: super()
{
}

PRInvokeHistory::PRInvokeHistory(shared_ptr<Invoke> invoke)
	: super(invoke)
{
	this->first_ = invoke->get("_Piece_first")->getValue<size_t>();
	this->last_ = invoke->get("_Piece_last")->getValue<size_t>();
}

PRInvokeHistory::~PRInvokeHistory()
{
}

void PRInvokeHistory::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	first_ = xml->getProperty<size_t>("first");
	last_ = xml->getProperty<size_t>("last");
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto PRInvokeHistory::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("first", first_);
	xml->setProperty("last", last_);

	return xml;
}