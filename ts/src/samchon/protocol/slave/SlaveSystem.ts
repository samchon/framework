/// <reference path="../../API.ts" />

/// <reference path="../ExternalSystem.ts" />

namespace samchon.protocol.slave
{
	/**
	 * @brief A slave system.
	 *
	 * @details
	 * <p> SlaveSystem, literally, means a slave system belongs to a maste system. </p>
	 *
	 * <p> The SlaveSystem class is used in opposite side system of master::DistributedSystem
	 * and master::ParallelSystem and reports elapsed time of each commmand (by Invoke message)
	 * for estimation of its performance. </p>
	 * 
	 * @inheritdoc
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class SlaveSystem
		extends ExternalSystem
	{
		/**
		 * <p> Default Constructor. </p>
		 */
		public constructor()
		{
			super();
		}

		/**
		 * @inheritdoc
		 */
		public replyData(invoke: Invoke): void
		{
			let history: InvokeHistory = new InvokeHistory(invoke);

			super.replyData(invoke);
		
			history.notifyEnd();
			this.sendData(history.toInvoke());
		}
	}
}