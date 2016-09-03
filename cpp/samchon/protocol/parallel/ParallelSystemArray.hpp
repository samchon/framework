#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/external/ExternalSystemArray.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class InvokeHistory;

	class SAMCHON_FRAMEWORK_API ParallelSystemArray
		: public external::ExternalSystemArray
	{
	private:
		typedef external::ExternalSystemArray super;

		size_t history_sequence;

	public:
		/* --------------------------------------------------------------------
			CONSTRUCTORS
		-------------------------------------------------------------------- */
		ParallelSystemArray();
		virtual ~ParallelSystemArray();

		/* --------------------------------------------------------------------
			INVOKE MESSAGE CHAIN
		-------------------------------------------------------------------- */
		using super::sendData;
		void sendData(std::shared_ptr<Invoke>, size_t);
		void sendData(std::shared_ptr<Invoke>, size_t, size_t);

	private:
		virtual auto notify_end(std::shared_ptr<InvokeHistory>) -> bool;

		void normalize_performance();
	};
};
};
};