#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class PRInvokeHistory : public protocol::InvokeHistory
	{
	private:
		typedef protocol::InvokeHistory super;

	private:
		size_t first_;
		size_t last_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		PRInvokeHistory() : super()
		{
		};

		PRInvokeHistory(std::shared_ptr<Invoke> invoke) : super(invoke)
		{
			this->first_ = invoke->get("piece_first")->getValue<size_t>();
			this->last_ = invoke->get("piece_last")->getValue<size_t>();
		};

		virtual ~PRInvokeHistory() = default;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		auto getFirst() const -> size_t
		{
			return first_;
		};
		auto getLast() const -> size_t
		{
			return last_;
		};

		auto computeSize() const -> size_t
		{
			return last_ - first_;
		};

		void setFirst(size_t val)
		{
			first_ = val;
		};

		void setLast(size_t val)
		{
			last_ = val;
		};
	};
};
};
};