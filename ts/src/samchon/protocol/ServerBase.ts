/// <reference path="../API.ts" />

/// <reference path="Server.ts" />

namespace samchon.protocol
{
	/**
	 * An interface for substitute server classes.
	 * 
	 * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
	 * 
	 * The easiest way to defining a server class is to extending one of them, who are derived from the 
	 * {@link IServer}.
	 * 
	 * <ul>
	 *	<li> {@link Server} </li>
	 *	<li> {@link WebServer} </li>
	 *	<li> {@link SharedWorkerServer} </li>
	 * </ul>
	 * 
	 * However, it is impossible (that is, if the class is already extending another class), you can instead implement
	 * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into the 
	 * aggregated {@link IServerBase}.
	 * 
	 * {@link ExternalClientArray} can be a good example using this {@link IServerBase}.
	 * <ul>
	 *	<li> https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts </li>
	 * </ul>
	 * 
	 * <code>
	class MyServer extends Something implements IServer
	{ 
		private server_base: IServerBase = new WebServerBase(this); 
	
		public addClient(driver: IClientDriver): void
		{
			// WHAT TO DO WHEN A CLIENT HAS CONNECTED
		} 
	
		public open(port: number): void
		{
			this.server_base.open();
		} 
		public close(): void
		{
			this.server_base.close();
		} 
	}
	 * </code>
	 * 
	 * @see {@link IServer}
	 * @handbook <a href="https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase"
	 *			 target="_blank"> Basic Components - IServerBase </a>
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
	 * {@link ServerBase} is a substitute class who subrogates {@link Server}'s responsibility.
	 * 
	 * The easiest way to defning a server class following normal protocol of Samchon Framework is to extending
	 * {@link Server}. However, it is impossible (that is, if the class is already extending another class), you can
	 * instead implement the {@link IServer} interface, create a {@link ServerBase} member, and write simple hooks 
	 * to route calls into the aggregated {@link ServerBase}.
	 * 
	 * {@link ExternalClientArray} can be a good example using this {@link IServerBase}.
	 * <ul>
	 *	<li> https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts </li>
	 * </ul>
	 * 
	 * <code>
	class MyServer extends Something implements IServer
	{
		private server_base: ServerBase = new ServerBase(this);

		public addClient(driver: ClientDriver): void
		{
			// WHAT TO DO WHEN A CLIENT HAS CONNECTED
		}

		public open(port: number): void
		{
			this.server_base.open();
		}
		public close(): void
		{
			this.server_base.close();
		}
	}
	 * </code>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class ServerBase
		extends Server
		implements IServerBase
	{
		private target_: IServer;

		public constructor(target: IServer)
		{
			super();
			this.target_ = target;
		}

		public addClient(driver: IClientDriver): void
		{
			this.target_.addClient(driver);
		}
	}
}

namespace samchon.protocol
{
	/**
	 * A substitute {@link WebServer}.
	 * 
	 * {@link WebServerBase} is a substitute class who subrogates {@link WebServer}'s responsibility.
	 * 
	 * The easiest way to defning a server class following normal protocol of Samchon Framework is to extending
	 * {@link WebServer}. However, it is impossible (that is, if the class is already extending another class), you can
	 * instead implement the {@link IServer} interface, create a {@link WebServerBase} member, and write simple hooks to
	 * route calls into the aggregated {@link WebServerBase}.
	 * 
	 * {@link ExternalClientArray} can be a good example using this {@link IServerBase}.
	 * <ul>
	 *	<li> https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts </li>
	 * </ul>
	 * 
	 * <code>
	class MyServer extends Something implements IServer
	{
		private server_base: WebServerBase = new WebServerBase(this);

		public addClient(driver: WebClientDriver): void
		{
			// WHAT TO DO WHEN A CLIENT HAS CONNECTED
		}

		public open(port: number): void
		{
			this.server_base.open();
		}
		public close(): void
		{
			this.server_base.close();
		}
	}
	 * </code>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class WebServerBase
		extends WebServer
		implements IServerBase
	{
		private target_: IServer;

		public constructor(target: IServer)
		{
			super();
			this.target_ = target;
		}

		public addClient(driver: IClientDriver): void
		{
			this.target_.addClient(driver);
		}
	}
}

namespace samchon.protocol
{
	/**
	 * A substitute {@link SharedWorkerServer}.
	 * 
	 * {@link SharedWorkerServerBase} is a substitute class who subrogates {@link SharedWorkerServer}'s 
	 * responsibility.
	 * 
	 * The easiest way to defning a server class following normal protocol of Samchon Framework is to extending
	 * {@link SharedWorkerServer}. However, it is impossible (that is, if the class is already extending another class), 
	 * you can instead implement the {@link IServer} interface, create a {@link SharedWorkerServerBase} member, and write 
	 * simple hooks to route calls into the aggregated {@link SharedWorkerServerBase}.
	 * 
	 * {@link ExternalClientArray} can be a good example using this {@link IServerBase}.
	 * <ul>
	 *	<li> https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts </li>
	 * </ul>
	 * 
	 * <code>
	class MyServer extends Something implements IServer
	{
		private server_base: SharedWorkerServerBase = new SharedWorkerServerBase(this);

		public addClient(driver: SharedWorkerClientDriver): void
		{
			// WHAT TO DO WHEN A CLIENT HAS CONNECTED
		}

		public open(port: number): void
		{
			this.server_base.open();
		}
		public close(): void
		{
			this.server_base.close();
		}
	}
	 * </code>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class SharedWorkerServerBase
		extends SharedWorkerServer
		implements IServerBase
	{
		private target_: IServer;

		public constructor(target: IServer)
		{
			super();
			this.target_ = target;
		}

		public addClient(driver: IClientDriver): void
		{
			this.target_.addClient(driver);
		}
	}
}