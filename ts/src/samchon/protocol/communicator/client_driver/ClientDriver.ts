/// <reference path="../../../API.ts" />

/// <reference path="../communicator/Communicator.ts" />

namespace samchon.protocol
{
	/**
	 * Communicator with remote client.
	 * 
	 * {@link ClientDriver} is a class taking full charge of network communication with remote client who follows Samchon
	 * Framework's own protocol. This {@link ClientDriver} object is always created by {@link Server} class. When you got 
	 * this {@link ClientDriver} object from the {@link Server.addClient Server.addClient()}, then specify 
	 * {@link IProtocol listener} with the {@link ClientDriver.listen ClientDriver.listen()} method.
	 * 
	 * #### [Inherited] {@link IClientDriver}
	 * @copydoc IClientDriver
	 */
	export class ClientDriver
		extends Communicator
		implements IClientDriver
	{
		/**
		 * Construct from a socket.
		 */
		public constructor(socket: any)
		{
			super();

			this["socket_"] = socket as net.Socket;
			this.connected_ = true;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener_ = listener;
			
			this._Start_listen();
		}
	}
}