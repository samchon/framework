#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IListener.hpp>

#include <samchon/protocol/Communicator.hpp>

namespace samchon
{
namespace protocol
{
namespace slave
{
	class SAMCHON_FRAMEWORK_API MasterSystem
		: public virtual IListener
	{
	protected:
		std::shared_ptr<Communicator> communicator_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		MasterSystem();
		virtual ~MasterSystem();

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		void sendData(std::shared_ptr<Invoke>) override;
		
	private:
		virtual void _replyData(std::shared_ptr<Invoke>) override;
	};
};
};
};