/// <reference path="../API.ts" />

/// <reference path="Server.ts" />

namespace samchon.protocol
{
	/**
	 * An interface for substitute server classes.
	 * 
	 * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
	 * 
	 * The easiest way to defining a server class is to extending one of them below, who implemented the {@link IServer}. 
	 * However, it is impossible (that is, if the class is already extending another class), you can instead implement 
	 * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into 
	 * the aggregated {@link IServerBase}.
	 * 
	 * Protocol | {@link IServer} | {@link IServerBase} | {@link IClientDriver}
	 * ---------|-----------------|---------------------|-----------------------
	 * Samchon Framework's own | {@link Server} | {@link ServerBase} | {@link ClientDriver}
	 * Web-socket protocol | {@link WebServer} | {@link WebServerBase} | {@link WebClientDriver}
	 * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerServerBase} | {@link SharedWorkerClientDriver}
	 * 
	 * After the hooking to aggregated {@link IServerBase} object, overrides {@link addClient addClient()} method who 
	 * accepts a newly connected client as an {@link IClientDriver} object. At last, call {@link open open()} method with 
	 * specified port number.
	 * 
	 * ```typescript
	 * class MyServer extends Something implements IServer
	 * {
	 * 	private server_base_: IServerBase = new WebServerBase(this);
	 *
	 * 	public addClient(driver: IClientDriver): void
	 * 	{
	 * 		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
	 * 	}
	 *
	 * 	public open(port: number): void
	 * 	{
	 * 		this.server_base_.open();
	 * 	}
	 * 	public close(): void
	 * 	{
	 * 		this.server_base_.close();
	 * 	}
	 * }
	 * ```
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link IServer}, {@link IClientDriver}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IServerBase extends IServer
	{
	}
}

namespace samchon.protocol
{
	/**
	 * A substitute {@link Server}.
	 * 
	 * The {@link ServerBase} is a substitute class who subrogates {@link Server}'s responsibility.
	 * 
	 * #### [Inherited] {@link IServerBase}
	 * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
	 *
	 * The easiest way to defining a server class is to extending one of them below, who implemented the {@link IServer}.
	 * However, it is impossible (that is, if the class is already extending another class), you can instead implement
	 * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into
	 * the aggregated {@link IServerBase}.
	 *
	 * Protocol | {@link IServer} | {@link IServerBase} | {@link IClientDriver}
	 * ---------|-----------------|---------------------|-----------------------
	 * Samchon Framework's own | {@link Server} | {@link ServerBase} | {@link ClientDriver}
	 * Web-socket protocol | {@link WebServer} | {@link WebServerBase} | {@link WebClientDriver}
	 * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerServerBase} | {@link SharedWorkerClientDriver}
	 *
	 * After the hooking to aggregated {@link IServerBase} object, overrides {@link addClient addClient()} method who
	 * accepts a newly connected client as an {@link IClientDriver} object. At last, call {@link open open()} method with
	 * specified port number.
	 *
	 * ```typescript
	 * class MyServer extends Something implements IServer
	 * {
	 * 	private server_base_: IServerBase = new WebServerBase(this);
	 *
	 * 	public addClient(driver: IClientDriver): void
	 * 	{
	 * 		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
	 * 	}
	 *
	 * 	public open(port: number): void
	 * 	{
	 * 		this.server_base_.open();
	 * 	}
	 * 	public close(): void
	 * 	{
	 * 		this.server_base_.close();
	 * 	}
	 * }
	 * ```
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 *
	 * @see {@link Server}, {@link ClientDriver}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class ServerBase
		extends Server
		implements IServerBase
	{
		/**
		 * @hidden
		 */
		private hooker_: IServer;

		/**
		 * Construct from a *hooker*.
		 * 
		 * @param hooker A hooker throwing responsibility of server's role.
		 */
		public constructor(hooker: IServer)
		{
			super();
			this.hooker_ = hooker;
		}

		/**
		 * @inheritdoc
		 */
		public addClient(driver: IClientDriver): void
		{
			this.hooker_.addClient(driver);
		}
	}
}

