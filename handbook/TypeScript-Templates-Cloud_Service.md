# Cloud Service
A template module for **Cloud Service**.


## References
#### Class Diagram
![Protocol - Cloud Service](http://samchon.github.io/framework/images/design/ts_class_diagram/templates_cloud_service.png)

#### API Documents
  - [Server](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.server.html)
  - [User](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.user.html)
  - [Client](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.client.html)
  - [Service](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.service.html)

#### Source Codes
  - [**Server.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/service/Server.ts)
  - [**User.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/service/User.ts)
  - [**Client.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/service/Client.ts)
  - [**Service.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/service/Service.ts)


## Basic Classes
### Server
A cloud server.

The [Server](#server) is an abstract server class, who can build a real-time cloud server, that is following the web-socket protocol. Extends this [Server](#server) and related classes and overrides abstract methods under below. After the overridings, open this cloud server using the [open()](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.server.html#open) method.

  - Objects in composite relationship and their factory methods
    - [User](#user): [Server.createUser](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.server.html#createuser)
    - [Client](#client): [User.createClient](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.user.html#createclient)
    - [Service](#service): [Client.createService](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.client.html#createservice)

### User
An user.

The [User](#user) is an abstract class groupping [Client](#client) objects, who communicates with remote client, with same session id. This [User](#user) represents a remote user literally. Within framework of remote system, an [User](#user) corresponds to a web-browser and a [Client](#client) represents a window in the web-browser.

Extends this [User](#user) class and override the createClient method, a factory method creating a child [Client](#client) object. I repeat, the [User](#user) class represents a remote user, groupping [Client](#client) objects with same session id. If your cloud server has some processes to be handled in the user level, then defines method in this [User](#user) class. Methods managing account under below are some of them:

  - [setAccount()](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.user.html#setaccount)
  - [getAccountID()](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.user.html#getaccountid)
  - [getAuthority()](http://samchon.github.io/framework/api/ts/classes/samchon.templates.service.user.html#getauthority)

The children [Client](#client) objects, they're contained with their key, the sequence number. If you {@link User.erase erase} the children [Client](#client) object by yourself, then their connection with the remote clients will be closed and their destruction method will be called. If you remove all children, then this [User](#user) object will be also destructed and erased from the parent [Server](#server) object.

### Client
A driver of remote client.

The [Client](#client) is an abstract class representing and interacting with a remote client. It deals the network communication with the remote client and shifts [Invoke message](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Standard_Message#invoke) to related [User](#user) and [Service](#service) objects.

Extends this [Client](#client) class and override the createService method, a factory method creating a child [Service](#service) object. Note that, [Client](#client) represents a remote client, not an user, a specific web page or service. Do not define logics about user or account information. It must be declared in the parent [User](#user) class. Also, don't define processes of a specific a web page or service. Defines them in the child [Service](#service) class.

### Service
A service.

The [Service](#service) is an abstract class who represents a service, that is providing functions a specific page.

Extends the [Service](#service) class and defines its own service, which to be provided for the specific weg page, by overriding the replyData() method. Note that, the service, functions for the specific page should be defined in this [Service](#service) class, not its parent Client class who represents a remote client and takes communication responsibility.


## Example Project
#### Chatting
  - [Demo](http://samchon.org/chat)
  - [Guide Document](https://github.com/samchon/framework/wiki/Examples-Chatting)
  - Source Code
    - [Server](https://github.com/samchon/framework/tree/master/ts/examples/chat-server)
    - [Web Client](https://github.com/samchon/framework/tree/master/ts/examples/chat-application)

