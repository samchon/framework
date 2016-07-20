/// <reference path="../API.ts" />

/// <reference path="Server.ts" />

namespace samchon.protocol
{
	/**
	 * <p> An interface for substitute server classes. </p>
	 * 
	 * <p> {@link IServerBase} is an interface for substitue server classes who subrogate server's role. </p>
	 * 
	 * <p> The easiest way to defining a server class is to extending one of them, who are derived from the 
	 * {@link IServer}. </p>
	 * 
	 * <ul>
	 *	<li> {@link NormalServer} </li>
	 *	<li> {@link WebServer} </li>
	 *	<li> {@link SharedWorkerServer} </li>
	 * </ul>
	 * 
	 * <p> However, it is impossible (that is, if the class is already extending another class), you can instead implement
	 * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into the 
	 * aggregated {@link IServerBase}. </p>
	 * 
	 * <p> {@link ExternalClientArray} can be a good example using this {@link IServerBase}. </p>
	 * <ul>
	 *	<li>https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts</li>
	 * </ul>
	 * 
	 * <code>
	class MyServer extends Something implements IServer
	{
		private server_base: IServerBase = new WebServerBase(this);

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
	export interface IServerBase extends IServer
	{
	}
}

namespace samchon.protocol
{
	/**
	 * <p> A substitute {@link NormalServer}. </p>
	 * 
	 * <p> {@link NormalServerBase} is a substitute class who subrogates {@link NormalServer}'s responsibility. </p>
	 * 
	 * <p> The easiest way to defning a server class following normal protocol of Samchon Framework is to extending
	 * {@link NormalServer}. However, it is impossible (that is, if the class is already extending another class), you can
	 * instead implement the {@link IServer} interface, create a {@link NormalServerBase} member, and write simple hooks 
	 * to route calls into the aggregated {@link NormalServerBase}. </p>
	 * 
	 * <p> {@link ExternalClientArray} can be a good example using this {@link IServerBase}. </p>
	 * <ul>
	 *	<li>https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts</li>
	 * </ul>
	 * 
	 * <code>
	class MyServer extends Something implements IServer
	{
		private server_base: NormalServerBase = new NormalServerBase(this);

		public addClient(driver: NormalClientDriver): void
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
	export class NormalServerBase
		extends NormalServer
		implements IServerBase
	{
		private target: IServer;

		public constructor(target: IServer)
		{
			super();
			this.target = target;
		}

		public addClient(driver: IClientDriver): void
		{
			this.target.addClient(driver);
		}
	}
}

namespace samchon.protocol
{
	/**
	 * <p> A substitute {@link WebServer}. </p>
	 * 
	 * <p> {@link WebServerBase} is a substitute class who subrogates {@link WebServer}'s responsibility. </p>
	 * 
	 * <p> The easiest way to defning a server class following normal protocol of Samchon Framework is to extending
	 * {@link WebServer}. However, it is impossible (that is, if the class is already extending another class), you can
	 * instead implement the {@link IServer} interface, create a {@link WebServerBase} member, and write simple hooks to
	 * route calls into the aggregated {@link WebServerBase}. </p>
	 * 
	 * <p> {@link ExternalClientArray} can be a good example using this {@link IServerBase}. </p>
	 * <ul>
	 *	<li>https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts</li>
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
		private target: IServer;

		public constructor(target: IServer)
		{
			super();
			this.target = target;
		}

		public addClient(driver: IClientDriver): void
		{
			this.target.addClient(driver);
		}
	}
}

namespace samchon.protocol
{
	/**
	 * <p> A substitute {@link SharedWorkerServer}. </p>
	 * 
	 * <p> {@link SharedWorkerServerBase} is a substitute class who subrogates {@link SharedWorkerServer}'s 
	 * responsibility. </p>
	 * 
	 * <p> The easiest way to defning a server class following normal protocol of Samchon Framework is to extending
	 * {@link SharedWorkerServer}. However, it is impossible (that is, if the class is already extending another class), 
	 * you can instead implement the {@link IServer} interface, create a {@link SharedWorkerServerBase} member, and write 
	 * simple hooks to route calls into the aggregated {@link SharedWorkerServerBase}. </p>
	 * 
	 * <p> {@link ExternalClientArray} can be a good example using this {@link IServerBase}. </p>
	 * <ul>
	 *	<li>https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts</li>
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
		private target: IServer;

		public constructor(target: IServer)
		{
			super();
			this.target = target;
		}

		public addClient(driver: IClientDriver): void
		{
			this.target.addClient(driver);
		}
	}
}