/// <reference path="../../API.ts" />

/// <reference path="ExternalSystem.ts" />

namespace samchon.protocol.external
{
	/**
	 * <p> An interface for an external server driver. </p>
	 * 
	 * <p> The easiest way to defining an external server driver is to extending one of below, who are derived from this
	 * interface {@link IExternalServer}. However, if you've to interact with an external system who can be both server 
	 * and client, then make a class (let's name it as <b>BaseSystem</b>) extending {@link ExternalSystem} and make a 
	 * new class (now, I name it <b>BaseServer</b>) extending <b>BaseSystem</b> and implementing this interface
	 * {@link IExternalServer}. Define the <b>BaseServer</b> following those codes on below:  
	 * 
	 * <ul>
	 *	<li> {@link ExternalServer}: 
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalServer.ts" 
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link ParallelServer}: 
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/DistributedServer.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link DistributedServer}: 
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/ParallelServer.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IExternalServer extends ExternalSystem
	{
		/**
		 * Connect to the external system.
		 */
		connect(): void;

		/**
		 * Get ip address.
		 */
		getIP(): string;

		/**
		 * Get port number.
		 */
		getPort(): number;
	}

	/**
	 * <p> An external server driver. </p>
	 * 
	 * <p> The {@link ExternalServer} class represents an external server, connected and interact with this system.
	 * {@link ExternalServer} takes full charge of network communication with external server have connected.
	 * Replied {@link Invoke messages} from the external system is shifted to and processed in, children elements of this
	 * class, {@link ExternalSystemRole} objects. </p>
	 * 
	 * <p> <a href="http://samchon.github.io/framework/api/ts/assets/images/design/protocol_external_system.png" 
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/api/ts/assets/images/design/protocol_external_system.png" 
	 *		 style="max-width: 100%" /> 
	 * </a> </p>
	 * 
	 * <h4> Bridge & Proxy Pattern </h4>
	 * <p> The {@link ExternalSystem} class can be a <i>bridge</i> for <i>logical proxy</i>. In framework within user,
	 * which {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
	 * important. Only interested in user's perspective is <i>which can be done</i>. </p>
	 *
	 * <p> By using the <i>logical proxy</i>, user dont't need to know which {@link ExternalSystemRole role} is belonged
	 * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
	 * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}. </p>
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
	 *	<li> Those strategy is called <i>Bridge Pattern</i> and <i>Proxy Pattern</i>. </li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ExternalServer 
		extends ExternalSystem
		implements IExternalServer
	{
		/**
		 * IP address of target external system to connect.
		 */
		protected ip: string;

		/**
		 * Port number of target external system to connect.
		 */
		protected port: number;

		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.ip = "";
			this.port = 0;
		}

		/**
		 * Factory method creating server connector.
		 */
		protected abstract createServerConnector(): IServerConnector;

		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			this.communicator = this.createServerConnector();
			(this.communicator as IServerConnector).connect(this.ip, this.port);
		}

		/**
		 * @inheritdoc
		 */
		public getIP(): string
		{
			return this.ip;
		}

		/**
		 * @inheritdoc
		 */
		public getPort(): number
		{
			return this.port;
		}
	}
}