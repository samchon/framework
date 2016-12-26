/// <reference path="../../../API.ts" />

// An abstract, basic class for communicators.
//
// {@link CommunicatorBase} is an abstract class implemented from the {@link ICommunicator }. Mechanism of converting
// raw data to {@link Invoke } messag has realized in this abstract class. Type of this {@link CommunicatorBase } class 
// is specified to as below following which protocol is used.
// 
// - {@link Communicator}: Samchon Framework's own protocool.
// - {@link WebCommunicator}: Web - socket protocol
// - {@link SharedWorkerCommunicator}: SharedWorker's message protocol.
//
// @author Jeongho Nam <http://samchon.org>

namespace samchon.protocol
{
    /**
     * @hidden
     */
	export abstract class _CommunicatorBase 
		implements ICommunicator
	{
		// BASIC MEMBERS
		/**
		 * @hidden
		 */
		protected listener_: IProtocol;

		/**
		 * @inheritdoc
		 */
		public onClose: Function;

		/**
		 * @hidden
		 */
		protected connected_: boolean;

		// BINARY INVOKE MEMBERS
		/**
		 * @hidden
		 */
		private binary_invoke_: Invoke;

		/**
		 * @hidden
		 */
		private binary_parameters_: std.Queue<InvokeParameter>;

		/**
		 * @hidden
		 */
		private unhandled_invokes_: std.Deque<Invoke>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Construct from *listener*.
		 * 
		 * @param listener An {@link IProtocol} object to listen {@link Invoke} messages.
		 */
		public constructor(listener: IProtocol);

		public constructor(listener: IProtocol = null)
		{
			// BASIC MEMBERS
			this.listener_ = listener;
			this.onClose = null;

			// BINARY INVOKE MEMBERS
			this.binary_invoke_ = null;
			this.binary_parameters_ = new std.Queue<InvokeParameter>();

			this.unhandled_invokes_ = new std.Deque<Invoke>();
		}

		/**
		 * @inheritdoc
		 */
		public abstract close(): void;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public isConnected(): boolean
		{
			return this.connected_;
		}

		/**
		 * @hidden
		 */
		protected _Is_binary_invoke(): boolean
		{
			return (this.binary_invoke_ != null);
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE GENERATOR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public abstract sendData(invoke: Invoke): void;
		
		/**
		 * @inheritdoc
		 */
		public replyData(invoke: Invoke): void
		{
			if (this.listener_ == null)
				this.unhandled_invokes_.push_back(invoke);
			else
			{
				if ((this.listener_ as any)["_Reply_data"] instanceof Function)
					(this.listener_ as any)["_Reply_data"](invoke);
				else
					this.listener_.replyData(invoke);
			}
		}

		/**
		 * @hidden
		 */
		protected _Handle_string(str: string): void
		{
			// REPLIED DATA IS CLEARY BE AN INVOKE MESSAGE
			let invoke: Invoke = new Invoke();
			invoke.construct(new library.XML(str));

			for (let i: number = 0; i < invoke.size(); i++)
			{
				let parameter: InvokeParameter = invoke.at(i);
				if (parameter.getType() != "ByteArray")
					continue;

				if (this.binary_invoke_ == null)
					this.binary_invoke_ = invoke; // INIT BINARY_INVOKE
				this.binary_parameters_.push(parameter); // ENROLL TO PARAMETERS' QUEUE
			}

			// NO BINARY, THEN REPLY DIRECTLY
			if (this.binary_invoke_ == null)
				this.replyData(invoke);
		}

		/**
		 * @hidden
		 */
		protected _Handle_binary(binary: Uint8Array): void
		{
			// FETCH A PARAMETER
			let parameter: InvokeParameter = this.binary_parameters_.front();
			{
				parameter.setValue(binary);
			}
			this.binary_parameters_.pop();

			if (this.binary_parameters_.empty() == true)
			{
				// NO BINARY PARAMETER LEFT,
				let invoke = this.binary_invoke_;
				this.binary_invoke_ = null;

				// THEN REPLY
				this.replyData(invoke);
			}
		}
	}
}