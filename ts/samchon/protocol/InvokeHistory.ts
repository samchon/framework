/// <reference path="../API.ts" />

/// <reference path="Entity.ts" />

/// <referecen path="Invoke.ts" />

namespace samchon.protocol
{
    /**
     * <p> A history of an Invoke message. </p>
     *
     * <p> InvokeHistory is a class for reporting history log of an Invoke message with elapsed time 
     * from a slave to its master.</p>
     *
     * <p> With the elapsed time, consumed time for a process of handling the Invoke message, 
     * InvokeHistory is reported to the master. The master utilizies the elapsed time to estimating
     * performances of each slave system. With the estimated performan index, master retrives the
     * optimal solution of distributing processes. </p>
     *
     * @author Jeongho Nam
     */
    export class InvokeHistory
        extends Entity
    {
        /**
         * <p> An identifier. </p>
         */
        protected uid: number;

        /**
	     * <p> A listener of the Invoke message. </p>
	     *
	     * <p> InvokeHistory does not archive entire data of an Invoke message. InvokeHistory only
	     * archives its listener. The first, formal reason is to save space, avoid wasting spaces. </p>
	     * 
	     * <p> The second, complicate reason is on an aspect of which systems are using the 
	     * InvokeHistory class. InvokeHistory is designed to let slave reports to master elapsed time 
	     * of a process used to handling the Invoke message. If you want to archive entire history log 
	     * of Invoke messages, then the subject should be master, not the slave using InvokeHistory 
	     * classes. </p>
	     */
        protected listener: string;

 	    /**
	     * <p> Start time of the history. </p>
	     *
	     * <p> Means start time of a process handling the Invoke message. The start time not only
	     * has ordinary arguments represented Datetime (year to seconds), but also has very precise 
	     * values under seconds, which is expressed as nano seconds (10^-9). </p>
	     *
	     * <p> The precise start time will be used to calculate elapsed time with end time. </p>
	     */
        protected startTime: Date;

  	    /**
	     * <p> End time of the history. </p>
	     *
	     * @details
	     * <p> Means end time of a process handling the Invoke message. The end time not only
	     * has ordinary arguments represented Datetime (year to seconds), but also has very precise 
	     * values under seconds, which is expressed as nano seconds (10^-9). </p>
	     *
	     * <p> The precise end time will be used to calculate elapsed time with start time. </p>
	     */
        protected endTime: Date;
    
        /* -----------------------------------------------------------------
		    CONSTRUCTORS
	    ----------------------------------------------------------------- */
        /**
	     * <p> Construct from an Invoke message. </p>
         * 
	     * <p> InvokeHistory does not archive entire Invoke message, only archives its listener. </p>
	     *
	     * @param invoke A message to archive its history log
	     */
        constructor(invoke: Invoke)
        {
            super();

            this.uid = invoke.get("invoke_history_uid").getValue();
            this.listener = invoke.getListener();

            this.startTime = new Date();

            //DELETE UID IN INVOKE
            //invoke.erase("invoke_history_uid");
        }

        /**
	     * <p> Notify end of the process. </p>
	     *
	     * <p> Notifies end of a process handling the matched Invoke message to InvokeHistory. </p>
	     * <p> InvokeHistory archives the end datetime and calculates elapsed time as nanoseconds. </p>
	     */
        public notifyEnd(): void
        {
            this.endTime = new Date();
        }

        /* -----------------------------------------------------------------
		    EXPORTERS
	    ----------------------------------------------------------------- */
        public TAG(): string 
        { 
            return "invokeHistory"; 
        }

        public toXML(): library.XML
        {
            var xml: library.XML = super.toXML();
            /*xml.setProperty("uid", this.uid);
            xml.setProperty("listener", this.listener);*/

            xml.setProperty("startTime", this.startTime.getTime() * Math.pow(10.0, 6));
            xml.setProperty("endTime", this.endTime.getTime() * Math.pow(10.0, 6));

            return xml;
        }

        /**
	     * <p> Get an Invoke message. </p>
	     *
	     * <p> Returns an Invoke message to report to a master that how much time was elapsed on a 
	     * process handling the Invoke message. In master, those reports are used to estimate 
	     * performance of each slave system. </p>
	     *
	     * @return An Invoke message to report master.
	     */
        public toInvoke(): Invoke
        {
            return null;
            //return new Invoke("reportInvokeHistory", this.toXML());
        }
    }
}