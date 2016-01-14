/// <reference path="../../API.ts" />

/// <reference path="../IProtocol.ts" />

namespace samchon.protocol.service
{
    /**
     * A sub-movie.
     *
     * @author Jeongho Nam
     */
    class SubMovie
	    implements IProtocol 
    {
        /**
         * A parent object the SubMovie is belonged to.
         */
	    protected parent: IProtocol;

	    public replyData(invoke: Invoke): void 
        {
		    invoke.apply(this);
	    }
	    public sendData(invoke: Invoke): void 
        {
		    this.parent.sendData(invoke);
	    }
    }
}