#include <samchon/library.hpp>
#include <samchon/protocol.hpp>
#include <samchon/templates.hpp>

using namespace std;
using namespace samchon;

class MyExt : public templates::distributed::DistributedSystemArrayMediator<>
{
};

void main()
{
	new library::XML();
}