#include <samchon/templates/distributed.hpp>
#include <samchon/templates/service.hpp>

using namespace std;
using namespace samchon;

class MyExt : public templates::distributed::DistributedSystemArrayMediator<>
{
};

void main()
{
	new library::XML();
}