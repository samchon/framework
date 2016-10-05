#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/slave/SlaveSystem.hpp>
#include <samchon/protocol/IListener.hpp>

#include <samchon/HashMap.hpp>

namespace samchon
{
namespace protocol
{
	class InvokeHistory;
};

namespace templates
{
namespace parallel
{
	class ParallelSystemArrayMediator;

	/**
	 * A mediator, the master driver.
	 * 
	 * The {@link MediatorSystem} is an abstract class helping {@link ParallelSystemArrayMediator} can be a **slave** 
	 * system. The {@link MediatorSystem} interacts and communicates with the **master** system as a role of **slave**.
	 * 
	 * This {@link MediatorSystem} object is created in {@link ParallelSystemArrayMediator.createMediator}. Override the
	 * method and return one of them, which are derived from this {@link MediatorSystem} class, considering which  
	 * type and protocol the **master** system follows:
	 * 
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 * 
	 * When the **master** orders a *parallel process* to this **slave**, then the {@link MediatorSystem} delivers the 
	 * *parallel process* to its parent {@link ParallelSystemArrayMediator} object. The 
	 * {@link ParallelSystemArrayMediator} object distributes the *parallel process* to its slaves system,
	 * {@link ParallelSystem} objects. When the *parallel process* has completed, then {@link MediatorSystem} reports the 
	 * result to its **master**.
	 * 
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png)
	 * 
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System),
	 *			 [Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API MediatorSystem
		: public virtual slave::SlaveSystem,
		public virtual protocol::IListener
	{
	private:
		typedef slave::SlaveSystem super;

		ParallelSystemArrayMediator *system_array_;
		HashMap<size_t, std::shared_ptr<protocol::InvokeHistory>> progress_list_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from parent {@link ParallelSystemArrayMediator} object.
		 * 
		 * @param systemArray The parent {@link ParallelSystemArrayMediator} object.
		 */
		MediatorSystem(ParallelSystemArrayMediator*);

		/**
		 * Default Destructor.
		 */
		virtual ~MediatorSystem();

		/**
		 * Start interaction.
		 * 
		 * The {@link start start()} is an abstract method starting interaction with the **master** system. If the 
		 * **master** is a server, then connects to the **master**. Otherwise, the **master** is client, then this 
		 * {@link MediatorSystem} object wil open a server accepting the **master**.
		 */
		virtual void start() = 0;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get parent {@link ParallelSystemArrayMediator} object.
		 */
		auto getSystemArray() const -> ParallelSystemArrayMediator*
		{
			return system_array_;
		};

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		void _Complete_history(size_t uid);

	private:
		virtual void _replyData(std::shared_ptr<protocol::Invoke>) override final;

	public:
		virtual void replyData(std::shared_ptr<protocol::Invoke>) override;
	};
};
};
};