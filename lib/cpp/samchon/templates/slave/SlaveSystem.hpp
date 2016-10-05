#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IListener.hpp>

#include <samchon/protocol/Communicator.hpp>

namespace samchon
{
namespace templates
{
namespace slave
{
	class SAMCHON_FRAMEWORK_API SlaveSystem
		: public virtual protocol::IListener
	{
	protected:
		std::shared_ptr<protocol::Communicator> communicator_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		SlaveSystem();
		virtual ~SlaveSystem();

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		void sendData(std::shared_ptr<protocol::Invoke>) override;
		
	protected:
		virtual void _replyData(std::shared_ptr<protocol::Invoke>) override;
	};
};
};
};