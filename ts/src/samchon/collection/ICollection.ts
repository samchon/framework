/// <reference path="../API.ts" />

namespace samchon.collection
{
	export interface CollectionHandler<T>
	{
		(first: std.Iterator<T>, last: std.Iterator<T>): void;
	}

	export interface MapCollectionHandler<Key, T>
		extends CollectionHandler<std.Pair<Key, T>>
	{
		(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
	}

	/**
	 * An interface for {@link IContainer containers} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface ICollection<T>
		extends std.base.IContainer<T>, library.IEventDispatcher
	{
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get insertion handler.
		 * 
		 * @return A pointer of callback function who listens elements insertion.
		 */
		get_insert_handler(): CollectionHandler<T>;

		/**
		 * Get deletion handler.
		 * 
		 * @return A pointer of callback function who listens elements deletion.
		 */
		get_erase_handler(): CollectionHandler<T>;

		/**
		 * Set insertion handler.
		 */
		set_insert_handler(listener: CollectionHandler<T>);

		/**
		 * Set deletion handler.
		 */
		set_erase_handler(listener: CollectionHandler<T>);

		/* ---------------------------------------------------------
			EVENT DISPATCHER
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: EventListener): void;

		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: EventListener, thisArg: Object): void;

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
		 * @param event The type of event; {@link CollectionEvent.INSERT} or {@link CollectionEvent.ERASE}.
		 * @param listener The listener function that processes the event. 
		 *				 This function must accept an Event object as its only parameter and must return 
		 *				 nothing.
		 */
		addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;

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
		 * @param event The type of event; {@link CollectionEvent.INSERT} or {@link CollectionEvent.ERASE}.
		 * @param listener The listener function that processes the event. 
		 *				 This function must accept an Event object as its only parameter and must return 
		 *				 nothing.
		 */
		addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;

		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: EventListener): void;

		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: EventListener, thisArg: Object): void;

		/**
		 * Removes a listener from the EventDispatcher object. If there is no matching listener registered 
		 * with the EventDispatcher object, a call to this method has no effect.
		 *
		 * @param type The type of event; {@link CollectionEvent.INSERT} or {@link CollectionEvent.ERASE}.
		 * @param listener The listener object to remove.
		 */
		removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;

		/**
		 * Removes a listener from the EventDispatcher object. If there is no matching listener registered 
		 * with the EventDispatcher object, a call to this method has no effect.
		 *
		 * @param type The type of event; {@link CollectionEvent.INSERT} or {@link CollectionEvent.ERASE}.
		 * @param listener The listener object to remove.
		 */
		removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
	}
}