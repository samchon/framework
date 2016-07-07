#include <samchon/protocol/master/PRInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

PRInvokeHistory::PRInvokeHistory()
	: super()
{
}

PRInvokeHistory::PRInvokeHistory(shared_ptr<Invoke> invoke)
	: super(invoke)
{
	index = invoke->get("piece_index")->getValue<size_t>();
	size = invoke->get("piece_size")->getValue<size_t>();
}

PRInvokeHistory::~PRInvokeHistory()
{
}