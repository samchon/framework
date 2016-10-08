#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/parallel/ParallelSystemArray.hpp>
#	include <samchon/templates/distributed/DistributedSystem.hpp>
#	include <samchon/templates/distributed/DistributedProcess.hpp>

namespace samchon
{
namespace templates
{

/**
 * A template for Distributed Processing System.
 * 
 * @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/CPP-Templates-Distributed_System)
 * @author Jeongho Nam <http://samchon.org>
 */
namespace distributed
{
	/**
	* Mediator of Distributed Processing System.
	*
	* The {@link DistributedSystemArrayMediator} class be a master for its slave systems, and be a slave to its master
	* system at the same time. This {@link DistributedSystemArrayMediator} be a master system, containing and managing
	* {@link DistributedSystem} objects, which represent distributed slave systems, by extending
	* {@link DistributedSystemArray} class. Also, be a slave system through {@link getMediator mediator} object, which is
	* derived from the {@link SlavSystem} class.
	*
	* As a master, you can specify this {@link DistributedSystemArrayMediator} class to be <i>a master server accepting
	* slave clients<i> or <i>a master client to connecting slave servers</i>. Even both of them is possible. Extends one
	* of them below and overrides abstract factory method(s) creating the child {@link DistributedSystem} object.
	*
	* - {@link DistributedClientArrayMediator}: A server accepting {@link DistributedSystem distributed clients}.
	* - {@link DistributedServerArrayMediator}: A client connecting to {@link DistributedServer distributed servers}.
	* - {@link DistributedServerClientArrayMediator}: Both of them. Accepts {@link DistributedSystem distributed clients} and
	*                                                 connects to {@link DistributedServer distributed servers} at the
	*                                                 same time.
	*
	* As a slave, you can specify this {@link DistributedSystemArrayMediator} to be <i>a client slave connecting to master
	* server</i> or <i>a server slave accepting master client</i> by overriding the {@link createMediator} method.
	* Overrides the {@link createMediator createMediator()} method and return one of them:
	*
	* - A client slave connecting to master server:
	*   - {@link MediatorClient}
	*   - {@link MediatorWebClient}
	*   - {@link MediatorSharedWorkerClient}
	* - A server slave accepting master client:
	*   - {@link MediatorServer}
	*   - {@link MediatorWebServer}
	*   - {@link MediatorSharedWorkerServer}
	*
	* #### [Inherited] {@link DistributedSystemArray}
	* The {@link DistributedSystemArray} is an abstract class containing and managing remote distributed **slave** system
	* drivers, {@link DistributedSystem} objects. Within framework of network, {@link DistributedSystemArray} represents
	* your system, a **Master** of *Distributed Processing System* that requesting *distributed process* to **slave**
	* systems and the children {@link DistributedSystem} objects represent the remote **slave** systems, who is being
	* requested the *distributed processes*.
	*
	* The {@link DistributedSystemArray} contains {@link DistributedProcess} objects directly. You can request a
	* **distributed process** through the {@link DistributedProcess} object. You can access the
	* {@link DistributedProcess} object(s) with those methods:
	*
	* - {@link hasRole}
	* - {@link getRole}
	* - {@link insertRole}
	* - {@link eraseRole}
	* - {@link getRoleMap}
	*
	* When you need the **distributed process**, call the {@link DistributedProcess.sendData} method. Then the
	* {@link DistributedProcess} will find the most idle {@link DistributedSystem} object who represents a distributed
	* **slave **system. The {@link Invoke} message will be sent to the most idle {@link DistributedSystem} object. When
	* the **distributed process** has completed, then {@link DistributedSystem.getPerformance performance index} and
	* {@link DistributedProcess.getResource resource index} of related objects will be revaluated.
	*
	* ![Class Diagram](http://samchon.github.io/framework/images/design/cpp_class_diagram/templates_distributed_system.png)
	*
	* #### Parallel Process
	* This {@link DistributedSystemArray} class is derived from the {@link ParallelSystemArray} class, so you can request
	* a **parallel process**, too.
	*
	* When you need the **parallel process**, then call one of them: {@link sendSegmentData} or {@link sendPieceData}.
	* When the **parallel process** has completed, {@link ParallelSystemArray} estimates each {@link ParallelSystem}'s
	* {@link ParallelSystem.getPerformance performance index} basis on their execution time. Those performance indices will
	* be reflected to the next **parallel process**, how much pieces to allocate to each {@link ParallelSystem}.
	*
	* #### Proxy Pattern
	* This class {@link DistributedSystemArray} is derived from the {@link ExternalSystemArray} class. Thus, you can take
	* advantage of the *Proxy Pattern* in the {@link DistributedSystemArray} class. If a process to request is not the
	* *parallel process* (to be distrubted to all slaves), but the **exclusive process** handled in a system, then it
	* may better to utilizing the *Proxy Pattern*:
	*
	* The {@link ExternalSystemArray} class can use *Proxy Pattern*. In framework within user, which
	* {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
	* important. Only interested in user's perspective is *which can be done*.
	*
	* By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
	* to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
	* Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
	*
	* <ul>
	*	<li>
	*		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
	*		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
	*	</li>
	*	<li>
	*		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
	*		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
	*		external system.
	*	</li>
	*	<li> Those strategy is called *Proxy Pattern*. </li>
	* </ul>
	*
	* @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/CPP-Templates-Distributed_System)
	* @author Jeongho Nam <http://samchon.org>
	*/
	class SAMCHON_FRAMEWORK_API DistributedSystemArray
		: public virtual parallel::ParallelSystemArray
	{
		friend class DistributedSystem;

	private:
		typedef parallel::ParallelSystemArray super;

		HashMap<std::string, std::shared_ptr<DistributedProcess>> process_map_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		DistributedSystemArray();
		virtual ~DistributedSystemArray();

		virtual void construct(std::shared_ptr<library::XML>) override;

	protected:
		/**
		 * Factory method creating a child {@link DistributedProcess process} object.
		 * 
		 * @param xml {@link XML} represents the {@link DistributedProcess child} object.
		 * @return A new {@link DistributedProcess} object.
		 */
		virtual auto createProcess(std::shared_ptr<library::XML>) -> DistributedProcess* = 0;

	public:
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		SHARED_ENTITY_DEQUE_ELEMENT_ACCESSOR_INLINE(DistributedSystem)

		/**
		 * Get process map. 
		 * 
		 * Gets an {@link HashMap} containing {@link DistributedProcess} objects with their *key*.
		 * 
		 * @return An {@link HasmMap> containing pairs of string and {@link DistributedProcess} object.
		 */
		auto getProcessMap() const -> const HashMap<std::string, std::shared_ptr<DistributedProcess>>&
		{
			return process_map_;
		};

		/**
		 * Test whether the process exists.
		 * 
		 * @param name Name, identifier of target {@link DistributedProcess process}.
		 * 
		 * @return Whether the process has or not.
		 */
		auto hasProcess(const std::string &name) const -> bool
		{
			return process_map_.has(name);
		};

		/**
		 * Get a process.
		 * 
		 * @param name Name, identifier of target {@link DistributedProcess process}.
		 * 
		 * @return The specified process.
		 */
		auto getProcess(const std::string &name) const -> std::shared_ptr<DistributedProcess>
		{
			return process_map_.get(name);
		};

		/**
		 * Insert a process.
		 * 
		 * @param process A process to be inserted.
		 * @return Success flag.
		 */
		void insertProcess(std::shared_ptr<DistributedProcess> role)
		{
			process_map_.emplace(role->getName(), role);
		};

		/**
		 * Erase a process.
		 * 
		 * @param name Name, identifier of target {@link DistributedProcess process}.
		 */
		void eraseProcess(const std::string &name)
		{
			process_map_.erase(name);
		};

	protected:
		/* ---------------------------------------------------------
			HISTORY HANDLER - PERFORMANCE ESTIMATION
		--------------------------------------------------------- */
		virtual auto _Complete_history(std::shared_ptr<protocol::InvokeHistory>) -> bool override;

		virtual void _Normalize_performance() override;

	private:
		void estimate_process_resource(std::shared_ptr<DSInvokeHistory>);
		void estimate_system_performance(std::shared_ptr<DSInvokeHistory>);

	public:
		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto toXML() const -> std::shared_ptr<library::XML> override;
	};
};
};
};