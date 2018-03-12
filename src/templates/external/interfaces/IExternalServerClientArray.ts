import { IExternalClientArray } from "./IExternalClientArray";
import { ExternalSystem } from "../ExternalSystem";

/**
 * An interface for an {@link ExternalSystemArray} accepts {@link ExternalSystem external clients} as a
 * {@link IServer server} and connects to {@link IExternalServer} as **client**, at the same time.
 * 
 * The easiest way to defining an {@link IExternalServerClientArray} who opens server, accepts
 * {@link ExternalSystem external clients} and connects to {@link IExternalServer external servers} is to extending 
 * one of below, who are derived from this interface {@link IExternalServerClientArray}. However, if you can't 
 * specify an {@link ExternalSystemArray} to be whether server or client or even can both them, then make a class 
 * (let's name it as **BaseSystemArray**) extending {@link ExternalSystemArray} and make a new class (now, I name 
 * it **BaseServerClientArray**) extending **BaseSystemArray** and implementing this interface 
 * {@link IExternalServerClientArray}. Define the **BaseServerClientArray** following those codes on below:
 * 
 * <ul>
 *	<li> {@link ExternalServerClientArray}:
 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalServerClientArray.ts"
 *		   target="_blank"> View source code on GitHub </a>
 *	</li>
 *	<li> {@link ParallelServerClientArray}:
 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/master/ParallelServerClientArray.ts"
 *		   target="_blank"> View source code on GitHub </a>
 *	</li>
 *	<li> {@link DistributedServerClientArray}:
 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/master/DistributedServerClientArray.ts"
 *		   target="_blank"> View source code on GitHub </a>
 *	</li>
 * </ul>
 * 
 * @handbook [Templates - External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External_System)
 * @author Jeongho Nam <http://samchon.org>
 */
export interface IExternalServerClientArray<System extends ExternalSystem>
	extends IExternalClientArray<System>
{
	/**
	 * Connect to {@link IExternalServer external servers}.
	 * 
	 * This method calls children elements' method {@link IExternalServer.connect} gradually.
	 */
	connect(): void;
}