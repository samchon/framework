#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class ParallelSystem;

	class SAMCHON_FRAMEWORK_API PRInvokeHistory 
		: public InvokeHistory
	{
		friend class ParallelSystem;

	private:
		typedef InvokeHistory super;

		size_t first_;
		size_t last_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		PRInvokeHistory();
		PRInvokeHistory(std::shared_ptr<Invoke> invoke);

		virtual ~PRInvokeHistory();

		virtual void construct(std::shared_ptr<library::XML> xml) override;

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

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto toXML() const -> std::shared_ptr<library::XML> override;
	};
};
};
};