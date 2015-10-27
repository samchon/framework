#include <samchon/protocol/master/PRMasterHistoryArray.hpp>

#include <samchon/protocol/master/PRMasterHistory.hpp>
#include <samchon/protocol/master/ParallelSystemArray.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

PRMasterHistoryArray::PRMasterHistoryArray(ParallelSystemArray *master)
	: super()
{
	this->master = master;
}
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(PRMasterHistoryArray, PRMasterHistory)