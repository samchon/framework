#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Invoke.hpp>

#include <samchon/templates/InvokeHistory.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
namespace templates
{
	class PInvoke : public protocol::Invoke
	{
	private:
		typedef protocol::Invoke super;

		std::shared_ptr<InvokeHistory> history_;
		protocol::IProtocol *master_driver_;

		bool hold_;

	public:
		PInvoke(const std::shared_ptr<protocol::Invoke> &invoke, std::shared_ptr<InvokeHistory> history, protocol::IProtocol *masterDriver)
			: super(invoke->getListener())
		{
			assign(invoke->begin(), invoke->end());

			this->history_ = history;
			this->master_driver_ = masterDriver;

			this->hold_ = false;
		};

		auto getHistory() const -> std::shared_ptr<InvokeHistory>
		{
			return history_;
		};
		auto isHold() const -> bool
		{
			return hold_;
		};

		void hold()
		{
			hold_ = true;
		};

		void complete()
		{
			history_->complete();

			master_driver_->sendData(history_->toInvoke());
		};
	};
};
};