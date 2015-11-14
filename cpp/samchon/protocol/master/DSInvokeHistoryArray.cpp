#include <samchon/protocol/master/DSInvokeHistoryArray.hpp>

#include <samchon/protocol/master/DSInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

DSInvokeHistoryArray::DSInvokeHistoryArray()
	: super()
{
}
auto DSInvokeHistoryArray::createChild(shared_ptr<XML>) -> InvokeHistory*
{
	return nullptr;
}

SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(DSInvokeHistoryArray, DSInvokeHistory)