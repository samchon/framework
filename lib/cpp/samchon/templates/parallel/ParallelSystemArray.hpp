#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/external/ExternalSystemArray.hpp>
#	include <samchon/templates/parallel/ParallelSystem.hpp>

namespace samchon
{
namespace templates
{

/**
 * A template for Parallel Processing System.
 * 
 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System)
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
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png)
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
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API ParallelSystemArray
		: public virtual external::ExternalSystemArray
	{
		friend class ParallelSystem;
		friend class distributed::DistributedProcess;

	private:
		typedef external::ExternalSystemArray super;

		size_t history_sequence;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * @brief Default Constructor.
		 */
		ParallelSystemArray();

		virtual ~ParallelSystemArray();

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		SHARED_ENTITY_DEQUE_ELEMENT_ACCESSOR_INLINE(ParallelSystem)

		/* =========================================================
			INVOKE MESSAGE CHAIN
				- SEND DATA
				- PERFORMANCE ESTIMATION
		============================================================
			SEND & REPLY DATA
		--------------------------------------------------------- */
		/**
		 * Send an {@link Invoke} message with segment size.
		 * 
		 * Sends an {@link Invoke} message requesting a **parallel process** with its *segment size*. The {@link Invoke}
		 * message will be delivered to children {@link ParallelSystem} objects with the *piece size*, which is divided
		 * from the *segment size*, basis on their {@link ParallelSystem.getPerformance performance indices}.
		 * 
		 * - If segment size is 100,
		 * - The segment will be allocated such below:
		 * 
		 * Name    | Performance index | Number of pieces to be allocated | Formula
		 * --------|-------------------|----------------------------------|--------------
		 * Snail   |                 1 |                               10 | 100 / 10 * 1
		 * Cheetah |                 4 |                               40 | 100 / 10 * 4
		 * Rabbit  |                 3 |                               30 | 100 / 10 * 3
		 * Turtle  |                 2 |                               20 | 100 / 10 * 2
		 * 
		 * When the **parallel process** has completed, then this {@link ParallelSystemArraY} will estimate 
		 * {@link ParallelSystem.getPerformance performance indices} of {@link ParallelSystem} objects basis on their 
		 * execution time.
		 * 
		 * @param invoke An {@link Invoke} message requesting parallel process.
		 * @param size Number of pieces to segment.
		 * 
		 * @see {@link sendPieceData}, {@link ParallelSystem.getPerformacen}
		 */
		void sendSegmentData(std::shared_ptr<protocol::Invoke> invoke, size_t size)
		{
			sendPieceData(invoke, 0, size);
		};

		/**
		 * Send an {@link Invoke} message with range of pieces.
		 * 
		 * Sends an {@link Invoke} message requesting a **parallel process** with its *range of pieces [first, last)*. 
		 * The {@link Invoke} will be delivered to children {@link ParallelSystem} objects with the newly computed 
		 * *range of sub-pieces*, which is divided from the *range of pieces (first to last)*, basis on their
		 * {@link ParallelSystem.getPerformance performance indices}.
		 * 
		 * - If indices of pieces are 0 to 50,
		 * - The sub-pieces will be allocated such below:
		 * 
		 * Name    | Performance index | Range of sub-pieces to be allocated | Formula
		 * --------|-------------------|-------------------------------------|------------------------
		 * Snail   |                 1 |                            ( 0,  5] | (50 - 0) / 10 * 1
		 * Cheetah |                 4 |                            ( 5, 25] | (50 - 0) / 10 * 4 + 5
		 * Rabbit  |                 3 |                            (25, 40] | (50 - 0) / 10 * 3 + 25
		 * Turtle  |                 2 |                            (40, 50] | (50 - 0) / 10 * 2 + 40
		 * 
		 * When the **parallel process** has completed, then this {@link ParallelSystemArraY} will estimate
		 * {@link ParallelSystem.getPerformance performance indices} of {@link ParallelSystem} objects basis on their
		 * execution time.
		 * 
		 * @param invoke An {@link Invoke} message requesting parallel process.
		 * @param first Initial piece's index in a section.
		 * @param last Final piece's index in a section. The range used is [*first*, *last*), which contains 
		 *			   all the pieces' indices between *first* and *last*, including the piece pointed by index
		 *			   *first*, but not the piece pointed by the index *last*.
		 * 
		 * @see {@link sendSegmentData}, {@link ParallelSystem.getPerformacen}
		 */
		virtual void sendPieceData(std::shared_ptr<protocol::Invoke>, size_t, size_t);

	protected:
		virtual auto _Complete_history(std::shared_ptr<protocol::InvokeHistory>) -> bool;

		virtual void _Normalize_performance();
	};
};
};
};