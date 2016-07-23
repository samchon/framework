/// <reference path="../../API.ts" />

/// <reference path="ExternalSystemArray.ts" />

namespace samchon.protocol.external
{
	/**
	 * <p> An interface for an {@link ExternalSystemArray} accepts {@link ExternalSystem external clients} as a
	 * {@link IServer server}. </p>
	 * 
	 * <p> The easiest way to defining an {@link ExternalSystemArray} who opens server and accepts 
	 * {@link ExternalSystem external clients} is to extending one of below, who are derived from this interface 
	 * {@link IExternalClientArray}. However, if you can't specify an {@link ExternalSystemArray} to be whether server or
	 * client, then make a class (let's name it as <b>BaseSystemArray</b>) extending {@link ExternalSystemArray} and make
	 * a new class (now, I name it <b>BaseClientArray</b>) extending <b>BaseSystemArray</b> and implementing this 
	 * interface {@link IExternalClientArray}. Define the <b>BaseClientArray</b> following those codes on below:
	 * 
	 * <ul>
	 *	<li> {@link ExternalClientArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link ParallelClientArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/ParallelClientArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link DistributedClientArray}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/DistributedClientArray.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IExternalClientArray
		extends ExternalSystemArray,
				IServer
	{
	}

	/**
	 * <p> An {@link ExternalSystemArray} acceepts {@link ExternalSystem external clients} as a {@link IServer server}. </p>
	 * 
	 * <p> {@link ExternalServerArray} is an abstract class contains, manages and accepts external server drivers, 
	 * {@link IExternalServer} objects, as a {@link IServer server}. </p>
	 *
	 * <p> <a href="http://samchon.github.io/framework/api/ts/assets/images/design/protocol_external_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/api/ts/assets/images/design/protocol_external_system.png"
	 *		 style="max-width: 100%" />
	 * </a> </p>
	 *
	 * <h4> Proxy Pattern </h4>
	 * <p> The {@link ExternalSystemArray} class can use <i>Proxy Pattern</i>. In framework within user, which
	 * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
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
	 *	<li> Those strategy is called <i>Proxy Pattern</i>. </li>
	 * </ul>
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ExternalClientArray
		extends ExternalSystemArray
		implements IExternalClientArray
	{
		/**
		 * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
		 */
		private server_base: IServerBase;

		/* =========================================================
			CONSTRUCTORS
				- MEMBER
				- FACTORY METHOD FOR CHILDREN
		============================================================
			MEMBER 
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.server_base = null;
		}

		/**
		 * <p> Factory method creating {@link IServerBase} object. </p>
		 * 
		 * <p> This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
		 * {@link ExternalClientArray}. If the protocol is determined, then {@link ExternalSystem external clients} who 
		 * may connect to {@link ExternalClientArray this server} must follow the specified protocol. </p>
		 * 
		 * <p> Creates and returns one of them: </p>
		 * <ul>
		 *	<li> {@link NormalServerBase} </li>
		 *	<li> {@link WebServerBase} </li>
		 *	<li> {@link SharedWorkerServerBase} </li>
		 * </ul>
		 * 
		 * @return A new {@link IServerBase} object.
		 */
		protected abstract createServerBase(): IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		public addClient(driver: IClientDriver): void
		{
			let system: ExternalSystem = this.createExternalClient(driver);
			if (system == null)
				return;

			if (system["communicator"] == null)
			{
				system["communicator"] = driver;
				driver.listen(system);
			}
			this.push_back(system);
		}

		/**
		 * This method is deprecated. Don't use and override this.
		 * 
		 * @return nothing.
		 */
		protected createChild(xml: library.XML): ExternalSystem { return null; }

		protected abstract createExternalClient(driver: IClientDriver): ExternalSystem;

		/* ---------------------------------------------------------
			METHOD OF SERVER
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.server_base = this.createServerBase();
			if (this.server_base == null)
				return;

			this.server_base.open(port);
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			if (this.server_base != null)
				this.server_base.close();
		}
	}
}