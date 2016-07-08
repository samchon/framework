/// <reference path="../API.ts" />

/// <reference path="../protocol/WebCommunicator.ts" />

namespace samchon.example
{
	export function test_websocket(): void
	{
		if (is_node() == true)
			new TestWebServer();
		
		new TestWebConnector();
	}

	class TestWebServer extends protocol.WebServer
	{
		public constructor()
		{
			super();

			this.open(11711);
		}

		protected addClient(driver: protocol.WebClientDriver): void
		{
			console.log("A client has connected.");

			let client: TestWebClientDriver = new TestWebClientDriver(driver);
		}
	}

	class TestWebClientDriver implements protocol.IProtocol
	{
		private driver: protocol.WebClientDriver;

		public constructor(driver: protocol.WebClientDriver)
		{
			this.driver = driver;
			this.driver.listen(this);
		}

		public sendData(invoke: protocol.Invoke): void
		{
			this.driver.sendData(invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			console.log(invoke.toXML().toString());
			this.sendData(invoke);
		}
	}

	class TestWebConnector implements protocol.IProtocol
	{
		private connector: protocol.WebServerConnector;

		public constructor()
		{
			this.connector = new protocol.WebServerConnector(this);
			this.connector.onopen = this.handle_open.bind(this);

			this.connector.connect("127.0.0.1", 11711, "my_path");
		}

		private handle_open(event: Event): void
		{
			let str: string = "";
			let invoke: protocol.Invoke = new protocol.Invoke("sendMessage", 99999, "I am a JavaScript Client", 3, 7, str);

			this.sendData(invoke);
		}

		public sendData(invoke: protocol.Invoke): void
		{
			this.connector.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			console.log(invoke.toXML().toString());
		}
	}
}