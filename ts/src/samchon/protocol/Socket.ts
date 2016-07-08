/// <reference path="../API.ts" />

namespace samchon.protocol
{
	//export namespace socket
	//{
	//	export type socket = NodeJS.net.Socket;
	//	export type server = NodeJS.net.Server;
	//	export type http_server = NodeJS.net.Server;
	//}

	//export namespace websocket
	//{
	//	export type connection = __websocket.connection;
	//	export type request = __websocket.request;
	//	export type IMessage = __websocket.IMessage;
	//	export type ICookie = __websocket.ICookie;
	//	export type client = __websocket.client;
	//}

	export namespace socket
	{
		export type socket = any;
		export type server = any;
		export type net = any;
		export type http = any;
		export type http_server = any;
	}

	export namespace websocket
	{
		export type connection = any;
		export type request = any;
		export type IMessage = any;
		export type ICookie = any;
		export type client = any;
	}
}