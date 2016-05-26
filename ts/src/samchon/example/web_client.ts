namespace samchon.example
{
    class WebClient
        implements protocol.IProtocol
    {
		private connector: protocol.ServerConnector;

		public constructor()
		{
			let this_ = this;

            this.connector = new protocol.ServerConnector(this);
            this.connector.onopen = 
				function (event: Event): void
				{
					console.log("connected");

					this_.sendData(new protocol.Invoke("sendMessage", "I am JavaScript Client", 3, 7));
				}
				this.connector.connect("127.0.0.1", 37888);
		}

		private rotate_interval(): void
		{
			console.log("send message");

			this.sendData(new protocol.Invoke("sendMessage", "I am JavaScript Client", 3, 7));
		}

        public sendData(invoke: protocol.Invoke): void
        {
			console.log("sendData: #" + invoke.toXML().toString().length);

            this.connector.sendData(invoke);
        }

        public replyData(invoke: protocol.Invoke): void
        {
            console.log("message from cpp:", invoke.toXML().toString());
        }
    }

    export function test_web_client(): void
    {
        let webClient = new WebClient();
    }
}