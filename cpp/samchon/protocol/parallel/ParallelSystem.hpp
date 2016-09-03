#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/external/ExternalSystem.hpp>
#include <samchon/protocol/IListener.hpp>

#include <samchon/HashMap.hpp>

namespace samchon
{
namespace protocol
{
	class InvokeHistory;

namespace parallel
{
	class SAMCHON_FRAMEWORK_API ParallelSystem
		: public external::ExternalSystem,
		public virtual IListener
	{
	private:
		typedef external::ExternalSystem super;

		HashMap<size_t, std::shared_ptr<InvokeHistory>> progress_list_;
		HashMap<size_t, std::shared_ptr<InvokeHistory>> history_list_;

		double performance_{ 1.0 };

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// TAKES SUPER'S CONSTRUCTORS
		using super::super;

		/**
		 * @brief Default Destructor.
		 */
		virtual ~ParallelSystem();

		virtual void construct(std::shared_ptr<library::XML>) override;

	private:
		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		void send_piece_data(std::shared_ptr<Invoke> invoke, size_t first, size_t last);

		virtual void _replyData(std::shared_ptr<Invoke>) override;

		void report_invoke_history(std::shared_ptr<library::XML>);

	public:
		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto toXML() const -> std::shared_ptr<library::XML> override;
	};
};
};
};