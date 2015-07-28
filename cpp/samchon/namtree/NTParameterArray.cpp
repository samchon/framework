#include <samchon/namtree/NTParameterArray.hpp>
#	include <samchon/namtree/NTParameter.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

auto NTParameterArray::TAG() const -> String { return _T("parameterArray"); }
auto NTParameterArray::CHILD_TAG() const -> String { return _T("parameter"); }

NTParameterArray::NTParameterArray()
	: super()
{
}
auto NTParameterArray::createChild(shared_ptr<XML> xml) -> Entity*
{
	return new NTParameter();
}

SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(NTParameterArray, NTParameter)