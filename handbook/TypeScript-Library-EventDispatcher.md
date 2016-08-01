# EventDispatcher

## References
#### API Documents
  - [IEventDispatcher](http://samchon.github.io/framework/api/ts/interfaces/samchon.library.ieventdispatcher.html)
  - [EventDispatcher](http://samchon.github.io/framework/api/ts/classes/samchon.library.eventdispatcher.html)

#### Conception, Header of EventDispatcher objects
``` typescript
interface IEventDispatcher
{
	hasEventDispatcher(type: string): void;
	
	dispatchEvent(event: Event): void;

	addEventListener(type: string, listener: EventListener): void;
	addEventListener(type: string, listener: EventListener, thisArg: Object): void;

	removeEventListener(type: string, listener: EventListener): void;
	removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
}

class EventDispatcher
{
	private dispatcher: IEventDispatcher;
	private listeners: std.HashMap<string, std.HashSet<std.Pair<EventListener, Object>>>;

	public constructor();
	public constructor(dispatcher: IEventDispatcher);
}
```

#### Class Diagram
![Library - Utils](http://samchon.github.io/framework/images/design/ts_class_diagram/library_utils.png)

EventDispatcher objects are left-bottom.

## Implementation
#### Listening Events

When event listener is a member method (function) in a class, then you've to specify ```this``` on 3rd parameter.
  - addEventListener(type: string, listener: EventListener);
  - addEventListener(type: string, listener: EventListener, **thisArg: Object**);

``` typescript
class MyClass
{
	private name: string;
	private list: collection.ListCollection<string>;
	
	private add_event_listener(): void
	{
		this.list.addEventListener("inser", MyClass.prototype.handle_event, this);
		this.list.addEventListener("erase", MyClass.prototype.handle_event, this);
		this.list.addEventListener("refresh", MyClass.prototype.handle_event, this);
	}
	private remove_event_listener(): void
	{
		this.list.removeEventListener("inser", MyClass.prototype.handle_event, this);
		this.list.removeEventListener("erase", MyClass.prototype.handle_event, this);
		this.list.removeEventListener("refresh", MyClass.prototype.handle_event, this);
	}
	
	private handle_event(event: collection.CollectionEvent<string>): void
	{
		// IF DO NOT SPECIFY "this" ON 3RD PARAMETER OF "addEventListener",
		// THEN CANNOT FIND MATCHED "name" WITH "this.name"
		console.log(this.name, event.type);
		
		for (let it = event.first; !it.equal_to(event.last); it = it.next())
			console.log(it.value);
	}
}
```

#### Dispatching Events
In general, the easiest way for a user-defined class to gain event dispatching capabilities is to extend *EventDispatcher*.

``` typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />

import library = require("samchon-framework").library;

class TopClass extends library.EventDispatcher
{
	public constructor()
	{
		super();
	}
}
```

If extending *EventDispatcher* is impossible (that is, if the class is already extending another class), you can instead implement the *IEventDispatcher* interface, create an *EventDispatcher* member, and write simple hooks to route calls into the aggregated *EventDispatcher*.

``` typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />

import library = require("samchon-framework").library;

class DerivedClass extends Something 
	implements library.IEventDispatcher
{
	/////
	// Create an EventDispatcher object and put this.
	/////
	private event_dispatcher_: library.EventDispatcher = new library.EventDispatcher(this);
	
	/* =========================================================
		EVENT_DISPATCHER
			- ACCESSORS
			- ADD
			- REMOVE
	============================================================
		ACCESSORS
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public hasEventListener(type: string): boolean 
	{
		// Declare member functions following IEventDispatcher
		// And call same method (shift responsibility) to this.event_dispatcher_
		// An EventDispatcher object who is a member variable of this.
		return this.event_dispatcher_.hasEventListener(type);
	}
	
	/**
	 * @inheritdoc
	 */
	public dispatchEvent(event: Event): boolean
	{
		// Shift
		return this.event_dispatcher_.dispatchEvent(event);
	}

	/* ---------------------------------------------------------
		ADD
	--------------------------------------------------------- */
	// Declare header of overloaded member functions following definitions in IEventDispatcher
	/**
	 * @inheritdoc
	 */
	public addEventListener(type: string, listener: EventListener): void;
	
	// Declare header of overloaded member functions following definitions in IEventDispatcher
	/**
	 * @inheritdoc
	 */
	public addEventListener(type: string, listener: EventListener, thisArg: Object): void;

	public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
	{
		// And declare body function who can incompatible with overloaded header functions.
		// Of course, it also shifts chain to its member EventDispatcher.
		this.event_dispatcher_.addEventListener(type, listener, thisArg);
	}

	/* ---------------------------------------------------------
		REMOVE
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public removeEventListener(type: string, listener: EventListener): void;
	
	/**
	 * @inheritdoc
	 */
	public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;

	public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
	{
		this.event_dispatcher_.removeEventListener(type, listener, thisArg);
	}
}
```