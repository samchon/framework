#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
namespace protocol
{
	class IListener : public virtual IProtocol
	{
	protected:
		virtual void _replyData(std::shared_ptr<Invoke>) = 0;
	};
};
};