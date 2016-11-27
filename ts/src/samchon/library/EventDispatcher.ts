/// <reference path="../API.ts" />

namespace samchon.library
{
	export type BasicEventListener = (event: BasicEvent) => void;
	
	/**
	 * The IEventDispatcher interface defines methods for adding or removing event listeners, checks whether specific 
	 * types of event listeners are registered, and dispatches events.
	 *
	 * The event target serves as the local point for how events flow through the display list hierarchy. When an 
	 * event such as a mouse click or a key press occurs, an event object is dispatched into the event flow from the 
	 * root of the display list. The event object makes a round-trip journey to the event target, which is 
	 * conceptually divided into three phases: the capture phase includes the journey from the root to the last node 
	 * before the event target's node; the target phase includes only the event target node; and the bubbling phase 
	 * includes any subsequent nodes encountered on the return trip to the root of the display list.
	 * 
	 * In general, the easiest way for a user-defined class to gain event dispatching capabilities is to extend 
	 * {@link EventDispatcher}. If this is impossible (that is, if the class is already extending another class), you 
	 * can instead implement the {@link IEventDispatcher} interface, create an {@link EventDispatcher} member, and 
	 * write simple hooks to route calls into the aggregated {@link EventDispatcher}.
	 *
	 * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/IEventDispatcher.html
	 * @handbook https://github.com/samchon/framework/wiki/TypeScript-Library-EventDispatcher
	 * @author Migrated by Jeongho Nam <http://samchon.org>
	 */
	export interface IEventDispatcher
	{
		/**
		 * Checks whether the {@link EventDispatcher} object has any listeners registered for a specific type of event. 
		 * This allows you to determine where an {@link EventDispatcher} object has altered handling of an event type 
		 * in the event flow hierarchy. To determine whether a specific event type actually triggers an event listener, 
		 * use {@link willTrigger willTrigger()}.
		 *
		 * The difference between {@link hasEventListener hasEventListener()} and {@link willTrigger willTrigger()} is 
		 * that {@link hasEventListener} examines only the object to which it belongs, whereas {@link willTrigger} 
		 * examines the entire event flow for the event specified by the type parameter.
		 *
		 * @param type The type of event.
		 */
		hasEventListener(type: string): boolean;

		/**
		 * Dispatches an event into the event flow. 
		 * 
		 * The event target is the {@link EventDispatcher} object upon which the {@link dispatchEvent dispatchEvent()} 
		 * method is called.
		 *
		 * @param event The {@link BasicEvent} object that is dispatched into the event flow. If the event is being 
		 *				redispatched, a clone of the event is created automatically. After an event is dispatched, its 
		 *				target property cannot be changed, so you must create a new copy 
		 *				of the event for redispatching to work. 
		 */
		dispatchEvent(event: library.BasicEvent): boolean;

