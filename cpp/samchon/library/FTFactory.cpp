#include <samchon/library/FTFactory.hpp>
#include <samchon/library/FTFile.hpp>

#include <samchon/Map.hpp>
#include <samchon/library/XML.hpp>



using namespace std;
using namespace samchon::library;

FTFactory::FTFactory()
{
}

void FTFactory::registerInstance(FTInstance *instance)
{
	instanceMap.set(instance->getUID(), instance);
}
