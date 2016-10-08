#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

namespace samchon
{
namespace templates
{
namespace parallel
{
	class ParallelSystem;

	/**
	 * History of an {@link Invoke} message.
	 * 
	 * The {@link PRInvokeHistory} is a class archiving history log of an {@link Invoke} message which requests the
	 * *parallel process*, created whenever {@link ParallelSystemArray.sendSegmentData} or 
	 * {@link ParallelSystemArray.sendSegmentData} is called.
	 * 
	 * When the *parallel process* has completed, then {@link complete complete()} is called and the *elapsed time* is 
	 * determined. The elapsed time is utilized for computation of {@link ParallelSystem.getPerformance performance index} 
	 * of each {@link ParallelSystem parallel slave system}.
	 * 
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/cpp_class_diagram/templates_parallel_system.png)
	 * 
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/CPP-Templates-Parallel_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API PRInvokeHistory 
		: public protocol::InvokeHistory
	{
		friend class ParallelSystem;

	private:
		typedef protocol::InvokeHistory super;

		size_t first_;
		size_t last_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		PRInvokeHistory();

		/**
		 * Construct from an {@link Invoke} message.
		 * 
		 * @param invoke An {@link Invoke} message requesting a *parallel process*.
		 */
		PRInvokeHistory(std::shared_ptr<protocol::Invoke> invoke);

		virtual ~PRInvokeHistory();

		virtual void construct(std::shared_ptr<library::XML> xml) override;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get initial piece's index.
		 * 
		 * Returns initial piece's index in the section of requested *parallel process*.
		 * 
		 * @return The initial index.
		 */
		auto getFirst() const -> size_t
		{
			return first_;
		};

		/**
		 * Get final piece's index.
		 * 
		 * Returns initial piece's index in the section of requested *parallel process*. The range used is 
		 * [*first*, *last*), which contains all the pieces' indices between *first* and *last*, including the piece 
		 * pointed by index *first*, but not the piece pointed by the index *last*.
		 * 
		 * @return The final index.
		 */
		auto getLast() const -> size_t
		{
			return last_;
		};

		/**
		 * Compute number of allocated pieces.
		 */
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