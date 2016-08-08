/// <reference path="../API.ts" />

namespace samchon.protocol
{
	/**
	 * <p> An interface for {@link Invoke} message chain. </p>
	 * 
	 * <p> {@link IProtocol} is an interface for {@link Invoke} message, which is standard message of network I/O in 
	 * <i>Samchon Framework</i>, chain. The {@link IProtocol} interface is used to network drivers and some classes 
	 * which are in a relationship of <i>Chain of Responsibility Pattern</i> with those network drivers. </p>
	 * 
	 * <p> Implements {@link IProtocol} if the class sends and handles {@link Invoke} message. Looking around source 
	 * codes of <i>Samchon Framework</i>, especially <i>System Templates</i>, you can find out that all the classes and 
	 * modules handling {@link Invoke} messages are always implementing this {@link IProtocol} . Yes, {@link IProtocol}, 
	 * this is the main role you've to follow in this <i>Samchon Framework</i>. </p>
	 * 
	 * <p> <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a> </p>
	 * 
	 * 
	 * <h2> Utilization Case </h2>
	 * <p> Below pseudo code and class diagram represents {@link service Service Module}, who can build a cloud server. 
	 * All the classes in the pseudo code are implementing the {@link IProtocol} because all of them are handling
	 * {@link Invoke} message. </p>
	 * 
	 * <ul>
	 *	<li> Server: Represents a server literally </li>
	 *	<li> User: Represents an user being identified by its session id. User contains multiple Client objects. </li>
	 *	<ul>
	 *		<li> In browser, an user can open multiple windows.
	 *		<ul>
	 *			<li> User: A browser (like IE, Chrome and Safari).
	 *			<li> Client: An internet browser window
	 *		</ul>
	 *		</li>
	 *	</ul>
	 *	<li> Client: Represents a browser window and it takes role of network communication with it. </li>
	 *	<li> Service: Represents a service, domain logic. </li>
	 * </ul>
	 * 
	 * <p> <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_service.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_service.png"
	 *		 style="max-width: 100%" />
	 * </a> </p>
	 *
	 * <code>
	/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
	/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

	// IMPORTS
	import std = require("typescript-stl");
	import samchon = require("samchon-framework");

	// SHORTCUTS
	import library = samchon.library;
	import collection = samchon.collection;
	import protocol = samchon.protocol;

	namespace service
	{
		export class Server extends protocol.WebServer implements IProtocol
		{
			// SERVER HAS MULTIPLE USER OBJECTS
			private session_map: std.HashMap<string, User>;

			//------------------------
			// MESSAGE CHAIN
			//------------------------
			public sendData(invoke: protocol.Invoke): void
			{
				// SEND INVOKE MESSAGE TO ALL USER OBJECTS
				for (let it = this.session_map.begin(); !it.equal_to(this.session_map.end()); it = it.next())
					it.second.sendData(invoke);
			}
			public replyData(invoke: protocol.Invoke): void
			{
				invoke.apply(this); // HANDLE INVOKE MESSAGE BY ITSELF
			}
		}

		export class User extends
			collection.HashMapCollection<number, Client> // USER HAS MULTIPLE CLIENT OBJECTS
			implements IProtocol
		{
			private server: Server; // USER REFRES SERVER

			//------------------------
			// MESSAGE CHAIN
			//------------------------
			public sendData(invoke: protocol.Invoke): void
			{
				// SEND INVOKE MESSAGE TO ALL CLIENT OBJECTS
				for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
					it.second.sendData(invoke);
			}
			public replyData(invoke: protocol.Invoke): void
			{
				invoke.apply(this); // HANDLE INOVKE MESSAGE BY ITSELF
				this.server.replyData(invoke); // OR VIA SERVER
			}
		}

		export class Client implements IProtocol
		{
			private user: User; // CLIENT REFERS USER
			private service: Service; // CLIENT HAS A SERVICE OBJECT

			private driver: WebClientDriver;

			//------------------------
			// MESSAGE CHAIN
			//------------------------
			public sendData(invoke: protocol.Invoke): void
			{
				// SEND INVOKE MESSAGE VIA driver: WebClientDriver
				this.driver.sendData(invoke);
			}
			public replyData(invoke: protocol.Invoke): void
			{
				invoke.apply(this); // HANDLE INOVKE MEESAGE BY ITSELF
				this.user.replyData(invoke); // OR VIA USER

				if (this.service != null) // OR VIA SERVICE
					this.service.replyData(invoke);
			}
		}

		export class Service implements IProtocol
		{
			private client: Client; // SERVICE REFRES CLIENT

			//------------------------
			// MESSAGE CHAIN
			//------------------------
			public sendData(invoke: protocol.Invoke): void
			{
				// SEND INVOKE MESSAGE VIA CLIENT
				return this.client.sendData(invoke);
			}
			public replyData(invoke: protocol.Invoke): void
			{
				invoke.apply(this); // HANDLE INVOKE MESSAGE BY ITSELF
			}
		}
	}
	 * </code> 
	 *
	 * 
	 * <h2> Basic Components </h2>
	 * <h4> What Basic Components are </h4>
	 * <p> <b>Basic Components</b> are the smallest unit of network communication in this <i>Samchon Framework</i>. With
	 * <b>Basic Components</b>, you can construct any type of network system, even how the network system is enormously
	 * scaled and complicated, by just combinating the <b>Basic Components</b>. </p>
	 * 
	 * <p> All the system templates in this framework are also being implemented by utilization of the 
	 * <b>Basic Compoonents</b>. </p>
	 * 
	 * <ul> 
	 *	<li> {@link service Service} </il>
	 *	<li> {@link external External System} </il>
	 *	<li> {@link parallel Parallel System} </il>
	 *	<li> {@link distributed Distributed System} </il>
	 * </ul>
	 *
	 * <p> Note that, whatever the network system what you've to construct is, just concentrate on role of each system 
	 * and attach matched <b>Basic Components</b> to the role, within framework of the <b>Object-Oriented Design</b>. 
	 * Then construction of the network system will be much easier. </p>
	 * 
	 * <ul>
	 *	<li> A system is a server, then use {@link IServer} or {@link IServerBase}. </li>
	 *	<li> A server wants to handle a client has connected, then use {@link IClientDriver}. </li>
	 *	<li> A system is a client connecting to an external server, then use {@link IServerConnector}. </li>
	 *	<li> </li>
	 * </ul>
	 * 
	 * <h4> Example - System Templates </h4>
	 * <p> Learning and understanding <i>Basic Components</i> of Samchon Framework, reading source codes and design of
	 * <b>System Templates</b>' modules will be very helpful. </p>
	 * 
	 * <table>
	 *	<tr>
	 *		<th> Name </th>
	 *		<th> Source </th>
	 *		<th> API Documents </th>
	 *	</tr>
	 *	<tr>
	 *		<td> Cloud Service </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/service" 
	 *				target="_blank"> protocol/service </a> </td>
	 *		<td> {@link protocol.service} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> External System </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/external"
	 *				target="_blank"> protocol/external </a> </td>
	 *		<td> {@link protocol.external} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> Parallel System </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/parallel"
	 *				target="_blank"> protocol/parallel </a> </td>
	 *		<td> {@link protocol.parallel} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> Distributed System </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/distributed"
	 *				target="_blank"> protocol/distributed </a> </td>
	 *		<td> {@link protocol.distributed} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> Slave System </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/slave"
	 *				target="_blank"> protocol/slave </a> </td>
	 *		<td> {@link protocol.slave} </td>
	 *	</tr>
	 * </table>
	 * 
	 * <h4> Example - Projects </h4>
	 * <ul>
	 *	<li> 
	 *		<a href="https://github.com/samchon/framework/wiki/Examples-Calculator" target="_blank"> Calculator </a> 
	 *	</li>
	 *	<li>
	 *		<a href="https://github.com/samchon/framework/wiki/Examples-Chatting" target="_blank"> Chatting </a>
	 *	</li>
	 *	<li>
	 *		<a href="https://github.com/samchon/framework/wiki/Examples-Interaction" target="_blank"> Interaction </a>
	 *	</li>
	 * </ul>
	 *
	 * @see {@link Invoke}
	 * @handbook <a href="https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iprotocol"
	 *			 target="_blank"> Basic Components - IProtocol </a>
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IProtocol
	{
		/**
		 * <p> Sending message. </p>
		 * <p> Sends message to related system or shifts the responsibility to chain. </p>
		 *
		 * @param invoke Invoke message to send
		 */
		replyData(invoke: Invoke): void;

		/**
		 * <p> Handling replied message. </p>
		 * <p> Handles replied message or shifts the responsibility to chain. </p>
		 *
		 * @param invoke An {@link Invoke} message has received.
		 */
		sendData(invoke: Invoke): void;
	}
}