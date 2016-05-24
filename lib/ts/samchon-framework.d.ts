declare namespace samchon.protocol {
    /**
     * <p> An entity, a standard data class. </p>
     *
     * <p> Entity is a class for standardization of expression method using on network I/O by XML. If
     * Invoke is a standard message protocol of Samchon Framework which must be kept, Entity is a
     * recommended semi-protocol of message for expressing a data class. Following the semi-protocol
     * Entity is not imposed but encouraged. </p>
     *
     * <p> As we could get advantages from standardization of message for network I/O with Invoke,
     * we can get additional advantage from standardizing expression method of data class with Entity.
     * We do not need to know a part of network communication. Thus, with the Entity, we can only
     * concentrate on entity's own logics and relationships between another entities. Entity does not
     * need to how network communications are being done. </p>
     *
     * <p> I say repeatedly. Expression method of Entity is recommended, but not imposed. It's a semi
     * protocol for network I/O but not a essential protocol must be kept. The expression method of
     * Entity, using on network I/O, is expressed by XML string. </p>
     *
     * <p> If your own network system has a critical performance issue on communication data class,
     * it would be better to using binary communication (with ByteArray).
     * Don't worry about the problem! Invoke also provides methods for binary data (ByteArray). </p>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class Entity implements IEntity {
        /**
         * <p> Default Constructor. </p>
         */
        constructor();
        construct(xml: library.XML): void;
        key(): any;
        abstract TAG(): string;
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class EntityArray<Ety extends IEntity> extends std.Vector<Ety> {
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * <p> Construct data of the Entity from an XML object. </p>
         *
         * <p> Constructs the EntityArray's own member variables only from the input XML object. </p>
         *
         * <p> Do not consider about constructing children Entity objects' data in EntityArray::construct().
         * Those children Entity objects' data will constructed by their own construct() method. Even insertion
         * of XML objects representing children are done by abstract method of EntityArray::toXML(). </p>
         *
         * <p> Constructs only data of EntityArray's own. </p>
         *
         * @inheritdoc
         */
        construct(xml: library.XML): void;
        /**
         * <p> Factory method of a child Entity. </p>
         *
         * <p> EntityArray::createChild() is a factory method creating a new child Entity which is belonged
         * to the EntityArray. This method is called by EntityArray::construct(). The children construction
         * methods Entity::construct() will be called by abstract method of the EntityArray::construct(). </p>
         *
         * @return A new child Entity belongs to EntityArray.
         */
        protected abstract createChild(xml: library.XML): Ety;
        /**
         * @inheritdoc
         */
        key(): any;
        /**
         * <p> Whether have the item or not. </p>
         *
         * <p> Indicates whether a map has an item having the specified identifier. </p>
         *
         * @param key Key value of the element whose mapped value is accessed.
         *
         * @return Whether the map has an item having the specified identifier.
         */
        has(key: any): boolean;
        /**
         * <p> Count elements with a specific key. </p>
         *
         * <p> Searches the container for elements whose key is <i>key</i> and returns the number of elements found. </p>
         *
         * @param key Key value to be searched for.
         *
         * @return The number of elements in the container with a <i>key</i>.
         */
        count(key: any): number;
        /**
         * <p> Get an element </p>
         *
         * <p> Returns a reference to the mapped value of the element identified with <i>key</i>. </p>
         *
         * @param key Key value of the element whose mapped value is accessed.
         *
         * @throw exception out of range
         *
         * @return A reference object of the mapped value (_Ty)
         */
        get(key: string): Ety;
        /**
         * @inheritdoc
         */
        abstract TAG(): string;
        /**
         * <p> A tag name of children objects. </p>
         */
        abstract CHILD_TAG(): string;
        /**
         * <p> Get an XML object represents the EntityArray. </p>
         *
         * <p> Archives the EntityArray's own member variables only to the returned XML object. </p>
         *
         * <p> Do not consider about archiving children Entity objects' data in EntityArray::toXML().
         * Those children Entity objects will converted to XML object by their own toXML() method. The
         * insertion of XML objects representing children are done by abstract method of
         * EntityArray::toXML(). </p>
         *
         * <p> Archives only data of EntityArray's own. </p>
         *
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * <p> A network driver for an external system. </p>
     *
     * <p> ExternalSystem is a boundary class interacting with an external system by network communication.
     * Also, ExternalSystem is an abstract class that a network role, which one is server and which one is
     * client, is not determined yet. </p>
     *
     * <p> The ExternalSystem has ExternalSystemRole(s) groupped methods, handling Invoke message
     * interacting with the external system, by subject or unit of a moudle. The ExternalSystemRole is
     * categorized in a 'control'. </p>
     *
     * <h4> Note </h4>
     * <p> The ExternalSystem class takes a role of interaction with external system in network level.
     * However, within a framework of Samchon Framework, a boundary class like the ExternalSystem is
     * not such important. You can find some evidence in a relationship between ExternalSystemArray,
     * ExternalSystem and ExternalSystemRole. </p>
     *
     * <p> Of course, the ExternalSystemRole is belonged to an ExternalSystem. However, if you
     * access an ExternalSystemRole from an ExternalSystemArray directly, not passing by a belonged
     * ExternalSystem, and send an Invoke message even you're not knowing which ExternalSystem is
     * related in, it's called "Proxy pattern".
     *
     * <p> Like the explanation of "Proxy pattern", you can utilize an ExternalSystemRole as a proxy
     * of an ExternalSystem. With the pattern, you can only concentrate on ExternalSystemRole itself,
     * what to do with Invoke message, irrespective of the ExternalSystemRole is belonged to which
     * ExternalSystem. </p>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ExternalSystem extends EntityArray<ExternalSystemRole> implements IProtocol {
        /**
         * <p> A driver for interacting with (real, physical) external system. </p>
         */
        protected driver: ServerConnector;
        /**
         * <p> A name can identify an external system. </p>
         *
         * <p> The name must be unique in ExternalSystemArray. </p>
         */
        protected name: string;
        /**
         * <p> An ip address of an external system. </p>
         */
        protected ip: string;
        /**
         * <p> A port number of an external system. </p>
         */
        protected port: number;
        /**
         * <p> Default Constructor. </p>
         */
        constructor();
        /**
         * <p> Start interaction. </p>
         * <p> An abstract method starting interaction with an external system. </p>
         *
         * <p> If an external systems are a server, starts connection and listening Inovoke message,
         * else clients, just starts listening only. You also can addict your own procudures of starting
         * the driver, but if you directly override method of abstract ExternalSystem, be careful about
         * virtual inheritance. </p>
         */
        start(): void;
        key(): any;
        /**
         * <p> Get name. </p>
         */
        getName(): string;
        /**
         * <p> Get ip address of the external system. </p>
         */
        getIP(): string;
        /**
         * <p> Get port number of the external system. </p>
         */
        getPort(): number;
        sendData(invoke: Invoke): void;
        replyData(invoke: Invoke): void;
        TAG(): string;
        CHILD_TAG(): string;
    }
}
declare namespace samchon.protocol {
    /**
     * <p> An array of ExternalSystem(s). </p>
     *
     * <p> ExternalSystemArray is an abstract class containing and managing external system drivers. </p>
     *
     * <p> Also, ExternalSystemArray can access to ExternalSystemRole(s) directly. With the method, you
     * can use an ExternalSystemRole as "logical proxy" of an ExternalSystem. Of course, the
     * ExternalSystemRole is belonged to an ExternalSystem. However, if you access an ExternalSystemRole
     * from an ExternalSystemArray directly, not passing by a belonged ExternalSystem, and send an Invoke
     * message even you're not knowing which ExternalSystem is related in, the ExternalSystemRole acted
     * a role of proxy. </p>
     *
     * <p> It's called as "Proxy pattern". With the pattern, you can only concentrate on
     * ExternalSystemRole itself, what to do with Invoke message, irrespective of the ExternalSystemRole
     * is belonged to which ExternalSystem. </p>
     *
     * <ul>
     *  <li> ExternalSystemArray::getRole("something")->sendData(invoke); </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ExternalSystemArray extends EntityArray<ExternalSystem> implements IProtocol {
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * <p> Start interaction. </p>
         * <p> An abstract method starting interaction with external systems. </p>
         *
         * <p> If external systems are servers, starts connection to them, else clients, opens a server
         * and accepts the external systems. You can addict your own procudures of starting drivers, but
         * if you directly override method of abstract ExternalSystemArray, be careful about virtual
         * inheritance. </p>
         */
        start(): void;
        /**
         * <p> Test whether has a role. </p>
         *
         * @param name Name of an ExternalSystemRole.
         * @return Whether has or not.
         */
        hasRole(key: string): boolean;
        /**
         * <p> Get a role. </p>
         *
         * @param name Name of an ExternalSystemRole
         * @return A shared pointer of specialized role
         */
        getRole(key: string): ExternalSystemRole;
        sendData(invoke: Invoke): void;
        replyData(invoke: Invoke): void;
        TAG(): string;
        CHILD_TAG(): string;
    }
}
declare namespace samchon.protocol {
    /**
     * <p> A role belongs to an external system. </p>
     *
     * <p> ExternalSystemRole is a 'control' class groupping methods, handling Invoke messages
     * interacting with an external system that the ExternalSystemRole is belonged to, by a subject or
     * unit of a module. <p>
     *
     * <p> ExternalSystemRole can be a "logical proxy" for an ExternalSystem which is containing the
     * ExternalSystemRole. Of course, the ExternalSystemRole is belonged to an ExternalSystem. However,
     * if you access an ExternalSystemRole from an ExternalSystemArray directly, not passing by a
     * belonged ExternalSystem, and send an Invoke message even you're not knowing which ExternalSystem
     * is related in, the ExternalSystemRole acted a role of proxy. </p>
     *
     * <p> It's called as "Proxy pattern". With the pattern, you can only concentrate on
     * ExternalSystemRole itself, what to do with Invoke message, irrespective of the ExternalSystemRole
     * is belonged to which ExternalSystem. </p>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class ExternalSystemRole extends Entity implements IProtocol {
        /**
         * <p> A driver of external system containing the ExternalSystemRole. </p>
         */
        protected system: ExternalSystem;
        /**
         * <p> A name representing the role. </p>
         */
        protected name: string;
        protected sendListeners: std.HashSet<string>;
        /**
         * <p> Construct from external system driver. </p>
         *
         * @param system A driver of external system the ExternalSystemRole is belonged to.
         */
        constructor(system: ExternalSystem);
        construct(xml: library.XML): void;
        getName(): string;
        hasSendListener(key: string): boolean;
        sendData(invoke: Invoke): void;
        replyData(invoke: Invoke): void;
        TAG(): string;
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * <p> An interface of entity. </p>
     *
     * <p> Entity is a class for standardization of expression method using on network I/O by XML. If
     * Invoke is a standard message protocol of Samchon Framework which must be kept, Entity is a
     * recommended semi-protocol of message for expressing a data class. Following the semi-protocol
     * Entity is not imposed but encouraged. </p>
     *
     * <p> As we could get advantages from standardization of message for network I/O with Invoke,
     * we can get additional advantage from standardizing expression method of data class with Entity.
     * We do not need to know a part of network communication. Thus, with the Entity, we can only
     * concentrate on entity's own logics and relationships between another entities. Entity does not
     * need to how network communications are being done. </p>
     *
     * <p> I say repeatedly. Expression method of Entity is recommended, but not imposed. It's a semi
     * protocol for network I/O but not a essential protocol must be kept. The expression method of
     * Entity, using on network I/O, is expressed by XML string. </p>
     *
     * <p> If your own network system has a critical performance issue on communication data class,
     * it would be better to using binary communication (with ByteArray).
     * Don't worry about the problem! Invoke also provides methods for binary data (ByteArray). </p>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IEntity {
        /**
         * <p> Construct data of the Entity from a XML object. </p>
         *
         * <p> Overrides the construct() method and fetch data of member variables from the XML. </p>
         *
         * <p> By recommended guidance, data representing member variables are contained in properties
         * of the put XML object. </p>
         *
         * @param xml An xml used to contruct data of entity.
         */
        construct(xml: library.XML): any;
        /**
        * <p> Get a key that can identify the Entity uniquely. </p>
        *
        * <p> If identifier of the Entity is not atomic value, returns a string or paired object
        * that can represents the composite identifier. </p>
        */
        key(): any;
        /**
         * <p> A tag name when represented by XML. </p>
         *
         * <ul>
         * 	<li> &lt;TAG {...properties} /&gt; </li>
         * </ul>
         */
        TAG(): string;
        /**
         * <p> Get a XML object represents the Entity. </p>
         *
         * <p> A member variable (not object, but atomic value like number, string or date) is categorized
         * as a property within the framework of entity side. Thus, when overriding a toXML() method and
         * archiving member variables to an XML object to return, puts each variable to be a property
         * belongs to only a XML object. </p>
         *
         * <p> Don't archive the member variable of atomic value to XML::value causing enormouse creation
         * of XML objects to number of member variables. An Entity must be represented by only a XML
         * instance (tag). </p>
         *
         * <table>
         *	<tr>
         *		<th> Standard Usage </th>
         *		<th> Non-standard usage abusing value </th>
         *	</tr>
         *	<tr>
         *		<td>
         *		  &lt;memberList&gt; <br>
         *		  &lt;member id='jhnam88' name='Jeongho+Nam' birthdate='1988-03-11' /&gt; <br>
    &lt;member id='master' name='Administartor' birthdate='2011-07-28' /&gt; <br>
&lt;/memberList&gt;
         *		</td>
         *		<td>
         *		  &lt;member&gt;
         *		  &lt;id&gt;jhnam88&lt;/id&gt;
         *		  &lt;name&gt;Jeongho+Nam&lt;name&gt;
         *		  &lt;birthdate&gt;1988-03-11&lt;/birthdate&gt;
         *		  &lt;/member&gt;
         *		</td>
         *	</tr>
         * </table>
         *
         * @return An XML object representing the Entity.
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * <p> An interface for Invoke message chain. </p>
     *
     * <p> IProtocol is an interface for Invoke message, which is standard message of network I/O
     * in Samchon Framework, chain. The IProtocol interface is used to network drivers and some
     * classes which are in a relationship of chain of responsibility with those network drivers. </p>
     *
     * <p> In Samchon Framework, server side, IProtocol is one of the basic 3 + 1 components that
     * can make any type of network system in Samchon Framework with IServer and IClient. Following
     * the "chain of responsibility" pa1ttern, looking around classes in Samchon Framework, you
     * can see all related classes with network I/O are implemented from the IProtocol. </p>
     *
     * @see Invoke
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IProtocol {
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
         * @param invoke Replied invoke message
         */
        sendData(invoke: Invoke): void;
    }
}
declare namespace samchon.protocol {
    /**
     * <p> Standard message of network I/O. </p>
     * <p> Invoke is a class used in network I/O in protocol package of Samchon Framework. </p>
     *
     * <p> The Invoke message has an XML structure like the result screen of provided example in below.
     * We can enjoy lots of benefits by the normalized and standardized message structure used in
     * network I/O. </p>
     *
     * <p> The greatest advantage is that we can make any type of network system, even how the system
     * is enourmously complicated. As network communication message is standardized, we only need to
     * concentrate on logical relationships between network systems. We can handle each network system
     * like a object (class) in OOD. And those relationships can be easily designed by using design
     * pattern. </p>
     *
     * <p> In Samchon Framework, you can make any type of network system with basic 3 + 1 componenets
     * (IProtocol, IServer and IClient + ServerConnector), by implemens or inherits them, like designing
     * classes of S/W architecture. </p>
     *
     * @see IProtocol
     * @author Jeongho Nam <http://samchon.org>
     */
    class Invoke extends EntityArray<InvokeParameter> {
        /**
         * <p> Listener, represent function's name. </p>
         */
        protected listener: string;
        constructor(listener: string);
        /**
         * Copy Constructor.
         *
         * @param invoke
         */
        constructor(invoke: Invoke);
        constructor(xml: library.XML);
        constructor(listener: string, begin: std.VectorIterator<InvokeParameter>, end: std.VectorIterator<InvokeParameter>);
        constructor(listener: string, ...parameters: any[]);
        /**
         * @inheritdoc
         */
        protected createChild(xml: library.XML): InvokeParameter;
        /**
         * Get listener.
         */
        getListener(): string;
        /**
         * <p> Get arguments for Function.apply(). </p>
         *
         * @return An array containing values of the contained parameters.
         */
        getArguments(): Array<any>;
        /**
         * <p> Apply to a matched function. </p>
         */
        apply(obj: IProtocol): boolean;
        /**
         * @inheritdoc
         */
        TAG(): string;
        /**
         * @inheritdoc
         */
        CHILD_TAG(): string;
    }
}
declare namespace samchon.protocol {
    /**
     * <p> A history of an Invoke message. </p>
     *
     * <p> InvokeHistory is a class for reporting history log of an Invoke message with elapsed time
     * from a slave to its master.</p>
     *
     * <p> With the elapsed time, consumed time for a process of handling the Invoke message,
     * InvokeHistory is reported to the master. The master utilizies the elapsed time to estimating
     * performances of each slave system. With the estimated performan index, master retrives the
     * optimal solution of distributing processes. </p>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class InvokeHistory extends Entity {
        /**
         * <p> An identifier. </p>
         */
        protected uid: number;
        /**
         * <p> A listener of the Invoke message. </p>
         *
         * <p> InvokeHistory does not archive entire data of an Invoke message. InvokeHistory only
         * archives its listener. The first, formal reason is to save space, avoid wasting spaces. </p>
         *
         * <p> The second, complicate reason is on an aspect of which systems are using the
         * InvokeHistory class. InvokeHistory is designed to let slave reports to master elapsed time
         * of a process used to handling the Invoke message. If you want to archive entire history log
         * of Invoke messages, then the subject should be master, not the slave using InvokeHistory
         * classes. </p>
         */
        protected listener: string;
        /**
         * <p> Start time of the history. </p>
         *
         * <p> Means start time of a process handling the Invoke message. The start time not only
         * has ordinary arguments represented Datetime (year to seconds), but also has very precise
         * values under seconds, which is expressed as nano seconds (10^-9). </p>
         *
         * <p> The precise start time will be used to calculate elapsed time with end time. </p>
         */
        protected startTime: Date;
        /**
         * <p> End time of the history. </p>
         *
         * @details
         * <p> Means end time of a process handling the Invoke message. The end time not only
         * has ordinary arguments represented Datetime (year to seconds), but also has very precise
         * values under seconds, which is expressed as nano seconds (10^-9). </p>
         *
         * <p> The precise end time will be used to calculate elapsed time with start time. </p>
         */
        protected endTime: Date;
        /**
         * <p> Construct from an Invoke message. </p>
         *
         * <p> InvokeHistory does not archive entire Invoke message, only archives its listener. </p>
         *
         * @param invoke A message to archive its history log
         */
        constructor(invoke: Invoke);
        /**
         * <p> Notify end of the process. </p>
         *
         * <p> Notifies end of a process handling the matched Invoke message to InvokeHistory. </p>
         * <p> InvokeHistory archives the end datetime and calculates elapsed time as nanoseconds. </p>
         */
        notifyEnd(): void;
        TAG(): string;
        toXML(): library.XML;
        /**
         * <p> Get an Invoke message. </p>
         *
         * <p> Returns an Invoke message to report to a master that how much time was elapsed on a
         * process handling the Invoke message. In master, those reports are used to estimate
         * performance of each slave system. </p>
         *
         * @return An Invoke message to report master.
         */
        toInvoke(): Invoke;
    }
}
declare namespace samchon.protocol {
    /**
     * A parameter belongs to an Invoke.
     *
     * @see Invoke
     * @author Jeongho Nam <http://samchon.org>
     */
    class InvokeParameter extends Entity {
        /**
         * <p> Name of the parameter. </p>
         *
         * @details Optional property, can be omitted.
         */
        protected name: string;
        /**
         * <p> Type of the parameter. </p>
         */
        protected type: string;
        /**
         * <p> Value of the parameter. </p>
         */
        protected value: any;
        constructor();
        constructor(name: string, val: any);
        constructor(name: string, type: string, val: any);
        construct(xml: library.XML): void;
        key(): any;
        /**
         * Get name.
         */
        getName(): string;
        /**
         * Get type.
         */
        getType(): string;
        /**
         * Get value.
         */
        getValue(): any;
        TAG(): string;
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * <p> A server connector for a physical client. </p>
     *
     * <p> ServerConnector is a class for a physical client connecting a server. If you want to connect
     * to a server,  then implements this ServerConnector and just override some methods like
     * getIP(), getPort() and replyData(). That's all. </p>
     *
     * <p> In Samchon Framework, package protocol, There are basic 3 + 1 components that can make any
     * type of network system in Samchon Framework. The basic 3 components are IProtocol, IServer and
     * IClient. The last, surplus one is the ServerConnector. Looking around classes in
     * Samchon Framework, especially module master and slave which are designed for realizing
     * distributed processing systems and parallel processing systems, physical client classes are all
     * derived from this ServerConnector. </p>
     *
     * <img src="interface.png" />
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class ServerConnector implements IProtocol {
        /**
         * <p> A parent object who listens and sends Invoke message. </p>
         *
         * <ul>
         * 	<li> ServerConnector.replyData(Invoke) -> parent.replyData(Invoke) </li>
         * </ul>
         */
        private parent;
        /**
         * <p> A socket for network I/O. </p>
         */
        private socket;
        /**
         * <p> Unused string from a server. </p>
         */
        private str;
        /**
         * <p> An open-event listener. </p>
         */
        onopen: Function;
        /**
         * <p> Constructor with parent. </p>
         */
        constructor(parent: IProtocol);
        /**
         * <p> Connects to a cloud server with specified host and port. </p>
         *
         * <p> If the connection fails immediately, either an event is dispatched or an exception is thrown:
         * an error event is dispatched if a host was specified, and an exception is thrown if no host
         * was specified. Otherwise, the status of the connection is reported by an event.
         * If the socket is already connected, the existing connection is closed first. </p>
         *
         * @param ip
         * 		The name or IP address of the host to connect to.
         * 		If no host is specified, the host that is contacted is the host where the calling
         * 		file resides. If you do not specify a host, use an event listener to determine whether
         * 		the connection was successful.
         * @param port
         * 		The port number to connect to.
         *
         * @throws IOError
         * 		No host was specified and the connection failed.
         * @throws SecurityError
         * 		This error occurs in SWF content for the following reasons:
         * 		Local untrusted SWF files may not communicate with the Internet. You can work around
         * 		this limitation by reclassifying the file as local-with-networking or as trusted.
         */
        connect(ip: string, port: number): void;
        /**
         * <p> Send data to the server. </p>
         */
        sendData(invoke: Invoke): void;
        /**
         * <p> Shift responsiblity of handling message to parent. </p>
         */
        replyData(invoke: Invoke): void;
        private handleConnect(event);
        /**
         * <p> Handling replied message. </p>
         */
        private handleReply(event);
    }
}
declare namespace samchon.protocol.service {
    /**
     * <p> An application, the top class in JS-UI. </p>
     *
     * <p> The Application is separated to three part, TopMenu, Movie and ServerConnector. </p>
     * <ul>
     * 	<li> <code>TopMenu</code>: Menu on the top. It's not an essential component. </li>
     * 	<li> <code>Movie</code>: Correspond with Service in Server. Movie has domain UI components(Movie) for the matched Service. </li>
     * 	<li> <code>ServerConnector</code>: The socket connecting to the Server. </li>
     * </ul>
     *
     * <p> The Application and its UI-layout is not fixed, essential component for Samchon Framework in Flex,
     * so it's okay to do not use the provided Application and make your custom Application.
     * But the custom Application, your own, has to contain the Movie and keep the construction routine. </p>
     *
     * <p> <img src="movie.png" /> </p>
     *
     * <h4> THE CONSTRUCTION ROUTINE </h4>
     * <ul>
     * 	<li>Socket Connection</li>
     * 	<ul>
     * 		<li>Connect to the CPP-Server</li>
     * 	</ul>
     * 	<li>Fetch authority</li>
     * 	<ul>
     * 		<li>Send a request to fetching authority</li>
     * 		<li>The window can be navigated to other page by the authority</li>
     * 	</ul>
     * 	<li>Construct Movie</li>
     * 	<ul>
     * 		<li>Determine a Movie by URLVariables::movie and construct it</li>
     * 	</ul>
     * 	<li>All the routines are done</li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class Application implements IProtocol {
        /**
         * <p> Invoke Socket. </p>
         */
        protected socket: ServerConnector;
        /**
         * <p> A movie. </p>
         */
        protected movie: Movie;
        /**
         * <p> Construct from arguments. </p>
         *
         * @param movie A movie represents a service.
         * @param ip An ip address of cloud server to connect.
         * @param port A port number of cloud server to connect.
         */
        constructor(movie: Movie, ip: string, port: number);
        private handleConnect(event);
        /**
         * <p> Handle replied message or shift the responsibility. </p>
         */
        replyData(invoke: Invoke): void;
        /**
         * <p> Send a data to server. </p>
         */
        sendData(invoke: Invoke): void;
    }
}
declare namespace samchon.protocol.service {
    /**
     * A movie belonged to an Application.
     */
    class Movie implements IProtocol {
        /**
         * <p> An application the movie is belonged to
         */
        protected application: Application;
        /**
         * Handle replied data.
         */
        replyData(invoke: Invoke): void;
        /**
         * Send data to server.
         */
        sendData(invoke: Invoke): void;
    }
}
declare namespace samchon.protocol.service {
}
declare namespace samchon.protocol.slave {
    /**
     * @brief A slave system.
     *
     * @details
     * <p> SlaveSystem, literally, means a slave system belongs to a maste system. </p>
     *
     * <p> The SlaveSystem class is used in opposite side system of master::DistributedSystem
     * and master::ParallelSystem and reports elapsed time of each commmand (by Invoke message)
     * for estimation of its performance. </p>
     *
     * @inheritdoc
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class SlaveSystem extends ExternalSystem {
        /**
         * <p> Default Constructor. </p>
         */
        constructor();
        /**
         * @inheritdoc
         */
        replyData(invoke: Invoke): void;
    }
}
