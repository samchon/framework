#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/ParallelSystemArray.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class ParallelMediator;

	class SAMCHON_FRAMEWORK_API ParallelSystemArrayMediator
		: public ParallelSystemArray
	{
	private:
		typedef ParallelSystemArray super;

		std::unique_ptr<ParallelMediator> mediator;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		ParallelSystemArrayMediator();
		virtual ~ParallelSystemArrayMediator();

	protected:
		virtual auto createMediator() -> ParallelMediator* = 0;

	public:
		/* ---------------------------------------------------------
			NETWORK INITIALIZATION
		--------------------------------------------------------- */
		virtual void open(int port);
		virtual void connect();

	private:
		void start_mediator();

		virtual auto notify_end(std::shared_ptr<PRInvokeHistory>) -> bool;
	};
};
};
};