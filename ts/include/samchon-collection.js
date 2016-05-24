var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
if (typeof (exports) != "undefined") {
    std = require("typescript-stl");
    samchon = require("samchon-library");
}
/// <reference path="requires.js" /> 
/// <reference path="node/requires.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var ArrayCollection = (function (_super) {
            __extends(ArrayCollection, _super);
            function ArrayCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            ArrayCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
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
                _super.prototype.push.call(this, val);
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
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @hidden
             */
            ArrayCollection.prototype.notify_erase = function (first, last) {
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
/// <reference path="node/requires.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var CollectionEvent = (function (_super) {
            __extends(CollectionEvent, _super);
            function CollectionEvent(type, first, last) {
                _super.call(this, type);
                this.first_ = first;
                this.last_ = last;
            }
            Object.defineProperty(CollectionEvent, "INSERT", {
                get: function () {
                    return "insert";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionEvent, "ERASE", {
                get: function () {
                    return "erase";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionEvent.prototype, "container", {
                get: function () {
                    return this.target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionEvent.prototype, "first", {
                get: function () {
                    return this.first_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionEvent.prototype, "last", {
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
/// <reference path="node/requires.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var DequeCollection = (function (_super) {
            __extends(DequeCollection, _super);
            function DequeCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            DequeCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            DequeCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            DequeCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            DequeCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
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
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @hidden
             */
            DequeCollection.prototype.notify_erase = function (first, last) {
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
/// <reference path="node/requires.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var HashMapCollection = (function (_super) {
            __extends(HashMapCollection, _super);
            function HashMapCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            HashMapCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            HashMapCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
            /**
             * @inheritdoc
             */
            HashMapCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            HashMapCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
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
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            HashMapCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
        var HashMultiMapCollection = (function (_super) {
            __extends(HashMultiMapCollection, _super);
            function HashMultiMapCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            HashMultiMapCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            HashMultiMapCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
            /**
             * @inheritdoc
             */
            HashMultiMapCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            HashMultiMapCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
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
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            HashMultiMapCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
/// <reference path="node/requires.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var HashSetCollection = (function (_super) {
            __extends(HashSetCollection, _super);
            function HashSetCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            HashSetCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            HashSetCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            HashSetCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            HashSetCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
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
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            HashSetCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
            HashSetCollection.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.addEventListener(type, listener, thisArg);
            };
            HashSetCollection.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                this.event_dispatcher_.removeEventListener(type, listener, thisArg);
            };
            return HashSetCollection;
        }(std.TreeSet));
        collection.HashSetCollection = HashSetCollection;
        var HashMultiSetCollection = (function (_super) {
            __extends(HashMultiSetCollection, _super);
            function HashMultiSetCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            HashMultiSetCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            HashMultiSetCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            HashMultiSetCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            HashMultiSetCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
            /* =========================================================
                ELEMENTS I/O
                    - HANDLE_INSERT & HANDLE_ERASE
            ============================================================
                HANDLE_INSERT & HANDLE_ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            HashMultiSetCollection.prototype.handle_insert = function (first, last) {
                _super.prototype.handle_insert.call(this, first, last);
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            HashMultiSetCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
            HashMultiSetCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            HashMultiSetCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
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
        }(std.TreeMultiSet));
        collection.HashMultiSetCollection = HashMultiSetCollection;
    })(collection = samchon.collection || (samchon.collection = {}));
})(samchon || (samchon = {}));
/// <reference path="node/requires.ts" />
/// <reference path="node/requires.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var ListCollection = (function (_super) {
            __extends(ListCollection, _super);
            function ListCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            ListCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            ListCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            ListCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            ListCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
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
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @hidden
             */
            ListCollection.prototype.notify_erase = function (first, last) {
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
/// <reference path="node/requires.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var TreeMapCollection = (function (_super) {
            __extends(TreeMapCollection, _super);
            function TreeMapCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            TreeMapCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            TreeMapCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
            /**
             * @inheritdoc
             */
            TreeMapCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            TreeMapCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
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
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            TreeMapCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
        var TreeMultiMapCollection = (function (_super) {
            __extends(TreeMultiMapCollection, _super);
            function TreeMultiMapCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            TreeMultiMapCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            TreeMultiMapCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
            /**
             * @inheritdoc
             */
            TreeMultiMapCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            TreeMultiMapCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
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
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            TreeMultiMapCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
/// <reference path="node/requires.ts" />
var samchon;
(function (samchon) {
    var collection;
    (function (collection) {
        var TreeSetCollection = (function (_super) {
            __extends(TreeSetCollection, _super);
            function TreeSetCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            TreeSetCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            TreeSetCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            TreeSetCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            TreeSetCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
            /* =========================================================
                ELEMENTS I/O
                    - HANDLE_INSERT & HANDLE_ERASE
            ============================================================
                HANDLE_INSERT & HANDLE_ERASE
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            TreeSetCollection.prototype.handle_insert = function (first, last) {
                _super.prototype.handle_insert.call(this, first, last);
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            TreeSetCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
            TreeSetCollection.prototype.hasEventListener = function (type) {
                return this.event_dispatcher_.hasEventListener(type);
            };
            /**
             * @inheritdoc
             */
            TreeSetCollection.prototype.dispatchEvent = function (event) {
                return this.event_dispatcher_.dispatchEvent(event);
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
        var TreeMultiSetCollection = (function (_super) {
            __extends(TreeMultiSetCollection, _super);
            function TreeMultiSetCollection() {
                _super.apply(this, arguments);
                this.insert_handler_ = null;
                this.erase_handler_ = null;
                this.event_dispatcher_ = new samchon.library.EventDispatcher(this);
            }
            /* =========================================================
                CONSTRUCTORS & ACCESSORS
            ============================================================
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::constructor
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * @inheritdoc
             */
            TreeMultiSetCollection.prototype.set_insert_handler = function (listener) {
                this.insert_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            TreeMultiSetCollection.prototype.set_erase_handler = function (listener) {
                this.erase_handler_ = listener;
            };
            /**
             * @inheritdoc
             */
            TreeMultiSetCollection.prototype.get_insert_handler = function () {
                return this.insert_handler_;
            };
            /**
             * @inheritdoc
             */
            TreeMultiSetCollection.prototype.get_erase_handler = function () {
                return this.erase_handler_;
            };
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
                if (this.insert_handler_ != null)
                    this.insert_handler_(first, last);
                this.dispatchEvent(new collection.CollectionEvent(collection.CollectionEvent.INSERT, first, last));
            };
            /**
             * @inheritdoc
             */
            TreeMultiSetCollection.prototype.handle_erase = function (first, last) {
                _super.prototype.handle_erase.call(this, first, last);
                if (this.erase_handler_ != null)
                    this.erase_handler_(first, last);
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
//# sourceMappingURL=app.js.map 
/// <reference path="../API.js" />
/// <reference path="../ArrayCollection.ts" />
if (typeof (exports) != "undefined") {
    exports.library = samchon.library;
    exports.collection = samchon.collection;
}
