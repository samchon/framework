var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * <h1> Samchon-Framework </h1>
 *
 * <p> <a href="https://nodei.co/npm/samchon-framework">
 *	<img src="https://nodei.co/npm/samchon-framework.png?downloads=true&downloadRank=true&stars=true"> </a> </p>
 *
 * <p> Samchon, a SDN (Software Defined Network) framework. </p>
 *
 * <p> With Samchon Framework, you can implement distributed processing system within framework of OOD like
 * handling S/W objects (classes). You can realize cloud and distributed system very easily with provided
 * system templates and even integration with C++ is possible. </p>
 *
 * <p> The goal, ultimate utilization model of Samchon Framework is, building cloud system with NodeJS and
 * take heavy works to C++ distributed systems with provided modules (system templates). </p>
 *
 * @git https://github.com/samchon/framework
 * @author Jeongho Nam <http://samchon.org>
 */
var samchon;
(function (samchon) {
    /**
     * <p> Running on Node. </p>
     *
     * <p> Test whether the JavaScript is running on Node. </p>
     *
     * @references http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
     */
    function is_node() {
        if (typeof process === "object")
            if (typeof process.versions === "object")
                if (typeof process.versions.node !== "undefined")
                    return true;
        return false;
    }
    samchon.is_node = is_node;
})(samchon || (samchon = {}));
if (samchon.is_node() == true) {
    eval("var std = require('typescript-stl')");
    eval("var http = require('http')");
    eval("var websocket = require('websocket')");
    eval("var net = require('net')");
}
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        /**
         * A {@link Vector} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var ArrayCollection = (function (_super) {
            __extends(ArrayCollection, _super);
            function ArrayCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor		
            /* =========================================================
                ELEMENTS I/O
                    - INSERT
                    - ERASE
                    - NOTIFIER
            ============================================================
                INSERT
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.push = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i - 0] = arguments[_i];
                }
                var ret = _super.prototype.push.apply(this, items);
                this.notify_insert(this.end().advance(-items.length), this.end());
                return ret;
            };
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.push_back = function (val) {
                _super.prototype.push_back.call(this, val);
                this.notify_insert(this.end().prev(), this.end());
            };
            /**
             * @hidden
             */
            ArrayCollection.prototype.insert_by_repeating_val = function (position, n, val) {
                var ret = _super.prototype.insert_by_repeating_val.call(this, position, n, val);
                this.notify_insert(ret, ret.advance(n));
                return ret;
            };
            /**
             * @hidden
             */
            ArrayCollection.prototype.insert_by_range = function (position, begin, end) {
                var n = this.size();
                var ret = _super.prototype.insert_by_range.call(this, position, begin, end);
                n = this.size() - n;
                this.notify_insert(ret, ret.advance(n));
                return ret;
            };
            /* ---------------------------------------------------------
                ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.pop_back = function () {
                this.notify_erase(this.end().prev(), this.end());
                _super.prototype.pop_back.call(this);
            };
            /**
             * @hidden
             */
            ArrayCollection.prototype.erase_by_range = function (first, last) {
                this.notify_erase(first, last);
                return _super.prototype.erase_by_range.call(this, first, last);
            };
            /* ---------------------------------------------------------
                NOTIFIER
            --------------------------------------------------------- */
            /**
             * @hidden
             */
            ArrayCollection.prototype.notify_insert = function (first, last) {
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @hidden
             */
            ArrayCollection.prototype.notify_erase = function (first, last) {
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            ArrayCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            ArrayCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            ArrayCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            ArrayCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            /* =========================================================
                ARRAY'S MEMBERS
                    - INSERT
                    - ERASE
            ============================================================
                INSERT
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.unshift = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i - 0] = arguments[_i];
                }
                var ret = _super.prototype.unshift.apply(this, items);
                this.notify_insert(this.begin(), this.begin().advance(items.length));
                return ret;
            };
            /* ---------------------------------------------------------
                ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.pop = function () {
                this.notify_erase(this.end().prev(), this.end());
                return _super.prototype.pop.call(this);
            };
            ArrayCollection.prototype.splice = function (start, deleteCount) {
                if (deleteCount === void 0) { deleteCount = this.size() - start; }
                var items = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    items[_i - 2] = arguments[_i];
                }
                // FILTER
                if (start + deleteCount > this.size())
                    deleteCount = this.size() - start;
                // NOTIFY ERASE
                var first = new std.VectorIterator(this, start);
                var last = first.advance(deleteCount);
                this.notify_erase(first, last);
                // CALL SUPER::ERASE
                return _super.prototype.splice.apply(this, [start, deleteCount].concat(items));
            };
            return ArrayCollection;
        }(std.Vector));
        collection.ArrayCollection = ArrayCollection;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        /**
         * An event class.
         *
         * <ul>
         *  <li> Comments from - https://developer.mozilla.org/en-US/docs/Web/API/Event/ </li>
         * </ul>
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var BasicEvent = (function () {
            /* -------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------- */
            function BasicEvent(type, bubbles, cancelable) {
                if (bubbles === void 0) { bubbles = false; }
                if (cancelable === void 0) { cancelable = false; }
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
            Object.defineProperty(BasicEvent.prototype, "NONE", {
                /* -------------------------------------------------------------------
                    STATIC CONSTS
                ------------------------------------------------------------------- */
                ///**
                // * @inheritdoc
                // */
                //public static get NONE(): number { return 0; }
                get: function () { return 0; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "CAPTURING_PHASE", {
                ///**
                // * @inheritdoc
                // */
                //public static get CAPTURING_PHASE(): number { return Event.CAPTURING_PHASE; }
                get: function () { return Event.CAPTURING_PHASE; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "AT_TARGET", {
                ///**
                // * @inheritdoc
                // */
                //public static get AT_TARGET(): number { return Event.AT_TARGET; }
                get: function () { return Event.AT_TARGET; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "BUBBLING_PHASE", {
                ///**
                // * @inheritdoc
                // */
                //public static get BUBBLING_PHASE(): number { return Event.BUBBLING_PHASE; }
                get: function () { return Event.BUBBLING_PHASE; },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritdoc
             */
            BasicEvent.prototype.initEvent = function (type, bubbles, cancelable) {
                this.type_ = type.toLowerCase();
                this.bubbles_ = bubbles;
                this.cancelable_ = cancelable;
            };
            /* -------------------------------------------------------------------
                ACTIONS ON PROGRESS
            ------------------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            BasicEvent.prototype.preventDefault = function () {
            };
            /**
             * @inheritdoc
             */
            BasicEvent.prototype.stopImmediatePropagation = function () {
            };
            /**
             * @inheritdoc
             */
            BasicEvent.prototype.stopPropagation = function () {
            };
            Object.defineProperty(BasicEvent.prototype, "type", {
                /* -------------------------------------------------------------------
                    GETTERS
                ------------------------------------------------------------------- */
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return this.type_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "target", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return this.target_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "currentTarget", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return this.currentTarget_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "isTrusted", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return this.isTrusted;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "bubbles", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return this.bubbles_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "cancelable", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return this.cancelable_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "eventPhase", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "defaultPrevented", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return this.defaultPrevented_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "srcElement", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "cancelBubble", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return this.cancelBubble_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "timeStamp", {
                /**
                 * @inheritdoc
                 */
                get: function () {
                    return this.timeStamp_.getTime();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BasicEvent.prototype, "returnValue", {
                /**
                 * Don't know what it is.
                 */
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            return BasicEvent;
        }());
        library.BasicEvent = BasicEvent;
        var ProgressEvent = (function (_super) {
            __extends(ProgressEvent, _super);
            function ProgressEvent(type, numerator, denominator) {
                _super.call(this, type);
                this.numerator_ = numerator;
                this.denominator_ = denominator;
            }
            Object.defineProperty(ProgressEvent, "PROGRESS", {
                get: function () { return "progress"; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ProgressEvent.prototype, "numerator", {
                get: function () {
                    return this.numerator_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ProgressEvent.prototype, "denominator", {
                get: function () {
                    return this.denominator_;
                },
                enumerable: true,
                configurable: true
            });
            return ProgressEvent;
        }(library.BasicEvent));
        library.ProgressEvent = ProgressEvent;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
;
/// <reference path="../API.ts" />
/// <reference path="../library/Event.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        /**
         * @author Jeongho Nam <http://samchon.org>
         */
        var CollectionEvent = (function (_super) {
            __extends(CollectionEvent, _super);
            /**
             *
             *
             * @param type Type of collection event.
             * @param first
             * @param last
             */
            function CollectionEvent(type, first, last) {
                _super.call(this, type);
                this.first_ = first;
                this.last_ = last;
            }
            Object.defineProperty(CollectionEvent.prototype, "container", {
                /**
                 * Get associative container.
                 */
                get: function () {
                    return this.target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionEvent.prototype, "first", {
                /**
                 * Get range of the first.
                 */
                get: function () {
                    return this.first_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionEvent.prototype, "last", {
                /**
                 * Get range of the last.
                 */
                get: function () {
                    return this.last_;
                },
                enumerable: true,
                configurable: true
            });
            return CollectionEvent;
        }(samchon.library.BasicEvent));
        collection.CollectionEvent = CollectionEvent;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var CollectionEvent;
        (function (CollectionEvent) {
            CollectionEvent.INSERT = "insert";
            CollectionEvent.ERASE = "erase";
            CollectionEvent.REFRESH = "refresh";
        })(CollectionEvent = collection.CollectionEvent || (collection.CollectionEvent = {}));
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        /**
         * A {@link Deque} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var DequeCollection = (function (_super) {
            __extends(DequeCollection, _super);
            function DequeCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* =========================================================
                ELEMENTS I/O
                    - INSERT
                    - ERASE
                    - NOTIFIER
            ============================================================
                INSERT
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            DequeCollection.prototype.push = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i - 0] = arguments[_i];
                }
                var ret = _super.prototype.push.apply(this, items);
                this.notify_insert(this.end().advance(-items.length), this.end());
                return ret;
            };
            /**
             * @inheritdoc
             */
            DequeCollection.prototype.push_back = function (val) {
                _super.prototype.push.call(this, val);
                this.notify_insert(this.end().prev(), this.end());
            };
            /**
             * @hidden
             */
            DequeCollection.prototype.insert_by_repeating_val = function (position, n, val) {
                var ret = _super.prototype.insert_by_repeating_val.call(this, position, n, val);
                this.notify_insert(ret, ret.advance(n));
                return ret;
            };
            /**
             * @hidden
             */
            DequeCollection.prototype.insert_by_range = function (position, begin, end) {
                var n = this.size();
                var ret = _super.prototype.insert_by_range.call(this, position, begin, end);
                n = this.size() - n;
                this.notify_insert(ret, ret.advance(n));
                return ret;
            };
            /* ---------------------------------------------------------
                ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            DequeCollection.prototype.pop_back = function () {
                this.notify_erase(this.end().prev(), this.end());
                _super.prototype.pop_back.call(this);
            };
            /**
             * @hidden
             */
            DequeCollection.prototype.erase_by_range = function (first, last) {
                this.notify_erase(first, last);
                return _super.prototype.erase_by_range.call(this, first, last);
            };
            /* ---------------------------------------------------------
                NOTIFIER
            --------------------------------------------------------- */
            /**
             * @hidden
             */
            DequeCollection.prototype.notify_insert = function (first, last) {
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @hidden
             */
            DequeCollection.prototype.notify_erase = function (first, last) {
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            DequeCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            DequeCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            DequeCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            DequeCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            DequeCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return DequeCollection;
        }(std.Deque));
        collection.DequeCollection = DequeCollection;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        /**
         * A {@link HashMap} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var HashMapCollection = (function (_super) {
            __extends(HashMapCollection, _super);
            function HashMapCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* =========================================================
                ELEMENTS I/O
                    - HANDLE_INSERT & HANDLE_ERASE
            ============================================================
                HANDLE_INSERT & HANDLE_ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            HashMapCollection.prototype.handle_insert = function (first, last) {
                _super.prototype.handle_insert.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            HashMapCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            HashMapCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            HashMapCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            HashMapCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            HashMapCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            HashMapCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return HashMapCollection;
        }(std.HashMap));
        collection.HashMapCollection = HashMapCollection;
        /**
         * A {@link HashMultiMap} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var HashMultiMapCollection = (function (_super) {
            __extends(HashMultiMapCollection, _super);
            function HashMultiMapCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* =========================================================
                ELEMENTS I/O
                    - HANDLE_INSERT & HANDLE_ERASE
            ============================================================
                HANDLE_INSERT & HANDLE_ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            HashMultiMapCollection.prototype.handle_insert = function (first, last) {
                _super.prototype.handle_insert.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            HashMultiMapCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            HashMultiMapCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            HashMultiMapCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            HashMultiMapCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            HashMultiMapCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            HashMultiMapCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return HashMultiMapCollection;
        }(std.HashMap));
        collection.HashMultiMapCollection = HashMultiMapCollection;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        /**
         * A {@link HashSet} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var HashSetCollection = (function (_super) {
            __extends(HashSetCollection, _super);
            function HashSetCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* =========================================================
                ELEMENTS I/O
                    - HANDLE_INSERT & HANDLE_ERASE
            ============================================================
                HANDLE_INSERT & HANDLE_ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            HashSetCollection.prototype.handle_insert = function (first, last) {
                _super.prototype.handle_insert.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            HashSetCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            HashSetCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            HashSetCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            HashSetCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            HashSetCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            HashSetCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return HashSetCollection;
        }(std.HashSet));
        collection.HashSetCollection = HashSetCollection;
        var HashMultiSetCollection = (function (_super) {
            __extends(HashMultiSetCollection, _super);
            function HashMultiSetCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
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
            HashMultiSetCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            HashMultiSetCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            HashMultiSetCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            HashMultiSetCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            HashMultiSetCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return HashMultiSetCollection;
        }(std.HashMultiSet));
        collection.HashMultiSetCollection = HashMultiSetCollection;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        /**
         * A {@link List} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var ListCollection = (function (_super) {
            __extends(ListCollection, _super);
            function ListCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* =========================================================
                ELEMENTS I/O
                    - INSERT
                    - ERASE
                    - NOTIFIER
            ============================================================
                INSERT
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            ListCollection.prototype.push = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i - 0] = arguments[_i];
                }
                var ret = _super.prototype.push.apply(this, items);
                this.notify_insert(this.end().advance(-items.length), this.end());
                return ret;
            };
            /**
             * @inheritdoc
             */
            ListCollection.prototype.push_front = function (val) {
                _super.prototype.push_front.call(this, val);
                this.notify_insert(this.begin(), this.begin().next());
            };
            /**
             * @inheritdoc
             */
            ListCollection.prototype.push_back = function (val) {
                _super.prototype.push_back.call(this, val);
                this.notify_insert(this.end().prev(), this.end());
            };
            /**
             * @hidden
             */
            ListCollection.prototype.insert_by_repeating_val = function (position, n, val) {
                var ret = _super.prototype.insert_by_repeating_val.call(this, position, n, val);
                this.notify_insert(ret, ret.advance(n));
                return ret;
            };
            /**
             * @hidden
             */
            ListCollection.prototype.insert_by_range = function (position, begin, end) {
                var n = this.size();
                var ret = _super.prototype.insert_by_range.call(this, position, begin, end);
                n = this.size() - n;
                this.notify_insert(ret, ret.advance(n));
                return ret;
            };
            /* ---------------------------------------------------------
                ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            ListCollection.prototype.pop_front = function () {
                var it = this.begin();
                _super.prototype.pop_front.call(this);
                this.notify_erase(it, it.next());
            };
            /**
             * @inheritdoc
             */
            ListCollection.prototype.pop_back = function () {
                var it = this.end().prev();
                _super.prototype.pop_back.call(this);
                this.notify_erase(it, this.end());
            };
            /**
             * @hidden
             */
            ListCollection.prototype.erase_by_range = function (first, last) {
                var ret = _super.prototype.erase_by_range.call(this, first, last);
                this.notify_erase(first, last);
                return ret;
            };
            /* ---------------------------------------------------------
                NOTIFIER
            --------------------------------------------------------- */
            /**
             * @hidden
             */
            ListCollection.prototype.notify_insert = function (first, last) {
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @hidden
             */
            ListCollection.prototype.notify_erase = function (first, last) {
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            ListCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            ListCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            ListCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            ListCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            ListCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return ListCollection;
        }(std.List));
        collection.ListCollection = ListCollection;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        /**
         * A {@link TreeMap} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var TreeMapCollection = (function (_super) {
            __extends(TreeMapCollection, _super);
            function TreeMapCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* =========================================================
                ELEMENTS I/O
                    - HANDLE_INSERT & HANDLE_ERASE
            ============================================================
                HANDLE_INSERT & HANDLE_ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            TreeMapCollection.prototype.handle_insert = function (first, last) {
                _super.prototype.handle_insert.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            TreeMapCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            TreeMapCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            TreeMapCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            TreeMapCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            TreeMapCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            TreeMapCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return TreeMapCollection;
        }(std.HashMap));
        collection.TreeMapCollection = TreeMapCollection;
        /**
         * A {@link TreeMultiMap} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var TreeMultiMapCollection = (function (_super) {
            __extends(TreeMultiMapCollection, _super);
            function TreeMultiMapCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* =========================================================
                ELEMENTS I/O
                    - HANDLE_INSERT & HANDLE_ERASE
            ============================================================
                HANDLE_INSERT & HANDLE_ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            TreeMultiMapCollection.prototype.handle_insert = function (first, last) {
                _super.prototype.handle_insert.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            TreeMultiMapCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            TreeMultiMapCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            TreeMultiMapCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            TreeMultiMapCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            TreeMultiMapCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            TreeMultiMapCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return TreeMultiMapCollection;
        }(std.HashMap));
        collection.TreeMultiMapCollection = TreeMultiMapCollection;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        /**
         * A {@link TreeMap} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var TreeSetCollection = (function (_super) {
            __extends(TreeSetCollection, _super);
            function TreeSetCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
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
            TreeSetCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            TreeSetCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            TreeSetCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            TreeSetCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            TreeSetCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return TreeSetCollection;
        }(std.TreeSet));
        collection.TreeSetCollection = TreeSetCollection;
        /**
         * A {@link TreeMultiSet} who can detect element I/O events.
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var TreeMultiSetCollection = (function (_super) {
            __extends(TreeMultiSetCollection, _super);
            function TreeMultiSetCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* =========================================================
                ELEMENTS I/O
                    - HANDLE_INSERT & HANDLE_ERASE
            ============================================================
                HANDLE_INSERT & HANDLE_ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            TreeMultiSetCollection.prototype.handle_insert = function (first, last) {
                _super.prototype.handle_insert.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            TreeMultiSetCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            TreeMultiSetCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            TreeMultiSetCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            TreeMultiSetCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            TreeMultiSetCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            TreeMultiSetCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return TreeMultiSetCollection;
        }(std.TreeMultiSet));
        collection.TreeMultiSetCollection = TreeMultiSetCollection;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        /**
         * <p> XML is a class representing a tree structued xml objects. </p>
         * <p> The XML class provides methods and properties for working with XML objects. </p>
         *
         * <p> The XML class (along with the XMLList and Namespace) implements
         * the powerful XML-handling standard defined in ECMAScript for XML (E4X) specification. </p>
         *
         * <p> XML class has a recursive, hierarchical relationship. </p>
         *
         * <p> Relationships between XML and XMLList </p>
         * <ul>
         *	<li> XML contains XMLList from dictionary of XMLList. </li>
         *  <li> XMLList contains XML from vector of XML. </li>
         * </ul>
         *
         * <h4> Note </h4>
         * <p> Do not abuse values for expressing member variables. </p>
         *
         * <table>
         *	<tr>
         *		<th>Standard Usage</th>
         *		<th>Non-standard usage abusing value</th>
         *	</tr>
         *	<tr>
         *		<td>
         *			&lt;memberList&gt;<br/>
         *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;member id='jhnam88' name='Jeongho+Nam' birthdate='1988-03-11' /&gt;<br/>
         *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;member id='master' name='Administartor' birthdate='2011-07-28' /&gt;<br/>
         *			&lt;/memberList&gt;
         *		</td>
         *		<td>
         *			&lt;member&gt;<br/>
         *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;id&gt;jhnam88&lt;/id&gt;<br/>
         *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;name&gt;Jeongho+Nam&lt;/name&gt;<br/>
         *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;birthdate&gt;1988-03-11&lt;/birthdate&gt;<br/>
         *			&lt;/member&gt;
         *		</td>
         *	</tr>
         * </table>
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var XML = (function (_super) {
            __extends(XML, _super);
            /* -------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------- */
            /**
             * <p> Default Constructor. </p>
             *
             * <p> If the string parameter is not omitted, constructs its tag, value and
             * properties by parsing the string. If there's children, then construct the
             * children XML, XMLList objects, too. </p>
             *
             * @param str A string to be parsed
             */
            function XML(str) {
                if (str === void 0) { str = ""; }
                _super.call(this);
                this.properties = new std.HashMap();
                this.value = "";
                if (str.indexOf("<") == -1)
                    return;
                var start;
                var end;
                //ERASE HEADER OF XML
                if ((start = str.indexOf("<?xml")) != -1) {
                    end = str.indexOf("?>", start);
                    if (end != -1)
                        str = str.substr(end + 2);
                }
                //ERASE COMMENTS
                while ((start = str.indexOf("<!--")) != -1) {
                    end = str.indexOf("-->", start);
                    if (end != -1)
                        break;
                    str = str.substr(0, start) + str.substr(end + 3);
                }
                //BEGIN PARSING
                this.construct(str);
            }
            /**
             * <p> Construct XML objects by parsing a string. </p>
             */
            XML.prototype.construct = function (str) {
                this.parseTag(str);
                this.parseProperty(str);
                var res = this.parseValue(str);
                if (res.second == true)
                    this.parseChildren(res.first);
            };
            /**
             * <p> Parse and fetch a tag. </p>
             */
            XML.prototype.parseTag = function (str) {
                var start = str.indexOf("<") + 1;
                var end = this.calcMinIndex(str.indexOf(" ", start), str.indexOf("\r\n", start), str.indexOf("\n", start), str.indexOf("\t", start), str.indexOf(">", start), str.indexOf("/", start));
                if (start == 0 || end == -1)
                    return;
                this.tag = str.substring(start, end);
            };
            /**
             * <p> Parse and fetch properties. </p>
             */
            XML.prototype.parseProperty = function (str) {
                var start = str.indexOf("<" + this.tag) + this.tag.length + 1;
                var end = this.calcMinIndex(str.lastIndexOf("/"), str.indexOf(">", start));
                if (start == -1 || end == -1 || start >= end)
                    return;
                //<comp label='ABCD' /> : " label='ABCD' "
                var line = str.substring(start, end);
                if (line.indexOf("=") == -1)
                    return;
                var label;
                var value;
                var helpers = new Array();
                var inQuote = false;
                var quoteType;
                var equal;
                //INDEXING
                for (var i = 0; i < line.length; i++) {
                    //Start of quote
                    if (inQuote == false && (line.charAt(i) == "'" || line.charAt(i) == "\"")) {
                        inQuote = true;
                        start = i;
                        if (line.charAt(i) == "'")
                            quoteType = 1;
                        else if (line.charAt(i) == "\"")
                            quoteType = 2;
                    }
                    else if (inQuote == true &&
                        ((quoteType == 1 && line.charAt(i) == "'") ||
                            (quoteType == 2 && line.charAt(i) == "\""))) {
                        helpers.push({ "type": quoteType, "start": start, "end": i });
                        inQuote = false;
                    }
                }
                //CONSTRUCTING
                for (var i = 0; i < helpers.length; i++) {
                    var quote = helpers[i];
                    if (i == 0) {
                        equal = line.indexOf("=");
                        label = line.substring(0, equal).trim();
                    }
                    else {
                        equal = line.indexOf("=", helpers[i - 1]["end"] + 1);
                        label = line.substring(helpers[i - 1]["end"] + 1, equal).trim();
                    }
                    value = line.substring(helpers[i]["start"] + 1, helpers[i]["end"]);
                    this.setProperty(label, XML.decodeProperty(value));
                }
            };
            /**
             * <p> Parse and fetch a value. </p>
             */
            XML.prototype.parseValue = function (str) {
                var end_slash = str.lastIndexOf("/");
                var end_block = str.indexOf(">");
                if (end_slash < end_block || end_slash + 1 == str.lastIndexOf("<")) {
                    //STATEMENT1: <TAG />
                    //STATEMENT2: <TAG></TAG> -> SAME WITH STATEMENT1: <TAG />
                    this.value = "";
                    return new std.Pair(str, false);
                }
                var start = end_block + 1;
                var end = str.lastIndexOf("<");
                str = str.substring(start, end); //REDEFINE WEAK_STRING -> IN TO THE TAG
                if (str.indexOf("<") == -1)
                    this.value = XML.decodeValue(str.trim());
                else
                    this.value = "";
                return new std.Pair(str, true);
            };
            /**
             * <p> Parse and construct children XML objects. </p>
             */
            XML.prototype.parseChildren = function (str) {
                if (str.indexOf("<") == -1)
                    return;
                var start = str.indexOf("<");
                var end = str.lastIndexOf(">") + 1;
                str = str.substring(start, end);
                var blockStart = 0;
                var blockEnd = 0;
                start = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str.charAt(i) == "<" && str.substr(i, 2) != "</")
                        blockStart++;
                    else if (str.substr(i, 2) == "/>" || str.substr(i, 2) == "</")
                        blockEnd++;
                    if (blockStart >= 1 && blockStart == blockEnd) {
                        end = str.indexOf(">", i);
                        var xmlList = void 0;
                        var xml = new XML();
                        xml.construct(str.substring(start, end + 1));
                        if (this.has(xml.tag) == true)
                            xmlList = this.get(xml.tag);
                        else {
                            xmlList = new XMLList();
                            this.set(xml.tag, xmlList);
                        }
                        xmlList.push(xml);
                        i = end;
                        start = end + 1;
                        blockStart = 0;
                        blockEnd = 0;
                    }
                }
            };
            /* -------------------------------------------------------------
                ACCESSORS
            ------------------------------------------------------------- */
            /**
             * <p> Get tag. </p>
             */
            XML.prototype.getTag = function () {
                return this.tag;
            };
            /**
             * <p> Get value. </p>
             */
            XML.prototype.getValue = function () {
                return this.value;
            };
            /**
             * <p> Test whether a property exists or not. </p>
             */
            XML.prototype.hasProperty = function (key) {
                return this.properties.has(key);
            };
            /**
             * <p> Get property by its key. </p>
             */
            XML.prototype.getProperty = function (key) {
                return this.properties.get(key);
            };
            XML.prototype.getPropertyMap = function () {
                return this.properties;
            };
            /* -------------------------------------------------------------
                SETTERS
            ------------------------------------------------------------- */
            /**
             * <p> Set tag (identifier) of the XML. </p>
             */
            XML.prototype.setTag = function (str) {
                this.tag = str;
            };
            /**
             * <p> Set value of the XML. </p>
             *
             * <p> Do not abuse values for expressing member variables. </p>
             * <table>
             *	<tr>
             *		<th>Standard Usage</th>
             *		<th>Non-standard usage abusing value</th>
             *	</tr>
             *	<tr>
             *		<td>
             *			\<memberList\>\n
             *			&nbsp;&nbsp;&nbsp;&nbsp;\<member id='jhnam88' name='Jeongho+Nam' birthdate='1988-03-11' /\>\n
             *			&nbsp;&nbsp;&nbsp;&nbsp;\<member id='master' name='Administartor' birthdate='2011-07-28' /\>\n
             *			\</memberList\>
             *		</td>
             *		<td>
             *			\<member\>\n
             *				\<id\>jhnam88\</id\>\n
             *				\<name\>Jeongho+Nam\</name\>\n
             *				\<birthdate\>1988-03-11\</birthdate\>\n
             *			\</member\>
             *		</td>
             *	</tr>
             * </table>
             *
             * @param val A value to set
             */
            XML.prototype.setValue = function (str) {
                this.value = str;
            };
            /**
             * <p> Set a property with its key. </p>
             */
            XML.prototype.setProperty = function (key, value) {
                this.properties.set(key, value);
            };
            /**
             * <p> Erase a property by its key. </p>
             *
             * @param key The key of the property to erase
             * @throw exception out of range
             */
            XML.prototype.eraseProperty = function (key) {
                if (this.properties.has(key) == false)
                    throw Error("out of range");
                else
                    this.properties.erase(key);
            };
            XML.prototype.push = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i - 0] = arguments[_i];
                }
                for (var i = 0; i < items.length; i++) {
                    if (items[i] instanceof XML) {
                        var xml = items[i];
                        if (this.has(xml.tag) == true)
                            this.get(xml.tag).push(xml);
                        else {
                            var xmlList = new XMLList();
                            xmlList.push(xml);
                            this.set(xml.tag, xmlList);
                        }
                    }
                    else if (items[i] instanceof XMLList) {
                        var xmlList = items[i];
                        if (xmlList.empty() == true)
                            continue;
                        if (this.has(xmlList.getTag()) == true) {
                            var myXMLList = this.get(xmlList.getTag());
                            myXMLList.insert(myXMLList.end(), xmlList.begin(), xmlList.end());
                        }
                        else
                            this.set(xmlList.getTag(), xmlList);
                    }
                    else
                        _super.prototype.push.call(this, items[i]);
                }
                return this.size();
            };
            XML.prototype.addAllProperties = function (xml) {
                for (var it = xml.properties.begin(); it.equal_to(xml.properties.end()) == false; it = it.next())
                    this.setProperty(it.first, it.second);
            };
            XML.prototype.clearProperties = function () {
                this.properties.clear();
            };
            /* -------------------------------------------------------------
                FILTERS
            ------------------------------------------------------------- */
            XML.prototype.calcMinIndex = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var min = args[0];
                for (var i = 1; i < args.length; i++) {
                    if (args[i] == -1)
                        continue;
                    if (min == -1 || args[i] < min)
                        min = args[i];
                }
                return min;
            };
            /**
             * <p> Decode a value. </p>
             *
             * <table>
             *	<tr>
             *		<th>Encoded</th>
             *		<th>Decoded</th>
             *	</tr>
             *	<tr>
             *		<td>\&amp;</td>
             *		<td>\&</td>
             *	</tr>
             *	<tr>
             *		<td>\&lt;</td>
             *		<td>\<</td>
             *	</tr>
             *	<tr>
             *		<td>\&gt;</td>
             *		<td>\></td>
             *	</tr>
             * </table>
             *
             * @return A decoded string represents a value
             */
            XML.decodeValue = function (str) {
                var pairs = [
                    new std.Pair("&amp;", "&"),
                    new std.Pair("&lt;", "<"),
                    new std.Pair("&gt;", ">")
                ];
                return library.StringUtil.replaceAll.apply(library.StringUtil, [str].concat(pairs));
            };
            /**
             * <p> Encode a value. </p>
             *
             * <table>
             *	<tr>
             *		<th>Original</th>
             *		<th>Encoded</th>
             *	</tr>
             *	<tr>
             *		<td>\&</td>
             *		<td>\&amp;</td>
             *	</tr>
             *	<tr>
             *		<td>\<</td>
             *		<td>\&lt;</td>
             *	</tr>
             *	<tr>
             *		<td>\></td>
             *		<td>\&gt;</td>
             *	</tr>
             * </table>
             *
             * @return A encoded string represents a value
             */
            XML.encodeValue = function (str) {
                var pairs = [
                    new std.Pair("&", "&amp;"),
                    new std.Pair("<", "&lt;"),
                    new std.Pair(">", "&gt;")
                ];
                return library.StringUtil.replaceAll.apply(library.StringUtil, [str].concat(pairs));
            };
            /**
              * <p> Decode a property. </p>
              *
              * <table>
              *	<tr>
              *		<th>Encoded</th>
              *		<th>Decoded</th>
              *	</tr>
              *	<tr>
              *		<td>\&amp;</td>
              *		<td>\&</td>
              *	</tr>
              *	<tr>
              *		<td>\&lt;</td>
              *		<td>\<</td>
              *	</tr>
              *	<tr>
              *		<td>\&gt;</td>
              *		<td>\></td>
              *	</tr>
              *	<tr>
              *		<td>&quot;</td>
              *		<td>\"</td>
              *	</tr>
              *	<tr>
              *		<td>&apos;</td>
              *		<td>'</td>
              *	</tr>
              *	<tr>
              *		<td>&#x9;</td>
              *		<td>'</td>
              *	</tr>
              *	<tr>
              *		<td>&apos;</td>
              *		<td>\\t</td>
              *	</tr>
              *	<tr>
              *		<td>&#xA;</td>
              *		<td>\\n</td>
              *	</tr>
              *	<tr>
              *		<td>&#xD;</td>
              *		<td>\\r</td>
              *	</tr>
              * </table>
              *
              * @return A decoded string represents a property
              */
            XML.decodeProperty = function (str) {
                var pairs = [
                    new std.Pair("&amp;", "&"),
                    new std.Pair("&lt;", "<"),
                    new std.Pair("&gt;", ">"),
                    new std.Pair("&quot;", "\""),
                    new std.Pair("&apos;", "'"),
                    new std.Pair("&#x9;", "\t"),
                    new std.Pair("&#xA;", "\n"),
                    new std.Pair("&#xD;", "\r"),
                ];
                return library.StringUtil.replaceAll.apply(library.StringUtil, [str].concat(pairs));
            };
            /**
             * <p> Decode a property. </p>
             *
             * <table>
             *	<tr>
             *		<th>Original</th>
             *		<th>Encoded</th>
             *	</tr>
             *	<tr>
             *		<td>\&</td>
             *		<td>\&amp;</td>
             *	</tr>
             *	<tr>
             *		<td>\<</td>
             *		<td>\&lt;</td>
             *	</tr>
             *	<tr>
             *		<td>\></td>
             *		<td>\&gt;</td>
             *	</tr>
             *	<tr>
             *		<td>\"</td>
             *		<td>&quot;</td>
             *	</tr>
             *	<tr>
             *		<td>'</td>
             *		<td>&apos;</td>
             *	</tr>
             *	<tr>
             *		<td>'</td>
             *		<td>&#x9;</td>
             *	</tr>
             *	<tr>
             *		<td>\\t</td>
             *		<td>&apos;</td>
             *	</tr>
             *	<tr>
             *		<td>\\n</td>
             *		<td>&#xA;</td>
             *	</tr>
             *	<tr>
             *		<td>\\r</td>
             *		<td>&#xD;</td>
             *	</tr>
             * </table>
             *
             * @return A encoded string represents a property
             */
            XML.encodeProperty = function (str) {
                var pairs = [
                    new std.Pair("&", "&amp;"),
                    new std.Pair("<", "&lt;"),
                    new std.Pair(">", "&gt;"),
                    new std.Pair("\"", "&quot;"),
                    new std.Pair("'", "&apos;"),
                    new std.Pair("\t", "&#x9;"),
                    new std.Pair("\n", "&#xA;"),
                    new std.Pair("\r", "&#xD;"),
                ];
                return library.StringUtil.replaceAll.apply(library.StringUtil, [str].concat(pairs));
            };
            /* -------------------------------------------------------------
                EXPORTS
            ------------------------------------------------------------- */
            /**
             * <p> Convert the XML to a string. </p>
             */
            XML.prototype.toString = function (level) {
                if (level === void 0) { level = 0; }
                var str = library.StringUtil.tab(level) + "<" + this.tag;
                var childrenString = "";
                //PROPERTIES
                for (var p_it = this.properties.begin(); p_it.equal_to(this.properties.end()) == false; p_it = p_it.next())
                    str += " " + p_it.first + "=\"" + XML.encodeProperty(String(p_it.second)) + "\"";
                if (this.size() == 0) {
                    if (this.value != "")
                        str += ">" + XML.encodeValue(String(this.value)) + "</" + this.tag + ">";
                    else
                        str += " />";
                }
                else {
                    str += ">\n";
                    for (var x_it = this.begin(); x_it.equal_to(this.end()) == false; x_it = x_it.next())
                        str += x_it.second.toString(level + 1);
                    str += library.StringUtil.tab(level) + "</" + this.tag + ">";
                }
                return str;
            };
            /**
             * <p> Convert the XML to HTML string. </p>
             */
            XML.prototype.toHTML = function (level) {
                if (level === void 0) { level = 0; }
                var str = library.StringUtil.htmlTab(level) + "&lt;" + this.tag;
                var childrenString = "";
                //PROPERTIES
                for (var p_it = this.properties.begin(); p_it.equal_to(this.properties.end()) == false; p_it = p_it.next())
                    str += " " + p_it.first + "=&quot;" + XML.encodeProperty(String(p_it.second)) + "&quot;";
                if (this.size() == 0) {
                    if (this.value != "")
                        str += "&gt;" + XML.encodeValue(String(this.value)) + "</" + this.tag + ">";
                    else
                        str += " /&gt;";
                }
                else {
                    str += "&gt;<br>\n";
                    for (var x_it = this.begin(); x_it.equal_to(this.end()) == false; x_it = x_it.next())
                        str += x_it.second.toHTML(level + 1);
                    str += library.StringUtil.htmlTab(level) + "&lt;/" + this.tag + "&gt;";
                }
                return str;
            };
            return XML;
        }(std.HashMap));
        library.XML = XML;
        /**
         * <p> List of XML(s) having same tag. </p>
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var XMLList = (function (_super) {
            __extends(XMLList, _super);
            function XMLList() {
                _super.apply(this, arguments);
            }
            // using super::constructor
            XMLList.prototype.getTag = function () {
                if (this.size() == 0)
                    return null;
                else
                    return this.at(0).getTag();
            };
            /**
             * <p> Convert XMLList to string. </p>
             *
             * @param level Level(depth) of the XMLList.
             */
            XMLList.prototype.toString = function (level) {
                if (level === void 0) { level = 0; }
                var str = "";
                for (var i = 0; i < this.size(); i++)
                    str += this.at(i).toString(level) + "\n";
                return str;
            };
            /**
             * <p> Convert XMLList to HTML string. </p>
             *
             * @param level Level(depth) of the XMLList.
             */
            XMLList.prototype.toHTML = function (level) {
                if (level === void 0) { level = 0; }
                var str = "";
                for (var i = 0; i < this.size(); i++)
                    str += this.at(i).toHTML(level) + "<br>\n";
                return str;
            };
            return XMLList;
        }(std.Vector));
        library.XMLList = XMLList;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="../library/XML.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var XMLListCollection = (function (_super) {
            __extends(XMLListCollection, _super);
            function XMLListCollection() {
                _super.apply(this, arguments);
                /**
                 * A chain object taking responsibility of dispatching events.
                 */
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* =========================================================
                ELEMENTS I/O
                    - INSERT
                    - ERASE
                    - NOTIFIER
            ============================================================
                INSERT
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            XMLListCollection.prototype.push = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i - 0] = arguments[_i];
                }
                var ret = _super.prototype.push.apply(this, items);
                this.notify_insert(this.end().advance(-items.length), this.end());
                return ret;
            };
            /**
             * @inheritdoc
             */
            XMLListCollection.prototype.push_back = function (val) {
                _super.prototype.push.call(this, val);
                this.notify_insert(this.end().prev(), this.end());
            };
            /**
             * @hidden
             */
            XMLListCollection.prototype.insert_by_repeating_val = function (position, n, val) {
                var ret = _super.prototype.insert_by_repeating_val.call(this, position, n, val);
                this.notify_insert(ret, ret.advance(n));
                return ret;
            };
            /**
             * @hidden
             */
            XMLListCollection.prototype.insert_by_range = function (position, begin, end) {
                var n = this.size();
                var ret = _super.prototype.insert_by_range.call(this, position, begin, end);
                n = this.size() - n;
                this.notify_insert(ret, ret.advance(n));
                return ret;
            };
            /* ---------------------------------------------------------
                ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            XMLListCollection.prototype.pop_back = function () {
                this.notify_erase(this.end().prev(), this.end());
                _super.prototype.pop_back.call(this);
            };
            /**
             * @hidden
             */
            XMLListCollection.prototype.erase_by_range = function (first, last) {
                this.notify_erase(first, last);
                return _super.prototype.erase_by_range.call(this, first, last);
            };
            /* ---------------------------------------------------------
                NOTIFIER
            --------------------------------------------------------- */
            /**
             * @hidden
             */
            XMLListCollection.prototype.notify_insert = function (first, last) {
                if (this.hasEventListener(collection.CollectionEvent.INSERT))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @hidden
             */
            XMLListCollection.prototype.notify_erase = function (first, last) {
                if (this.hasEventListener(collection.CollectionEvent.ERASE))
                    this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.ERASE, first, last));
            };
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
            XMLListCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            XMLListCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
            };
            XMLListCollection.prototype.refresh = function (first, last) {
                if (first === void 0) { first = this.begin(); }
                if (last === void 0) { last = this.end(); }
                this.dispatchEvent(new collection.CollectionEvent("refresh", first, last));
            };
            XMLListCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            XMLListCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            /* =========================================================
                ARRAY'S MEMBERS
                    - INSERT
                    - ERASE
            ============================================================
                INSERT
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            XMLListCollection.prototype.unshift = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i - 0] = arguments[_i];
                }
                var ret = _super.prototype.unshift.apply(this, items);
                this.notify_insert(this.begin(), this.begin().advance(items.length));
                return ret;
            };
            /* ---------------------------------------------------------
                ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            XMLListCollection.prototype.pop = function () {
                this.notify_erase(this.end().prev(), this.end());
                return _super.prototype.pop.call(this);
            };
            XMLListCollection.prototype.splice = function (start, deleteCount) {
                if (deleteCount === void 0) { deleteCount = this.size() - start; }
                var items = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    items[_i - 2] = arguments[_i];
                }
                // FILTER
                if (start + deleteCount > this.size())
                    deleteCount = this.size() - start;
                // NOTIFY ERASE
                var first = new std.VectorIterator(this, start);
                var last = first.advance(deleteCount);
                this.notify_erase(first, last);
                // CALL SUPER::ERASE
                return _super.prototype.splice.apply(this, [start, deleteCount].concat(items));
            };
            return XMLListCollection;
        }(samchon.library.XMLList));
        collection.XMLListCollection = XMLListCollection;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        /**
         * <p> Case generator. </p>
         *
         * <p> CaseGenerator is an abstract case generator using like a matrix. </p>
         * <ul>
         *  <li> nTTr(n^r) -> CombinedPermutationGenerator </li>
         *  <li> nPr -> PermutationGenerator </li>
         *  <li> n! -> FactorialGenerator </li>
         * </ul>
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var CaseGenerator = (function () {
            /* ---------------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------------- */
            /**
             * <p> Construct from size of N and R. </p>
             *
             * @param n Size of candidates.
             * @param r Size of elements of each case.
             */
            function CaseGenerator(n, r) {
                this.n_ = n;
                this.r_ = r;
            }
            /* ---------------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------------- */
            /**
             * <p> Get size of all cases. </p>
             *
             * @return Get a number of the all cases.
             */
            CaseGenerator.prototype.size = function () {
                return this.size_;
            };
            /**
             * <p> Get size of the N. </p>
             */
            CaseGenerator.prototype.n = function () {
                return this.n_;
            };
            /**
             * <p> Get size of the R. </p>
             */
            CaseGenerator.prototype.r = function () {
                return this.r_;
            };
            return CaseGenerator;
        }());
        library.CaseGenerator = CaseGenerator;
        /**
         * <p> A combined-permutation case generator. </p>
         * <p> <sub>n</sub>TT<sub>r</sub> </p>
         *
         * @inheritdoc
         * @author Jeongho Nam <http://samchon.org>
         */
        var CombinedPermutationGenerator = (function (_super) {
            __extends(CombinedPermutationGenerator, _super);
            /* ---------------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------------- */
            /**
             * <p> Construct from size of N and R. </p>
             *
             * @param n Size of candidates.
             * @param r Size of elements of each case.
             */
            function CombinedPermutationGenerator(n, r) {
                _super.call(this, n, r);
                this.size_ = Math.pow(n, r);
                this.divider_array = new Array();
                for (var i = 0; i < r; i++) {
                    var x = r - (i + 1);
                    var val = Math.pow(n, x);
                    this.divider_array.push(val);
                }
            }
            CombinedPermutationGenerator.prototype.at = function (index) {
                var row = new Array();
                for (var i = 0; i < this.r_; i++) {
                    var val = Math.floor(index / this.divider_array[i]) % this.n_;
                    row.push(val);
                }
                return row;
            };
            return CombinedPermutationGenerator;
        }(CaseGenerator));
        library.CombinedPermutationGenerator = CombinedPermutationGenerator;
        /**
         * <p> A permutation case generator. </p>
         * <p> nPr </p>
         *
         * @author Jeongho Nam <http://samchon.org>
         * @inheritdoc
         */
        var PermuationGenerator = (function (_super) {
            __extends(PermuationGenerator, _super);
            /* ---------------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------------- */
            /**
             * <p> Construct from size of N and R. </p>
             *
             * @param n Size of candidates.
             * @param r Size of elements of each case.
             */
            function PermuationGenerator(n, r) {
                _super.call(this, n, r);
                this.size_ = n;
                for (var i = n - 1; i > n - r; i--)
                    this.size_ *= i;
            }
            /**
             * @inheritdoc
             */
            PermuationGenerator.prototype.at = function (index) {
                var atoms = new Array();
                for (var i = 0; i < this.n_; i++)
                    atoms.push(i);
                var row = new Array();
                for (var i = 0; i < this.r_; i++) {
                    var item = index % atoms.length;
                    index = Math.floor(index / atoms.length);
                    row.push(atoms[item]);
                    atoms.splice(item, 1);
                }
                return row;
            };
            return PermuationGenerator;
        }(CaseGenerator));
        library.PermuationGenerator = PermuationGenerator;
        var FactorialGenerator = (function (_super) {
            __extends(FactorialGenerator, _super);
            /**
             * Construct from factorial size N.
             *
             * @param n Factoria size N.
             */
            function FactorialGenerator(n) {
                _super.call(this, n, n);
            }
            return FactorialGenerator;
        }(PermuationGenerator));
        library.FactorialGenerator = FactorialGenerator;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
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
        var EventDispatcher = (function () {
            function EventDispatcher(dispatcher) {
                if (dispatcher === void 0) { dispatcher = null; }
                if (dispatcher == null)
                    this.event_dispatcher_ = this;
                else
                    this.event_dispatcher_ = dispatcher;
                this.event_listeners_ = new std.HashMap();
            }
            /**
             * @inheritdoc
             */
            EventDispatcher.prototype.hasEventListener = function (type) {
                type = type.toLowerCase();
                return this.event_listeners_.has(type);
            };
            /**
             * @inheritdoc
             */
            EventDispatcher.prototype.dispatchEvent = function (event) {
                if (event instanceof library.BasicEvent)
                    event["target_"] = this.event_dispatcher_;
                else
                    event.target = this.event_dispatcher_;
                if (this.event_listeners_.has(event.type) == false)
                    return false;
                var listenerSet = this.event_listeners_.get(event.type);
                for (var it = listenerSet.begin(); it.equal_to(listenerSet.end()) == false; it = it.next())
                    it.value.first.apply(it.value.second, [event]);
                //it.value.apply(event);
                return true;
            };
            EventDispatcher.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                type = type.toLowerCase();
                var listenerSet;
                if (this.event_listeners_.has(type) == false) {
                    listenerSet = new std.HashSet();
                    this.event_listeners_.set(type, listenerSet);
                }
                else
                    listenerSet = this.event_listeners_.get(type);
                listenerSet.insert(new std.Pair(listener, thisArg));
            };
            EventDispatcher.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                type = type.toLowerCase();
                if (this.event_listeners_.has(type) == false)
                    return;
                var listenerSet = this.event_listeners_.get(type);
                var bind = new std.Pair(listener, thisArg);
                if (listenerSet.has(bind) == false)
                    return;
                listenerSet.erase(bind);
                if (listenerSet.empty() == true)
                    this.event_listeners_.erase(type);
            };
            return EventDispatcher;
        }());
        library.EventDispatcher = EventDispatcher;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        /**
         * <p> The {@link FileReference} class provides a means to load and save files in browser level. </p>
         *
         * <p> The {@link FileReference} class provides a means to {@link load} and {@link save} files in browser level. A
         * browser-system dialog box prompts the user to select a file to {@link load} or a location for {@link svae}. Each
         * {@link FileReference} object refers to a single file on the user's disk and has properties that contain
         * information about the file's size, type, name, creation date, modification date, and creator type (Macintosh only).
         * </p>
         *
         * <p> FileReference instances are created in the following ways: </p>
         * <ul>
         *	<li>
         *		When you use the new operator with the {@link FileReference} constructor:
         *		<code>var myFileReference = new FileReference();</code>
         *	</li>
         *	<li>
         *		When you call the {@link FileReferenceList.browse} method, which creates an array of {@link FileReference}
         *		objects.
         *	</li>
         * </ul>
         *
         * <p> During a load operation, all the properties of a {@link FileReference} object are populated by calls to the
         * {@link FileReference.browse} or {@link FileReferenceList.browse} methods. During a save operation, the name
         * property is populated when the select event is dispatched; all other properties are populated when the complete
         * event is dispatched. </p>
         *
         * <p> The {@link browse browse()} method opens an browser-system dialog box that prompts the user to select a file
         * for {@link load}. The {@link FileReference.browse} method lets the user select a single file; the
         * {@link FileReferenceList.browse} method lets the user select multiple files. After a successful call to the
         * {@link browse browse()} method, call the {@link FileReference.load} method to load one file at a time. The
         * {@link FileReference.save} method prompts the user for a location to save the file and initiates downloading from
         * a binary or string data. </p>
         *
         * <p> The {@link FileReference} and {@link FileReferenceList} classes do not let you set the default file location
         * for the dialog box that the {@link browse} or {@link save} methods generate. The default location shown in the
         * dialog box is the most recently browsed folder, if that location can be determined, or the desktop. The classes do
         * not allow you to read from or write to the transferred file. They do not allow the browser that initiated the
         * {@link load} or {@link save} to access the loaded or saved file or the file's location on the user's disk. </p>
         *
         * @references http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/FileReference.html
         * @author Jeongho Nam <http://samchon.org>
         */
        var FileReference = (function (_super) {
            __extends(FileReference, _super);
            /**
             * Default Constructor.
             */
            function FileReference() {
                _super.call(this);
                this.file_ = null;
                this.data_ = null;
            }
            Object.defineProperty(FileReference.prototype, "data", {
                /* ---------------------------------------------------------
                    ACCESSORS
                --------------------------------------------------------- */
                /**
                 * <p> The data from the loaded file after a successful call to the {@link load load()} method. </p>
                 *
                 * <p> If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
                 * an {@link LogicError exception} will be thrown when you try to get the value of this property. </p>
                 *
                 * <p> All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
                 * </p>
                 */
                get: function () {
                    return this.data_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileReference.prototype, "name", {
                /**
                 * <p> The name of the file on the local disk. </p>
                 *
                 * <p> If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
                 * an {@link LogicError exception} will be thrown when you try to get the value of this property. </p>
                 *
                 * <p> All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
                 * </p>
                 */
                get: function () {
                    var index = this.file_.name.lastIndexOf(".");
                    if (index == -1)
                        return this.file_.name;
                    else
                        return this.file_.name.substr(0, index);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileReference.prototype, "extension", {
                /**
                 * <p> The filename extension. </p>
                 *
                 * <p> A file's extension is the part of the name following (and not including) the final dot (&quot;.&quot;). If
                 * there is no dot in the filename, the extension is <code>null</code>. </p>
                 *
                 * <p> If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
                 * an {@link LogicError exception} will be thrown when you try to get the value of this property. </p>
                 *
                 * <p> All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
                 * </p>
                 */
                get: function () {
                    var index = this.file_.name.lastIndexOf(".");
                    if (index == -1)
                        return null;
                    else
                        return this.file_.name.substr(index + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileReference.prototype, "type", {
                /**
                 * <p> The file type, metadata of the {@link extension}. </p>
                 *
                 * <p> If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
                 * an {@link LogicError exception} will be thrown when you try to get the value of this property. </p>
                 *
                 * <p> All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
                 * </p>
                 */
                get: function () {
                    return this.file_.type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileReference.prototype, "size", {
                /**
                 * <p> The size of the file on the local disk in bytes. </p>
                 *
                 * <p> If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
                 * an {@link LogicError exception} will be thrown when you try to get the value of this property. </p>
                 *
                 * <p> All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
                 * </p>
                 */
                get: function () {
                    return this.file_.size;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FileReference.prototype, "modificationDate", {
                /**
                 * <p> The date that the file on the local disk was last modified. </p>
                 *
                 * <p> If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
                 * an {@link LogicError exception} will be thrown when you try to get the value of this property. </p>
                 *
                 * <p> All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
                 * </p>
                 */
                get: function () {
                    return this.file_.lastModifiedDate;
                },
                enumerable: true,
                configurable: true
            });
            /* =========================================================
                PROCEDURES
                    - OPEN FILE
                    - SAVE FILE
            ============================================================
                OPEN FILE
            --------------------------------------------------------- */
            /**
             * <p> Displays a file-browsing dialog box that lets the user select a file to upload. The dialog box is native
             * to the user's browser system. The user can select a file on the local computer or from other systems, for
             * example, through a UNC path on Windows. </p>
             *
             * <p> When you call this method and the user successfully selects a file, the properties of this
             * {@link FileReference} object are populated with the properties of that file. Each subsequent time that the
             * {@link FileReference.browse} method is called, the {@link FileReference} object's properties are reset to
             * the file that the user selects in the dialog box. Only one {@link browse browse()} can be performed at a time
             * (because only one dialog box can be invoked at a time). </p>
             *
             * <p> Using the <i>typeFilter parameter</i>, you can determine which files the dialog box displays. </p>
             *
             * @param typeFilter An array of filter strings used to filter the files that are displayed in the dialog box.
             *					 If you omit this parameter, all files are displayed.
             */
            FileReference.prototype.browse = function () {
                var typeFilter = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    typeFilter[_i - 0] = arguments[_i];
                }
                var this_ = this;
                // CREATE A FILE SELECTOR
                var input = document.createElement("input");
                input.type = "file";
                if (typeFilter.length > 0)
                    input.accept = typeFilter.toString();
                // EVENT HANDLER
                input.onchange = function (event) {
                    this_.file_ = input.files[0];
                    this_.dispatchEvent(new library.BasicEvent("select"));
                };
                // APEND TO BODY TEMPORARILY
                input.onclick = function (event) {
                    document.body.removeChild(event.target);
                };
                input.style.display = "none";
                document.body.appendChild(input);
                // CLICK DIRECTLY
                input.click();
            };
            /**
             * <p> Starts the load of a local file selected by a user. </p>
             *
             * <p> You must call the {@link FileReference.browse} or {@link FileReferenceList.browse} method before you call
             * the {@link load load()} method. </p>
             *
             * <p> Listeners receive events to indicate the progress, success, or failure of the load. Although you can use
             * the {@link FileReferenceList} object to let users select multiple files to load, you must {@link load} the
             * {@link FileReferenceList files} one by one. To {@link load} the files one by one, iterate through the
             * {@link FileReferenceList.fileList} array of {@link FileReference} objects. </p>
             *
             * <p> If the file finishes loading successfully, its contents are stored in the {@link data} property. </p>
             */
            FileReference.prototype.load = function () {
                var this_ = this;
                var reader = new FileReader();
                reader.onload = function (event) {
                    this_.data_ = reader.result;
                    this_.dispatchEvent(new library.BasicEvent("complete"));
                };
                reader.readAsText(this.file_);
            };
            /* ---------------------------------------------------------
                SAVE FILE
            --------------------------------------------------------- */
            /**
             * <p> Save a file to local filesystem. </p>
             *
             * <p> {@link FileReference.save} implemented the save function by downloading a file from a hidden anchor tag.
             * However, the plan, future's {@link FileReference} will follow such rule: </p>
             *
             * <p> Opens a dialog box that lets the user save a file to the local filesystem. </p>
             *
             * <p> The {@link save save()} method first opens an browser-system dialog box that asks the user to enter a
             * filename and select a location on the local computer to save the file. When the user selects a location and
             * confirms the save operation (for example, by clicking Save), the save process begins. Listeners receive events
             * to indicate the progress, success, or failure of the save operation. To ascertain the status of the dialog box
             * and the save operation after calling {@link save save()}, your code must listen for events such as cancel,
             * open, progress, and complete. </p>
             *
             * <p> When the file is saved successfully, the properties of the {@link FileReference} object are populated with
             * the properties of the local file. The complete event is dispatched if the save is successful. </p>
             *
             * <p> Only one {@link browse browse()} or {@link save()} session can be performed at a time (because only one
             * dialog box can be invoked at a time). </p>
             *
             * @param data The data to be saved. The data can be in one of several formats, and will be treated appropriately.
             * @param fileName File name to be saved.
             */
            FileReference.prototype.save = function (data, fileName) {
                var blob = new Blob([data], { type: "text/plain" });
                if (window.navigator.msSaveBlob != undefined) {
                    // IE ONLY
                    window.navigator.msSaveBlob(blob, fileName);
                }
                else {
                    // CREATE AN ANCHOR
                    var anchor = document.createElement("a");
                    anchor.download = fileName;
                    anchor.innerHTML = "";
                    // LINK TO THE BLOB
                    anchor.href = window.URL.createObjectURL(blob);
                    // APEND TO BODY TEMPORARILY
                    anchor.onclick = function (event) {
                        // CLICKS AND REMOVES IT DIRECTLY
                        document.body.removeChild(event.target);
                    };
                    anchor.style.display = "none";
                    document.body.appendChild(anchor);
                    // CLICK DIRECTLY
                    anchor.click();
                }
            };
            return FileReference;
        }(library.EventDispatcher));
        library.FileReference = FileReference;
        /**
         * <p> The {@link FileReferenceList} class provides a means to let users select one or more files for
         * {@link FileReference.load loading}. A {@link FileReferenceList} object represents a group of one or more local
         * files on the user's disk as an array of {@link FileReference} objects. For detailed information and important
         * considerations about {@link FileReference} objects and the FileReference class, which you use with
         * {@link FileReferenceList}, see the {@link FileReference} class. </p>
         *
         * <p> To work with the {@link FileReferenceList} class: </p>
         * <ul>
         *	<li> Instantiate the class: <code>var myFileRef = new FileReferenceList();</code> </li>
         *	<li>
         *		Call the {@link FileReferenceList.browse} method, which opens a dialog box that lets the user select one or
         *		more files for upload: <code>myFileRef.browse();</code>
         *	</li>
         *	<li>
         *		After the {@link browse browse()} method is called successfully, the {@link fileList} property of the
         *		{@link FileReferenceList} object is populated with an array of {@link FileReference} objects.
         *	</li>
         *	<li> Call {@link FileReference.load} on each element in the {@link fileList} array. </li>
         * </ul>
         *
         * <p> The {@link FileReferenceList} class includes a {@link browse browse()} method and a {@link fileList} property
         * for working with multiple files. </p>
         *
         * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/FileReferenceList.html
         * @author Jeongho Nam <http://samchon.org>
         */
        var FileReferenceList = (function (_super) {
            __extends(FileReferenceList, _super);
            /**
             * Default Constructor.
             */
            function FileReferenceList() {
                _super.call(this);
                this.file_list = new std.Vector();
            }
            Object.defineProperty(FileReferenceList.prototype, "fileList", {
                /**
                 * <p> An array of {@link FileReference} objects. </p>
                 *
                 * <p> When the {@link FileReferenceList.browse} method is called and the user has selected one or more files
                 * from the dialog box that the {@link browse browse()} method opens, this property is populated with an array of
                 * {@link FileReference} objects, each of which represents the files the user selected. </p>
                 *
                 * <p> The {@link fileList} property is populated anew each time {@link browse browse()} is called on that
                 * {@link FileReferenceList} object. </p>
                 */
                get: function () {
                    return this.file_list;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * <p> Displays a file-browsing dialog box that lets the user select one or more local files to upload. The
             * dialog box is native to the user's browser system.  </p>
             *
             * <p> When you call this method and the user successfully selects files, the {@link fileList} property of this
             * {@link FileReferenceList} object is populated with an array of {@link FileReference} objects, one for each
             * file that the user selects. Each subsequent time that the {@link FileReferenceList.browse} method is called,
             * the {@link FileReferenceList.fileList} property is reset to the file(s) that the user selects in the dialog
             * box. </p>
             *
             * <p> Using the <i>typeFilter</i> parameter, you can determine which files the dialog box displays. </p>
             *
             * <p> Only one {@link FileReference.browse}, {@link FileReference.load}, or {@link FileReferenceList.browse}
             * session can be performed at a time on a {@link FileReferenceList} object (because only one dialog box can be
             * opened at a time). </p>
             *
             * @param typeFilter An array of filter strings used to filter the files that are displayed in the dialog box.
             *					 If you omit this parameter, all files are displayed.
             */
            FileReferenceList.prototype.browse = function () {
                var typeFilter = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    typeFilter[_i - 0] = arguments[_i];
                }
                var this_ = this;
                // CREATE A FILE SELECTOR
                var input = document.createElement("input");
                input.type = "file";
                if (typeFilter.length > 0)
                    input.accept = typeFilter.toString();
                // EVENT HANDLER
                input.onchange = function (event) {
                    var fileList = input.files;
                    this_.file_list.clear();
                    for (var i = 0; i < fileList.length; i++) {
                        var reference = new FileReference();
                        reference["file_"] = fileList[i];
                        this_.file_list.push(reference);
                    }
                    this_.dispatchEvent(new library.BasicEvent("select"));
                };
                // APEND TO BODY TEMPORARILY
                input.onclick = function (event) {
                    document.body.removeChild(event.target);
                };
                input.style.display = "none";
                document.body.appendChild(input);
                // CLICK DIRECTLY
                input.click();
            };
            return FileReferenceList;
        }(library.EventDispatcher));
        library.FileReferenceList = FileReferenceList;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        /**
         * <p> A utility class supporting static methods of string. </p>
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var StringUtil = (function () {
            function StringUtil() {
            }
            /* ==================================================================
                SUBSTRING
                    - BETWEEN(s)
                    - TRIM
            =====================================================================
                BETWEEN(s)
            ------------------------------------------------------------------ */
            /**
             * <p> Generate a substring. </p>
             *
             * <p> Extracts a substring consisting of the characters from specified start to end.
             * It's same with str.substring( ? = (str.find(start) + start.size()), str.find(end, ?) ) </p>
             *
             * <code>
             let str = between("ABCD[EFGH]IJK", "[", "]");
             console.log(str); // PRINTS "EFGH"
             * </code>
             *
             * <ul>
             *	<li> If start is not specified, extracts from begin of the string to end. </li>
             *	<li> If end is not specified, extracts from start to end of the string. </li>
             *	<li> If start and end are all omitted, returns str, itself. </li>
             * </ul>
             *
             * @param str Target string to be applied between
             * @param start A string for separating substring at the front
             * @param end A string for separating substring at the end
             *
             * @return substring by specified terms
             */
            StringUtil.between = function (str, start, end) {
                if (start === void 0) { start = ""; }
                if (end === void 0) { end = ""; }
                if (start == "" && end == "")
                    return str;
                else if (start == "")
                    return str.substr(0, str.indexOf(end));
                else if (end == "")
                    return str.substr(str.indexOf(start) + start.length);
                else {
                    var startIndex = str.indexOf(start);
                    if (startIndex == -1)
                        return "";
                    return str.substring(startIndex + start.length, str.indexOf(end, startIndex + start.length));
                }
            };
            /**
             * <p> Fetch substrings. </p>
             *
             * <p> Splits a string into an array of substrings dividing by specified delimeters of start and end.
             * It's the array of substrings adjusted the between. </p>
             *
             * <ul>
             *	<li> If startStr is omitted, it's same with the split by endStr not having last item. </li>
             *	<li> If endStr is omitted, it's same with the split by startStr not having first item. </li>
             *	<li> If startStr and endStar are all omitted, returns <i>str</i>. </li>
             * </ul>
             *
             * @param str Target string to split by between
             * @param start A string for separating substring at the front.
             *				If omitted, it's same with split(end) not having last item
             * @param end A string for separating substring at the end.
             *			  If omitted, it's same with split(start) not having first item
             * @return An array of substrings
             */
            StringUtil.betweens = function (str, start, end) {
                if (start === void 0) { start = ""; }
                if (end === void 0) { end = ""; }
                var substrings = [];
                if (start == "" && end == "") {
                    // PARAMETER IS NOT SPECIFIED
                    // DO NOTHING
                    return [str];
                }
                else if (start == end) {
                    // SPLITTERS START AND END ARE EQUAL
                    var prevIndex = -1;
                    var endIndex = void 0;
                    var n = 0;
                    while ((endIndex = str.indexOf(start, prevIndex + 1)) != -1) {
                        if (++n % 2 == 0) {
                            substrings.push(str.substring(prevIndex, endIndex));
                        }
                        endIndex = prevIndex;
                    }
                }
                else {
                    substrings = str.split(start).splice(1);
                    if (end != "")
                        for (var i = substrings.length - 1; i >= 0; i--)
                            if (substrings[i].indexOf(end) == -1)
                                substrings.splice(i, 1);
                            else
                                substrings[i] = StringUtil.between(substrings[i], "", end);
                }
                return substrings;
            };
            /**
             * Remove all designated characters from the beginning and end of the specified string.
             *
             * @param str The string whose designated characters should be trimmed.
             * @param args Designated character(s).
             *
             * @return Updated string where designated characters was removed from the beginning and end.
             */
            StringUtil.trim = function (str) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (args.length == 0)
                    args = StringUtil.SPACE_ARRAY;
                return StringUtil.ltrim.apply(StringUtil, [StringUtil.rtrim.apply(StringUtil, [str].concat(args))].concat(args));
            };
            /**
             * Remove all designated characters from the beginning of the specified string.
             *
             * @param str The string should be trimmed.
             * @param delims Designated character(s).
             *
             * @return Updated string where designated characters was removed from the beginning
             */
            StringUtil.ltrim = function (str) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (args.length == 0)
                    args = StringUtil.SPACE_ARRAY;
                var index = 0;
                while (index < str.length) {
                    var maxIndex = index;
                    for (var i = 0; i < args.length; i++) {
                        var myIndex = str.indexOf(args[i], maxIndex) // START FROM PREVIOUS MAX_INDEX
                            + args[i].length; // ADD ITS LENGTH
                        maxIndex = Math.max(maxIndex, myIndex);
                    }
                    if (maxIndex <= index)
                        break; // CAN BE -1
                    else
                        index = maxIndex;
                }
                if (index == str.length)
                    return "";
                else
                    return str.substr(index);
            };
            /**
             * Remove all designated characters from the end of the specified string.
             *
             * @param str The string should be trimmed.
             * @param delims Designated character(s).
             *
             * @return Updated string where designated characters was removed from the end.
             */
            StringUtil.rtrim = function (str) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (args.length == 0)
                    args = StringUtil.SPACE_ARRAY;
                var index = str.length;
                while (index != 0) {
                    var minIndex = index;
                    for (var i = 0; i < args.length; i++) {
                        var myIndex = str.lastIndexOf(args[i], minIndex - 1);
                        if (myIndex == -1)
                            continue;
                        minIndex = Math.min(minIndex, myIndex);
                    }
                    if (minIndex == -1 || minIndex >= index)
                        break;
                    else
                        index = minIndex;
                }
                return str.substr(0, index);
            };
            /* ==================================================================
                REPLACERS
                    - SUBSTITUTE
                    - REPLACE_ALL
                    - MISCELLANEOUS
            =====================================================================
                SUBSTITUTE
            ------------------------------------------------------------------ */
            /**
             * Substitute <code>{n}</code> tokens within the specified string.
             *
             * @param format The string to make substitutions in. This string can contain special tokens of the form
             *				 <code>{n}</code>, where <code>n</code> is a zero based index, that will be replaced with the
             *				 additional parameters found at that index if specified.
             * @param args Additional parameters that can be substituted in the <i>format</i> parameter at each
             *			   <code>{n}</code> location, where <code>n</code> is an integer (zero based) index value into
             *			   the array of values specified.
             *
             * @return New string with all of the <code>{n}</code> tokens replaced with the respective arguments specified.
             */
            StringUtil.substitute = function (format) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                while (true) {
                    if (args.length == 0)
                        break;
                    var parenthesisArray = StringUtil.betweens(format, "{", "}");
                    var minIndex = Number.MAX_VALUE;
                    for (var i = 0; i < parenthesisArray.length; i++) {
                        var index = Number(parenthesisArray[i]);
                        if (isNaN(index) == true)
                            continue;
                        minIndex = Math.min(minIndex, index);
                    }
                    if (minIndex == Number.MAX_VALUE)
                        break;
                    format = StringUtil.replaceAll(format, "{" + minIndex + "}", args[0]);
                    args.shift();
                }
                return format;
            };
            StringUtil.replaceAll = function (str) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (args.length == 2 && typeof args[0] == "string") {
                    var before = args[0];
                    var after = args[1];
                    return str.split(before).join(after);
                }
                else {
                    var pairs = args[0];
                    if (pairs.length == 0)
                        return str;
                    for (var i = 0; i < pairs.length; i++)
                        str = str.split(pairs[i].first).join(pairs[i].second);
                    return str;
                }
            };
            /* ------------------------------------------------------------------
                MISCELLANEOUS
            ------------------------------------------------------------------ */
            /**
             * <p> Get a tabbed string by specified size. </p>
             */
            StringUtil.tab = function (size) {
                var str = "";
                for (var i = 0; i < size; i++)
                    str += "\t";
                return str;
            };
            /**
             * <p> Get a tabbed HTLM string by specified size. </p>
             */
            StringUtil.htmlTab = function (size) {
                var str = "";
                for (var i = 0; i < size; i++)
                    str += "&nbsp;&nbsp;&nbsp;&nbsp;";
                return str;
            };
            /**
             * Replace all HTML spaces to a literal space.
             *
             * @param str Target string to replace.
             */
            StringUtil.removeHTMLSpaces = function (str) {
                return StringUtil.replaceAll(str, new std.Pair("&nbsp;", " "), new std.Pair("\t", " "), new std.Pair("  ", " "));
            };
            /* ------------------------------------------------------------------
                TRIM
            ------------------------------------------------------------------ */
            /**
             * An array containing whitespaces.
             */
            StringUtil.SPACE_ARRAY = [" ", "\t", "\r", "\n"];
            return StringUtil;
        }());
        library.StringUtil = StringUtil;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        var URLVariables = (function (_super) {
            __extends(URLVariables, _super);
            function URLVariables(str) {
                if (str === void 0) { str = ""; }
                _super.call(this);
                if (str.trim() == "")
                    return;
                if (str.indexOf("?") != -1)
                    str = str.substr(str.indexOf("?") + 1);
                var var_pairs = str.split("&");
                for (var i = 0; i < var_pairs.length; i++) {
                    var equal_index = var_pairs[i].indexOf("=");
                    var key = void 0;
                    var value = void 0;
                    if (equal_index == -1) {
                        key = var_pairs[i];
                        value = "";
                    }
                    else {
                        key = var_pairs[i].substr(0, equal_index);
                        name = decodeURIComponent(var_pairs[i].substr(equal_index + 1));
                    }
                    this.insert([key, name]);
                }
            }
            URLVariables.prototype.toString = function () {
                var str = "";
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next()) {
                    if (!it.equal_to(this.begin()))
                        str += "&";
                    str += it.first + "=" + encodeURIComponent(it.second);
                }
                return str;
            };
            return URLVariables;
        }(std.HashMap));
        library.URLVariables = URLVariables;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
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
        var Entity = (function () {
            /**
             * Default Constructor.
             */
            function Entity() {
                //NOTHING
            }
            Entity.prototype.construct = function (xml) {
                // MEMBER VARIABLES; ATOMIC
                var propertyMap = xml.getPropertyMap();
                for (var v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next())
                    if (this.hasOwnProperty(v_it.first) == true)
                        if (typeof this[v_it.first] == "number")
                            this[v_it.first] = parseFloat(v_it.second);
                        else if (typeof this[v_it.first] == "string")
                            this[v_it.first] = v_it.second;
                        else if (typeof this[v_it.first] == "boolean")
                            this[v_it.first] = (v_it.second == "true");
            };
            /**
             * @inheritdoc
             */
            Entity.prototype.key = function () { return ""; };
            /**
             * @inheritdoc
             */
            Entity.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                // MEMBERS
                for (var key in this)
                    if (typeof key == "string" // NOT STRING, THEN IT MEANS CHILDREN (INT, INDEX)
                        && (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean")
                        && this.hasOwnProperty(key)) {
                        xml.setProperty(key, this[key] + "");
                    }
                return xml;
            };
            return Entity;
        }());
        protocol.Entity = Entity;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="../library/XML.ts" />
/// <reference path="../collection/ArrayCollection.ts" />
/// <reference path="../protocol/Entity.ts" />
if (samchon.is_node() == true)
    for (var key in samchon)
        exports[key] = samchon[key];
/// <reference path="../API.ts" />
/// <reference path="../collection/ArrayCollection.ts" />
/// <reference path="../collection/ListCollection.ts" />
/// <reference path="../collection/DequeCollection.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        ;
        /**
         * @inheritdoc
         */
        var EntityArrayCollection = (function (_super) {
            __extends(EntityArrayCollection, _super);
            function EntityArrayCollection() {
                _super.apply(this, arguments);
            }
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            // using super::super;
            /**
             * @inheritdoc
             */
            EntityArrayCollection.prototype.construct = function (xml) {
                this.clear();
                // MEMBER VARIABLES; ATOMIC
                var propertyMap = xml.getPropertyMap();
                for (var v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next()) {
                    if (v_it.first == "length")
                        continue;
                    if (typeof this[v_it.first] == "number")
                        this[v_it.first] = parseFloat(v_it.second);
                    else if (typeof this[v_it.first] == "string")
                        this[v_it.first] = v_it.second;
                    else if (typeof this[v_it.first] == "boolean")
                        this[v_it.first] = (v_it.second == "true");
                }
                //CHILDREN
                if (xml.has(this.CHILD_TAG()) == false)
                    return;
                var xmlList = xml.get(this.CHILD_TAG());
                var children = [];
                for (var i = 0; i < xmlList.size(); i++) {
                    var child = this.createChild(xmlList.at(i));
                    if (child == null)
                        continue;
                    child.construct(xmlList.at(i));
                    children.push(child);
                }
                this.push.apply(this, children);
            };
            /* ------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------ */
            /**
             * @inheritdoc
             */
            EntityArrayCollection.prototype.key = function () {
                return "";
            };
            /**
             * @inheritdoc
             */
            //public find(key: any): std.VectorIterator<T>
            //{
            //	return std.find_if(this.begin(), this.end(),
            //		function (entity: T): boolean
            //		{
            //			return std.equal_to(entity.key(), key);
            //		}
            //	);
            //}
            /**
             * @inheritdoc
             */
            EntityArrayCollection.prototype.has = function (key) {
                return std.any_of(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityArrayCollection.prototype.count = function (key) {
                return std.count_if(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityArrayCollection.prototype.get = function (key) {
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    if (it.value.key() == key)
                        return it.value;
                throw new std.OutOfRange("out of range");
            };
            /**
             * @inheritdoc
             */
            EntityArrayCollection.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                // MEMBERS
                for (var key in this)
                    if (typeof key == "string"
                        && (typeof this[key] == "string" || typeof this[key] == "number")
                        && this.hasOwnProperty(key)) {
                        if (key == "length")
                            continue;
                        // ATOMIC
                        xml.setProperty(key, this[key] + "");
                    }
                // CHILDREN
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    xml.push(it.value.toXML());
                return xml;
            };
            return EntityArrayCollection;
        }(samchon.collection.ArrayCollection));
        protocol.EntityArrayCollection = EntityArrayCollection;
        /**
         * @inheritdoc
         */
        var EntityListCollection = (function (_super) {
            __extends(EntityListCollection, _super);
            function EntityListCollection() {
                _super.apply(this, arguments);
            }
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            // using super::super;
            /**
             * @inheritdoc
             */
            EntityListCollection.prototype.construct = function (xml) {
                this.clear();
                // MEMBER VARIABLES; ATOMIC
                var propertyMap = xml.getPropertyMap();
                for (var v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next()) {
                    if (v_it.first == "size_")
                        continue;
                    if (typeof this[v_it.first] == "number")
                        this[v_it.first] = parseFloat(v_it.second);
                    else if (typeof this[v_it.first] == "string")
                        this[v_it.first] = v_it.second;
                    else if (typeof this[v_it.first] == "boolean")
                        this[v_it.first] = (v_it.second == "true");
                }
                //CHILDREN
                if (xml.has(this.CHILD_TAG()) == false)
                    return;
                var xmlList = xml.get(this.CHILD_TAG());
                var children = [];
                for (var i = 0; i < xmlList.size(); i++) {
                    var child = this.createChild(xmlList.at(i));
                    if (child == null)
                        continue;
                    child.construct(xmlList.at(i));
                    children.push(child);
                }
                this.push.apply(this, children);
            };
            /* ------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------ */
            /**
             * @inheritdoc
             */
            EntityListCollection.prototype.key = function () {
                return "";
            };
            /**
             * @inheritdoc
             */
            //public find(key: any): std.ListIterator<T>
            //{
            //	return std.find_if(this.begin(), this.end(),
            //		function (entity: T): boolean
            //		{
            //			return std.equal_to(entity.key(), key);
            //		}
            //	);
            //}
            /**
             * @inheritdoc
             */
            EntityListCollection.prototype.has = function (key) {
                return std.any_of(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityListCollection.prototype.count = function (key) {
                return std.count_if(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityListCollection.prototype.get = function (key) {
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    if (it.value.key() == key)
                        return it.value;
                throw new std.OutOfRange("out of range");
            };
            /**
             * @inheritdoc
             */
            EntityListCollection.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                // MEMBERS
                for (var key in this)
                    if (typeof key == "string"
                        && (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean")
                        && this.hasOwnProperty(key)) {
                        if (key == "size_")
                            continue;
                        // ATOMIC
                        xml.setProperty(key, this[key] + "");
                    }
                // CHILDREN
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    xml.push(it.value.toXML());
                return xml;
            };
            return EntityListCollection;
        }(samchon.collection.ListCollection));
        protocol.EntityListCollection = EntityListCollection;
        /**
         * @inheritdoc
         */
        var EntityDequeCollection = (function (_super) {
            __extends(EntityDequeCollection, _super);
            function EntityDequeCollection() {
                _super.apply(this, arguments);
            }
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            // using super::super;
            /**
             * @inheritdoc
             */
            EntityDequeCollection.prototype.construct = function (xml) {
                this.clear();
                // MEMBER VARIABLES; ATOMIC
                var propertyMap = xml.getPropertyMap();
                for (var v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next()) {
                    if (v_it.first == "size_" || v_it.first == "capacity_")
                        continue;
                    if (typeof this[v_it.first] == "number")
                        this[v_it.first] = parseFloat(v_it.second);
                    else if (typeof this[v_it.first] == "string")
                        this[v_it.first] = v_it.second;
                    else if (typeof this[v_it.first] == "boolean")
                        this[v_it.first] = (v_it.second == "true");
                }
                //CHILDREN
                if (xml.has(this.CHILD_TAG()) == false)
                    return;
                var xmlList = xml.get(this.CHILD_TAG());
                for (var i = 0; i < xmlList.size(); i++) {
                    var child = this.createChild(xmlList.at(i));
                    if (child == null)
                        continue;
                    child.construct(xmlList.at(i));
                    this.push(child);
                }
            };
            /* ------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------ */
            /**
             * @inheritdoc
             */
            EntityDequeCollection.prototype.key = function () {
                return "";
            };
            /**
             * @inheritdoc
             */
            //public find(key: any): std.DequeIterator<T>
            //{
            //	return std.find_if(this.begin(), this.end(),
            //		function (entity: T): boolean
            //		{
            //			return std.equal_to(entity.key(), key);
            //		}
            //	);
            //}
            /**
             * @inheritdoc
             */
            EntityDequeCollection.prototype.has = function (key) {
                return std.any_of(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityDequeCollection.prototype.count = function (key) {
                return std.count_if(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityDequeCollection.prototype.get = function (key) {
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    if (it.value.key() == key)
                        return it.value;
                throw new std.OutOfRange("out of range");
            };
            /**
             * @inheritdoc
             */
            EntityDequeCollection.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                // MEMBERS
                for (var key in this)
                    if (typeof key == "string"
                        && (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean")
                        && this.hasOwnProperty(key)) {
                        if (key == "size_" || key == "capacity_")
                            continue;
                        // ATOMIC
                        xml.setProperty(key, this[key] + "");
                    }
                // CHILDREN
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    xml.push(it.value.toXML());
                return xml;
            };
            return EntityDequeCollection;
        }(samchon.collection.DequeCollection));
        protocol.EntityDequeCollection = EntityDequeCollection;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../EntityCollection.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var external;
        (function (external) {
            var ExternalSystemArray = (function (_super) {
                __extends(ExternalSystemArray, _super);
                /* ---------------------------------------------------------
                    CONSTRUCTORS
                --------------------------------------------------------- */
                /**
                 * Default Constructor.
                 */
                function ExternalSystemArray() {
                    _super.call(this);
                }
                /* ---------------------------------------------------------
                    ACCESSORS
                --------------------------------------------------------- */
                ExternalSystemArray.prototype.hasRole = function (key) {
                    for (var i = 0; i < this.size(); i++)
                        for (var j = 0; j < this.at(i).size(); j++)
                            if (this.at(i).at(j).key() == key)
                                return true;
                    return false;
                };
                ExternalSystemArray.prototype.getRole = function (key) {
                    for (var i = 0; i < this.size(); i++)
                        for (var j = 0; j < this.at(i).size(); j++)
                            if (this.at(i).at(j).key() == key)
                                return this.at(i).at(j);
                    throw new std.OutOfRange("No role with such name.");
                };
                /* ---------------------------------------------------------
                    MESSAGE CHAIN
                --------------------------------------------------------- */
                ExternalSystemArray.prototype.sendData = function (invoke) {
                    for (var i = 0; i < this.size(); i++)
                        this.at(i).sendData(invoke);
                };
                ExternalSystemArray.prototype.replyData = function (invoke) {
                    invoke.apply(this);
                };
                /* ---------------------------------------------------------
                    EXPORTERS
                --------------------------------------------------------- */
                ExternalSystemArray.prototype.TAG = function () {
                    return "systemArray";
                };
                ExternalSystemArray.prototype.CHILD_TAG = function () {
                    return "system";
                };
                return ExternalSystemArray;
            }(protocol.EntityArrayCollection));
            external.ExternalSystemArray = ExternalSystemArray;
        })(external = protocol.external || (protocol.external = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ExternalSystemArray.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var external;
        (function (external) {
            var ExternalClientArray = (function (_super) {
                __extends(ExternalClientArray, _super);
                /* =========================================================
                    CONSTRUCTORS
                        - MEMBER
                        - FACTORY METHOD FOR CHILDREN
                ============================================================
                    MEMBER
                --------------------------------------------------------- */
                /**
                 * Default Constructor.
                 */
                function ExternalClientArray() {
                    _super.call(this);
                }
                /* ---------------------------------------------------------
                    FACTORY METHOD FOR CHILDREN
                --------------------------------------------------------- */
                ExternalClientArray.prototype.addClient = function (driver) {
                    var system = this.createExternalClient(driver);
                    if (system == null)
                        return;
                    if (system["communicator"] == null) {
                        system["communicator"] = driver;
                        driver.listen(system);
                    }
                    this.push_back(system);
                };
                ExternalClientArray.prototype.createChild = function (xml) { return null; };
                /* ---------------------------------------------------------
                    SERVER's METHOD
                --------------------------------------------------------- */
                ExternalClientArray.prototype.open = function (port) {
                    this.server = this.createServer();
                    if (this.server == null)
                        return;
                    this.server.open(port);
                };
                ExternalClientArray.prototype.close = function () {
                    if (this.server != null)
                        this.server.close();
                };
                return ExternalClientArray;
            }(external.ExternalSystemArray));
            external.ExternalClientArray = ExternalClientArray;
        })(external = protocol.external || (protocol.external = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ExternalSystemArray.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var external;
        (function (external) {
            var ExternalServerArray = (function (_super) {
                __extends(ExternalServerArray, _super);
                /* ---------------------------------------------------------
                    CONSTRUCTORS
                --------------------------------------------------------- */
                /**
                 * Default Constructor.
                 */
                function ExternalServerArray() {
                    _super.call(this);
                }
                /* ---------------------------------------------------------
                    CONNECTOR's METHOD
                --------------------------------------------------------- */
                ExternalServerArray.prototype.connect = function () {
                    for (var i = 0; i < this.size(); i++)
                        if (this.at(i)["connect"] != undefined)
                            this.at(i).connect();
                };
                return ExternalServerArray;
            }(external.ExternalSystemArray));
            external.ExternalServerArray = ExternalServerArray;
        })(external = protocol.external || (protocol.external = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ExternalSystemArray.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var external;
        (function (external) {
            var ExternalServerClientArray = (function (_super) {
                __extends(ExternalServerClientArray, _super);
                /* =========================================================
                    CONSTRUCTORS
                        - MEMBER
                        - FACTORY METHOD FOR CHILDREN
                ============================================================
                    MEMBER
                --------------------------------------------------------- */
                /**
                 * Default Constructor.
                 */
                function ExternalServerClientArray() {
                    _super.call(this);
                }
                /* ---------------------------------------------------------
                    FACTORY METHOD FOR CHILDREN
                --------------------------------------------------------- */
                ExternalServerClientArray.prototype.createChild = function (xml) {
                    return this.createExternalServer(xml);
                };
                ExternalServerClientArray.prototype.addClient = function (driver) {
                    var system = this.createExternalClient(driver);
                    if (system == null)
                        return;
                    if (system["communicator"] == null) {
                        system["communicator"] = driver;
                        driver.listen(system);
                    }
                    this.push_back(system);
                };
                /* ---------------------------------------------------------
                    METHOD OF SERVER AND CLIENT
                --------------------------------------------------------- */
                ExternalServerClientArray.prototype.open = function (port) {
                    this.server = this.createServer();
                    if (this.server == null)
                        return;
                    this.server.open(port);
                };
                ExternalServerClientArray.prototype.close = function () {
                    if (this.server != null)
                        this.server.close();
                };
                ExternalServerClientArray.prototype.connect = function () {
                    for (var i = 0; i < this.size(); i++)
                        if (this.at(i)["connect"] != undefined)
                            this.at(i).connect();
                };
                return ExternalServerClientArray;
            }(external.ExternalSystemArray));
            external.ExternalServerClientArray = ExternalServerClientArray;
        })(external = protocol.external || (protocol.external = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="../../API.ts" />
/// <reference path="../EntityCollection.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var external;
        (function (external) {
            var ExternalSystem = (function (_super) {
                __extends(ExternalSystem, _super);
                /* ---------------------------------------------------------
                    CONSTRUCTORS
                --------------------------------------------------------- */
                /**
                 * Default Constructor.
                 */
                function ExternalSystem() {
                    _super.call(this);
                    this.name = "";
                    this.communicator = null;
                }
                /* ---------------------------------------------------------
                    ACCESSORS
                --------------------------------------------------------- */
                ExternalSystem.prototype.key = function () {
                    return this.name;
                };
                ExternalSystem.prototype.getName = function () {
                    return this.name;
                };
                /* ---------------------------------------------------------
                    NETWORK & MESSAGE CHAIN
                --------------------------------------------------------- */
                ExternalSystem.prototype.sendData = function (invoke) {
                    this.communicator.sendData(invoke);
                };
                ExternalSystem.prototype.replyData = function (invoke) {
                    invoke.apply(this);
                    for (var i = 0; i < this.size(); i++)
                        this.at(i).replyData(invoke);
                };
                /* ---------------------------------------------------------
                    EXPORTERS
                --------------------------------------------------------- */
                ExternalSystem.prototype.TAG = function () {
                    return "system";
                };
                ExternalSystem.prototype.CHILD_TAG = function () {
                    return "role";
                };
                return ExternalSystem;
            }(protocol.EntityArrayCollection));
            external.ExternalSystem = ExternalSystem;
        })(external = protocol.external || (protocol.external = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ExternalSystem.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var external;
        (function (external) {
            var ExternalServer = (function (_super) {
                __extends(ExternalServer, _super);
                function ExternalServer() {
                    _super.call(this);
                }
                ExternalServer.prototype.connect = function () {
                    if (this.communicator == null)
                        return;
                    this.communicator = this.createServerConnector();
                    this.communicator.connect(this.ip, this.port);
                };
                ExternalServer.prototype.getIP = function () {
                    return this.ip;
                };
                ExternalServer.prototype.getPort = function () {
                    return this.port;
                };
                return ExternalServer;
            }(external.ExternalSystem));
            external.ExternalServer = ExternalServer;
        })(external = protocol.external || (protocol.external = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../Entity.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var external;
        (function (external) {
            var ExternalSystemRole = (function (_super) {
                __extends(ExternalSystemRole, _super);
                /* ---------------------------------------------------------
                    CONSTRUCTORS
                --------------------------------------------------------- */
                function ExternalSystemRole(system) {
                    _super.call(this);
                    this.system = system;
                }
                /* ---------------------------------------------------------
                    ACCESSORS
                --------------------------------------------------------- */
                ExternalSystemRole.prototype.key = function () {
                    return this.name;
                };
                ExternalSystemRole.prototype.getSystem = function () {
                    return this.system;
                };
                ExternalSystemRole.prototype.getName = function () {
                    return this.name;
                };
                /* ---------------------------------------------------------
                    MESSAGE CHAIN
                --------------------------------------------------------- */
                ExternalSystemRole.prototype.sendData = function (invoke) {
                    this.system.sendData(invoke);
                };
                ExternalSystemRole.prototype.replyData = function (invoke) {
                    invoke.apply(this);
                };
                /* ---------------------------------------------------------
                    EXPORTERS
                --------------------------------------------------------- */
                ExternalSystemRole.prototype.TAG = function () {
                    return "role";
                };
                return ExternalSystemRole;
            }(protocol.Entity));
            external.ExternalSystemRole = ExternalSystemRole;
        })(external = protocol.external || (protocol.external = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var Server = (function () {
            function Server() {
            }
            return Server;
        }());
        protocol.Server = Server;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="Server.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var NormalCommunicator = (function () {
            function NormalCommunicator() {
                this.listener = null;
                this.socket = null;
                this.onClose = null;
                this.data = "";
                this.content_size = -1;
            }
            NormalCommunicator.prototype.close = function () {
                // HOW TO CLOSE IT?
            };
            NormalCommunicator.prototype.start_listen = function () {
                this.socket.setEncoding("utf8");
                this.socket.on("data", this.listen_piece.bind(this));
            };
            NormalCommunicator.prototype.listen_piece = function (piece) {
                this.data += piece;
                if (this.content_size == -1)
                    this.listen_header();
                else
                    this.listen_data();
            };
            NormalCommunicator.prototype.listen_header = function () {
                if (this.data.length < 8)
                    return;
                var buffer = new Buffer(this.data);
                this.data = this.data.substr(8);
                this.content_size = buffer.readUInt32BE(0, true) * Math.pow(2, 32);
                this.content_size += buffer.readUInt32BE(4, true);
                if (this.data != "")
                    this.listen_data();
            };
            NormalCommunicator.prototype.listen_data = function () {
                if (this.data.length < this.content_size)
                    return;
                var invoke = new protocol.Invoke(new samchon.library.XML(this.data.substr(0, this.content_size)));
                this.data = this.data.substr(this.content_size);
                this.content_size = -1;
                this.replyData(invoke);
                if (this.data != "")
                    this.listen_header();
            };
            NormalCommunicator.prototype.replyData = function (invoke) {
                this.listener.replyData(invoke);
            };
            NormalCommunicator.prototype.sendData = function (invoke) {
                var buffer = new Buffer(8);
                var str = invoke.toXML().toString();
                // WRITE CONTENT SIZE TO HEADER BUFFER
                buffer.writeUInt32BE(0x00000000, 0, true);
                buffer.writeUInt32BE(str.length, 4, true);
                this.socket.write(buffer); // SEND SIZE HEADER
                this.socket.write(str); // SEND DATA
            };
            return NormalCommunicator;
        }());
        protocol.NormalCommunicator = NormalCommunicator;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var NormalServer = (function (_super) {
            __extends(NormalServer, _super);
            function NormalServer() {
                _super.apply(this, arguments);
            }
            NormalServer.prototype.open = function (port) {
                this.server = net.createServer(this.handle_connect.bind(this));
                this.server.listen(port);
            };
            NormalServer.prototype.close = function () {
                this.server.close();
            };
            NormalServer.prototype.handle_connect = function (socket) {
                var clientDriver = new protocol.NormalClientDriver(socket);
                ;
                this.addClient(clientDriver);
            };
            return NormalServer;
        }(protocol.Server));
        protocol.NormalServer = NormalServer;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var NormalClientDriver = (function (_super) {
            __extends(NormalClientDriver, _super);
            function NormalClientDriver(socket) {
                _super.call(this);
                this.socket = socket;
            }
            NormalClientDriver.prototype.listen = function (listener) {
                this.listener = listener;
                this.start_listen();
            };
            return NormalClientDriver;
        }(protocol.NormalCommunicator));
        protocol.NormalClientDriver = NormalClientDriver;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var NormalServerConnector = (function (_super) {
            __extends(NormalServerConnector, _super);
            function NormalServerConnector(listener) {
                _super.call(this);
                this.listener = listener;
            }
            NormalServerConnector.prototype.connect = function (ip, port) {
                this.socket = net.connect({ host: ip, port: port }, this.handle_connect.bind(this));
            };
            NormalServerConnector.prototype.handle_connect = function () {
                var arg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arg[_i - 0] = arguments[_i];
                }
                this.start_listen();
                if (this.onConnect != null)
                    this.onConnect();
            };
            return NormalServerConnector;
        }(protocol.NormalCommunicator));
        protocol.NormalServerConnector = NormalServerConnector;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="Server.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        /**
         * <p> Base class for web-communicator, {@link WebClientDriver} and {@link WebServerConnector}. </p>
         *
         * <p> This class {@link WebCommunicatorBase} subrogates network communication for web-communicator classes,
         * {@link WebClinetDriver} and {@link WebServerConnector}. The web-communicator and this class
         * {@link WebCommunicatorBase} share same interface {@link IProtocol} and have a <b>chain of responsibily</b>
         * relationship. </p>
         *
         * <p> When an {@link Invoke} message was delivered from the connected remote system, then this class calls
         * web-communicator's {@link WebServerConnector.replyData replyData()} method. Also, when called web-communicator's
         * {@link WebClientDriver.sendData sendData()}, then {@link sendData sendData()} of this class will be caleed. </p>
         *
         * <ul>
         *	<li> this.replyData() -> communicator.replyData() </li>
         *	<li> communicator.sendData() -> this.sendData() </li>
         * </ul>
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var WebCommunicator = (function () {
            /**
             * Initialization Constructor.
             *
             * @param communicator Communicator of web-socket.
             * @param connection Connection driver, a socket for web-socket.
             */
            function WebCommunicator() {
                this.listener = null;
                this.connection = null;
                this.onClose = null;
            }
            /**
             * Listen message from remoate system.
             */
            //public listen(): void
            //{
            //	this.connection.on("message", this.handle_message.bind(this));
            //}
            /**
             * Close the connection.
             */
            WebCommunicator.prototype.close = function () {
                this.connection.close();
            };
            /**
             * <p> Handle raw-data received from the remote system. </p>
             *
             * <p> Queries raw-data received from the remote system. When the raw-data represents an formal {@link Invoke}
             * message, then it will be sent to the {@link replyData}. </p>
             *
             * @param message A raw-data received from the remote system.
             */
            WebCommunicator.prototype.handle_message = function (message) {
                if (message.type == "utf8")
                    this.replyData(new protocol.Invoke(new samchon.library.XML(message.utf8Data)));
                else
                    message.binaryData;
            };
            WebCommunicator.prototype.handle_close = function () {
                if (this.onClose != null)
                    this.onClose();
            };
            /**
             * Reply {@link Invoke} message from the remote system. </p>
             *
             * <p> {@link WebCommunicator} delivers replied {@link Invoke} message from remote system to its parent class,
             * {@link communicator}. </p>
             *
             * @param invoke An Invoke message replied from the remote system.
             */
            WebCommunicator.prototype.replyData = function (invoke) {
                this.listener.replyData(invoke);
            };
            /**
             * <p> Send message to the remote system. </p>
             *
             * {@link WebCommunicator}.{@link sendData} is called from its parent {@link communicator}'s sendData(). </p>
             *
             * @param invoke An Inovoke message to send to the remote system.
             */
            WebCommunicator.prototype.sendData = function (invoke) {
                this.connection.sendUTF(invoke.toXML().toString());
                for (var i = 0; i < invoke.size(); i++)
                    if (invoke.at(i).getType() == "ByteArray")
                        this.connection.sendBytes(invoke.at(i).getValue());
            };
            return WebCommunicator;
        }());
        protocol.WebCommunicator = WebCommunicator;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var WebServer = (function (_super) {
            __extends(WebServer, _super);
            /**
             * Default Constructor.
             */
            function WebServer() {
                _super.call(this);
                this.sequence = 0;
            }
            /**
             * @inheritdoc
             */
            WebServer.prototype.open = function (port) {
                this.my_port = port;
                this.http_server = http.createServer();
                this.http_server.listen(port);
                var ws_server = new websocket.server({ httpServer: this.http_server });
                ws_server.on("request", this.handle_request.bind(this));
            };
            WebServer.prototype.close = function () {
                this.http_server.close();
            };
            /**
             * <p> Handle request from a client system. </p>
             *
             * <p> This method {@link handle_request} will be called when a client is connected. It will call an abstract
             * method method {@link addClient addClient()} who handles an accepted client. If the newly connected client
             * doesn't have its own session id, then a new session id will be issued. </p>
             *
             * @param request Requested header.
             */
            WebServer.prototype.handle_request = function (request) {
                var path = request.resource.substr(1);
                var session_id = this.get_session_id(request.cookies);
                var connection = request.accept("", request.origin, [{ name: "SESSION_ID", value: session_id }]);
                var driver = new protocol.WebClientDriver(connection, path, session_id);
                this.addClient(driver);
            };
            /**
             * <p> Get session id from a newly connected. </p>
             *
             * <p> Queries ordinary session id from cookies of a newly connected client. If the client has not, a new
             * session id will be issued. </p>
             *
             * @param cookies Cookies from the remote client.
             */
            WebServer.prototype.get_session_id = function (cookies) {
                for (var i = 0; i < cookies.length; i++)
                    if (cookies[i].name == "SESSION_ID")
                        return cookies[i].value;
                return this.issue_session_id();
            };
            /**
             * Issue a new session id.
             */
            WebServer.prototype.issue_session_id = function () {
                var port = this.my_port;
                var uid = ++this.sequence;
                var linux_time = new Date().getTime();
                var rand = Math.floor(Math.random() * 0xffffffff);
                return port.toString(16) + uid.toString(16) + linux_time.toString(16) + rand.toString(16);
            };
            return WebServer;
        }(protocol.Server));
        protocol.WebServer = WebServer;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var WebClientDriver = (function (_super) {
            __extends(WebClientDriver, _super);
            /**
             * Initialization Constructor.
             *
             * @param connection Connection driver, a socket for web-socket.
             * @param path Requested path.
             * @param session_id Session ID, an identifier of the remote client.
             */
            function WebClientDriver(connection, path, session_id) {
                _super.call(this);
                this.connection = connection;
                this.path = path;
                this.session_id = session_id;
                this.listening_ = false;
            }
            /**
             * @inheritdoc
             */
            WebClientDriver.prototype.listen = function (listener) {
                this.listener = listener;
                if (this.listening_ == false) {
                    this.listening_ = true;
                    this.connection.on("message", this.handle_message.bind(this));
                    this.connection.on("close", this.handle_close.bind(this));
                    this.connection.on("error", this.handle_close.bind(this));
                }
            };
            /**
             * Get requested path.
             */
            WebClientDriver.prototype.getPath = function () {
                return this.path;
            };
            /**
             * Get session ID, an identifier of the remote client.
             */
            WebClientDriver.prototype.getSessionID = function () {
                return this.session_id;
            };
            return WebClientDriver;
        }(protocol.WebCommunicator));
        protocol.WebClientDriver = WebClientDriver;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        /**
         * <p> A server connector for web-socket protocol. </p>
         *
         * @author Jeongho Nam <http://samchon.org>
         */
        var WebServerConnector = (function (_super) {
            __extends(WebServerConnector, _super);
            /* ----------------------------------------------------
                CONSTRUCTORS
            ---------------------------------------------------- */
            function WebServerConnector(listener) {
                _super.call(this);
                this.listener = listener;
                this.browser_socket = null;
                this.node_client = null;
                this.onConnect = null;
            }
            /**
             * @inheritdoc
             */
            WebServerConnector.prototype.connect = function (ip, port, path) {
                if (path === void 0) { path = ""; }
                // COMPOSITE FULL-ADDRESS
                var address;
                if (ip.indexOf("ws://") == -1)
                    if (ip.indexOf("://") != -1)
                        throw "only websocket is possible";
                    else
                        ip = "ws://" + ip;
                address = ip + ":" + port + "/" + path;
                // CONNECTION BRANCHES
                if (samchon.is_node() == true) {
                    this.node_client = new websocket.client();
                    this.node_client.on("connect", this.handle_node_connect.bind(this));
                    this.node_client.connect(address);
                }
                else {
                    this.browser_socket = new WebSocket(address);
                    this.browser_socket.onopen = this.handle_browser_connect.bind(this);
                    this.browser_socket.onerror = this.handle_close.bind(this);
                    this.browser_socket.onclose = this.handle_close.bind(this);
                    this.browser_socket.onmessage = this.handle_browser_message.bind(this);
                }
            };
            /**
             * @inheritdoc
             */
            WebServerConnector.prototype.close = function () {
                this.close();
            };
            /* ----------------------------------------------------
                IPROTOCOL'S METHOD
            ---------------------------------------------------- */
            /**
             * @inheritdoc
             */
            WebServerConnector.prototype.sendData = function (invoke) {
                if (this.browser_socket != null) {
                    this.browser_socket.send(invoke.toXML().toString());
                    for (var i = 0; i < invoke.size(); i++)
                        if (invoke.at(i).getType() == "ByteArray")
                            this.browser_socket.send(invoke.at(i).getValue());
                }
                else {
                    _super.prototype.sendData.call(this, invoke);
                }
            };
            WebServerConnector.prototype.handle_browser_connect = function (event) {
                if (this.onConnect != null)
                    this.onConnect();
            };
            WebServerConnector.prototype.handle_browser_message = function (event) {
                this.replyData(new protocol.Invoke(new samchon.library.XML(event.data)));
            };
            WebServerConnector.prototype.handle_node_connect = function (connection) {
                this.connection = connection;
                this.connection.on("message", this.handle_message.bind(this));
                this.connection.on("close", this.handle_close.bind(this));
                this.connection.on("error", this.handle_close.bind(this));
                if (this.onConnect != null)
                    this.onConnect();
            };
            return WebServerConnector;
        }(protocol.WebCommunicator));
        protocol.WebServerConnector = WebServerConnector;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="Server.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var SharedWorkerServer = (function (_super) {
            __extends(SharedWorkerServer, _super);
            function SharedWorkerServer() {
                _super.apply(this, arguments);
            }
            SharedWorkerServer.prototype.open = function () {
            };
            SharedWorkerServer.prototype.close = function () {
            };
            return SharedWorkerServer;
        }(protocol.Server));
        protocol.SharedWorkerServer = SharedWorkerServer;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var SharedWorkerClientDriver = (function () {
            function SharedWorkerClientDriver() {
            }
            SharedWorkerClientDriver.prototype.listen = function (listener) {
                this.listener = listener;
            };
            SharedWorkerClientDriver.prototype.close = function () {
            };
            SharedWorkerClientDriver.prototype.sendData = function (invoke) {
            };
            SharedWorkerClientDriver.prototype.replyData = function (invoke) {
                this.listener.replyData(invoke);
            };
            return SharedWorkerClientDriver;
        }());
        protocol.SharedWorkerClientDriver = SharedWorkerClientDriver;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var SharedWorkerConnector = (function () {
            function SharedWorkerConnector(listener) {
                this.listener = listener;
                this.driver = null;
            }
            SharedWorkerConnector.prototype.connect = function (jsFile, name) {
                if (name === void 0) { name = ""; }
                this.driver = new SharedWorker(jsFile, name);
                this.driver.port.addEventListener("message", this.reply_message.bind(this));
                this.driver.port.start();
            };
            SharedWorkerConnector.prototype.close = function () {
                this.driver.port.close();
            };
            SharedWorkerConnector.prototype.sendData = function (invoke) {
                this.driver.port.postMessage(invoke.toXML().toString());
                for (var i = 0; i < invoke.size(); i++)
                    if (invoke.at(i).getType() == "ByteaArray")
                        this.driver.port.postMessage(invoke.at(i).getValue());
            };
            SharedWorkerConnector.prototype.replyData = function (invoke) {
                this.listener.replyData(invoke);
            };
            SharedWorkerConnector.prototype.reply_message = function (event) {
            };
            return SharedWorkerConnector;
        }());
        protocol.SharedWorkerConnector = SharedWorkerConnector;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../NormalCommunicator.ts" />
/// <reference path="../WebCommunicator.ts" />
/// <reference path="../SharedWorker.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var external;
        (function (external) {
            var ExtNormalServerBase = (function (_super) {
                __extends(ExtNormalServerBase, _super);
                function ExtNormalServerBase(system_array) {
                    _super.call(this);
                    this.system_array = system_array;
                }
                ExtNormalServerBase.prototype.addClient = function (driver) {
                    this.system_array["addClient"](driver);
                };
                return ExtNormalServerBase;
            }(protocol.NormalServer));
            external.ExtNormalServerBase = ExtNormalServerBase;
            var ExtWebServerBase = (function (_super) {
                __extends(ExtWebServerBase, _super);
                function ExtWebServerBase(system_array) {
                    _super.call(this);
                    this.system_array = system_array;
                }
                ExtWebServerBase.prototype.addClient = function (driver) {
                    this.system_array["addClient"](driver);
                };
                return ExtWebServerBase;
            }(protocol.WebServer));
            external.ExtWebServerBase = ExtWebServerBase;
            var ExtSharedWorkerServerBase = (function (_super) {
                __extends(ExtSharedWorkerServerBase, _super);
                function ExtSharedWorkerServerBase(system_array) {
                    _super.call(this);
                    this.system_array = system_array;
                }
                ExtSharedWorkerServerBase.prototype.addClient = function (driver) {
                    this.system_array["addClient"](driver);
                };
                return ExtSharedWorkerServerBase;
            }(protocol.SharedWorkerServer));
            external.ExtSharedWorkerServerBase = ExtSharedWorkerServerBase;
        })(external = protocol.external || (protocol.external = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        /**
         * @inheritdoc
         */
        var EntityArray = (function (_super) {
            __extends(EntityArray, _super);
            function EntityArray() {
                _super.apply(this, arguments);
            }
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            // using super::super;
            /**
             * @inheritdoc
             */
            EntityArray.prototype.construct = function (xml) {
                this.clear();
                // MEMBER VARIABLES; ATOMIC
                var propertyMap = xml.getPropertyMap();
                for (var v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next()) {
                    if (v_it.first == "length")
                        continue;
                    if (typeof this[v_it.first] == "number")
                        this[v_it.first] = parseFloat(v_it.second);
                    else if (typeof this[v_it.first] == "string")
                        this[v_it.first] = v_it.second;
                    else if (typeof this[v_it.first] == "boolean")
                        this[v_it.first] = (v_it.second == "true");
                }
                //CHILDREN
                if (xml.has(this.CHILD_TAG()) == false)
                    return;
                var xmlList = xml.get(this.CHILD_TAG());
                for (var i = 0; i < xmlList.size(); i++) {
                    var child = this.createChild(xmlList.at(i));
                    if (child == null)
                        continue;
                    child.construct(xmlList.at(i));
                    this.push(child);
                }
            };
            /* ------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------ */
            /**
             * @inheritdoc
             */
            EntityArray.prototype.key = function () {
                return "";
            };
            /**
             * @inheritdoc
             */
            //public find(key: any): std.VectorIterator<T>
            //{
            //	return std.find_if(this.begin(), this.end(),
            //		function (entity: T): boolean
            //		{
            //			return std.equal_to(entity.key(), key);
            //		}
            //	);
            //}
            /**
             * @inheritdoc
             */
            EntityArray.prototype.has = function (key) {
                return std.any_of(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityArray.prototype.count = function (key) {
                return std.count_if(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityArray.prototype.get = function (key) {
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    if (it.value.key() == key)
                        return it.value;
                throw new std.OutOfRange("out of range");
            };
            /**
             * @inheritdoc
             */
            EntityArray.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                // MEMBERS
                for (var key in this)
                    if (typeof key == "string"
                        && (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean")
                        && this.hasOwnProperty(key)) {
                        if (key == "length")
                            continue;
                        // ATOMIC
                        xml.setProperty(key, this[key] + "");
                    }
                // CHILDREN
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    xml.push(it.value.toXML());
                return xml;
            };
            return EntityArray;
        }(std.Vector));
        protocol.EntityArray = EntityArray;
        /**
         * @inheritdoc
         */
        var EntityList = (function (_super) {
            __extends(EntityList, _super);
            function EntityList() {
                _super.apply(this, arguments);
            }
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            // using super::super;
            /**
             * @inheritdoc
             */
            EntityList.prototype.construct = function (xml) {
                this.clear();
                // MEMBER VARIABLES; ATOMIC
                var propertyMap = xml.getPropertyMap();
                for (var v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next()) {
                    if (v_it.first == "size_")
                        continue;
                    if (typeof this[v_it.first] == "number")
                        this[v_it.first] = parseFloat(v_it.second);
                    else if (typeof this[v_it.first] == "string")
                        this[v_it.first] = v_it.second;
                    else if (typeof this[v_it.first] == "boolean")
                        this[v_it.first] = (v_it.second == "true");
                }
                //CHILDREN
                if (xml.has(this.CHILD_TAG()) == false)
                    return;
                var xmlList = xml.get(this.CHILD_TAG());
                for (var i = 0; i < xmlList.size(); i++) {
                    var child = this.createChild(xmlList.at(i));
                    if (child == null)
                        continue;
                    child.construct(xmlList.at(i));
                    this.push(child);
                }
            };
            /* ------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------ */
            /**
             * @inheritdoc
             */
            EntityList.prototype.key = function () {
                return "";
            };
            /**
             * @inheritdoc
             */
            //public find(key: any): std.ListIterator<T>
            //{
            //	return std.find_if(this.begin(), this.end(),
            //		function (entity: T): boolean
            //		{
            //			return std.equal_to(entity.key(), key);
            //		}
            //	);
            //}
            /**
             * @inheritdoc
             */
            EntityList.prototype.has = function (key) {
                return std.any_of(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityList.prototype.count = function (key) {
                return std.count_if(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityList.prototype.get = function (key) {
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    if (it.value.key() == key)
                        return it.value;
                throw new std.OutOfRange("out of range");
            };
            /**
             * @inheritdoc
             */
            EntityList.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                // MEMBERS
                for (var key in this)
                    if (typeof key == "string"
                        && (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean")
                        && this.hasOwnProperty(key)) {
                        // ATOMIC
                        xml.setProperty(key, this[key] + "");
                    }
                // CHILDREN
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    xml.push(it.value.toXML());
                return xml;
            };
            return EntityList;
        }(std.List));
        protocol.EntityList = EntityList;
        /**
         * @inheritdoc
         */
        var EntityDeque = (function (_super) {
            __extends(EntityDeque, _super);
            function EntityDeque() {
                _super.apply(this, arguments);
            }
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            // using super::super;
            /**
             * @inheritdoc
             */
            EntityDeque.prototype.construct = function (xml) {
                this.clear();
                // MEMBER VARIABLES; ATOMIC
                var propertyMap = xml.getPropertyMap();
                for (var v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next()) {
                    if (v_it.first == "size_" || v_it.first == "capacity_")
                        continue;
                    if (typeof this[v_it.first] == "number")
                        this[v_it.first] = parseFloat(v_it.second);
                    else if (typeof this[v_it.first] == "string")
                        this[v_it.first] = v_it.second;
                    else if (typeof this[v_it.first] == "boolean")
                        this[v_it.first] = (v_it.second == "true");
                }
                //CHILDREN
                if (xml.has(this.CHILD_TAG()) == false)
                    return;
                var xmlList = xml.get(this.CHILD_TAG());
                for (var i = 0; i < xmlList.size(); i++) {
                    var child = this.createChild(xmlList.at(i));
                    if (child == null)
                        continue;
                    child.construct(xmlList.at(i));
                    this.push(child);
                }
            };
            /* ------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------ */
            /**
             * @inheritdoc
             */
            EntityDeque.prototype.key = function () {
                return "";
            };
            /**
             * @inheritdoc
             */
            //public find(key: any): std.DequeIterator<T>
            //{
            //	return std.find_if(this.begin(), this.end(),
            //		function (entity: T): boolean
            //		{
            //			return std.equal_to(entity.key(), key);
            //		}
            //	);
            //}
            /**
             * @inheritdoc
             */
            EntityDeque.prototype.has = function (key) {
                return std.any_of(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityDeque.prototype.count = function (key) {
                return std.count_if(this.begin(), this.end(), function (entity) {
                    return std.equal_to(entity.key(), key);
                });
            };
            /**
             * @inheritdoc
             */
            EntityDeque.prototype.get = function (key) {
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    if (it.value.key() == key)
                        return it.value;
                throw new std.OutOfRange("out of range");
            };
            /**
             * @inheritdoc
             */
            EntityDeque.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                // MEMBERS
                for (var key in this)
                    if (typeof key == "string"
                        && (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean")
                        && this.hasOwnProperty(key)) {
                        if (key == "size_" || key == "capacity_")
                            continue;
                        // ATOMIC
                        xml.setProperty(key, this[key] + "");
                    }
                // CHILDREN
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    xml.push(it.value.toXML());
                return xml;
            };
            return EntityDeque;
        }(std.Deque));
        protocol.EntityDeque = EntityDeque;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="Entity.ts" />
/// <reference path="EntityArray.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var InvokeHistory = (function (_super) {
            __extends(InvokeHistory, _super);
            function InvokeHistory(invoke) {
                if (invoke === void 0) { invoke = null; }
                _super.call(this);
                if (invoke != null) {
                    this.uid = invoke.get("invoke_history_uid").getValue();
                    this.listener = invoke.getListener();
                    this.startTime = new Date();
                }
            }
            InvokeHistory.prototype.construct = function (xml) {
                _super.prototype.construct.call(this, xml);
                this.startTime = new Date(parseInt(xml.getProperty("startTime")));
                this.endTime = new Date(parseInt(xml.getProperty("endTime")));
            };
            InvokeHistory.prototype.notifyEnd = function () {
                this.endTime = new Date();
            };
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            InvokeHistory.prototype.key = function () {
                return this.uid;
            };
            InvokeHistory.prototype.getUID = function () {
                return this.uid;
            };
            InvokeHistory.prototype.getListener = function () {
                return this.listener;
            };
            InvokeHistory.prototype.getStartTime = function () {
                return this.startTime;
            };
            InvokeHistory.prototype.getEndTime = function () {
                return this.endTime;
            };
            InvokeHistory.prototype.getElapsedTime = function () {
                return this.endTime.getTime() - this.startTime.getTime();
            };
            /* ---------------------------------------------------------
                EXPORTERS
            --------------------------------------------------------- */
            InvokeHistory.prototype.TAG = function () {
                return "invokeHistory";
            };
            InvokeHistory.prototype.toXML = function () {
                var xml = _super.prototype.toXML.call(this);
                xml.setProperty("startTime", this.startTime.getTime() + "");
                xml.setProperty("endTime", this.endTime.getTime() + "");
                return xml;
            };
            InvokeHistory.prototype.toInvoke = function () {
                return new protocol.Invoke("report_invoke_history", this.toXML());
            };
            return InvokeHistory;
        }(protocol.Entity));
        protocol.InvokeHistory = InvokeHistory;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../external/ExternalSystem.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var slave;
        (function (slave) {
            var SlaveSystem = (function (_super) {
                __extends(SlaveSystem, _super);
                /**
                 * Default Constructor.
                 */
                function SlaveSystem() {
                    _super.call(this);
                }
                SlaveSystem.prototype.replyData = function (invoke) {
                    if (invoke.has("invoke_history_uid")) {
                        // INIT HISTORY - WITH START TIME
                        var history_1 = new protocol.InvokeHistory(invoke);
                        std.remove_if(invoke.begin(), invoke.end(), function (parameter) {
                            return parameter.getName() == "invoke_history_uid";
                        }); // DETACH THE UID FOR FUNCTION AUTO-MATCHING
                        // MAIN PROCESS - REPLY_DATA
                        _super.prototype.replyData.call(this, invoke);
                        // NOTIFY - WITH END TIME
                        history_1.notifyEnd();
                        this.sendData(history_1.toInvoke());
                    }
                    else
                        _super.prototype.replyData.call(this, invoke);
                };
                return SlaveSystem;
            }(protocol.external.ExternalSystem));
            slave.SlaveSystem = SlaveSystem;
        })(slave = protocol.slave || (protocol.slave = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var slave;
        (function (slave) {
            var SlaveNormalServerBase = (function (_super) {
                __extends(SlaveNormalServerBase, _super);
                function SlaveNormalServerBase(slave_system) {
                    _super.call(this);
                    this.slave_system = slave_system;
                }
                SlaveNormalServerBase.prototype.addClient = function (driver) {
                    this.slave_system["communicator"] = driver;
                    driver.listen(this.slave_system);
                };
                return SlaveNormalServerBase;
            }(protocol.NormalServer));
            slave.SlaveNormalServerBase = SlaveNormalServerBase;
            var SlaveWebServerBase = (function (_super) {
                __extends(SlaveWebServerBase, _super);
                function SlaveWebServerBase(slave_system) {
                    _super.call(this);
                    this.slave_system = slave_system;
                }
                SlaveWebServerBase.prototype.addClient = function (driver) {
                    this.slave_system["communicator"] = driver;
                    driver.listen(this.slave_system);
                };
                return SlaveWebServerBase;
            }(protocol.WebServer));
            slave.SlaveWebServerBase = SlaveWebServerBase;
            var SlaveSharedWorkerServerBase = (function (_super) {
                __extends(SlaveSharedWorkerServerBase, _super);
                function SlaveSharedWorkerServerBase(slave_system) {
                    _super.call(this);
                    this.slave_system = slave_system;
                }
                SlaveSharedWorkerServerBase.prototype.addClient = function (driver) {
                    this.slave_system["communicator"] = driver;
                    driver.listen(this.slave_system);
                };
                return SlaveSharedWorkerServerBase;
            }(protocol.SharedWorkerServer));
            slave.SlaveSharedWorkerServerBase = SlaveSharedWorkerServerBase;
        })(slave = protocol.slave || (protocol.slave = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../slave/SlaveSystem.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var master;
        (function (master) {
            var MediatorSystem = (function (_super) {
                __extends(MediatorSystem, _super);
                function MediatorSystem(systemArray) {
                    _super.call(this);
                    this.system_array = systemArray;
                    this.progress_list = new std.HashMap();
                }
                MediatorSystem.prototype.notifyEnd = function (uid) {
                    if (this.progress_list.has(uid) == false)
                        return;
                    var history = this.progress_list.get(uid);
                    this.sendData(history.toInvoke());
                    this.progress_list.erase(uid);
                };
                return MediatorSystem;
            }(protocol.slave.SlaveSystem));
            master.MediatorSystem = MediatorSystem;
        })(master = protocol.master || (protocol.master = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../external/ExternalSystemArray.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var master;
        (function (master) {
            var ParallelSystemArray = (function (_super) {
                __extends(ParallelSystemArray, _super);
                /* ---------------------------------------------------------
                    CONSTRUCTORS
                --------------------------------------------------------- */
                function ParallelSystemArray() {
                    _super.call(this);
                    this.history_sequence = 0;
                }
                /* ---------------------------------------------------------
                    ACCESSORS
                --------------------------------------------------------- */
                //public at(index: number): ParallelSystem
                //{
                //	return super.at(index) as ParallelSystem;
                //}
                //public get(key: any): ParallelSystem
                //{
                //	return super.get(key) as ParallelSystem;
                //}
                /* ---------------------------------------------------------
                    MESSAGE CHAIN
                --------------------------------------------------------- */
                ParallelSystemArray.prototype.sendSegmentData = function (invoke, size) {
                    this.sendPieceData(invoke, 0, size);
                };
                ParallelSystemArray.prototype.sendPieceData = function (invoke, index, size) {
                    invoke.push_back(new protocol.InvokeParameter("invoke_history_uid", ++this.history_sequence));
                    for (var i = 0; i < this.size(); i++) {
                        var system = this.at(i);
                        var piece_size = (i == this.size() - 1)
                            ? size - index
                            : Math.floor(size / this.size() * system.getPerformance());
                        if (piece_size == 0)
                            continue;
                        system["send_piece_data"](invoke, index, piece_size);
                        index += piece_size;
                    }
                };
                ParallelSystemArray.prototype.notify_end = function (history) {
                    var uid = history.getUID();
                    // ALL THE SUB-TASKS ARE DONE?
                    for (var i = 0; i < this.size(); i++)
                        if (this.at(i)["progress_list"].has(uid) == false)
                            return;
                    ///////
                    // RE-CALCULATE PERFORMANCE INDEX
                    ///////
                    // CONSTRUCT BASIC DATA
                    var system_pairs = new std.Vector();
                    var performance_index_avergae = 0.0;
                    for (var i = 0; i < this.size(); i++) {
                        var system = this.at(i);
                        if (system["history_list"].has(uid) == false)
                            continue;
                        var my_history = system["history_list"].get(uid);
                        var performance_index = my_history.getSize() / my_history.getElapsedTime();
                        system_pairs.push_back(std.make_pair(system, performance_index));
                        performance_index_avergae += performance_index;
                    }
                    performance_index_avergae /= system_pairs.size();
                    // RE-CALCULATE PERFORMANCE INDEX
                    for (var i = 0; i < system_pairs.size(); i++) {
                        var system = system_pairs.at(i).first;
                        var new_performance = system_pairs.at(i).second / performance_index_avergae;
                        var ordinary_ratio = Math.max(0.3, 1.0 / (system["history_list"].size() - 1.0));
                        system["performance"] = (system["performance"] * ordinary_ratio) + (new_performance * (1 - ordinary_ratio));
                    }
                    this.normalize_performance();
                };
                ParallelSystemArray.prototype.normalize_performance = function () {
                    // CALC AVERAGE
                    var average = 0.0;
                    for (var i = 0; i < this.size(); i++)
                        average += this.at(i)["performance"];
                    average /= this.size();
                    // DIVIDE FROM THE AVERAGE
                    for (var i = 0; i < this.size(); i++)
                        this.at(i)["performance"] /= average;
                };
                return ParallelSystemArray;
            }(protocol.external.ExternalSystemArray));
            master.ParallelSystemArray = ParallelSystemArray;
        })(master = protocol.master || (protocol.master = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ParallelSystemArray.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var master;
        (function (master) {
            var ParallelClientArray = (function (_super) {
                __extends(ParallelClientArray, _super);
                /* =========================================================
                    CONSTRUCTORS
                        - MEMBER
                        - FACTORY METHOD FOR CHILDREN
                ============================================================
                    MEMBER
                --------------------------------------------------------- */
                /**
                 * Default Constructor.
                 */
                function ParallelClientArray() {
                    _super.call(this);
                }
                /* ---------------------------------------------------------
                    FACTORY METHOD FOR CHILDREN
                --------------------------------------------------------- */
                ParallelClientArray.prototype.addClient = function (driver) {
                    var system = this.createExternalClient(driver);
                    if (system == null)
                        return;
                    if (system["communicator"] == null) {
                        system["communicator"] = driver;
                        driver.listen(system);
                    }
                    this.push_back(system);
                };
                ParallelClientArray.prototype.createChild = function (xml) { return null; };
                /* ---------------------------------------------------------
                    SERVER's METHOD
                --------------------------------------------------------- */
                ParallelClientArray.prototype.open = function (port) {
                    this.server = this.createServer();
                    if (this.server == null)
                        return;
                    this.server.open(port);
                };
                ParallelClientArray.prototype.close = function () {
                    if (this.server != null)
                        this.server.close();
                };
                return ParallelClientArray;
            }(master.ParallelSystemArray));
            master.ParallelClientArray = ParallelClientArray;
        })(master = protocol.master || (protocol.master = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../external/ExternalSystem.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var master;
        (function (master) {
            var ParallelSystem = (function (_super) {
                __extends(ParallelSystem, _super);
                /* ---------------------------------------------------------
                    CONSTRUCTORS
                --------------------------------------------------------- */
                function ParallelSystem(systemArray) {
                    _super.call(this);
                    this.systemArray = systemArray;
                    this.performance = 1.0;
                    this.progress_list = new std.HashMap();
                    this.history_list = new std.HashMap();
                }
                /* ---------------------------------------------------------
                    ACCESSORS
                --------------------------------------------------------- */
                ParallelSystem.prototype.getSystemArray = function () {
                    return this.systemArray;
                };
                ParallelSystem.prototype.getPerformance = function () {
                    return this.performance;
                };
                /* ---------------------------------------------------------
                    MESSAGE CHAIN
                --------------------------------------------------------- */
                ParallelSystem.prototype.send_piece_data = function (invoke, index, size) {
                    // DUPLICATE INVOKE AND ATTACH PIECE INFO
                    var my_invoke = new protocol.Invoke(invoke.getListener());
                    {
                        my_invoke.assign(invoke.begin(), invoke.end());
                        my_invoke.push_back(new protocol.InvokeParameter("index", index));
                        my_invoke.push_back(new protocol.InvokeParameter("size", size));
                    }
                    // REGISTER THE UID AS PROGRESS
                    var history = new master.PRInvokeHistory(my_invoke);
                    this.progress_list.insert([history.getUID(), history]);
                    // SEND DATA
                    this.sendData(invoke);
                };
                ParallelSystem.prototype.report_invoke_history = function (xml) {
                    ///////
                    // CONSTRUCT HISTORY
                    ///////
                    var history = new master.PRInvokeHistory();
                    history.construct(xml);
                    var progress_it = this.progress_list.find(history.getUID());
                    history["index"] = progress_it.second.getIndex();
                    history["size"] = progress_it.second.getSize();
                    // ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
                    this.progress_list.erase(progress_it);
                    this.history_list.insert([history.getUID(), history]);
                    // NOTIFY TO THE MANAGER, SYSTEM_ARRAY
                    this.systemArray["notify_end"](history);
                };
                return ParallelSystem;
            }(protocol.external.ExternalSystem));
            master.ParallelSystem = ParallelSystem;
        })(master = protocol.master || (protocol.master = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ParallelSystem.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var master;
        (function (master) {
            var ParallelServer = (function (_super) {
                __extends(ParallelServer, _super);
                function ParallelServer(systemArray) {
                    _super.call(this, systemArray);
                    this.ip = "";
                    this.port = 0;
                }
                ParallelServer.prototype.connect = function () {
                    if (this.communicator == null)
                        return;
                    this.communicator = this.createServerConnector();
                    this.communicator.connect(this.ip, this.port);
                };
                ParallelServer.prototype.getIP = function () {
                    return this.ip;
                };
                ParallelServer.prototype.getPort = function () {
                    return this.port;
                };
                return ParallelServer;
            }(master.ParallelSystem));
            master.ParallelServer = ParallelServer;
        })(master = protocol.master || (protocol.master = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ParallelSystemArray.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var master;
        (function (master) {
            var ParallelServerArray = (function (_super) {
                __extends(ParallelServerArray, _super);
                /* ---------------------------------------------------------
                    CONSTRUCTORS
                --------------------------------------------------------- */
                function ParallelServerArray() {
                    _super.call(this);
                }
                /* ---------------------------------------------------------
                    CONNECTOR's METHOD
                --------------------------------------------------------- */
                ParallelServerArray.prototype.connect = function () {
                    for (var i = 0; i < this.size(); i++)
                        if (this.at(i)["connect"] != undefined)
                            this.at(i).connect();
                };
                return ParallelServerArray;
            }(master.ParallelSystemArray));
            master.ParallelServerArray = ParallelServerArray;
        })(master = protocol.master || (protocol.master = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ParallelSystemArray.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var master;
        (function (master) {
            var ParallelServerClientArray = (function (_super) {
                __extends(ParallelServerClientArray, _super);
                /* =========================================================
                    CONSTRUCTORS
                        - MEMBER
                        - FACTORY METHOD FOR CHILDREN
                ============================================================
                    MEMBER
                --------------------------------------------------------- */
                /**
                 * Default Constructor.
                 */
                function ParallelServerClientArray() {
                    _super.call(this);
                }
                /* ---------------------------------------------------------
                    FACTORY METHOD FOR CHILDREN
                --------------------------------------------------------- */
                ParallelServerClientArray.prototype.createChild = function (xml) {
                    return this.createExternalServer(xml);
                };
                ParallelServerClientArray.prototype.addClient = function (driver) {
                    var system = this.createExternalClient(driver);
                    if (system == null)
                        return;
                    if (system["communicator"] == null) {
                        system["communicator"] = driver;
                        driver.listen(system);
                    }
                    this.push_back(system);
                };
                /* ---------------------------------------------------------
                    METHOD OF SERVER AND CLIENT
                --------------------------------------------------------- */
                ParallelServerClientArray.prototype.open = function (port) {
                    this.server = this.createServer();
                    if (this.server == null)
                        return;
                    this.server.open(port);
                };
                ParallelServerClientArray.prototype.close = function () {
                    if (this.server != null)
                        this.server.close();
                };
                ParallelServerClientArray.prototype.connect = function () {
                    for (var i = 0; i < this.size(); i++)
                        if (this.at(i)["connect"] != undefined)
                            this.at(i).connect();
                };
                return ParallelServerClientArray;
            }(master.ParallelSystemArray));
            master.ParallelServerClientArray = ParallelServerClientArray;
        })(master = protocol.master || (protocol.master = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ParallelSystemArray".ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var master;
        (function (master) {
            var ParallelSystemArrayMediator = (function (_super) {
                __extends(ParallelSystemArrayMediator, _super);
                function ParallelSystemArrayMediator() {
                    _super.call(this);
                }
                ParallelSystemArrayMediator.prototype.start_mediator = function () {
                };
                return ParallelSystemArrayMediator;
            }(master.ParallelSystemArray));
            master.ParallelSystemArrayMediator = ParallelSystemArrayMediator;
        })(master = protocol.master || (protocol.master = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../InvokeHistory.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var master;
        (function (master) {
            var PRInvokeHistory = (function (_super) {
                __extends(PRInvokeHistory, _super);
                function PRInvokeHistory(invoke) {
                    if (invoke === void 0) { invoke = null; }
                    _super.call(this, invoke);
                    if (invoke == null) {
                        this.index = 0;
                        this.size = 0;
                    }
                    else {
                        this.index = invoke.get("index").getValue();
                        this.size = invoke.get("size").getValue();
                    }
                }
                PRInvokeHistory.prototype.getIndex = function () {
                    return this.index;
                };
                PRInvokeHistory.prototype.getSize = function () {
                    return this.size;
                };
                return PRInvokeHistory;
            }(protocol.InvokeHistory));
            master.PRInvokeHistory = PRInvokeHistory;
        })(master = protocol.master || (protocol.master = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../APi.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var service;
        (function (service) {
            var Client = (function () {
                /* ------------------------------------------------------------------
                    CONSTRUCTORS
                ------------------------------------------------------------------ */
                /**
                 * Default Constructor.
                 */
                function Client(user, driver) {
                    this.user = user;
                    this.driver = driver;
                    this.driver.listen(this);
                    this.service = null;
                }
                Client.prototype.close = function () {
                    this.user.erase(this.no);
                };
                /* ------------------------------------------------------------------
                    ACCESSORS
                ------------------------------------------------------------------ */
                Client.prototype.getUser = function () {
                    return this.user;
                };
                Client.prototype.getService = function () {
                    return this.service;
                };
                /* ------------------------------------------------------------------
                    MESSAGE CHAIN
                ------------------------------------------------------------------ */
                Client.prototype.sendData = function (invoke) {
                    this.driver.sendData(invoke);
                };
                Client.prototype.replyData = function (invoke) {
                    invoke.apply(this);
                    this.user.replyData(invoke);
                    if (this.service != null)
                        this.service.replyData(invoke);
                };
                Client.prototype.changeService = function (path) {
                    if (this.service != null)
                        this.service.destructor();
                    this.service = this.createService(path);
                    if (this.service != null) {
                        this.service["client"] = this;
                        this.service["path"] = path;
                    }
                };
                return Client;
            }());
            service.Client = Client;
        })(service = protocol.service || (protocol.service = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../WebCommunicator.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var service;
        (function (service_1) {
            var Server = (function (_super) {
                __extends(Server, _super);
                /* ------------------------------------------------------------------
                    CONSTRUCTORS
                ------------------------------------------------------------------ */
                /**
                 * Default Constructor.
                 */
                function Server() {
                    _super.call(this);
                    this.session_map = new std.HashMap();
                    this.account_map = new std.HashMap();
                }
                /* ------------------------------------------------------------------
                    ACCESSORS
                ------------------------------------------------------------------ */
                Server.prototype.has = function (account) {
                    return this.account_map.has(account);
                };
                Server.prototype.get = function (account) {
                    return this.account_map.get(account);
                };
                /* ------------------------------------------------------------------
                    MESSAGE CHAIN
                ------------------------------------------------------------------ */
                Server.prototype.sendData = function (invoke) {
                    for (var it = this.session_map.begin(); !it.equal_to(this.session_map.end()); it = it.next())
                        it.second.sendData(invoke);
                };
                Server.prototype.replyData = function (invoke) {
                    invoke.apply(this);
                };
                /* ------------------------------------------------------------------
                    CLIENT I/O
                ------------------------------------------------------------------ */
                Server.prototype.addClient = function (driver) {
                    /////////////////////////////////////////////
                    // CREATE CHILDREN OBJECTS
                    /////////////////////////////////////////////
                    // USER
                    /////
                    var user;
                    if (this.session_map.has(driver.getSessionID()) == true)
                        user = this.session_map.get(driver.getSessionID());
                    else {
                        user = this.createUser();
                        user["server"] = this;
                        user["session_id"] = driver.getSessionID();
                        this.session_map.insert(std.make_pair(driver.getSessionID(), user));
                    }
                    /////
                    // CLIENT
                    /////
                    var client = user["createClient"](driver);
                    client["user"] = user;
                    client["no"] = ++user["sequence"];
                    client["driver"] = driver;
                    user.insert(std.make_pair(client["no"], client));
                    /////
                    // SERVICE
                    /////
                    var service = client["createService"](driver.getPath());
                    if (service != null) {
                        service["client"] = client;
                        service["path"] = driver.getPath();
                    }
                    client["service"] = service;
                    ///////
                    // START COMMUNICATION
                    ///////
                    if (driver["listening_"] == false)
                        driver.listen(client);
                    driver.onClose = function () {
                        // WHEN DISCONNECTED, THEN ERASE THE CLIENT.
                        // OF COURSE, IT CAN CAUSE DELETION OF THE RELATED USER.
                        user.erase(client["no"]);
                        // ALSO, DESTRUCTOR OF THE SERVICE IS CALLED.
                        if (client["service"] != null)
                            client["service"].destructor();
                    };
                };
                Server.prototype.erase_user = function (user) {
                    // USER DOESN'T BE ERASED AT THAT TIME
                    // IT WAITS UNTIL 30 SECONDS TO KEEP SESSION
                    setTimeout(function () {
                        if (user.empty() == false)
                            return;
                        this.session_map.erase(user["session_id"]);
                        if (user.getAccountID() != "")
                            this.account_map.erase(user.getAccountID());
                    }.bind(this), 30000);
                };
                return Server;
            }(protocol.WebServer));
            service_1.Server = Server;
        })(service = protocol.service || (protocol.service = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var service;
        (function (service) {
            var Service = (function () {
                /* ------------------------------------------------------------------
                    CONSTRUCTORS
                ------------------------------------------------------------------ */
                /**
                 * Default Constructor.
                 */
                function Service(client, path) {
                    this.client = client;
                    this.path = path;
                }
                Service.prototype.destructor = function () {
                };
                /* ------------------------------------------------------------------
                    ACCESSORS
                ------------------------------------------------------------------ */
                /**
                 * Get client.
                 */
                Service.prototype.getClient = function () {
                    return this.client;
                };
                /**
                 * Get path.
                 */
                Service.prototype.getPath = function () {
                    return this.path;
                };
                /* ------------------------------------------------------------------
                    MESSAGE CHAIN
                ------------------------------------------------------------------ */
                Service.prototype.sendData = function (invoke) {
                    return this.client.sendData(invoke);
                };
                Service.prototype.replyData = function (invoke) {
                    invoke.apply(this);
                };
                return Service;
            }());
            service.Service = Service;
        })(service = protocol.service || (protocol.service = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <refernece path="../../collection/HashMapCollection.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var service;
        (function (service) {
            var User = (function (_super) {
                __extends(User, _super);
                /* ---------------------------------------------------------
                    CONSTRUCTORS
                --------------------------------------------------------- */
                /**
                 * Default Constructor.
                 */
                function User(server) {
                    _super.call(this);
                    this.server = server;
                    this.sequence = 0;
                    this.account_id = "guest";
                    this.authority = 0;
                    this.addEventListener("erase", this.handle_erase_client, this);
                }
                User.prototype.handle_erase_client = function (event) {
                    for (var it = event.first; !it.equal_to(event.last); it = it.next()) {
                        it.value.second.close();
                    }
                    if (this.empty() == true)
                        this.server["erase_user"](this);
                };
                /* ---------------------------------------------------------
                    ACCESSORS
                --------------------------------------------------------- */
                User.prototype.getServer = function () {
                    return this.server;
                };
                User.prototype.getAccountID = function () {
                    return this.account_id;
                };
                User.prototype.getAuthority = function () {
                    return this.authority;
                };
                User.prototype.setAccount = function (id, authority) {
                    if (this.account_id == id)
                        return;
                    else if (this.account_id != "")
                        this.server["account_map"].erase(this.account_id); // ERASE FROM ORDINARY ACCOUNT_MAP
                    // SET
                    this.account_id = id;
                    this.authority = authority;
                    // REGISTER TO ACCOUNT_MAP IN ITS SERVER
                    this.server["account_map"].set(id, this);
                };
                /* ---------------------------------------------------------
                    MESSAGE CHAIN
                --------------------------------------------------------- */
                User.prototype.sendData = function (invoke) {
                    for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                        it.second.sendData(invoke);
                };
                User.prototype.replyData = function (invoke) {
                    invoke.apply(this);
                    this.server.replyData(invoke);
                };
                return User;
            }(samchon.collection.HashMapCollection));
            service.User = User;
        })(service = protocol.service || (protocol.service = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
///// <reference path="../API.ts" />
//namespace samchon.protocol
//{
//	export abstract class DedicatedWorker implements IProtocol
//	{
//		private communicator: DedicatedWorkerClientDriver;
//		/**
//		 * Default Constructor.
//		 */
//		public constructor()
//		{
//			this.communicator = new DedicatedWorkerClientDriver(this);
//		}
//		public sendData(invoke: Invoke): void
//		{
//			this.communicator.sendData(invoke);
//		}
//		public abstract replyData(invoke: Invoke): void;
//	}
//	class DedicatedWorkerClientDriver extends ICommunicator
//	{
//		public constructor(listener: DedicatedWorker)
//		{
//			super();
//			this.listener = listener;
//			self.addEventListener("message", this.listen_message.bind(this));
//		}
//		public close(): void
//		{
//			self.close();
//		}
//		public sendData(invoke: Invoke): void
//		{
//			(postMessage as Function)(invoke.toXML().toString());
//			for (let i: number = 0; i < invoke.size(); i++)
//				if (invoke.at(i).getType() == "ByteArray")
//					(postMessage as Function)(invoke.at(i).getValue());
//		}
//		private listen_message(event: MessageEvent): void
//		{
//		}
//	}
//}
//namespace samchon.protocol
//{
//	export class DedicatedWorkerConnector 
//		extends ICommunicator
//	{
//		private worker: Worker;
//		public constructor(listener: IProtocol)
//		{
//			super();
//			this.listener = listener;
//			this.worker = null;
//		}
//		public connect(jsFile: string): void
//		{
//			this.worker = new Worker(jsFile);
//			this.worker.addEventListener("message", this.reply_message.bind(this));
//		}
//		public close(): void
//		{
//			this.worker.terminate();
//		}
//		public sendData(invoke: Invoke): void
//		{
//			this.worker.postMessage(invoke.toXML().toString());
//			for (let i: number = 0; i < invoke.size(); i++)
//				if (invoke.at(i).getType() == "ByteaArray")
//					this.worker.postMessage(invoke.at(i).getValue());
//		}
//		private reply_message(event: MessageEvent): void
//		{
//		}
//	}
//} 
/// <reference path="../API.ts" />
/// <reference path="EntityArray.ts" />
/// <reference path="Entity.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
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
        var Invoke = (function (_super) {
            __extends(Invoke, _super);
            function Invoke() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                _super.call(this);
                if (args.length == 0) {
                    this.listener = "";
                }
                else if (args.length == 1 && typeof args[0] == "string") {
                    var listener = args[0];
                    this.listener = listener;
                }
                else if (args.length == 1 && args[0] instanceof samchon.library.XML) {
                    this.listener = "";
                    var xml = args[0];
                    this.construct(xml);
                }
                else if (args.length == 1 && args[0] instanceof Invoke) {
                    var invoke = args[0];
                    this.listener = invoke.listener;
                    this.assign(invoke.begin(), invoke.end());
                }
                else if (args.length == 3 && args[1] instanceof std.VectorIterator && args[2] instanceof std.VectorIterator) {
                    var listener = args[0];
                    var begin = args[1];
                    var end = args[2];
                    this.listener = listener;
                    this.assign(begin, end);
                }
                else if (args.length > 1) {
                    this.listener = args[0];
                    for (var i = 1; i < args.length; i++)
                        this.push_back(new protocol.InvokeParameter("", args[i]));
                }
            }
            /**
             * @inheritdoc
             */
            Invoke.prototype.createChild = function (xml) {
                return new protocol.InvokeParameter();
            };
            /* -------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------- */
            /**
             * Get listener.
             */
            Invoke.prototype.getListener = function () {
                return this.listener;
            };
            /**
             * <p> Get arguments for Function.apply(). </p>
             *
             * @return An array containing values of the contained parameters.
             */
            Invoke.prototype.getArguments = function () {
                var args = [];
                for (var i = 0; i < this.size(); i++)
                    if (this[i].getName() == "invoke_history_uid")
                        continue;
                    else
                        args.push(this[i].getValue());
                return args;
            };
            /* -------------------------------------------------------------------
                APPLY BY FUNCTION POINTER
            ------------------------------------------------------------------- */
            /**
             * <p> Apply to a matched function. </p>
             */
            Invoke.prototype.apply = function (obj) {
                if (!(this.listener in obj && obj[this.listener] instanceof Function))
                    return false;
                var func = obj[this.listener];
                var args = this.getArguments();
                func.apply(obj, args);
                return true;
            };
            /* -------------------------------------------------------------------
                EXPORTERS
            ------------------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            Invoke.prototype.TAG = function () {
                return "invoke";
            };
            /**
             * @inheritdoc
             */
            Invoke.prototype.CHILD_TAG = function () {
                return "parameter";
            };
            return Invoke;
        }(protocol.EntityArray));
        protocol.Invoke = Invoke;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        /**
         * A parameter belongs to an Invoke.
         *
         * @see Invoke
         * @author Jeongho Nam <http://samchon.org>
         */
        var InvokeParameter = (function (_super) {
            __extends(InvokeParameter, _super);
            /* -------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------- */
            function InvokeParameter() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                _super.call(this);
                /**
                 * <p> Name of the parameter. </p>
                 *
                 * @details Optional property, can be omitted.
                 */
                this.name = "";
                /**
                 * <p> Type of the parameter. </p>
                 */
                this.type = "";
                /**
                 * <p> Value of the parameter. </p>
                 */
                this.value = null;
                if (args.length == 0)
                    return;
                else if (args.length == 2) {
                    this.name = args[0];
                    this.value = args[1];
                }
                else if (args.length == 3) {
                    this.name = args[0];
                    this.value = args[2];
                }
                this.type = typeof this.value;
                if (this.value instanceof samchon.library.XML)
                    this.type = "XML";
            }
            /**
             * @inheritdoc
             */
            InvokeParameter.prototype.construct = function (xml) {
                this.name = (xml.hasProperty("name")) ? xml.getProperty("name") : "";
                this.type = xml.getProperty("type");
                if (this.type == "XML")
                    this.value = xml.begin().second.front();
                else if (this.type == "number")
                    this.value = parseFloat(xml.getValue());
                else
                    this.value = xml.getValue();
            };
            InvokeParameter.prototype.setValue = function (value) {
                this.value = value;
            };
            /* -------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            InvokeParameter.prototype.key = function () {
                return this.name;
            };
            /**
             * Get name.
             */
            InvokeParameter.prototype.getName = function () {
                return this.name;
            };
            /**
             * Get type.
             */
            InvokeParameter.prototype.getType = function () {
                return this.type;
            };
            /**
             * Get value.
             */
            InvokeParameter.prototype.getValue = function () {
                return this.value;
            };
            /* -------------------------------------------------------------------
                EXPORTERS
            ------------------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            InvokeParameter.prototype.TAG = function () {
                return "parameter";
            };
            /**
             * @inheritdoc
             */
            InvokeParameter.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                xml.setProperty("name", this.name);
                xml.setProperty("type", this.type);
                // NOT CONSIDERED ABOUT THE BINARY DATA
                if (this.type == "XML")
                    xml.push(this.value);
                else if (this.type != "ByteArray")
                    xml.setValue(this.value);
                return xml;
            };
            return InvokeParameter;
        }(protocol.Entity));
        protocol.InvokeParameter = InvokeParameter;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
//# sourceMappingURL=samchon-framework.js.map