/// <reference path="../../API.ts" />

/// <reference path="../ExternalSystem.ts" />

/// <reference path="../InvokeHistory.ts" />

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
     * @author Jeongho Nam
     */
    export class SlaveSystem
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
            var history: InvokeHistory = new InvokeHistory(invoke);

            super.replyData(invoke);
        
            history.notifyEnd();
            this.sendData(history.toInvoke());
        }
    }
}