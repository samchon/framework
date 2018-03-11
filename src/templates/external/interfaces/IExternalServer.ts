namespace samchon.templates.external
{
    /**
	 * An interface for an external server driver.
	 * 
	 * The easiest way to defining an external server driver is to extending one of below, who are derived from this
	 * interface {@link IExternalServer}. However, if you've to interact with an external system who can be both server 
	 * and client, then make a class (let's name it as **BaseSystem**) extending {@link ExternalSystem} and make a 
	 * new class (now, I name it **BaseServer**) extending **BaseSystem** and implementing this interface
	 * {@link IExternalServer}. Define the **BaseServer** following those codes on below:  
	 * 
	 * <ul>
	 *	<li> {@link ExternalServer}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalServer.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link ParallelServer}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelServer.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link DistributedServer}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedServer.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 * </ul>
	 * 
	 * @handbook [Templates - External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
    export interface IExternalServer extends ExternalSystem
    {
		/**
		 * Connect to the external server.
		 */
        connect(): void;
    }
}