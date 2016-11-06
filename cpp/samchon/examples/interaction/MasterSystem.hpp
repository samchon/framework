#pragma once
#include <samchon/templates/distributed/DistributedSystem.hpp>
#include <samchon/examples/interaction/base/SystemBase.hpp>

namespace samchon
{
namespace examples
{
namespace interaction
{
	class Chief;

	class MasterSystem
		: public templates::distributed::DistributedSystem
	{
	private:
		typedef templates::distributed::DistributedSystem super;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		MasterSystem(Chief *chief, std::shared_ptr<protocol::ClientDriver> driver)
			: super((templates::external::base::ExternalSystemArrayBase*)chief, driver)
		{

		};
	};
};
};
};