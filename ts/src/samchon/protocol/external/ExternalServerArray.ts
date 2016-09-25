/// <reference path="../../API.ts" />

/// <reference path="ExternalSystemArray.ts" />

namespace samchon.protocol.external
{
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
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalServerArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link ParallelServerArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/ParallelServerArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link DistributedServerArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/DistributedServerArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IExternalServerArray
		extends ExternalSystemArray
	{
		/**
		 * Connect to {@link IExternalServer external servers}.
		 * 
		 * This method calls children elements' method {@link IExternalServer.connect} gradually.
		 */
		connect(): void;
	}

	/**
	 * An {@link ExternalSystemArray} connecting to {@link IExternalServer external servers} as a **client**.
	 * 
	 * {@link ExternalServerArray} is an abstract class contains, manages and connects to external server drivers, 
	 * {@link IExternalServer} objects, as a **client**.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * <h4> Proxy Pattern </h4>
	 * The {@link ExternalSystemArray} class can use *Proxy Pattern*. In framework within user, which
	 * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
	 * important. Only interested in user's perspective is *which can be done*.
	 *
	 * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
	 * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
	 * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
	 *
	 * <ul>
	 *	<li>
	 *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
	 *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
	 *	</li>
	 *	<li>
	 *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
	 *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
	 *		external system.
	 *	</li>
	 *	<li> Those strategy is called *Proxy Pattern*. </li>
	 * </ul>
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ExternalServerArray
		extends ExternalSystemArray
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

		/* ---------------------------------------------------------
			CONNECTOR's METHOD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ExternalSystem = this.at(i);
				if ((system as IExternalServer).connect == undefined)
					continue;

				(system as IExternalServer).connect();
			}
		}
	}
}