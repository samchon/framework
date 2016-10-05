#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/parallel/ParallelSystem.hpp>
#	include <samchon/templates/distributed/DistributedProcess.hpp>

namespace samchon
{
namespace templates
{
namespace distributed
{
	class DistributedSystemArray;

	/**
	 * A driver for a distributed slave system.
	 * 
	 * The {@link DistributedSystem} is an abstract class represents a **slave** system in *Distributed Processing System*,
	 * connected with this **master** system. This {@link DistributedSystem} takes full charge of network communication 
	 * with the remote, distributed **slave** system has connected.
	 * 
	 * This {@link DistributedSystem} has a {@link getPerformance performance index} that indicates how much the **slave** 
	 * system is fast. The {@link getPerformance performance index} is referenced and revaluated whenever those methods 
	 * are called:
	 * 
	 * - Requesting a *parallel process*
	 *   - {@link DistributedSystemArray.sendSegmentData}
	 *   - {@link DistributedSystemArray.sendPieceData}
	 * - Requesting a *distributed process*: {@link DistributedProcess.sendData}
	 * 
	 * Note that, this {@link DistributedSystem} class derived from the {@link ExternalSystem} class. Thus, this 
	 * {@link DistributedSystem} can also have children {@link ExternalSystemRole} objects exclusively. However, the 
	 * children {@link ExternalSystemRole roles} objects are different with the {@link DistributedProcess}. The 
	 * domestic {@link ExternalSystemRole roles} are belonged to only a specific {@link DistributedSystem} object. 
	 * Otherwise, the {@link DistributedProcess} objects are belonged to a {@link DistributedSystemArray} object. 
	 * Furthermore, the relationship between this {@link DistributedSystem} and {@link DistributedProcess} classes are 
	 * **M: N Associative**.
	 * 
	 * Articles     | {@link DistributedProcess}     | {@link ExternalSystemRole}
	 * -------------|--------------------------------|----------------------------
	 * Belonged to  | {@link DistributedSystemArray} | {@link DistributedSystem}
	 * Relationship | M: N Associative               | 1: N Composite
	 * Ownership    | References                     | Exclusive possession
	 * 
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png)
	 * 
	 * @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API DistributedSystem
		: public virtual parallel::ParallelSystem
	{
		friend class DistributedSystemArray;

	private:
		typedef parallel::ParallelSystem super;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		using super::super;
		virtual ~DistributedSystem();

	protected:
		/**
		 * Factory method creating a {@link ExternalSystemRole child} object.
		 * 
		 * In {@link distributed} module, the process class {@link DistributedProcess} is not belonged to a specific 
		 * {@link DistributedSystem} object. It only belongs to a {@link DistributedSystemArray} object and has a 
		 * **M: N Associative Relationship** between this {@link DistributedSystem} class.
		 * 
		 * By that reason, it's the normal case that the {@link DistributedSystem} object does not have any children 
		 * {@link ExternalSystemRole} object. Thus, default {@link createChild} returns ```null```.
		 * 
		 * However, if you want a {@link DistributedSystem} to have its own domestic {@link ExternalSystemRole} objects
		 * without reference to the {@link DistributedProcess} objects, it is possible. Creates and returns the 
		 * domestic {@link ExternalSystemRole} object.
		 * 
		 * @param xml {@link XML} represents the {@link ExternalSystemRole child} object.
		 * @return A newly created {@link ExternalSystemRole} object or ```null```.
		 */
		virtual auto createChild(std::shared_ptr<library::XML>) -> external::ExternalSystemRole* override
		{
			return nullptr;
		};

	public:
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get parent {@link DistributedSystemArray} object.
		 *
		 * @return The parent {@link DistributedSystemArray} object.
		 */
		auto getSystemArray() const -> DistributedSystemArray*;

	private:
		auto compute_average_elapsed_time() const -> double;

	public:
		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		virtual void replyData(std::shared_ptr<protocol::Invoke>) override;

		virtual void _Send_back_history(std::shared_ptr<protocol::Invoke>, std::shared_ptr<protocol::InvokeHistory>);

	protected:
		virtual void _Report_history(std::shared_ptr<library::XML>) override;

		
	};
};
};
};