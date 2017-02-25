/// <reference path="../../../API.ts" />

/// <reference path="_CommunicatorBase.ts" />

namespace samchon.protocol
{
	/**
	 * A communicator following Web-socket protocol.
	 * 
	 * {@link WebCommunicator} is an abstract class following Web-socket protocol. This {@link WebCommunicator} class is
	 * specified to {@link WebServerConnector} and {@link WebClientDriver} whether the remote system is a server (that my
	 * system is connecting to) or a client (a client conneting to to my server).
	 * 
	 * Note that, one of this or remote system is web-browser based, then there's not any alternative choice. Web browser
	 * supports only Web-socket protocol. In that case, you've use this {@link WebCommunicator} class.
	 * 
	 * #### [Inherited] {@link ICommunicator}
	 * @copydoc ICommunicator
	 */
	export abstract class WebCommunicator
		extends _CommunicatorBase
	{
		// SOCKET MEMBER
		/**
		 * @hidden
		 */
		private connection_: websocket.connection = null;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super.constructor

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.connection_.close();
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE I/O
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void
		{
			this.connection_.sendUTF(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteArray")
					this.connection_.sendBytes(invoke.at(i).getValue());
		}

		/**
		 * @hidden
		 */
		private _Handle_message(message: websocket.IMessage)
		{
			// EXCEPTION HANDLING IS REQUIRED
			//	- BINARY_INVOKE EXISTS, BUT TEXT MESSAGE HAS COME
			//	- BINARY_INVOKE IS NOT, BUT BINARY MESSAGE HAS COME

			if (message.type == "utf8")
				this._Handle_string(message.utf8Data);
			else
				this._Handle_binary(message.binaryData);
		}

		/**
		 * @hidden
		 */
		protected _Handle_close(): void
		{
			this.connected_ = false;

			if (this.onClose != null)
				this.onClose();
		}
	}
}