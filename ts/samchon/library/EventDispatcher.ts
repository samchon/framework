/// <reference path="IEventDispatcher.ts" />

/// <reference path="../../std/Bind.ts" />

namespace samchon.library
{
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
     * @author Migrated by Jeongho Nam
     */
    export class EventDispatcher
        implements IEventDispatcher
    {
        /**
         * The origin object who issuing events.
         */
        protected target: IEventDispatcher;

        /**
         * Container of listeners.
         */
        protected listeners: std.UnorderedMap<string, std.UnorderedSet<std.Bind<EventListener, Object>>>;

        /**
         * Default Constructor.
         */
        public constructor();

        /**
         * Construct from the origin event dispatcher.
         *
         * @param target The origin object who issuing events.
         */
        public constructor(target: IEventDispatcher);

        public constructor(target: IEventDispatcher = null)
        {
            if (target == null)
                this.target = this;
            else
                this.target = target;

            this.listeners = new std.UnorderedMap<string, std.UnorderedSet<std.Bind<EventListener, Object>>>();
        }

        /**
         * @inheritdoc
         */
        public hasEventListener(type: string): boolean 
        {
            return this.listeners.has(type);
        }
        
        /**
         * @inheritdoc
         */
        public dispatchEvent(event: Event): boolean
        {
            event.target = this.target;

            if (this.listeners.has(event.type) == false)
                return false;

            var listenerSet = this.listeners.get(event.type);
            for (var it = listenerSet.begin(); it.equals(listenerSet.end()) == false; it = it.next())
                it.value.apply();

            return true;
        }
        
        /**
         * @inheritdoc
         */
        public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
        {
            var listenerSet: std.UnorderedSet<std.Bind<EventListener, Object>>;
            
            if (this.listeners.has(type) == false)
            {
                listenerSet = new std.UnorderedSet<std.Bind<EventListener, Object>>();
                this.listeners.set(type, listenerSet);
            }
            else
                listenerSet = this.listeners.get(type);

            listenerSet.insert(new std.Bind<EventListener, Object>(listener, thisArg));
        }

        /**
         * @inheritdoc
         */
        public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
        {
            if (this.listeners.has(type) == false)
                return;

            var listenerSet = this.listeners.get(type);
            var bind: std.Bind<EventListener, Object> = new std.Bind<EventListener, Object>(listener, thisArg);
            
            if (listenerSet.has(bind) == false)
                return;

            listenerSet.erase(bind);

            if (listenerSet.empty() == true)
                this.listeners.erase(type);
        }
    }
}