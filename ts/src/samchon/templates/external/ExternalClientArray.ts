/// <reference path="../../API.ts" />

/// <reference path="ExternalSystemArray.ts" />

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
	export interface IExternalClientArray
		extends ExternalSystemArray,
				protocol.IServer
	{
	}

	/**
	 * An {@link ExternalSystemArray} acceepts {@link ExternalSystem external clients} as a {@link IServer server}.
	 * 
	 * {@link ExternalServerArray} is an abstract class contains, manages and accepts external server drivers, 
	 * {@link IExternalServer} objects, as a {@link IServer server}.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png"
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
	 * @handbook [Templates - External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ExternalClientArray
		extends ExternalSystemArray
		implements IExternalClientArray
	{
		/**
		 * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
		 */
		private server_base_: protocol.IServerBase;

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

			this.server_base_ = null;
		}

		/**
		 * Factory method creating {@link IServerBase} object.
		 * 
		 * This method {@link createServerBase createServerBase()} determines which templates is used in this server,
		 * {@link ExternalClientArray}. If the templates is determined, then {@link ExternalSystem external clients} who 
		 * may connect to {@link ExternalClientArray this server} must follow the specified templates.
		 * 
		 * Creates and returns one of them:
		 * <ul>
		 *	<li> {@link ServerBase} </li>
		 *	<li> {@link WebServerBase} </li>
		 *	<li> {@link SharedWorkerServerBase} </li>
		 * </ul>
		 * 
		 * @return A new {@link IServerBase} object.
		 */
		protected abstract createServerBase(): protocol.IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		public addClient(driver: protocol.IClientDriver): void
		{
			let system: ExternalSystem = this.createExternalClient(driver);
			if (system == null)
				return;

			this.push_back(system);
		}

		/**
		 * (Deprecated) Factory method creating child object.
		 * 
		 * The method {@link createChild createChild()} is deprecated. Don't use and override this. 
		 * 
		 * Note that, the {@link ExternalClientArray} is a server accepting {@link ExternalSystem external clients}.
		 * There's no way to creating the {@link ExternalSystem external clients} in advance before opening the server.
		 * 
		 * @param xml An {@link XML} object represents the child {@link ExternalSystem} object.
		 * @return null
		 */
		public createChild(xml: library.XML): ExternalSystem { return null; }

		/**
		 * Factory method creating a child {@link ExternalSystem} object.
		 * 
		 * @param driver A communicator with connected client.
		 * @return A newly created {@link ExternalSystem} object.
		 */
		protected abstract createExternalClient(driver: protocol.IClientDriver): ExternalSystem;

		/* ---------------------------------------------------------
			METHOD OF SERVER
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.server_base_ = this.createServerBase();
			if (this.server_base_ == null)
				return;

			this.server_base_.open(port);
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			if (this.server_base_ == null)
				return;

			this.server_base_.close();
		}
	}
}