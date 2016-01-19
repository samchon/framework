/// <reference path="../API.ts" />

/// <reference path="../../std/Exception.ts" />

namespace samchon.library
{
    /**
     * An event class.
     *
     * <ul>
     *  <li> Comments from - https://developer.mozilla.org/en-US/docs/Web/API/Event/ </li>
     * </ul>
     *
     * @author Jeongho Nam
     */
    export class BasicEvent
        implements Event
    {
        /* -------------------------------------------------------------------
		    STATIC CONSTS
	    ------------------------------------------------------------------- */
        /**
         *  No event is being processed at this time. 
         */
        public get NONE(): number { return 0; }

        /**
         * The event is being propagated through the target's ancestor objects. This process starts with the Window, 
         * then Document, then the HTMLHtmlElement, and so on through the elements until the target's parent is reached. 
         * Event listeners registered for capture mode when EventTarget.addEventListener() was called are triggered 
         * during this phase.
         */
        public static get CAPTURING_PHASE(): number { return Event.CAPTURING_PHASE; }
        public get CAPTURING_PHASE(): number { return Event.CAPTURING_PHASE; }
        

        /**
         * The event has arrived at the event's target. Event listeners registered for this phase are called at this 
         * time. If Event.bubbles is false, processing the event is finished after this phase is complete.
         */
        public static get AT_TARGET(): number { return Event.AT_TARGET; }
        public get AT_TARGET(): number { return Event.AT_TARGET; }

        /**
         * The event is propagating back up through the target's ancestors in reverse order, starting with the parent, 
         * and eventually reaching the containing Window. This is known as bubbling, and occurs only if Event.bubbles 
         * is true. Event listeners registered for this phase are triggered during this process.
         */
        public static get BUBBLING_PHASE(): number { return Event.BUBBLING_PHASE; }
        public get BUBBLING_PHASE(): number { return Event.BUBBLING_PHASE; }

        /* -------------------------------------------------------------------
		    MEMBERS
	    ------------------------------------------------------------------- */
        private type_: string;
        private target_: EventTarget;
        private currentTarget_: EventTarget;

        protected trusted_: boolean;
        protected bubbles_: boolean;
        protected cancelable_: boolean;
        protected defaultPrevented_: boolean;
        protected cancelBubble_: boolean;

        private timeStamp_: Date;

        /* -------------------------------------------------------------------
		    CONSTRUCTORS
	    ------------------------------------------------------------------- */
        public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false)
        {
            this.type_ = type.toLowerCase();
            this.target_ = null;
            this.currentTarget_ = null;

            this.trusted_ = false;
            this.bubbles_ = bubbles;
            this.cancelable_ = cancelable;
            this.defaultPrevented_ = false;
            this.cancelBubble_ = false;
            this.timeStamp_ = new Date();
        }

        /**
         * Initializes the value of an Event created. If the event has already being dispatched, this method does nothing.
         */
        public initEvent(type: string, bubbles: boolean, cancelable: boolean): void
        {
            this.type_ = type.toLowerCase();

            this.bubbles_ = bubbles;
            this.cancelable_ = cancelable;
        }

        /* -------------------------------------------------------------------
		    ACTIONS ON PROGRESS
	    ------------------------------------------------------------------- */
        /**
         * Cancels the event (if it is cancelable).
         */
        public preventDefault(): void
        {
            throw new std.AbstractMethodError("BasicEvent.preventDefault() is not overriden yet.");
        }

        /**
         * For this particular event, no other listener will be called. Neither those attached on the same element, 
         * nor those attached on elements which will be traversed later (in capture phase, for instance).
         */
        public stopImmediatePropagation()
        {
            throw new std.AbstractMethodError("BasicEvent.stopImmediatePropagation() is not overriden yet.");
        }

        /**
         * Stops the propagation of events further along in the DOM.
         */
        public stopPropagation()
        {
            throw new std.AbstractMethodError("BasicEvent.stopPropagation() is not overriden yet.");
        }

        /* -------------------------------------------------------------------
		    GETTERS
	    ------------------------------------------------------------------- */
        /**
         * The name of the event (case-insensitive).
         */
        public get type(): string
        {
            return this.type_;
        }

        /**
         * A reference to the target to which the event was originally dispatched.
         */
        public get target(): EventTarget
        {
            return this.target_;
        }

        /**
         * A reference to the currently registered target for the event.
         */
        public get currentTarget(): EventTarget
        {
            return this.currentTarget_;
        }

        /**
         * A proprietary alias for the standard Event.target property. It is specific to old versions of 
         * Microsoft Internet Explorer.
         */
        public get srcElement(): Element
        {
            return <Element>this.target_;
        }

        /**
         * Indicates whether or not the event was initiated by the browser (after a user click for instance) or 
         * by a script (using an event creation method, like event.initEvent).
         */
        public get isTrusted(): boolean
        {
            return this.isTrusted;
        }

        /**
         * A boolean indicating whether the event bubbles up through the DOM or not.
         */
        public get bubbles(): boolean
        {
            return this.bubbles_;
        }

        /**
         * A boolean indicating whether the event is cancelable.
         */
        public get cancelable(): boolean
        {
            return this.cancelable_;
        }

        /**
         * Indicates which phase of the event flow is currently being evaluated.
         */
        public get eventPhase(): number
        {
            return this.NONE;
        }

        /**
         * Returns a boolean indicating whether or not event.preventDefault() was called on the event.
         */
        public get defaultPrevented(): boolean
        {
            return this.defaultPrevented_;
        }

        /**
         * Indicates if event bubbling for this event has been canceled or not. It is set to false by default, allowing 
         * the event to bubble up the DOM, if it is a bubbleable event. Setting this property to true stops the event 
         * from bubbling up the DOM. Not all events are allowed to bubble up the DOM.
         */
        public get cancelBubble(): boolean
        {
            return this.cancelBubble_;
        }

        /**
         * The time that the event was created.
         */
        public get timeStamp(): number
        {
            return this.timeStamp_.getTime();
        }

        /**
         * Don't know what it is.
         */ 
        public get returnValue(): boolean
        {
            return false;
        }
    }
}