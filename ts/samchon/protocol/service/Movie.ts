/// <reference path="../../API.ts" />

/// <reference path="../IProtocol.ts" />

/// <reference path="Application.ts" />

namespace samchon.protocol.service
{
    /**
     * A movie belonged to an Application.
     */
    export class Movie
	    implements IProtocol
    {
        /**
         * <p> An application the movie is belonged to
         */
	    protected application: Application;

        /**
         * Handle replied data.
         */
	    public replyData(invoke: Invoke): void
	    {
		    invoke.apply(this) == false;
	    }

        /**
         * Send data to server.
         */
	    public sendData(invoke: Invoke): void
	    {
		    this.application.sendData(invoke);
	    }
    }
}