		/**
		 * Registers an event listener object with an {@link EventDispatcher} object so that the listener receives 
		 * notification of an event. You can register event listeners on all nodes in the display list for a specific 
		 * type of event, phase, and priority. 
		 *
		 * After you successfully register an event listener, you cannot change its priority through additional calls 
		 * to {@link addEventListener addEventListener()|} To change a listener's priority, you must first call
		 * {@link removeEventListener removeEventListener()}. Then you can register the listener again with the new 
		 * priority level.
		 *
		 * Keep in mind that after the listener is registered, subsequent calls to {@link addEventListener} with a 
		 * different type or useCapture value result in the creation of a separate listener registration. For example, 
		 * if you first register a listener with useCapture set to true, it listens only during the capture phase. If 
		 * you call {@link addEventListener} again using the same listener object, but with useCapture set to false, 
		 * you have two separate listeners: one that listens during the capture phase and another that listens during 
		 * the target and bubbling phases.
		 *
		 * You cannot register an event listener for only the target phase or the bubbling phase. Those phases are 
		 * coupled during registration because bubbling applies only to the ancestors of the target node.
		 * 
		 * If you no longer need an event listener, remove it by calling {@link removeEventListener}, or memory 
		 * problems could result. Event listeners are not automatically removed from memory because the garbage 
		 * collector does not remove the listener as long as the dispatching object exists (unless the 
		 * useWeakReference parameter is set to true).
		 * 
		 * Copying an {@link EventDispatcher} instance does not copy the event listeners attached to it. (If your n
		 * ewly created node needs an event listener, you must attach the listener after creating the node.) However, 
		 * if you move an {@link EventDispatcher} instance, the event listeners attached to it move along with it.
		 * 
		 * If the event listener is being registered on a node while an event is also being processed on this node, 
		 * the event listener is not triggered during the current phase but may be triggered during a later phase in 
		 * the event flow, such as the bubbling phase.
		 *
		 * If an event listener is removed from a node while an event is being processed on the node, it is still 
		 * triggered by the current actions. After it is removed, the event listener is never invoked again (unless it 
		 * is registered again for future processing).
		 *
		 * @param event The type of event.
		 * @param listener The listener function that processes the event. 
		 *				 This function must accept an Event object as its only parameter and must return 
		 *				 nothing.
		 */
		addEventListener(type: string, listener: library.BasicEventListener): void;

		/**
		 * Registers an event listener object with an {@link EventDispatcher} object so that the listener receives
		 * notification of an event. You can register event listeners on all nodes in the display list for a specific
		 * type of event, phase, and priority.
		 *
		 * After you successfully register an event listener, you cannot change its priority through additional calls
		 * to {@link addEventListener addEventListener()|} To change a listener's priority, you must first call
		 * {@link removeEventListener removeEventListener()}. Then you can register the listener again with the new
		 * priority level.
		 *
		 * Keep in mind that after the listener is registered, subsequent calls to {@link addEventListener} with a
		 * different type or useCapture value result in the creation of a separate listener registration. For example,
		 * if you first register a listener with useCapture set to true, it listens only during the capture phase. If
		 * you call {@link addEventListener} again using the same listener object, but with useCapture set to false,
		 * you have two separate listeners: one that listens during the capture phase and another that listens during
		 * the target and bubbling phases.
		 *
		 * You cannot register an event listener for only the target phase or the bubbling phase. Those phases are
		 * coupled during registration because bubbling applies only to the ancestors of the target node.
		 *
		 * If you no longer need an event listener, remove it by calling {@link removeEventListener}, or memory
		 * problems could result. Event listeners are not automatically removed from memory because the garbage
		 * collector does not remove the listener as long as the dispatching object exists (unless the
		 * useWeakReference parameter is set to true).
		 *
		 * Copying an {@link EventDispatcher} instance does not copy the event listeners attached to it. (If your n
		 * ewly created node needs an event listener, you must attach the listener after creating the node.) However,
		 * if you move an {@link EventDispatcher} instance, the event listeners attached to it move along with it.
		 *
		 * If the event listener is being registered on a node while an event is also being processed on this node,
		 * the event listener is not triggered during the current phase but may be triggered during a later phase in
		 * the event flow, such as the bubbling phase.
		 *
		 * If an event listener is removed from a node while an event is being processed on the node, it is still
		 * triggered by the current actions. After it is removed, the event listener is never invoked again (unless it
		 * is registered again for future processing).
		 *
		 * @param event The type of event.
		 * @param listener The listener function that processes the event. 
		 *				 This function must accept an Event object as its only parameter and must return 
		 *				 nothing.
		 * @param thisArg The object to be used as the **this** object.
		 */
		addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;

		/**
		 * Removes a listener from the {@link EventDispatcher} object. If there is no matching listener registered 
		 * with the {@link EventDispatcher} object, a call to this method has no effect.
		 *
		 * @param type The type of event.
		 * @param listener The listener object to remove.
		 */
		removeEventListener(type: string, listener: library.BasicEventListener): void;

