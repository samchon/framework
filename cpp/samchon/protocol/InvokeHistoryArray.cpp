#include <samchon/protocol/InvokeHistoryArray.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

InvokeHistoryArray::InvokeHistoryArray()
	: super()
{
}
auto InvokeHistoryArray::create_child(shared_ptr<XML>) -> InvokeHistory*
{
	return new InvokeHistory();
}

auto InvokeHistoryArray::TAG() const -> string
{
	return "invokeHistoryArray";
}
auto InvokeHistoryArray::CHILD_TAG() const -> string
{
	return "invokeHistory";
}