namespace samchon.protocol
{
	/**
	 * A substitute {@link WebServer}.
	 * 
	 * The {@link WebServerBase} is a substitute class who subrogates {@link WebServer}'s responsibility.
	 * 
	 * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
	 *
	 * The easiest way to defining a server class is to extending one of them below, who implemented the {@link IServer}.
	 * However, it is impossible (that is, if the class is already extending another class), you can instead implement
	 * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into
	 * the aggregated {@link IServerBase}.
	 *
	 * Protocol | {@link IServer} | {@link IServerBase} | {@link IClientDriver}
	 * ---------|-----------------|---------------------|-----------------------
	 * Samchon Framework's own | {@link Server} | {@link ServerBase} | {@link ClientDriver}
	 * Web-socket protocol | {@link WebServer} | {@link WebServerBase} | {@link WebClientDriver}
	 * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerServerBase} | {@link SharedWorkerClientDriver}
	 *
	 * After the hooking to aggregated {@link IServerBase} object, overrides {@link addClient addClient()} method who
	 * accepts a newly connected client as an {@link IClientDriver} object. At last, call {@link open open()} method with
	 * specified port number.
	 *
	 * ```typescript
	 * class MyServer extends Something implements IServer
	 * {
	 * 	private server_base_: IServerBase = new WebServerBase(this);
	 *
	 * 	public addClient(driver: IClientDriver): void
	 * 	{
	 * 		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
	 * 	}
	 *
	 * 	public open(port: number): void
	 * 	{
	 * 		this.server_base_.open();
	 * 	}
	 * 	public close(): void
	 * 	{
	 * 		this.server_base_.close();
	 * 	}
	 * }
	 * ```
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link WebServer}, {@link WebClientDriver}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class WebServerBase
		extends WebServer
		implements IServerBase
	{
		/**
		 * @hidden
		 */
		private hooker_: IServer;

		/**
		 * Construct from a *hooker*.
		 * 
		 * @param hooker A hooker throwing responsibility of server's role.
		 */
		public constructor(hooker: IServer)
		{
			super();
			this.hooker_ = hooker;
		}

		/**
		 * @inheritdoc
		 */
		public addClient(driver: IClientDriver): void
		{
			this.hooker_.addClient(driver);
		}
	}
}

namespace samchon.protocol
{
	/**
	 * A substitute {@link SharedWorkerServer}.
	 * 
	 * The {@link SharedWorkerServerBase} is a substitute class who subrogates {@link SharedWorkerServer}'s 
	 * responsibility.
	 * 
	 * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
	 *
	 * The easiest way to defining a server class is to extending one of them below, who implemented the {@link IServer}.
	 * However, it is impossible (that is, if the class is already extending another class), you can instead implement
	 * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into
	 * the aggregated {@link IServerBase}.
	 *
	 * Protocol | {@link IServer} | {@link IServerBase} | {@link IClientDriver}
	 * ---------|-----------------|---------------------|-----------------------
	 * Samchon Framework's own | {@link Server} | {@link ServerBase} | {@link ClientDriver}
	 * Web-socket protocol | {@link WebServer} | {@link WebServerBase} | {@link WebClientDriver}
	 * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerServerBase} | {@link SharedWorkerClientDriver}
	 *
	 * After the hooking to aggregated {@link IServerBase} object, overrides {@link addClient addClient()} method who
	 * accepts a newly connected client as an {@link IClientDriver} object. At last, call {@link open open()} method with
	 * specified port number.
	 *
	 * ```typescript
	 * class MyServer extends Something implements IServer
	 * {
	 * 	private server_base_: IServerBase = new WebServerBase(this);
	 *
	 * 	public addClient(driver: IClientDriver): void
	 * 	{
	 * 		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
	 * 	}
	 *
	 * 	public open(port: number): void
	 * 	{
	 * 		this.server_base_.open();
	 * 	}
	 * 	public close(): void
	 * 	{
	 * 		this.server_base_.close();
	 * 	}
	 * }
	 * ```
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link SharedWorkerServer}, {@link SharedWorkerClientDriver}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class SharedWorkerServerBase
		extends SharedWorkerServer
		implements IServerBase
	{
		/**
		 * @hidden
		 */
		private hooker_: IServer;

		/**
		 * Construct from a *hooker*.
		 * 
		 * @param hooker A hooker throwing responsibility of server's role.
		 */
		public constructor(hooker: IServer)
		{
			super();
			this.hooker_ = hooker;
		}

		/**
		 * @inheritdoc
		 */
		public addClient(driver: IClientDriver): void
		{
			this.hooker_.addClient(driver);
		}
	}
}