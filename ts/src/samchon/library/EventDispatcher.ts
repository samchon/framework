/// <reference path="../API.ts" />

namespace samchon.library
{
	/**
	 * <p> The IEventDispatcher interface defines methods for adding or removing event listeners, checks 
	 * whether specific types of event listeners are registered, and dispatches events. </p>
	 *
	 * <p> Event targets are an important part of the Flash¢ç Player and Adobe AIR event model. The event 
	 * target serves as the focal point for how events flow through the display list hierarchy. When an 
	 * event such as a mouse click or a keypress occurs, an event object is dispatched into the event flow 
	 * from the root of the display list. The event object makes a round-trip journey to the event target, 
	 * which is conceptually divided into three phases: the capture phase includes the journey from the 
	 * root to the last node before the event target's node; the target phase includes only the event 
	 * target node; and the bubbling phase includes any subsequent nodes encountered on the return trip to 
	 * the root of the display list. </p>
	 * 
	 * <p> In general, the easiest way for a user-defined class to gain event dispatching capabilities is 
	 * to extend EventDispatcher. If this is impossible (that is, if the class is already extending another 
	 * class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member, 
	 * and write simple hooks to route calls into the aggregated EventDispatcher. </p>
	 *
	 * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/IEventDispatcher.html
	 * @author Migrated by Jeongho Nam <http://samchon.org>
	 */
	export interface IEventDispatcher
	{
		/**
		 * <p> Checks whether the EventDispatcher object has any listeners registered for a specific type 
		 * of event. This allows you to determine where an EventDispatcher object has altered handling of 
		 * an event type in the event flow hierarchy. To determine whether a specific event type actually 
		 * triggers an event listener, use willTrigger(). </p>
		 *
		 * <p> The difference between hasEventListener() and willTrigger() is that hasEventListener() 
		 * examines only the object to which it belongs, whereas willTrigger() examines the entire event 
		 * flow for the event specified by the type parameter. </p>
		 *
		 * @param type The type of event.
		 */
		hasEventListener(type: string): boolean;

		/**
		 * <p> Dispatches an event into the event flow. </p> 
		 * <p> The event target is the EventDispatcher object upon which the dispatchEvent() method is called. </p>
		 *
		 * @param event The Event object that is dispatched into the event flow. If the event is being 
		 *			  redispatched, a clone of the event is created automatically. After an event is 
		 *			  dispatched, its target property cannot be changed, so you must create a new copy 
		 *			  of the event for redispatching to work. 
		 */
		dispatchEvent(event: library.BasicEvent): boolean;

		/**
		 * <p> Registers an event listener object with an EventDispatcher object so that the listener 
		 * receives notification of an event. You can register event listeners on all nodes in the display 
		 * list for a specific type of event, phase, and priority. 
		 *
		 * <p> After you successfully register an event listener, you cannot change its priority through 
		 * additional calls to addEventListener(). To change a listener's priority, you must first call 
		 * removeEventListener(). Then you can register the listener again with the new priority level. </p>
		 *
		 * <p> Keep in mind that after the listener is registered, subsequent calls to addEventListener() 
		 * with a different type or useCapture value result in the creation of a separate listener 
		 * registration. For example, if you first register a listener with useCapture set to true, 
		 * it listens only during the capture phase. If you call addEventListener() again using the same 
		 * listener object, but with useCapture set to false, you have two separate listeners: one that 
		 * listens during the capture phase and another that listens during the target and bubbling phases. </p>
		 *
		 * <p> You cannot register an event listener for only the target phase or the bubbling phase. 
		 * Those phases are coupled during registration because bubbling applies only to the ancestors of 
		 * the target node. </p>
		 * 
		 * <p> If you no longer need an event listener, remove it by calling removeEventListener(), or 
		 * memory problems could result. Event listeners are not automatically removed from memory because 
		 * the garbage collector does not remove the listener as long as the dispatching object exists 
		 * (unless the useWeakReference parameter is set to true). </p>
		 * 
		 * <p> Copying an EventDispatcher instance does not copy the event listeners attached to it. (If 
		 * your newly created node needs an event listener, you must attach the listener after creating 
		 * the node.) However, if you move an EventDispatcher instance, the event listeners attached to 
		 * it move along with it. </p>
		 * 
		 * <p> If the event listener is being registered on a node while an event is also being processed 
		 * on this node, the event listener is not triggered during the current phase but may be triggered 
		 * during a later phase in the event flow, such as the bubbling phase. </p>
		 *
		 * <p> If an event listener is removed from a node while an event is being processed on the node, 
		 * it is still triggered by the current actions. After it is removed, the event listener is never 
		 * invoked again (unless it is registered again for future processing). </p>
		 *
		 * @param event The type of event.
		 * @param listener The listener function that processes the event. 
		 *				 This function must accept an Event object as its only parameter and must return 
		 *				 nothing.
		 */
		addEventListener(type: string, listener: EventListener): void;

