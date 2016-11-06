#pragma once
#include <samchon/templates/parallel/ParallelSystem.hpp>
#include <samchon/examples/interaction/base/SystemBase.hpp>

#include <samchon/examples/interaction/base/MasterBase.hpp>
#include <samchon/examples/interaction/base/MonitorBase.hpp>
#include <samchon/examples/interaction/TSPRequest.hpp>
#include <samchon/examples/interaction/PackerRequest.hpp>

namespace samchon
{
namespace examples
{
namespace interaction
{
	class SlaveDriver 
		: public templates::parallel::ParallelSystem,
		public base::SystemBase
	{
	private:
		typedef templates::parallel::ParallelSystem super;

		base::MasterBase *master;

	public:
		SlaveDriver(base::MasterBase *master, std::shared_ptr<protocol::ClientDriver> driver)
			: super(master, driver)
		{
			name = "";

			if (master->getUID() != -1)
				sendData(std::make_shared<protocol::Invoke>("set_master_uid", master->getUID()));
		};
		virtual ~SlaveDriver()
		{
			std::cout << "A slave has disconnected" << std::endl;
		};

		virtual void construct(std::shared_ptr<library::XML> xml) override
		{
			setUID(xml->getProperty<int>("uid"));
			super::construct(xml);
		};
		
	protected:
		virtual auto createChild(std::shared_ptr<library::XML>) -> templates::external::ExternalSystemRole*
		{
			return nullptr;
		};

	public:
		virtual void sendData(std::shared_ptr<protocol::Invoke> invoke) override
		{
			super::sendData(invoke);

			// NOTIFY SEND_DATA
			master->getMonitor()->reportSendData(getUID(), invoke);
		};

		virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override
		{
			if (invoke->getListener() == "construct")
				construct(invoke->front()->getValueAsXML());
			else if (invoke->getListener() == "replyPackerOptimization")
				master->getPacker()->replyOptimization(invoke->front()->getValueAsXML());
			else if (invoke->getListener() == "replyTSPOptimization")
				master->getTSP()->replyOptimization(invoke->front()->getValueAsXML());
		};

		virtual auto TAG() const -> std::string 
		{
			return super::TAG();
		}
	};
};
};
};