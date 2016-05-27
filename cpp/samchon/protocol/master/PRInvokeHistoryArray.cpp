#include <samchon/protocol/master/PRInvokeHistoryArray.hpp>

#include <samchon/protocol/master/PRInvokeHistory.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

PRInvokeHistoryArray::PRInvokeHistoryArray()
	: super()
{
}
auto PRInvokeHistoryArray::create_child(shared_ptr<XML>) -> InvokeHistory*
{
	return new PRInvokeHistory();
}

SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(PRInvokeHistoryArray, PRInvokeHistory)