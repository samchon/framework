#include <samchon/namtree/NTParameterArray.hpp>
#	include <samchon/namtree/NTParameter.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

auto NTParameterArray::TAG() const -> string { return "parameterArray"; }
auto NTParameterArray::CHILD_TAG() const -> string { return "parameter"; }

NTParameterArray::NTParameterArray()
	: super()
{
}
auto NTParameterArray::create_child(shared_ptr<XML>) -> NTParameter*
{
	return new NTParameter();
}