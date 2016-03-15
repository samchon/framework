#include <API.hpp>



using namespace std;
using namespace samchon::library;

FTFactory::FTFactory()
{
}

void FTFactory::registerInstance(FTInstance *instance)
{
	instanceMap.set(instance->getUID(), instance);
}
