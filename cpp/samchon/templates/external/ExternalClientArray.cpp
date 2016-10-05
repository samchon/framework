#include <samchon/templates/external/ExternalClientArray.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::external;

ExternalClientArray::ExternalClientArray()
	: ExternalSystemArray()
{
}
ExternalClientArray::~ExternalClientArray()
{
}

void ExternalClientArray::addClient(shared_ptr<ClientDriver> driver)
{
	std::shared_ptr<ExternalSystem> system(createExternalClient(driver));
	if (system == nullptr)
		return;
	
	system->communicator_ = driver;
	
	push_back(system);
	driver->listen(system.get());

	for (size_t i = 0; i < size(); i++)
		if (at(i) == system)
		{
			erase(begin() + i);
			break;
		}
}
auto ExternalClientArray::createChild(shared_ptr<XML> xml) -> ExternalSystem*
{
	return nullptr;
}