#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystemArray.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class ParallelSystemArray
		: public ExternalSystemArray
	{
	private:
		typedef ExternalSystemArray super;

	public:
		ParallelSystemArray() : super()
		{
		};
		virtual ~ParallelSystemArray() = default;

		void sendSegmentData(std::shared_ptr<Invoke> invoke, size_t size)
		{
			sendPieceData(invoke, 0, size);
		};
		void sendPieceData(std::shared_ptr<Invoke> invoke, size_t first, size_t last)
		{

		};
	};
};
};
};