		/**
		 * <p> Registers an event listener object with an EventDispatcher object so that the listener 
		 * receives notification of an event. You can register event listeners on all nodes in the display 
		 * list for a specific type of event, phase, and priority. 
		 *
		 * <p> After you successfully register an event listener, you cannot change its priority through 
		 * additional calls to addEventListener(). To change a listener's priority, you must first call 
		 * removeEventListener(). Then you can register the listener again with the new priority level. </p>
		 *
		 * <p> Keep in mind that after the listener is registered, subsequent calls to addEventListener() 
		 * with a different type or useCapture value result in the creation of a separate listener 
		 * registration. For example, if you first register a listener with useCapture set to true, 
		 * it listens only during the capture phase. If you call addEventListener() again using the same 
		 * listener object, but with useCapture set to false, you have two separate listeners: one that 
		 * listens during the capture phase and another that listens during the target and bubbling phases. </p>
		 *
		 * <p> You cannot register an event listener for only the target phase or the bubbling phase. 
		 * Those phases are coupled during registration because bubbling applies only to the ancestors of 
		 * the target node. </p>
		 * 
		 * <p> If you no longer need an event listener, remove it by calling removeEventListener(), or 
		 * memory problems could result. Event listeners are not automatically removed from memory because 
		 * the garbage collector does not remove the listener as long as the dispatching object exists 
		 * (unless the useWeakReference parameter is set to true). </p>
		 * 
		 * <p> Copying an EventDispatcher instance does not copy the event listeners attached to it. (If 
		 * your newly created node needs an event listener, you must attach the listener after creating 
		 * the node.) However, if you move an EventDispatcher instance, the event listeners attached to 
		 * it move along with it. </p>
		 * 
		 * <p> If the event listener is being registered on a node while an event is also being processed 
		 * on this node, the event listener is not triggered during the current phase but may be triggered 
		 * during a later phase in the event flow, such as the bubbling phase. </p>
		 *
		 * <p> If an event listener is removed from a node while an event is being processed on the node, 
		 * it is still triggered by the current actions. After it is removed, the event listener is never 
		 * invoked again (unless it is registered again for future processing). </p>
		 *
		 * @param event The type of event.
		 * @param listener The listener function that processes the event. 
		 *				 This function must accept an Event object as its only parameter and must return 
		 *				 nothing.
		 */
		addEventListener(type: string, listener: EventListener, thisArg: Object): void;

		/**
		 * Removes a listener from the EventDispatcher object. If there is no matching listener registered 
		 * with the EventDispatcher object, a call to this method has no effect.
		 *
		 * @param type The type of event.
		 * @param listener The listener object to remove.
		 */
		removeEventListener(type: string, listener: EventListener): void;

		/**
		 * Removes a listener from the EventDispatcher object. If there is no matching listener registered 
		 * with the EventDispatcher object, a call to this method has no effect.
		 *
		 * @param type The type of event.
		 * @param listener The listener object to remove.
		 */
		removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
	}

