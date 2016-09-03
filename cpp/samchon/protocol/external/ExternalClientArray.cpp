#include <samchon/protocol/external/ExternalClientArray.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::external;

ExternalClientArray::ExternalClientArray()
	: ExternalSystemArray()
{
}
ExternalClientArray::~ExternalClientArray()
{
}

void ExternalClientArray::addClient(shared_ptr<ClientDriver> driver)
{
	ExternalSystem *system = createExternalClient(driver);
	if (system == nullptr)
		return;
	
	system->communicator_ = driver;
	
	emplace_back(system);
	driver->listen(system);
}
auto ExternalClientArray::createChild(shared_ptr<XML> xml) -> ExternalSystem*
{
	return nullptr;
}