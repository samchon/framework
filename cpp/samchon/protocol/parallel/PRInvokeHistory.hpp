#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class PRInvokeHistory : public InvokeHistory
	{
	private:
		typedef InvokeHistory super;

	public:
		size_t first_;
		size_t last_;

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

		virtual void construct(std::shared_ptr<library::XML> xml) override
		{
			super::construct(xml);

			first_ = xml->getProperty<size_t>("first");
			last_ = xml->getProperty<size_t>("last");
		};

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
	};
};
};
};