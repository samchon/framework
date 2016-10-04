/// <reference path="../../API.ts" />

namespace samchon.templates.service
{
	/**
	 * A service.
	 * 
	 * The {@link Service} is an abstract class who represents a service, that is providing functions a specific page.
	 * 
	 * Extends the {@link Service} class and defines its own service, which to be provided for the specific weg page,
	 * by overriding the {@link replyData replyData()} method. Note that, the service, functions for the specific page 
	 * should be defined in this {@link Service} class, not its parent {@link Client} class who represents a remote client 
	 * and takes communication responsibility.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_cloud_service.png" target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_cloud_service.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Templates - Cloud Service](https://github.com/samchon/framework/wiki/TypeScript-Templates-Cloud_Service)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class Service 
		implements protocol.IProtocol
	{
		/**
		 * @hidden
		 */
		private client_: Client;
		
		/**
		 * @hidden
		 */
		private path_: string;

		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Construct from parent {@link Client} and requested path.
		 * 
		 * @param client Driver of remote client.
		 * @param path Requested path that identifies this {@link Service}.
		 */
		public constructor(client: Client, path: string)
		{
			this.client_ = client;
			this.path_ = path;
		}

		/**
		 * Default Destructor.
		 * 
		 * This {@link destructor destructor()} method is call when the {@link Service} object is destructed and the 
		 * {@link Service} object is destructed when its parent {@link Client} object has 
		 * {@link Client.destructor destructed} or the {@link Client} object {@link Client.changeService changed} its  
		 * child {@link Service service} object to another one.
		 * 
		 * Note that, don't call this {@link destructor destructor()} method by yourself. It must be called automatically
		 * by those *destruction* cases. Also, if your derived {@link Service} class has something to do on the
		 * *destruction*, then overrides this {@link destructor destructor()} method and defines the something to do.
		 */
		protected destructor(): void
		{
		}
		
		/* ------------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------------ */
		/**
		 * Get client.
		 */
		public getClient(): Client
		{
			return this.client_;
		}

		/**
		 * Get requested path.
		 */
		public getPath(): string
		{
			return this.path_;
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		/**
		 * Send an {@link Invoke} message.
		 * 
		 * Sends an {@link Invoke} message to remote system through parent {@link Client} object ({@link Client.sendData}).
		 * 
		 * @param invoke An {@link Invoke} message to send to the remte system.
		 */
		public sendData(invoke: protocol.Invoke): void
		{
			return this.client_.sendData(invoke);
		}

		/**
		 * 
		 * @param invoke An {@link Invoke} message to be handled in this {@link Service} level.
		 */
		public abstract replyData(invoke: protocol.Invoke): void;
	}
}