		/**
		 * Removes a listener from the {@link EventDispatcher} object. If there is no matching listener registered
		 * with the {@link EventDispatcher} object, a call to this method has no effect.
		 *
		 * @param type The type of event.
		 * @param listener The listener object to remove.
		 * @param thisArg The object to be used as the **this** object.
		 */
		removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
	}

	/**
	 * The {@link EventDispatcher} class is the base class for all classes that dispatch events. The 
	 * {@link EventDispatcher} class implements the {@link IEventDispatcher} interface and is the base class for the 
	 * {@link DisplayObject} class. The {@link EventDispatcher} class allows any object on the display list to be an 
	 * event target and as such, to use the methods of the {@link IEventDispatcher} interface.
	 * 
	 * The event target serves as the local point for how events flow through the display list hierarchy. When an
	 * event such as a mouse click or a key press occurs, an event object is dispatched into the event flow from the
	 * root of the display list. The event object makes a round-trip journey to the event target, which is
	 * conceptually divided into three phases: the capture phase includes the journey from the root to the last node
	 * before the event target's node; the target phase includes only the event target node; and the bubbling phase
	 * includes any subsequent nodes encountered on the return trip to the root of the display list.
	 * 
	 * In general, the easiest way for a user-defined class to gain event dispatching capabilities is to extend 
	 * {@link EventDispatcher}. If this is impossible (that is, if the class is already extending another class), you 
	 * can instead implement the {@link IEventDispatcher} interface, create an {@link EventDispatcher} member, and 
	 * write simple hooks to route calls into the aggregated {@link EventDispatcher}.
	 *
	 * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/EventDispatcher.html
	 * @author Migrated by Jeongho Nam <http://samchon.org>
	 */
	export class EventDispatcher
		implements IEventDispatcher
	{
		/**
		 * @hidden
		 */
		private event_dispatcher_: IEventDispatcher;

		/**
		 * @hidden
		 */
		private event_listeners_: std.HashMap<string, std.HashSet<std.Pair<library.BasicEventListener, Object>>>;

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

			this.event_listeners_ = new std.HashMap<string, std.HashSet<std.Pair<library.BasicEventListener, Object>>>();
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
		public dispatchEvent(event: library.BasicEvent): boolean
		{
			event.target = this.event_dispatcher_;
			if (this.event_listeners_.has(event.type) == false)
				return false;

			let listenerSet = this.event_listeners_.get(event.type);
			for (let it = listenerSet.begin(); it.equals(listenerSet.end()) == false; it = it.next())
			{
				if (event.defaultPrevented == true)
					continue;
				
				it.value.first.apply(it.value.second, [event]);
			}
			return true;
		}
		
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: library.BasicEventListener): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
		
		public addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object = null): void
		{
			type = type.toLowerCase();
			let listenerSet: std.HashSet<std.Pair<library.BasicEventListener, Object>>;
			
			if (this.event_listeners_.has(type) == false)
			{
				listenerSet = new std.HashSet<std.Pair<library.BasicEventListener, Object>>();
				this.event_listeners_.set(type, listenerSet);
			}
			else
				listenerSet = this.event_listeners_.get(type);

			listenerSet.insert(new std.Pair<library.BasicEventListener, Object>(listener, thisArg));
		}

		
		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: library.BasicEventListener): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;

		public removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object = null): void
		{
			type = type.toLowerCase();
			if (this.event_listeners_.has(type) == false)
				return;

			let listenerSet = this.event_listeners_.get(type);
			let bind: std.Pair<library.BasicEventListener, Object> = new std.Pair<library.BasicEventListener, Object>(listener, thisArg);
			
			if (listenerSet.has(bind) == false)
				return;

			listenerSet.erase(bind);

			if (listenerSet.empty() == true)
				this.event_listeners_.erase(type);
		}
	}
}