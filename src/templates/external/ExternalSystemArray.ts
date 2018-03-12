import * as std from "tstl";
import * as collections from "../../collections";

import { EntityDequeCollection } from "../../protocol/entity/EntityCollection";
import { ExternalSystemRole } from "./ExternalSystemRole";
import { ExternalSystem } from "./ExternalSystem";

import { IProtocol } from "../../protocol/invoke/IProtocol";
import { Invoke } from "../../protocol/invoke/Invoke";

/**
 * An array and manager of {@link ExternalSystem external system drivers}.
 * 
 * The {@link ExternalSystemArray} is an abstract class containing and managing external system drivers, 
 * {@link ExternalSystem} objects. Within framewokr of network, {@link ExternalSystemArray} represents your system 
 * and children {@link ExternalSystem} objects represent remote, external systems connected with your system. 
 * With this {@link ExternalSystemArray}, you can manage multiple external systems as a group. 
 * 
 * You can specify this {@link ExternalSystemArray} class to be *a server accepting external clients* or 
 * *a client connecting to external servers*. Even both of them is also possible. 
 * 
 * - {@link ExternalClientArray}: A server accepting {@link ExternalSystem external clients}.
 * - {@link ExternalServerArray}: A client connecting to {@link ExternalServer external servers}.
 * - {@link ExternalServerClientArray}: Both of them. Accepts {@link ExternalSystem external clients} and connects to 
 *   {@link ExternalServer external servers} at the same time.
 * 
 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png" 
 *		  target="_blank">
 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png" 
 *		 style="max-width: 100%" />
 * </a>
 * 
 * #### Proxy Pattern
 * The {@link ExternalSystemArray} class can use *Proxy Pattern*. In framework within user, which
 * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
 * important. Only interested in user's perspective is *which can be done*.
 * 
 * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
 * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
 * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
 * 
 * <ul>
 *	<li>
 *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
 *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
 *	</li>
 *	<li>
 *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
 *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
 *		external system.
 *	</li>
 *	<li> Those strategy is called *Proxy Pattern*. </li>
 * </ul>
 * 
 * @handbook [Templates - External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External_System)
 * @author Jeongho Nam <http://samchon.org>
 */
export abstract class ExternalSystemArray<System extends ExternalSystem>
	extends EntityDequeCollection<System>
	implements IProtocol
{
	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	/**
	 * Default Constructor.
	 */
	public constructor()
	{
		super();
		
		this.addEventListener("erase", this._Handle_system_erase);
	}

	/**
	 * @hidden
	 */
	private _Handle_system_erase(event: collections.Deque.Event<System>): void
	{
		for (let it = event.first; !it.equals(event.last); it = it.next())
			it.value["destructor"]();
	}

	/* ---------------------------------------------------------
		ACCESSORS
	--------------------------------------------------------- */
	/**
	 * Test whether the role exists.
	 * 
	 * @param name Name, identifier of target {@link ExternalSystemRole role}.
	 * 
	 * @return Whether the role has or not.
	 */
	public hasRole(name: string): boolean
	{
		for (let i: number = 0; i < this.size(); i++)
			for (let j: number = 0; j < this.at(i).size(); j++)
				if (this.at(i).at(j).key() == name)
					return true;

		return false;
	}

	/**
	 * Get a role.
	 * 
	 * @param name Name, identifier of target {@link ExternalSystemRole role}.
	 * 
	 * @return The specified role.
	 */
	public getRole(name: string): ExternalSystemRole
	{
		for (let i: number = 0; i < this.size(); i++)
			for (let j: number = 0; j < this.at(i).size(); j++)
				if (this.at(i).at(j).key() == name)
					return this.at(i).at(j);

		throw new std.OutOfRange("No role with such name.");
	}

	/* ---------------------------------------------------------
		MESSAGE CHAIN
	--------------------------------------------------------- */
	/**
	 * Send an {@link Invoke} message.
	 * 
	 * @param invoke An {@link Invoke} message to send.
	 */
	public sendData(invoke: Invoke): void
	{
		for (let i: number = 0; i < this.size(); i++)
			this.at(i).sendData(invoke);
	}

	/**
	 * Handle an {@Invoke} message have received.
	 * 
	 * @param invoke An {@link Invoke} message have received.
	 */
	public abstract replyData(invoke: Invoke): void;

	/* ---------------------------------------------------------
		EXPORTERS
	--------------------------------------------------------- */
	/**
	 * Tag name of the {@link ExternalSytemArray} in {@link XML}.
	 *
	 * @return *systemArray*.
	 */
	public TAG(): string
	{
		return "systemArray";
	}

	/**
	 * Tag name of {@link ExternalSystem children elements} belonged to the {@link ExternalSytemArray} in {@link XML}.
	 * 
	 * @return *system*.
	 */
	public CHILD_TAG(): string
	{
		return "system";
	}
}