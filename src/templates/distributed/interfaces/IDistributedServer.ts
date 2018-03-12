import { DistributedSystem } from "../DistributedSystem";

/**
 * An interface for a distributed slave server driver.
 * 
 * The easiest way to defining a driver for distributed **slave** server is extending {@link DistributedServer} class. 
 * However, if you've to interact with a prallel **slave** system who can be both server and client, them make a class 
 * (let's name it **BaseSystem**) extending the {@link DistributedServer} class. At next, make a new class (now, I name 
 * it **BaseServer**) extending the **BaseSystem** and implements this interface {@link IParallelServer}. Define the 
 * **BaseServer** following those codes on below:
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
	* @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System)
	* @author Jeongho Nam <http://samchon.org>
	*/
export interface IDistributedServer
	extends DistributedSystem
{
	/**
	 * Connect to external server.
	 */
	connect(): void;
}