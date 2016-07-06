#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/external/ExternalSystemArray.hpp>

#include <samchon/protocol/master/ParallelSystem.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class ParallelSystem;
	class PRInvokeHistory;

	class SAMCHON_FRAMEWORK_API ParallelSystemArray
		: public external::ExternalSystemArray
	{
		friend class ParallelSystem;

	private:
		typedef external::ExternalSystemArray super;

		size_t history_sequence;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		ParallelSystemArray();
		virtual ~ParallelSystemArray();

		SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_INLINE(ParallelSystem)

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		void sendSegmentData(std::shared_ptr<Invoke> invoke, size_t size)
		{
			sendPieceData(invoke, 0, size);
		};
		void sendPieceData(std::shared_ptr<Invoke> invoke, size_t index, size_t count);

	private:
		void notify_end(const PRInvokeHistory &);
		void normalize_performance();
	};
};
};
};