#include <samchon/templates/external/ExternalSystemArray.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::external;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ExternalSystemArray::ExternalSystemArray()
	: super()
{
}
ExternalSystemArray::~ExternalSystemArray()
{
}

/* ---------------------------------------------------------
	INVOKE MESSAGE CHAIN
--------------------------------------------------------- */
void ExternalSystemArray::sendData(shared_ptr<Invoke> invoke)
{
	for (size_t i = 0; i < size(); i++)
		at(i)->sendData(invoke);
}