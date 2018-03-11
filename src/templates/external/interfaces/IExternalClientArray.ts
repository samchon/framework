namespace samchon.templates.external
{
    /**
	 * An interface for an {@link ExternalSystemArray} accepts {@link ExternalSystem external clients} as a
	 * {@link IServer server}.
	 * 
	 * The easiest way to defining an {@link ExternalSystemArray} who opens server and accepts 
	 * {@link ExternalSystem external clients} is to extending one of below, who are derived from this interface 
	 * {@link IExternalClientArray}. However, if you can't specify an {@link ExternalSystemArray} to be whether server or
	 * client, then make a class (let's name it as **BaseSystemArray**) extending {@link ExternalSystemArray} and make
	 * a new class (now, I name it **BaseClientArray**) extending **BaseSystemArray** and implementing this 
	 * interface {@link IExternalClientArray}. Define the **BaseClientArray** following those codes on below:
	 * 
	 * <ul>
	 *	<li> {@link ExternalClientArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalClientArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link ParallelClientArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/master/ParallelClientArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link DistributedClientArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/master/DistributedClientArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 * </ul>
	 * 
	 * @handbook [Templates - External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IExternalClientArray<System extends ExternalSystem>
		extends ExternalSystemArray<System>,
				protocol.IServer
	{
	}
}