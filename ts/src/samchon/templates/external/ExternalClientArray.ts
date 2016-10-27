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
	export interface IExternalClientArray<System extends ExternalSystem>
		extends ExternalSystemArray<System>,
				protocol.IServer
	{
	}

	/**
	 * An array and manager of {@link ExternalSystem external clients} as a server.
	 * 
	 * The {@link ExternalClientArray} is an abstract class, derived from the {@link ExternalSystemArray} class, opening
	 * a server accepting {@link ExternalSystem external clients}.
	 *
	 * Extends this {@link ExternalClientArray}, overrides {@link createServerBase createServerBase()} to determine which
	 * protocol to follow and {@link createExternalClient createExternalClient()} creating child {@link ExternalSystem}
	 * object. After the extending and overridings, open this server using the {@link open open()} method.
	 * 
	 * #### [Inherited] {@link ExternalSystemArray}
	 * The {@link ExternalSystemArray} is an abstract class containing and managing external system drivers,
	 * {@link ExternalSystem} objects. Within framewokr of network, {@link ExternalSystemArray} represents your system
	 * and children {@link ExternalSystem} objects represent remote, external systems connected with your system.
	 * With this {@link ExternalSystemArray}, you can manage multiple external systems as a group.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * #### Proxy Pattern
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
	export abstract class ExternalClientArray<T extends ExternalSystem>
		extends ExternalSystemArray<T>
		implements IExternalClientArray<T>
	{
		/**
		 * @hidden
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
		 * 
		 * - {@link ServerBase}
		 * - {@link WebServerBase}
		 * - {@link SharedWorkerServerBase}
		 * 
		 * @return A new {@link IServerBase} object.
		 */
		protected abstract createServerBase(): protocol.IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		/**
		 * Add a newly connected remote client.
		 * 
		 * When a {@link IClientDriver remote client} connects to this *server* {@link ExternalClientArray} object, 
		 * then this {@link ExternalClientArray} creates a child {@link ExternalSystem external client} object through 
		 * the {@link createExternalClient createExternalClient()} method and {@link insert inserts} it.
		 * 
		 * @param driver A communicator for external client.
		 */
		public addClient(driver: protocol.IClientDriver): void
		{
			let system: T = this.createExternalClient(driver);
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
		public createChild(xml: library.XML): T { return null; }

		/**
		 * Factory method creating a child {@link ExternalSystem} object.
		 * 
		 * @param driver A communicator with connected client.
		 * @return A newly created {@link ExternalSystem} object.
		 */
		protected abstract createExternalClient(driver: protocol.IClientDriver): T;

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