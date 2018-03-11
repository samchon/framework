/// <reference path="../../APi.ts" />

namespace samchon.templates.service
{
	/**
	 * A driver of remote client.
	 * 
	 * The {@link Client} is an abstract class representing and interacting with a remote client. It deals the network 
	 * communication with the remote client and shifts {@link Invoke} message to related {@link User} and {@link Service} 
	 * objects.
	 * 
	 * Extends this {@link Client} class and override the {@link createService} method, a factory method creating a child
	 * {@link Service} object. Note that, {@link Client} represents a remote client, not *an user*, a specific *web page* 
	 * or *service*. Do not define logics about user or account information. It must be declared in the parent 
	 * {@link User} class. Also, don't define processes of a specific a web page or service. Defines them in the child
	 * {@link Service} class.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_cloud_service.png" target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_cloud_service.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Templates - Cloud Service](https://github.com/samchon/framework/wiki/TypeScript-Templates-Cloud_Service)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class Client implements protocol.IProtocol
	{
		/**
		 * @hidden
		 */
		private user_: User;
		
		/**
		 * @hidden
		 */
		private no_: number;

		/**
		 * @hidden
		 */
		private communicator_: protocol.WebClientDriver;
		
		/**
		 * @hidden
		 */
		private service_: Service;

		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Construct from parent {@link User} and communicator.
		 * 
		 * @param user Parent {@link User} object.
		 * @param driver Communicator with remote client.
		 */
		public constructor(user: User, driver: protocol.WebClientDriver)
		{
			this.user_ = user;
			this.no_ = ++user["sequence_"];

			// ENROLL COMMUNICATOR
			this.communicator_ = driver;
			this.communicator_.listen(this);
			
			// CREATE SERVICE DIRECLTY
			this.service_ = this.createService(driver.getPath());
		}

		/**
		 * Default Destructor.
		 * 
		 * This {@link destructor destructor()} method is called when the {@link Client} object is destructed and this
		 * {@link Client} object is destructed when connection with the remote client is closed or this {@link Client} 
		 * object is {@link User.erase erased} from its parent {@link User} object.
		 * 
		 * Note that, don't call this {@link destructor destructor()} method by yourself. It must be called automatically
		 * by those *destruction* cases. Also, if your derived {@link Client} class has something to do on the 
		 * *destruction*, then overrides this {@link destructor destructor()} method and defines the something to do. 
		 * Overriding this {@link destructor destructor()}, don't forget to calling ```super.destructor();``` on tail.
		 *
		 * ```typescript
		 * class MyUser extends protocol.service.Client
		 * {
		 *     protected destructor(): void
		 *     {
		 *         // DO SOMETHING
		 *         this.do_something();
		 *
		 *         // CALL SUPER.DESTRUCTOR() ON TAIL. DON'T FORGET THIS
		 *         super.destructor();
		 *     }
		 * }
		 * ```
		 */
		protected destructor(): void
		{
			if (this.service_ != null)
				this.service_["destructor"]();
		}

		/**
		 * Factory method creating {@link Service} object.
		 * 
		 * @param path Requested path.
		 * @return A newly created {@link Service} object or ```null```.
		 */
		protected abstract createService(path: string): Service;

		/**
		 * Close connection.
		 */
		public close(): void
		{
			this.user_.erase(this.no_);
		}

		/* ------------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------------ */
		/**
		 * Get parent {@link User} object.
		 * 
		 * Get the parent {@link User} object, who is groupping {@link Client} objects with same session id.
		 * 
		 * @return The parent {@link User} object.
		 */
		public getUser(): User
		{
			return this.user_;
		}

		/**
		 * Get child {@link Service} object.
		 * 
		 * @return The child {@link Service} object.
		 */
		public getService(): Service
		{
			return this.service_;
		}

		/**
		 * Get sequence number. 
		 * 
		 * Get sequence number of this {@link Client} object in the parent {@link User} object. This sequence number also
		 * be a *key* in the parent {@link User} object, who extended the ```std.HashMap<number, Client>```.
		 *
		 * @return Sequence number.
		 */
		public getNo(): number
		{
			return this.no_;
		}
		
		/**
		 * Change related {@link Service} object.
		 * 
		 * @param path Requested, identifier path.
		 */
		protected changeService(path: string): void;

		/**
		 * Change {@link Service} to another.
		 * 
		 * @param service {@link service} object to newly assigned.
		 */
		protected changeService(service: Service): void;

		protected changeService(arg: Service | string): void
		{
			if (this.service_ != null)
				this.service_["destructor"]();

			if (arg instanceof Service)
				this.service_ = arg;
			else
				this.service_ = this.createService(arg);
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		/**
		 * Send an {@link Invoke} message. 
		 * 
		 * Sends an {@link Invoke} message to remote client.
		 * 
		 * @param invoke An {@link Invoke} messgae to send to remote client.
		 */
		public sendData(invoke: protocol.Invoke): void
		{
			this.communicator_.sendData(invoke);
		}
		
		/**
		 * Handle a replied {@link Invoke} message.
		 * 
		 * The default {@link Client.replyData Client.replyData()} shifts chain to its parent {@link User} and belonged 
		 * {@link Service} objects, by calling the the {@link User.replyData User.replyData()} and 
		 * {@link Service.replyData Service.replyData()} methods.
		 * 
		 * Note that, {@link Client} represents a remote client, not *an user*, a specific *web page* or *service*. Do not 
		 * define logics about user or account information. It must be declared in the parent {@link User} class. Also, 
		 * don't define processes of a specific a web page or service. Defines them in the child {@link Service} class.
		 * 
		 * ```typescript
		 * class protocol.service.Client
		 * {
		 *     public replyData(invoke: protocol.Invoke): void
		 *     {
		 *         // SHIFT TO PARENT USER
		 *         // THE PARENT USER ALSO MAY SHIFT TO ITS PARENT SERVER
		 *         this.getUser().replyData(invoke);
		 *         
		 *         // SHIFT TO BELOGED SERVICE
		 *         if (this.getService() != null)
		 *             this.getService().replyData(invoke);
		 *     }
		 * }
		 * 
		 * class MyClient extends protocol.service.Client
		 * {
		 *     public replyData(invoke: protocol.Invoke): void
		 *     {
		 *         if (invoke.getListener() == "do_something_in_client_level")
		 *             this.do_something_in_client_level();
		 *         else
		 *             super.replyData(invoke);
		 *     }
		 * }
		 * ```
		 * 
		 * @param invoke An {@link Invoke invoke} message to be handled in {@link Client} level.
		 */
		public replyData(invoke: protocol.Invoke): void
		{
			// SHIFT CHAIN TO USER
			this.user_.replyData(invoke);
			
			// AND SERVICE
			if (this.service_ != null) 
				this.service_.replyData(invoke);
		}
	}
}