	/**
	 * <p> Registers an event listener object with an EventDispatcher object so that the listener 
	 * receives notification of an event. You can register event listeners on all nodes in the display 
	 * list for a specific type of event, phase, and priority. </p>
	 *
	 * <p> After you successfully register an event listener, you cannot change its priority through 
	 * additional calls to addEventListener(). To change a listener's priority, you must first call 
	 * removeListener(). Then you can register the listener again with the new priority level. </p>
	 *
	 * Keep in mind that after the listener is registered, subsequent calls to <code>addEventListener()</code> 
	 * with a different type or useCapture value result in the creation of a separate listener registration. 
	 * For example, if you first register a listener with useCapture set to true, it listens only during the 
	 * capture phase. If you call addEventListener() again using the same listener object, but with 
	 * useCapture set to false, you have two separate listeners: one that listens during the capture 
	 * phase and another that listens during the target and bubbling phases. 
	 *
	 * <p> You cannot register an event listener for only the target phase or the bubbling phase. Those 
	 * phases are coupled during registration because bubbling applies only to the ancestors of the 
	 * target node. </p>
	 * 
	 * <p> If you no longer need an event listener, remove it by calling <code>removeEventListener()</code>, 
	 * or memory problems could result. Event listeners are not automatically removed from memory 
	 * because the garbage collector does not remove the listener as long as the dispatching object 
	 * exists (unless the useWeakReference parameter is set to true). </p>
	 *
	 * <p> Copying an EventDispatcher instance does not copy the event listeners attached to it. (If your 
	 * newly created node needs an event listener, you must attach the listener after creating the 
	 * node.) However, if you move an EventDispatcher instance, the event listeners attached to it move 
	 * along with it. </p>
	 *
	 * <p> If the event listener is being registered on a node while an event is being processed on 
	 * this node, the event listener is not triggered during the current phase but can be triggered 
	 * during a later phase in the event flow, such as the bubbling phase. </p>
	 * 
	 * <p> If an event listener is removed from a node while an event is being processed on the node, it is 
	 * still triggered by the current actions. After it is removed, the event listener is never invoked 
	 * again (unless registered again for future processing). </p>
	 *
	 * <ul>
	 *  <li> Made by AS3 - http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/EventDispatcher.html
	 * </ul>
	 *
	 * @author Migrated by Jeongho Nam <http://samchon.org>
	 */
	export class EventDispatcher
		implements IEventDispatcher
	{
		/**
		 * The origin object who issuing events.
		 */
		protected event_dispatcher_: IEventDispatcher;

		/**
		 * Container of listeners.
		 */
		protected event_listeners_: std.HashMap<string, std.HashSet<std.Pair<EventListener, Object>>>;

		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Construct from the origin event dispatcher.
		 *
		 * @param dispatcher The origin object who issuing events.
		 */
		public constructor(dispatcher: IEventDispatcher);

		public constructor(dispatcher: IEventDispatcher = null)
		{
			if (dispatcher == null)
				this.event_dispatcher_ = this;
			else
				this.event_dispatcher_ = dispatcher;

			this.event_listeners_ = new std.HashMap<string, std.HashSet<std.Pair<EventListener, Object>>>();
		}

		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			type = type.toLowerCase();

			return this.event_listeners_.has(type);
		}
		
		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			if (event instanceof library.BasicEvent)
				event["target_"] = this.event_dispatcher_;
			else
				event.target = this.event_dispatcher_;

			if (this.event_listeners_.has(event.type) == false)
				return false;

			let listenerSet = this.event_listeners_.get(event.type);
			for (let it = listenerSet.begin(); it.equal_to(listenerSet.end()) == false; it = it.next())
				it.value.first.apply(it.value.second, [event]);
				//it.value.apply(event);

			return true;
		}
		
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;
		
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			type = type.toLowerCase();
			let listenerSet: std.HashSet<std.Pair<EventListener, Object>>;
			
			if (this.event_listeners_.has(type) == false)
			{
				listenerSet = new std.HashSet<std.Pair<EventListener, Object>>();
				this.event_listeners_.set(type, listenerSet);
			}
			else
				listenerSet = this.event_listeners_.get(type);

			listenerSet.insert(new std.Pair<EventListener, Object>(listener, thisArg));
		}

		
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
			type = type.toLowerCase();
			if (this.event_listeners_.has(type) == false)
				return;

			let listenerSet = this.event_listeners_.get(type);
			let bind: std.Pair<EventListener, Object> = new std.Pair<EventListener, Object>(listener, thisArg);
			
			if (listenerSet.has(bind) == false)
				return;

			listenerSet.erase(bind);

			if (listenerSet.empty() == true)
				this.event_listeners_.erase(type);
		}
	}
}