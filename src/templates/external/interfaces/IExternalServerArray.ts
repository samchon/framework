import { ExternalSystemArray } from "../ExternalSystemArray";
import { IExternalServer } from "./IExternalServer";

/**
 * An interface for an {@link ExternalSystemArray} connects to {@link IExternalServer external servers} as a 
 * **client**.
 * 
 * The easiest way to defining an {@link ExternalSystemArray} who connects to 
 * {@link IExternalServer external servers} is to extending one of below, who are derived from this interface 
 * {@link IExternalServerArray}. However, if you can't specify an {@link ExternalSystemArray} to be whether server or 
 * client, then make a class (let's name it as **BaseSystemArray**) extending {@link ExternalSystemArray} and make
 * a new class (now, I name it **BaseServerArray**) extending **BaseSystemArray** and implementing this 
 * interface {@link IExternalServerArray}. Define the **BaseServerArray** following those codes on below: 
 * 
 * <ul>
 *	<li> {@link ExternalServerArray}:
 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalServerArray.ts"
 *		   target="_blank"> View source code on GitHub </a>
 *	</li>
 *	<li> {@link ParallelServerArray}:
 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/master/ParallelServerArray.ts"
 *		   target="_blank"> View source code on GitHub </a>
 *	</li>
 *	<li> {@link DistributedServerArray}:
 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/master/DistributedServerArray.ts"
 *		   target="_blank"> View source code on GitHub </a>
 *	</li>
 * </ul>
 * 
 * @handbook [Templates - External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External_System)
 * @author Jeongho Nam <http://samchon.org>
 */
export interface IExternalServerArray<System extends IExternalServer>
	extends ExternalSystemArray<System>
{
	/**
	 * Connect to {@link IExternalServer external servers}.
	 * 
	 * This method calls children elements' method {@link IExternalServer.connect} gradually.
	 */
	connect(): void;
}