#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/external/ExternalSystemArray.hpp>
#	include <samchon/templates/parallel/ParallelSystem.hpp>
#include <samchon/templates/parallel/base/ParallelSystemArrayBase.hpp>

namespace samchon
{
namespace templates
{

/**
 * A template for Parallel Processing System.
 * 
 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/CPP-Templates-Parallel_System)
 * @author Jeongho Nam <http://samchon.org>
 */
namespace parallel
{
	/**
	 * Master of Parallel Processing System.
	 * 
	 * The {@link ParallelSystemArray} is an abstract class containing and managing remote parallel **slave** system 
	 * drivers, {@link ParallelSystem} objects. Within framework of network, {@link ParallelSystemArray} represents your 
	 * system, a **Master** of *Parallel Processing System* that requesting *parallel process* to **slave** systems and the 
	 * children {@link ParallelSystem} objects represent the remote **slave** systems, who is being requested the 
	 * *parallel processes*.
	 * 
	 * You can specify this {@link ParallelSystemArray} class to be *a server accepting parallel clients* or 
	 * *a client connecting to parallel servers*. Even both of them is possible. Extends one of them below and overrides 
	 * abstract factory method(s) creating the child {@link ParallelSystem} object.
	 * 
	 * - {@link ParallelClientArray}: A server accepting {@link ParallelSystem parallel clients}.
	 * - {@link ParallelServerArray}: A client connecting to {@link ParallelServer parallel servers}.
	 * - {@link ParallelServerClientArray}: Both of them. Accepts {@link ParallelSystem parallel clients} and connects to
	 *                                      {@link ParallelServer parallel servers} at the same time.
	 * 
	 * When you need the **parallel process**, then call one of them: {@link sendSegmentData} or {@link sendPieceData}.
	 * When the **parallel process** has completed, {@link ParallelSystemArray} estimates each {@link ParallelSystem}'s 
	 * {@link ParallelSystem.getPerformance performance index} basis on their execution time. Those performance indices 
	 * will be reflected to the next **parallel process**, how much pieces to allocate to each {@link ParallelSystem}.
	 *
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/cpp_class_diagram/templates_parallel_system.png)
	 * 
	 * #### Proxy Pattern
	 * This class {@link ParallelSystemArray} is derived from the {@link ExternalSystemArray} class. Thus, you can take 
	 * advantage of the *Proxy Pattern* in the {@link ParallelSystemArray} class. If a process to request is not the 
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
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/CPP-Templates-Parallel_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	template <class System = ParallelSystem>
	class ParallelSystemArray
		: public virtual external::ExternalSystemArray<System>,
		public base::ParallelSystemArrayBase
	{
	private:
		typedef external::ExternalSystemArray<System> super;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * @brief Default Constructor.
		 */
		ParallelSystemArray()
			: super(),
			base::ParallelSystemArrayBase()
		{
		};
		virtual ~ParallelSystemArray() = default;
	};
};
};
};