var samchon;
(function (samchon) {
    /**
     * <p> Trace arguments on screen. </p>
     * <p> Displays arguments on screen by <i>document.write</i>. </p>
     *
     * <p> If any argument in a trace statement includes a data type other than a string, the trace function
     * invokes the associated toString() method for that data type. If the argument which is not a string
     * doesn't have <i>toString()</i> method, only "[object Object]" words will be traced. </p>
     *
     * <p> Trace prints words in web page direclty. It can harm ordinary layout of the page. </p>
     *
     * @param args One or more (comma separated) expressions to evaluate.
     *			   For multiple expressions, a space is inserted between each expression in the output.
     *
     * @author Jeongho Nam
     */
    function trace() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var str = "";
        var replacerArray = [
            //new std.Pair<string, string>("'", "&apos;"),
            //new std.Pair<string, string>('"', "&quot;"),
            new std.Pair("&", "&amp;"),
            new std.Pair("<", "&lt;"),
            new std.Pair(">", "&gt;"),
            new std.Pair("\n", "<br>"),
            new std.Pair("\t", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
        ];
        for (var i = 0; i < args.length; i++) {
            var item = String(args[i]);
            item = samchon.library.StringUtil.replaceAll(item, replacerArray);
            if (i == 0)
                str += item;
            else
                str += ", " + item;
        }
        document.write("<p>" + str + "</p>");
    }
    samchon.trace = trace;
})(samchon || (samchon = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var std;
(function (std) {
    /* =========================================================
        + EXCEPTION
            + LOGIC_ERROR
                - DOMAIN_ERROR
                - INVALID_ARGUMENT
                - LENGTH_ERROR
                - OUT_OF_RANGE
            + RUNTIME_ERROR
                - OVERFLOW_ERROR
                - RANGE_ERROR
                - SYSTEM_ERROR
                - UNDERFLOW_ERROR
    ========================================================= */
    /**
     * <p> Standard exception class. </p>
     * <p> Base class for standard exceptions. </p>
     *
     * <p> All objects thrown by components of the standard library are derived from this class.
     * Therefore, all standard exceptions can be caught by catching this type by reference. </p>
     *
     * <ul>
     *  <li> Designed by C++ Reference - http://www.cplusplus.com/reference/exception/exception/
     * </ul>
     *
     * @author Migrated by Jeongho Nam
     */
    var Exception = (function () {
        function Exception(what) {
            if (what === void 0) { what = ""; }
            this.message = what;
        }
        /**
         * <p> Get string identifying exception. </p>
         * <p> Returns a string that may be used to identify the exception. </p>
         *
         * <p> The particular representation pointed by the returned value is implementation-defined.
         * As a virtual function, derived classes may redefine this function so that specify value are
         * returned. </p>
         */
        Exception.prototype.what = function () {
            return this.message;
        };
        return Exception;
    })();
    std.Exception = Exception;
    /* =========================================================
        + LOGIC_ERROR
            - DOMAIN_ERROR
            - INVALID_ARGUMENT
            - LENGTH_ERROR
            - OUT_OF_RANGE
            - ABSTRACT_METHOD_ERROR
    ========================================================= */
    /**
     * <p> Logic error exception. </p>
     *
     * <p> This class defines the type of objects thrown as exceptions to report errors in the internal
     * logical of the program, such as violation of logical preconditions or class invariants. </p>
     *
     * <p> These errors are presumably detectable before the program executes. </p>
     *
     * <p> It is used as a base class for several logical error exceptions. </p>
     *
     * <ul>
     *  <li> Designed by C++ Reference - http://www.cplusplus.com/reference/stdexcept/logic_error/
     * </ul>
     *
     * @author Migrated by Jeongho Nam
     */
    var LogicError = (function (_super) {
        __extends(LogicError, _super);
        function LogicError(what) {
            _super.call(this, what);
        }
        return LogicError;
    })(Exception);
    std.LogicError = LogicError;
    var DomainError = (function (_super) {
        __extends(DomainError, _super);
        function DomainError(what) {
            _super.call(this, what);
        }
        return DomainError;
    })(LogicError);
    std.DomainError = DomainError;
    var InvalidArgument = (function (_super) {
        __extends(InvalidArgument, _super);
        function InvalidArgument(what) {
            _super.call(this, what);
        }
        return InvalidArgument;
    })(LogicError);
    std.InvalidArgument = InvalidArgument;
    var LengthError = (function (_super) {
        __extends(LengthError, _super);
        function LengthError(what) {
            _super.call(this, what);
        }
        return LengthError;
    })(LogicError);
    std.LengthError = LengthError;
    var OutOfRange = (function (_super) {
        __extends(OutOfRange, _super);
        function OutOfRange(what) {
            _super.call(this, what);
        }
        return OutOfRange;
    })(LogicError);
    std.OutOfRange = OutOfRange;
    var AbstractMethodError = (function (_super) {
        __extends(AbstractMethodError, _super);
        function AbstractMethodError(what) {
            _super.call(this, what);
        }
        return AbstractMethodError;
    })(LogicError);
    std.AbstractMethodError = AbstractMethodError;
    /* =========================================================
        + RUNTIME_ERROR
            - OVERFLOW_ERROR
            - RANGE_ERROR
            - SYSTEM_ERROR
            - UNDERFLOW_ERROR
    ========================================================= */
    /**
     * <p> Runtime error exception. </p>
     *
     * <p> This class defines the type of objects thrown as exceptions to report errors that can only be
     * detected during runtime. </p>
     *
     * <p> It is used as a base class for several runtime error exceptions. </p>
     *
     * <ul>
     *  <li> Designed by C++ Reference - http://www.cplusplus.com/reference/stdexcept/runtime_error/
     * </ul>
     *
     * @author Migrated by Jeongho Nam
     */
    var RuntimeError = (function (_super) {
        __extends(RuntimeError, _super);
        function RuntimeError(what) {
            _super.call(this, what);
        }
        return RuntimeError;
    })(Exception);
    std.RuntimeError = RuntimeError;
    var OverflowError = (function (_super) {
        __extends(OverflowError, _super);
        function OverflowError(what) {
            _super.call(this, what);
        }
        return OverflowError;
    })(RuntimeError);
    std.OverflowError = OverflowError;
    var UnderflowError = (function (_super) {
        __extends(UnderflowError, _super);
        function UnderflowError(what) {
            _super.call(this, what);
        }
        return UnderflowError;
    })(RuntimeError);
    std.UnderflowError = UnderflowError;
    var RangeError = (function (_super) {
        __extends(RangeError, _super);
        function RangeError(what) {
            _super.call(this, what);
        }
        return RangeError;
    })(RuntimeError);
    std.RangeError = RangeError;
    var SystemError = (function (_super) {
        __extends(SystemError, _super);
        function SystemError(what) {
            _super.call(this, what);
        }
        return SystemError;
    })(RuntimeError);
    std.SystemError = SystemError;
})(std || (std = {}));
/// <reference path="Iterator.ts" />
/// <reference path="Exception.ts" />
var std;
(function (std) {
    /**
     * An abstract class containing elements.
     *
     * @author Jeongho Nam
     */
    var Container = (function () {
        function Container() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (args.length == 1 && (args[0] instanceof std.Vector || args[0] instanceof Container)) {
                var container = args[0];
                this.assign(container.begin(), container.end());
            }
            else if (args.length == 2 && args[0] instanceof std.Iterator && args[1] instanceof std.Iterator) {
                var begin = args[0];
                var end = args[1];
                this.assign(begin, end);
            }
        }
        /**
         * <p> Assign Container content. </p>
         *
         * <p> Assigns new contents to the Container, replacing its current contents,
         * and modifying its size accordingly. </p>
         *
         * @param begin Input interator of the initial position in a sequence.
         * @param end Input interator of the final position in a sequence.
         */
        Container.prototype.assign = function (begin, end) {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /**
         * <p> Clear content. </p>
         *
         * <p> Removes all elements from the Container, leaving the container with a size of 0. </p>
         */
        Container.prototype.clear = function () {
            this.erase(this.begin(), this.end());
        };
        /* ---------------------------------------------------------------
            ELEMENTS I/O
        --------------------------------------------------------------- */
        Container.prototype.push = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i - 0] = arguments[_i];
            }
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        Container.prototype.erase = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /* ---------------------------------------------------------------
            GETTERS
        --------------------------------------------------------------- */
        /**
         * <p> Return iterator to beginning. </p>
         * <p> Returns an iterator referring the first element in the Container. </p>
         *
         * <h4> Note </h4>
         * <p> If the container is empty, the returned iterator is same with end(). </p>
         *
         * @return An iterator to the first element in the container.
         *         The iterator containes the first element's value.
         */
        Container.prototype.begin = function () {
            if (this.size() == 0)
                return this.end();
            else
                throw new std.AbstractMethodError("Have to be overriden.");
        };
        /**
         * <p> Return iterator to end. </p>
         * <p> Returns an iterator referring to the past-the-end element in the Container. </p>
         *
         * <p> The past-the-end element is the theoretical element that would follow the last element in
         * the Container. It does not point to any element, and thus shall not be dereferenced. </p>
         *
         * <p> Because the ranges used by functions of the Container do not include the element reference
         * by their closing iterator, this function is often used in combination with Container::begin() to specify
         * a range including all the elements in the container. </p>
         *
         * <h4> Note </h4>
         * <p> Returned iterator from Container.end() does not refer any element. Trying to accessing
         * element by the iterator will cause throwing exception (out of range). </p>
         * <p> If the container is empty, this function returns the same as Container::begin(). </p>
         *
         * @return An iterator to the end element in the container.
         */
        Container.prototype.end = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /**
         * Return the number of elements in the Container.
         */
        Container.prototype.size = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /**
         * Test whether the Container is empty.
         */
        Container.prototype.empty = function () {
            return this.size() == 0;
        };
        return Container;
    })();
    std.Container = Container;
    var PairContainer = (function (_super) {
        __extends(PairContainer, _super);
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        /**
         * Default Constructor
         */
        function PairContainer() {
            _super.call(this);
        }
        PairContainer.prototype.assign = function (begin, end) {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        PairContainer.prototype.clear = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        PairContainer.prototype.size = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        PairContainer.prototype.begin = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        PairContainer.prototype.end = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        PairContainer.prototype.find = function (key) {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        PairContainer.prototype.has = function (key) {
            return !this.find(key).equals(this.end());
        };
        PairContainer.prototype.get = function (key) {
            return this.find(key).second;
        };
        PairContainer.prototype.erase = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        return PairContainer;
    })(Container);
    std.PairContainer = PairContainer;
})(std || (std = {}));
/// <reference path="Container.ts" />
/// <reference path="Exception.ts" />
var std;
(function (std) {
    var Iterator = (function () {
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        /**
         * Construct from the source Container.
         *
         * @param source The source Container.
         */
        function Iterator(source) {
            this.source = source;
        }
        /* ---------------------------------------------------------
            MOVERS
        --------------------------------------------------------- */
        /**
         * Get iterator to previous element.
         */
        Iterator.prototype.prev = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /**
         * Return an Iterator.
         */
        Iterator.prototype.next = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /**
         * Advances the Iterator by n element positions.
         *
         * @param n Number of element positions to advance.
         * @return An advanced Iterator.
         */
        Iterator.prototype.advance = function (n) {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        Iterator.prototype.equals = function (obj) {
            return this.source == obj.source;
        };
        /**
         * Get source.
         */
        Iterator.prototype.getSource = function () {
            return this.source;
        };
        Object.defineProperty(Iterator.prototype, "value", {
            /**
             * Get value.
             */
            get: function () {
                throw new std.AbstractMethodError("Have to be overriden.");
            },
            /**
             * Set value.
             */
            set: function (val) {
                throw new std.AbstractMethodError("Have to be overriden.");
            },
            enumerable: true,
            configurable: true
        });
        return Iterator;
    })();
    std.Iterator = Iterator;
    var PairIterator = (function (_super) {
        __extends(PairIterator, _super);
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        /**
         * Construct from the source PairContainer.
         *
         * @param source The source PairContainer.
         */
        function PairIterator(source) {
            _super.call(this, source);
        }
        /* ---------------------------------------------------------
            MOVERS
        --------------------------------------------------------- */
        PairIterator.prototype.prev = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        PairIterator.prototype.next = function () {
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        PairIterator.prototype.equals = function (obj) {
            return this.source == obj.source;
        };
        Object.defineProperty(PairIterator.prototype, "first", {
            get: function () {
                throw new std.AbstractMethodError("Have to be overriden.");
            },
            set: function (val) {
                throw new std.AbstractMethodError("Have to be overriden.");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PairIterator.prototype, "second", {
            get: function () {
                throw new std.AbstractMethodError("Have to be overriden.");
            },
            set: function (val) {
                throw new std.AbstractMethodError("Have to be overriden.");
            },
            enumerable: true,
            configurable: true
        });
        return PairIterator;
    })(Iterator);
    std.PairIterator = PairIterator;
})(std || (std = {}));
/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />
var std;
(function (std) {
    /**
     * <p> Lists are sequence containers that allow constant time insert and erase operations anywhere
     * within the sequence, and iteration in both directions. </p>
     *
     * <p> List containers are implemented as doubly-linked lists; Doubly linked lists can store each of
     * the elements they contain in different and unrelated storage locations. The ordering is kept
     * internally by the association to each element of a link to the element preceding it and a link to
     * the element following it. </p>
     *
     * <p> They are very similar to forward_list: The main difference being that forward_list objects are
     * single-linked lists, and thus they can only be iterated forwards, in exchange for being somewhat
     * smaller and more efficient. </p>
     *
     * <p> Compared to other base standard sequence containers (array, vector and deque), lists perform
     * generally better in inserting, extracting and moving elements in any position within the container
     * for which an iterator has already been obtained, and therefore also in algorithms that make
     * intensive use of these, like sorting algorithms. </p>
     *
     * <p> The main drawback of lists and forward_lists compared to these other sequence containers is that
     * they lack direct access to the elements by their position; For example, to access the sixth element
     * in a list, one has to iterate from a known position (like the beginning or the end) to that position,
     * which takes linear time in the distance between these. They also consume some extra memory to keep
     * the linking information associated to each element (which may be an important factor for large lists
     * of small-sized elements). </p>
     *
     * <ul>
     *  <li> Designed by C++ Reference - http://www.cplusplus.com/reference/list/list/
     * </ul>
     *
     * @author Migrated by Jeongho Nam
     */
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.call(this);
            if (args.length == 0) {
                this.clear();
            }
            else if (args.length == 1 && args[0] instanceof Array) {
                var array = args[0];
                this.clear();
                this.push.apply(this, array);
            }
            else if (args.length == 1 && (args[0] instanceof std.Vector || args[0] instanceof std.Container)) {
                var container = args[0];
                this.assign(container.begin(), container.end());
            }
            else if (args.length == 2 && args[0] instanceof std.Iterator && args[1] instanceof std.Iterator) {
                var begin = args[0];
                var end = args[1];
                this.assign(begin, end);
            }
            else if (args.length == 2 && typeof args[0] == "number") {
                var size = args[0];
                var val = args[1];
                this.assign(size, val);
            }
        }
        List.prototype.assign = function (par1, par2) {
            if (par1 instanceof std.Iterator && par2 instanceof std.Iterator) {
                // PARAMETERS
                var begin = par1;
                var end = par2;
                // BODY
                var prev = null;
                var item;
                var it = begin;
                while (true) {
                    // CONSTRUCT ELEMENT ITEM
                    item = new ListIterator(this, prev, null, (it != end ? it.value : null));
                    // SET PREVIOUS NEXT POINTER
                    if (prev != null)
                        prev.setNext(item);
                    // CONSTRUCT BEGIN AND END
                    if (it == begin)
                        this.begin_ = item;
                    else if (it == end) {
                        this.end_ = item;
                        break;
                    }
                    // ADD COUNTS AND STEP TO THE NEXT
                    this.size_++;
                    it = it.next();
                }
            }
        };
        List.prototype.clear = function () {
            var it = new ListIterator(this, null, null, null);
            it.setPrev(it);
            it.setNext(it);
            this.begin_ = it;
            this.end_ = it;
            this.size_ = 0;
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        List.prototype.begin = function () {
            return this.begin_;
        };
        /**
         * @inheritdoc
         */
        List.prototype.end = function () {
            return this.end_;
        };
        /**
         * @inheritdoc
         */
        List.prototype.size = function () {
            return this.size_;
        };
        /**
         * <p> Access first element. </p>
         * <p> Returns a value in the first element of the List. </p>
         *
         * <p> Unlike member <code>List.end()</code>, which returns an iterator just past this element,
         * this function returns a direct value. </p>
         *
         * <p> Calling this function on an empty container causes undefined behavior. </p>
         *
         * @return A value in the first element of the List.
         */
        List.prototype.front = function () {
            return this.begin_.value;
        };
        /**
         * <p> Access last element. </p>
         * <p> Returns a value in the last element of the List. </p>
         *
         * <p> Unlike member <code>List.end()</code>, which returns an iterator just past this element,
         * this function returns a direct value. </p>
         *
         * <p> Calling this function on an empty container causes undefined behavior. </p>
         *
         * @return A value in the last element of the List.
         */
        List.prototype.back = function () {
            return this.end_.prev().value;
        };
        /* ---------------------------------------------------------
            ELEMENTS I/O
        --------------------------------------------------------- */
        List.prototype.push = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            for (var i = 0; i < args.length; i++)
                this.pushBack(args[i]);
            return this.size();
        };
        List.prototype.pushFront = function (val) {
            var item = new ListIterator(this, null, this.begin_, val);
            // CONFIGURE BEGIN AND NEXT
            this.begin_.setPrev(item);
            if (this.size_ == 0) {
                // IT WAS EMPTY
                this.end_ = new ListIterator(this, item, item, null);
                item.setNext(this.end_);
            }
            else
                this.end_.setNext(item);
            // SET
            this.begin_ = item;
            this.size_++;
        };
        List.prototype.pushBack = function (val) {
            var prev = this.end_.prev();
            var item = new ListIterator(this, this.end_.prev(), this.end_, val);
            prev.setNext(item);
            this.end_.setPrev(item);
            if (this.empty() == true) {
                this.begin_ = item;
                item.setPrev(this.end_);
            }
            this.size_++;
        };
        /**
         * <p> Delete first element. </p>
         *
         * <p> Removes first last element in the List container, effectively reducing the container
         * <code>size</code> by one. </p>
         */
        List.prototype.popFront = function () {
            this.erase(this.begin_);
        };
        /**
         * <p> Delete last element. </p>
         *
         * <p> Removes the last element in the List container, effectively reducing the container
         * <code>size</code> by one. </p>
         */
        List.prototype.popBack = function () {
            this.erase(this.end_.prev());
        };
        List.prototype.insert = function (myEnd, begin, end) {
            if (end === void 0) { end = null; }
            if (this != myEnd.getSource())
                throw new std.InvalidArgument("Parametric Iterator is not this Container's own.");
            else if (end != null && begin.getSource() != end.getSource())
                throw new std.InvalidArgument("Parameter begin and end are not from same container.");
            if (end == null)
                end = begin.next();
            var myPrev = myEnd;
            var myLast = myEnd.next();
            var size = 0;
            for (var it = begin; it.equals(end) == false; it = it.next()) {
                var myIt = new ListIterator(this, myPrev, null, it.value);
                myPrev.setNext(myIt);
                if (it == begin && this.empty() == true)
                    this.begin_ = myIt;
                myPrev = myIt;
                size++;
            }
            myPrev.setNext(myLast);
            myLast.setPrev(myPrev);
            this.size_ += size;
            return myPrev;
        };
        List.prototype.erase = function (begin, end) {
            if (end === void 0) { end = null; }
            if (this != begin.getSource() || begin.getSource() != end.getSource())
                throw new std.InvalidArgument("Parametric Iterator is not this Container's own.");
            var prev = begin.prev();
            var next = (end == null)
                ? begin.next()
                : end.next();
            prev.setNext(next);
            next.setPrev(prev);
            // CALCULATE THE SIZE
            var size = 0;
            if (end != null) {
                for (var it = begin; it.equals(end) == false; it = it.next())
                    size++;
            }
            else
                size = 1;
            this.size_ -= size;
            return prev;
        };
        return List;
    })(std.Container);
    std.List = List;
    var ListIterator = (function (_super) {
        __extends(ListIterator, _super);
        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        /**
         * <p> Construct from source List. </p>
         *
         * <h4> Note </h4>
         * <p> Do not create iterator directly. </p>
         * <p> Use begin(), find() or end() in List instead. </p>
         *
         * @param list The source vector to reference.
         */
        function ListIterator(source, prev, next, value) {
            _super.call(this, source);
            this.prev_ = prev;
            this.next_ = next;
            this.value_ = value;
        }
        ListIterator.prototype.setPrev = function (prev) {
            this.prev_ = prev;
        };
        ListIterator.prototype.setNext = function (next) {
            this.next_ = next;
        };
        /* ---------------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------------- */
        ListIterator.prototype.equals = function (obj) {
            if (obj instanceof ListIterator == false)
                return false;
            var it = obj;
            return _super.prototype.equals.call(this, obj) == true && this.prev_ == it.prev_ && this.next_ == it.next_;
        };
        ListIterator.prototype.prev = function () {
            return this.prev_;
        };
        ListIterator.prototype.next = function () {
            return this.next_;
        };
        Object.defineProperty(ListIterator.prototype, "value", {
            get: function () {
                return this.value_;
            },
            set: function (val) {
                this.value_ = val;
            },
            enumerable: true,
            configurable: true
        });
        return ListIterator;
    })(std.Iterator);
    std.ListIterator = ListIterator;
})(std || (std = {}));
/// <reference path="../../API.ts" />
/// <reference path="../../../std/List.ts" />
var samchon;
(function (samchon) {
    var example;
    (function (example) {
        var container;
        (function (container) {
            function main() {
                var list = new std.UnorderedSet([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
                samchon.trace("#" + list.size());
                for (var it = list.begin(); it.equals(list.end()) == false; it = it.next())
                    samchon.trace(it.value);
            }
            container.main = main;
        })(container = example.container || (example.container = {}));
    })(example = samchon.example || (samchon.example = {}));
})(samchon || (samchon = {}));
/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />
var std;
(function (std) {
    /**
     * <p> Vectors are sequence containers representing arrays that can change in size. </p>
     *
     * <p> Just like arrays, vectors use contiguous storage locations for their elements, which means that
     * their elements can also be accessed using offsets on regular pointers to its elements, and just as
     * efficiently as in arrays. But unlike arrays, their size can change dynamically, with their storage
     * being handled automatically by the container. </p>
     *
     * <p> Internally, Vectors use a dynamically allocated array to store their elements. This array may
     * need to be reallocated in order to grow in size when new elements are inserted, which implies
     * allocating a new array and moving all elements to it. This is a relatively expensive task in terms
     * of processing time, and thus, vectors do not reallocate each time an element is added to the
     * container. </p>
     *
     * <p> Instead, vector containers may allocate some extra storage to accommodate for possible growth,
     * and thus the container may have an actual capacity greater than the storage strictly needed to
     * contain its elements (i.e., its size). Libraries can implement different strategies for growth to
     * balance between memory usage and reallocations, but in any case, reallocations should only happen at
     * logarithmically growing intervals of size so that the insertion of individual elements at the end of
     * the vector can be provided with amortized constant time complexity. </p>
     *
     * <p> Therefore, compared to arrays, vectors consume more memory in exchange for the ability to manage
     * storage and grow dynamically in an efficient way. </p>
     *
     * <p> Compared to the other dynamic sequence containers (deques, lists and forward_lists), vectors are
     * very efficient accessing its elements (just like arrays) and relatively efficient adding or removing
     * elements from its end. For operations that involve inserting or removing elements at positions other
     * than the end, they perform worse than the others, and have less consistent iterators and references
     * than Lists. </p>
     *
     * <ul>
     *  <li> Designed by C++ Reference - http://www.cplusplus.com/reference/vector/vector/
     * </ul>
     *
     * @author Migrated by Jeongho Nam
     */
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.call(this);
            if (args.length == 0) {
            }
            if (args.length == 1 && args[0] instanceof Array) {
                // CONSTRUCT FROM AN ARRAY OF ITEMS
                var array = args[0];
                this.push.apply(this, array);
            }
            else if (args.length == 1 && typeof args[0] == "number") {
                // CONSTRUCT FROM SIZE
                var size = args[0];
                this.length = size;
            }
            else if (args.length == 2 && typeof args[0] == "number") {
                // CONSTRUCT FROM SIZE AND REPEATING VALUE
                var size = args[0];
                var val = args[1];
                this.assign(size, val);
            }
            else if (args.length == 1 && (args[0] instanceof Vector || args[0] instanceof std.Container)) {
                // COPY CONSTRUCTOR
                var container = args[0];
                this.assign(container.begin(), container.end());
            }
            else if (args.length == 2 && args[0] instanceof std.Iterator && args[1] instanceof std.Iterator) {
                // CONSTRUCT FROM INPUT ITERATORS
                var begin = args[0];
                var end = args[1];
                this.assign(begin, end);
            }
        }
        Vector.prototype.assign = function (first, second) {
            this.clear();
            if (first instanceof std.Iterator && second instanceof std.Iterator) {
                var begin = first;
                var end = second;
                for (var it = begin; it.equals(end) == false; it = it.next())
                    this.push(it.value);
            }
            else if (typeof first == "number") {
                var size = first;
                var val = second;
                this.length = size;
                for (var i = 0; i < size; i++)
                    this[i] = val;
            }
        };
        /**
         * @inheritdoc
         */
        Vector.prototype.clear = function () {
            this.splice(0, this.length);
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        Vector.prototype.begin = function () {
            if (this.size() == 0)
                return this.end();
            else
                return new VectorIterator(this, 0);
        };
        /**
         * @inheritdoc
         */
        Vector.prototype.end = function () {
            return new VectorIterator(this, -1);
        };
        /**
         * @inheritdoc
         */
        Vector.prototype.size = function () {
            return this.length;
        };
        /**
         * @inheritdoc
         */
        Vector.prototype.empty = function () {
            return this.length != 0;
        };
        /**
         * <p> Access element. </p>
         * <p> Returns a value to the element at position <code>index</code> in the Vector.</p>
         *
         * <p> The function automatically checks whether n is within the bounds of valid elements in the
         * Vector, throwing an OutOfRange exception if it is not (i.e., if <code>index</code> is greater or
         * equal than its size). This is in contrast with member operator[], that does not check against
         * bounds. </p>
         *
         * @param index Position of an element in the container.
         *              If this is greater than or equal to the vector size, an exception of type OutOfRange
         *              is thrown. Notice that the first element has a position of 0 (not 1).
         *
         * @return The element at the specified position in the container.
         */
        Vector.prototype.at = function (index) {
            if (index < this.size())
                return this[index];
            else
                throw new std.OutOfRange("Target index is greater than Vector's size.");
        };
        /**
         * <p> Access first element. </p>
         * <p> Returns a value in the first element of the Vector. </p>
         *
         * <p> Unlike member <code>Vector.begin()</code>, which returns an iterator just past this element,
         * this function returns a direct value. </p>
         *
         * <p> Calling this function on an empty container causes undefined behavior. </p>
         *
         * @return A value in the first element of the Vector.
         */
        Vector.prototype.front = function () {
            return this[0];
        };
        /**
         * <p> Access last element. </p>
         * <p> Returns a value in the last element of the Vector. </p>
         *
         * <p> Unlike member <code>Vector.end()</code>, which returns an iterator just past this element,
         * this function returns a direct value. </p>
         *
         * <p> Calling this function on an empty container causes undefined behavior. </p>
         *
         * @return A value in the last element of the Vector.
         */
        Vector.prototype.back = function () {
            return this[this.length - 1];
        };
        /* ---------------------------------------------------------
            ELEMENTS I/O
        --------------------------------------------------------- */
        Vector.prototype.push = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i - 0] = arguments[_i];
            }
            return this.push.apply(this, items);
        };
        Vector.prototype.pushBack = function (element) {
            this.push(element);
        };
        /**
         * Replaces the element at the specified position in this list with the specified element.
         *
         * @param index A specified position of the value to replace.
         * @param val A value to be stored at the specified position.
         *
         * @return The previous element had stored at the specified position.
         */
        Vector.prototype.set = function (index, val) {
            if (index > this.length)
                throw new std.OutOfRange("Target index is greater than Vector's size.");
            var prev = this[index];
            this[index] = val;
            return prev;
        };
        /**
         * <p> Delete last element. </p>
         *
         * <p> Removes the last element in the Vector container, effectively reducing the container
         * <code>size</code> by one. </p>
         */
        Vector.prototype.popBack = function () {
            this.splice(this.length - 1, 1);
        };
        Vector.prototype.insert = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var position = args[0];
            if (args.length == 2 && args[1] instanceof std.Iterator == false) {
                var val = args[1];
                return this.insert(position, 1, val);
            }
            else if (args.length == 3 && typeof args[1] == "number") {
                var size = args[1];
                var val = args[2];
                var spliced = this.splice(position.getIndex());
                var inserts = [];
                for (var i = 0; i < size; i++)
                    inserts.push(val);
                this.push.apply(this, spliced);
                this.push.apply(this, inserts);
                return new VectorIterator(this, position.getIndex() + inserts.length);
            }
            else if (args.length == 3 && args[1] instanceof std.Iterator && args[2] instanceof std.Iterator) {
                var myEnd = args[0];
                var begin = args[1];
                var end = args[2];
                var spliced = this.splice(position.getIndex());
                var inserts = [];
                for (var it = begin; it.equals(end) == false; it = it.next())
                    inserts.push(it.value);
                this.push.apply(this, spliced);
                this.push.apply(this, inserts);
                return new VectorIterator(this, myEnd.getIndex() + inserts.length);
            }
            else
                throw new std.InvalidArgument("invalid parameters.");
        };
        Vector.prototype.erase = function (begin, end) {
            if (end === void 0) { end = null; }
            var startIndex = begin.getIndex();
            if (end == null)
                this.splice(startIndex, 1);
            else
                this.splice(startIndex, end.getIndex() - startIndex);
            return new VectorIterator(this, startIndex);
        };
        return Vector;
    })(Array);
    std.Vector = Vector;
    ;
    /**
     * <p> A bi-directional iterator of a Set. </p>
     *
     * <ul>
     *  <li> _Ty: Type of the elements. </li>
     * </ul>
     *
     * @author Jeongho Nam
     */
    var VectorIterator = (function (_super) {
        __extends(VectorIterator, _super);
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        /**
         * <p> Construct from source and index number. </p>
         *
         * <h4> Note </h4>
         * <p> Do not create iterator directly. </p>
         * <p> Use begin(), find() or end() in Vector instead. </p>
         *
         * @param vector The source vector to reference.
         * @param index Sequence number of the element in the surce vector.
         */
        function VectorIterator(source, index) {
            _super.call(this, source);
            this.index = index;
        }
        Object.defineProperty(VectorIterator.prototype, "vector", {
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            get: function () {
                return this.source;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VectorIterator.prototype, "value", {
            /**
             * <p> Get value of the iterator is pointing. </p>
             *
             * @return A value of the iterator.
             */
            get: function () {
                return this.vector.at(this.index);
            },
            /**
             * <p> Set value of the iterator is pointing. </p>
             *
             * @param val A new value of the iterator.
             */
            set: function (val) {
                this.vector.set(this.index, val);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p> Whether an iterator is equal with the iterator. </p>
         * <p> Compare two iterators and returns whether they are equal or not. </p>
         *
         * <h4> Note </h4>
         * <p> Iterator's equals() only compare souce map and index number. </p>
         * <p> Although elements in a pair, key and value are equals, if the source map or
         * index number is different, then the equals() will return false. If you want to
         * compare the elements of a pair, compare them directly by yourself. </p>
         *
         * @param obj An iterator to compare
         * @return Indicates whether equal or not.
         */
        VectorIterator.prototype.equals = function (obj) {
            return _super.prototype.equals.call(this, obj) && this.index == obj.index;
        };
        VectorIterator.prototype.getIndex = function () {
            return this.index;
        };
        /* ---------------------------------------------------------
            MOVERS
        --------------------------------------------------------- */
        /**
         * <p> Get iterator to previous element. </p>
         * <p> If current iterator is the first item(equal with <i>begin()</i>), returns end(). </p>
         *
         * @return An iterator of the previous item.
         */
        VectorIterator.prototype.prev = function () {
            if (this.index <= 0)
                return this.source.end();
            else
                return new VectorIterator(this.source, this.index - 1);
        };
        /**
         * <p> Get iterator to next element. </p>
         * <p> If current iterator is the last item, returns end(). </p>
         *
         * @return An iterator of the next item.
         */
        VectorIterator.prototype.next = function () {
            if (this.index >= this.source.size() - 1)
                return this.source.end();
            else
                return new VectorIterator(this.source, this.index + 1);
        };
        return VectorIterator;
    })(std.Iterator);
    std.VectorIterator = VectorIterator;
})(std || (std = {}));
var std;
(function (std) {
    /**
     * <p> A pair of values. </p>
     * <ul>
     *  <li> _Ty1: Type of member fisrt. </li>
     *  <li> _Ty2 Type of member second. </li>
     * </ul>
     *
     * <p> This class couples together a pair of values, which may be of different types
     * (_Ty1 and _Ty2). The individual values can be accessed through its public members
     * first and second. </p>
     *
     * <p> Same with std::pair (http://www.cplusplus.com/reference/utility/pair/) </p>
     *
     * @author Jeongho Nam
     */
    var Pair = (function () {
        /**
         * <p> Construct from pair values. </p>
         *
         * @param first The first value of the Pair
         * @param second The second value of the Pair
         */
        function Pair(first, second) {
            this.first = first;
            this.second = second;
        }
        /**
         * <p> Whether a Pair is equal with the Pair. <p>
         * <p> Compare each first and second value of two Pair(s) and returns whether they are equal or not. </p>
         *
         * <p> If stored key and value in a Pair are not number or string but an object like a class or struct,
         * the comparison will be executed by a member method (SomeObject)::equals(). If the object does not have
         * the member method equals(), only address of pointer will be compared. </p>
         *
         * @param obj A Map to compare
         * @return Indicates whether equal or not.
         */
        Pair.prototype.equals = function (obj) {
            var first;
            var second;
            if (this.first.hasOwnProperty("equals") && this.first["equals"] instanceof Function)
                first = this.first["equals"](obj.first);
            else
                first = this.first == obj.first;
            if (this.second.hasOwnProperty("equals") && this.second["equals"] instanceof Function)
                second = this.second["equals"](obj.second);
            else
                second = this.second == obj.second;
            return first == true && second == true;
        };
        /**
         * <p> Returns a string representation of the Map. </p>
         *
         * <p> The returned string will follow the form of JSonObject </p>
         * <ul>
         *	<li> {"first": "???", "second": ???} </li>
         * </ul>
         */
        Pair.prototype.toString = function () {
            return "{first: " + this.first + ", second: " + this.second + "}";
        };
        return Pair;
    })();
    std.Pair = Pair;
})(std || (std = {}));
/// <reference path="Container.ts" />
/// <reference path="IMap.ts" />
/// <reference path="Iterator.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Pair.ts" />
var std;
(function (std) {
    /**
     * <p> A map containing pairs of key and value. </p>
     * <ul>
     *  <li> _Kty: Type of the keys. Each element in a map is uniquely identified by its key value. </li>
     *  <li> _Ty: Type of the mapped value. Each element in a map stores some data as its mapped value. </li>
     * </ul>
     *
     * <p> Map is designed to pursuing formality in JavaScript. </p>
     * <h4> Definition of std::unordered_map. </h4>
     * <ul>
     *  <li> Reference: http://www.cplusplus.com/reference/unordered_map/unordered_map/ </li>
     * </ul>
     *
     * <p> Unordered maps are associative containers that store elements formed by the combination of
     * a key value and a mapped value, and which allows for fast retrieval of individual elements
     * based on their keys. </p>
     *
     * <p> In an unordered_map, the key value is generally used to uniquely identify the element, while the
     * mapped value is an object with the content associated to this key. Types of key and mapped value may
     * differ. </p>
     *
     * <p> Internally, the elements in the unordered_map are not sorted in any particular order with respect to
     * either their key or mapped values, but organized into buckets depending on their hash values to allow
     * for fast access to individual elements directly by their key values (with a constant average time
     * complexity on average). </p>
     *
     * <p> unordered_map containers are faster than map containers to access individual elements by their key,
     * although they are generally less efficient for range iteration through a subset of their elements. </p>
     *
     * <p> Unordered maps implement the direct access operator (operator[]) which allows for direct access of
     * the mapped value using its key value as argument. </p>
     *
     * <p> Iterators in the container are at least forward iterators. </p>
     *
     * <h4> Differences between std::unordered_map. </h4>
     * <ul>
     *	<li> Addicted Methods </li>
     *	<ul>
     *		<li> has := { find(key) != end(); } </li>
     *		<li> set := { insert({key, value}); } </li>
     *		<li> get := { find(key).second; } </li>
     *	</ul>
     *	<li> Depreciated Methods </li>
     *	<ul>
     *		<li> Modifier methods using iterators </li>
     *		<li> operator[] </li>
     *	</ul>
     * </ul>
     *
     * <h4> Note </h4>
     * <p> Do not use operator[] and hasOwnProperty(). Use get() and has() instead. </p>
     * <p> Do not iterate by <i>for statement</i> used for dynamic object of JavaScript; <i>for(var key in Map)</i> </p>.
     * <p> Use <i>iterator</i> with begin() and end() instaed. </p>
     *
     * @author Jeongho Nam
     */
    var UnorderedMap = (function (_super) {
        __extends(UnorderedMap, _super);
        function UnorderedMap() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.call(this);
            this.data_ = new std.Vector();
        }
        UnorderedMap.prototype.assign = function (begin, end) {
        };
        UnorderedMap.prototype.clear = function () {
            this.data_.clear();
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        /**
         * <p> Get data. </p>
         * <p> Returns the source container of the Map. </p>
         *
         * <h4> Note </h4>
         * <p> Changes on the returned container influences the source Map. </p>
         */
        UnorderedMap.prototype.data = function () {
            return this.data_;
        };
        /**
         * <p> Return container size. </p>
         * <p> Returns the number of elements in Map container. </p>
         *
         * @return The number of elements in the container.
         */
        UnorderedMap.prototype.size = function () {
            return this.data_.size();
        };
        /**
         * <p> Get iterator to element. </p>
         *
         * <p> Searches the container for an element with a identifier equivalent to <i>key</i> and
         * returns an iterator to it if found, otherwise it returns an iterator to Map::end(). </p>
         *
         * <p> Two keys are considered equivalent if the container's comparison object returns false
         * reflexively (i.e., no matter the order in which the elements are passed as arguments). </p>
         *
         * <p> Another member function, Map.has(), can be used to just check whether
         * a particular key exists. </p>
         *
         * @param key Key to be searched for
         * @return An iterator to the element, if an element with specified key is found, or Map::end() otherwise.
         */
        UnorderedMap.prototype.find = function (key) {
            var i;
            if (key.hasOwnProperty("equals") == true) {
                for (i = 0; i < this.data_.size(); i++)
                    if (this.data_.at(i).first["equals"](key) == true)
                        return new UnorderedMapIterator(this, i);
            }
            else {
                for (i = 0; i < this.data_.size(); i++)
                    if (this.data_.at(i).first == key)
                        return new UnorderedMapIterator(this, i);
            }
            return this.end();
        };
        /* ---------------------------------------------------------
            GETTERS
        --------------------------------------------------------- */
        /**
         * <p> Whether have the item or not. </p>
         * <p> Indicates whether a map has an item having the specified identifier. </p>
         *
         * @param key Key value of the element whose mapped value is accessed.
         * @return Whether the map has an item having the specified identifier
         */
        UnorderedMap.prototype.has = function (key) {
            return !this.find(key).equals(this.end());
        };
        /**
         * <p> Get element by key. </p>
         * <p> Returns a reference to the mapped value of the element identified with key. </p>
         *
         * @param key Key value of the element whose mapped value is accessed.
         * @throw exception out of range.
         *
         * @return A reference object of the mapped value (_Ty)
         */
        UnorderedMap.prototype.get = function (key) {
            return this.find(key).second;
        };
        /* ---------------------------------------------------------
            ITERATORS
        --------------------------------------------------------- */
        /**
         * <p> Return iterator to beginning. </p>
         * <p> Returns an iterator referring the first element in the Map container. </p>
         *
         * <h4> Note </h4>
         * <p> If the container is empty, the returned iterator is same with end(). </p>
         *
         * @return An iterator to the first element in the container.
         *         The iterator containes the first element's pair; key and value.
         */
        UnorderedMap.prototype.begin = function () {
            if (this.size() == 0)
                return this.end();
            return new UnorderedMapIterator(this, 0);
        };
        /**
         * <p> Return iterator to end. </p>
         * <p> Returns an iterator referring to the past-the-end element in the Map container. </p>
         *
         * <p> The past-the-end element is the theoretical element that would follow the last element in
         * the Map container. It does not point to any element, and thus shall not be dereferenced. </p>
         *
         * <p> Because the ranges used by functions of the Map do not include the element reference
         * by their closing iterator, this function is often used in combination with Map::begin() to specify
         * a range including all the elements in the container. </p>
         *
         * <h4> Note </h4>
         * <p> Returned iterator from Map.end() does not refer any element. Trying to accessing
         * element by the iterator will cause throwing exception (out of range). </p>
         * <p> If the container is empty, this function returns the same as Map::begin(). </p>
         *
         * @return An iterator to the end element in the container.
         */
        UnorderedMap.prototype.end = function () {
            return new UnorderedMapIterator(this, -1);
        };
        /* ---------------------------------------------------------
            ELEMENTS I/O AND MODIFIDERS
        --------------------------------------------------------- */
        UnorderedMap.prototype.insert = function (myEnd, begin, end) {
            if (end === void 0) { end = null; }
            return null;
        };
        UnorderedMap.prototype.erase = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            throw new std.AbstractMethodError("Have to be overriden.");
        };
        /**
         * <p> Set element. </p>
         * <p> Set an item as the specified identifier. </p>
         *
         * <p> If the identifier is already in map, change value of the identifier.
         * If not, then insert the object with the identifier. </p>
         *
         * @param key Key value of the element whose mapped value is accessed.
         * @param val Value, the item.
         */
        UnorderedMap.prototype.set = function (key, value) {
            for (var i = 0; i < this.data_.size(); i++)
                if (this.data_.at(i).first == key) {
                    this.data_.at(i).second = value;
                    return;
                }
            this.data_.push(new std.Pair(key, value));
        };
        /**
         * <p> Pop an element. </p>
         * <p> Removes an element by its key(identifier) from the Map container and returns it. </p>
         *
         * @param key Key of the element to be removed from the Map.
         * @throw exception out of range.
         */
        UnorderedMap.prototype.pop = function (key) {
            for (var i = 0; i < this.data_.size(); i++)
                if (this.data_.at(i).first == key)
                    return this.data_.splice(i, 1)[0].second;
            throw Error("out of range");
        };
        /* ---------------------------------------------------------
            COMPARE
        --------------------------------------------------------- */
        /**
         * <p> Whether a Map is equal with the Map. </p>
         *
         * <p> Map::equals() does not compare reference(address of pointer) of Maps or elements
         * in the two Maps. The target of comparison are the key and value in all children elements(pairs).
         * It's not a matter that order sequence of children are different between two Maps. </p>
         *
         * <p> If stored key or value in a pair (element) in those Maps are not number or string, but an object
         * like a class or struct, the comparison will be executed by a member method (SomeObject)::equals(). If
         * the object does not have the member method equals(), only address of pointer will be compared. </p>
         *
         * @param obj A Map to compare
         * @return Indicates whether equal or not.
         */
        UnorderedMap.prototype.equals = function (obj) {
            if (this.size() != obj.size())
                return false;
            for (var i = 0; i < this.data_.size(); i++)
                if (this.data_.at(i).equals(obj.data_.at(i)) == false)
                    return false;
            return true;
        };
        /* ---------------------------------------------------------
            EXPORT
        --------------------------------------------------------- */
        /**
         * <p> Returns a string representation of the Map. </p>
         *
         * <p> The returned string will follow the form of JSonObject </p>
         * <ul>
         *	<li> {{"key": "???", "value": ???}, {"key": "?", "value": ?}, ...} </li>
         * </ul>
         */
        UnorderedMap.prototype.toString = function () {
            var str = "{";
            for (var i = 0; i < this.data_.size(); i++) {
                var pair = this.data_.at(i);
                var key = "\"" + pair.first + "\"";
                var value = (typeof pair.second == "string")
                    ? "\"" + pair.second + "\""
                    : String(pair.second);
                str += "{\"key\": " + key + ": value: " + value + "}";
            }
            str += "}";
            return str;
        };
        return UnorderedMap;
    })(std.PairContainer);
    std.UnorderedMap = UnorderedMap;
    /**
     * <p> A bi-directional iterator. </p>
     * <ul>
     *  <li> _Kty: Type of the keys. Each element in a map is uniquely identified by its key value. </li>
     *  <li> _Ty: Type of the mapped value. Each element in a map stores some data as its mapped value. </li>
     * </ul>
     *
     * @author Jeongho Nam
     */
    var UnorderedMapIterator = (function (_super) {
        __extends(UnorderedMapIterator, _super);
        /**
         * <p> Construct from source and index number. </p>
         *
         * <h4> Note </h4>
         * <p> Do not create iterator directly. </p>
         * <p> Use begin(), find() or end() in Map instead. </p>
         *
         * @param map The source map to reference
         * @param index Sequence number of the element in the source map
         */
        function UnorderedMapIterator(source, index) {
            _super.call(this, source);
            if (index != -1 && index < source.size())
                this.index = index;
            else
                this.index = -1;
        }
        Object.defineProperty(UnorderedMapIterator.prototype, "map", {
            /* ---------------------------------------------------------
                GETTERS AND SETTERS
            --------------------------------------------------------- */
            get: function () {
                return (this.source);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnorderedMapIterator.prototype, "first", {
            /**
             * <p> Get first element (key). </p>
             */
            get: function () {
                return this.map.data().at(this.index).first;
            },
            /**
             * <p> Set first element (key). </p>
             */
            set: function (key) {
                this.map.data().at(this.index).first = key;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnorderedMapIterator.prototype, "second", {
            /**
             * <p> Get second element (mapped value). </p>
             */
            get: function () {
                return this.map.data().at(this.index).second;
            },
            /**
             * <p> Set second element (mapped value). </p>
             */
            set: function (val) {
                this.map.data().at(this.index).second = val;
            },
            enumerable: true,
            configurable: true
        });
        /* ---------------------------------------------------------
            COMPARISON
        --------------------------------------------------------- */
        /**
         * <p> Whether an iterator is equal with the iterator. </p>
         * <p> Compare two iterators and returns whether they are equal or not. </p>
         *
         * <h4> Note </h4>
         * <p> Iterator's equals() only compare souce map and index number. </p>
         * <p> Although elements in a pair, key and value are equals, if the source map or
         * index number is different, then the equals() will return false. If you want to
         * compare the elements of a pair, compare them directly by yourself. </p>
         *
         * @param obj An iterator to compare
         * @return Indicates whether equal or not.
         */
        UnorderedMapIterator.prototype.equals = function (obj) {
            return _super.prototype.equals.call(this, obj) && this.index == obj.index;
        };
        /* ---------------------------------------------------------
            MOVERS
        --------------------------------------------------------- */
        /**
         * <p> Get iterator to previous element. </p>
         * <p> If current iterator is the first item(equal with <i>begin()</i>), returns end(). </p>
         *
         * @return An iterator of the previous item.
         */
        UnorderedMapIterator.prototype.prev = function () {
            if (this.index - 1 < 0)
                return this.map.end();
            else
                return new UnorderedMapIterator(this.map, this.index - 1);
        };
        /**
         * <p> Get iterator to next element. </p>
         * <p> If current iterator is the last item, returns end(). </p>
         *
         * @return An iterator of the next item.
         */
        UnorderedMapIterator.prototype.next = function () {
            if (this.index + 1 >= this.map.size())
                return this.map.end();
            else
                return new UnorderedMapIterator(this.map, this.index + 1);
        };
        return UnorderedMapIterator;
    })(std.PairIterator);
    std.UnorderedMapIterator = UnorderedMapIterator;
})(std || (std = {}));
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        /**
         * <p> A utility class supporting static methods of string. </p>
         *
         * @author Jeongho Nam
         */
        var StringUtil = (function () {
            function StringUtil() {
            }
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
            /*public static substitute(format: string, ...args: any[]): string
            {
                return "";
            }*/
            /**
             * <p> Replace all patterns of a string. </p>
             */
            StringUtil.replaceAll = function (str, pairs) {
                if (pairs.length == 0)
                    return str;
                for (var i = 0; i < pairs.length; i++)
                    str = str.split(pairs[i].first).join(pairs[i].second);
                return str;
            };
            return StringUtil;
        })();
        library.StringUtil = StringUtil;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../../std/UnorderedMap.ts" />
///     <reference path="XMLList.ts" />
/// <reference path="StringUtil.ts" />
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
         * @author Jeongho Nam
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
             * <h4> Note </h4>
             * <p> Throwing exceptions on parsing are not defined yet. If there's some problem on
             * the string representing the XML object, error will be occured. </p>
             *
             * @param str A string to be parsed
             */
            function XML(str) {
                if (str === void 0) { str = ""; }
                _super.call(this);
                this.properties = new std.UnorderedMap();
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
                        var xmlList;
                        var xml = new XML();
                        xml.construct(str.substring(start, end + 1));
                        if (this.has(xml.tag) == true)
                            xmlList = this.get(xml.tag);
                        else {
                            xmlList = new library.XMLList();
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
             * <p> Test wheter a property exists or not. </p>
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
             * @param val The value to set
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
                            var xmlList = new library.XMLList();
                            xmlList.push(xml);
                            this.set(xml.tag, xmlList);
                        }
                    }
                    else if (items[i] instanceof library.XMLList) {
                        _super.prototype.push.call(this, items[i]);
                    }
                }
                return this.size();
            };
            XML.prototype.addAllProperties = function (xml) {
                for (var it = xml.properties.begin(); it.equals(xml.properties.end()) == false; it = it.next())
                    this.setProperty(it.first, it.second);
            };
            XML.prototype.clearProperties = function () {
                this.properties = new std.UnorderedMap();
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
                return library.StringUtil.replaceAll(str, pairs);
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
                return library.StringUtil.replaceAll(str, pairs);
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
                return library.StringUtil.replaceAll(str, pairs);
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
                return library.StringUtil.replaceAll(str, pairs);
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
                for (var p_it = this.properties.begin(); p_it.equals(this.properties.end()) == false; p_it = p_it.next())
                    str += " " + p_it.first + "=\"" + XML.encodeProperty(String(p_it.second)) + "\"";
                if (this.size() == 0) {
                    if (this.value != "")
                        str += ">" + XML.encodeValue(String(this.value)) + "</" + this.tag + ">";
                    else
                        str += " />";
                }
                else {
                    str += ">\n";
                    for (var x_it = this.begin(); x_it.equals(this.end()) == false; x_it = x_it.next())
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
                for (var p_it = this.properties.begin(); p_it.equals(this.properties.end()) == false; p_it = p_it.next())
                    str += " " + p_it.first + "=&quot;" + XML.encodeProperty(String(p_it.second)) + "&quot;";
                if (this.size() == 0) {
                    if (this.value != "")
                        str += "&gt;" + XML.encodeValue(String(this.value)) + "</" + this.tag + ">";
                    else
                        str += " /&gt;";
                }
                else {
                    str += "&gt;<br>\n";
                    for (var x_it = this.begin(); x_it.equals(this.end()) == false; x_it = x_it.next())
                        str += x_it.second.toHTML(level + 1);
                    str += library.StringUtil.htmlTab(level) + "&lt;/" + this.tag + "&gt;";
                }
                return str;
            };
            return XML;
        })(std.UnorderedMap);
        library.XML = XML;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../../std/Vector.ts" />
///     <reference path="XML.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        /**
         * <p> List of XML(s) having same tag. </p>
         *
         * @author Jeongho Nam
         */
        var XMLList = (function (_super) {
            __extends(XMLList, _super);
            /**
             * <p> Default Constructor. </p>
             */
            function XMLList() {
                _super.call(this);
            }
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
        })(std.Vector);
        library.XMLList = XMLList;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../library/XML.ts" />
/// <reference path="../../std/Vector.ts" />
///     <reference path="IEntity.ts" />
/// <reference path="../../std/IMap.ts" />
/// <reference path="../library/XML.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        /**
         * @inheritdoc
         */
        var EntityArray = (function (_super) {
            __extends(EntityArray, _super);
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            /**
             * Default Constructor.
             */
            function EntityArray() {
                _super.call(this);
            }
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
            EntityArray.prototype.construct = function (xml) {
                this.clear();
                // MEMBER VARIABLES; ATOMIC
                var propertyMap = xml.getPropertyMap();
                for (var v_it = propertyMap.begin(); v_it.equals(propertyMap.end()) != true; v_it = v_it.next())
                    if (this.hasOwnProperty(v_it.first) == true
                        && (typeof this[v_it.first] == "number" || typeof this[v_it.first] == "string")
                        && v_it.first != "length") {
                        this[v_it.first] = v_it.second;
                    }
                // MEMBER ENTITIES
                for (var e_it = xml.begin(); e_it.equals(xml.end()) != true; e_it = e_it.next()) {
                    if (this.hasOwnProperty(e_it.first) == true
                        && e_it.first != this.CHILD_TAG()
                        && e_it.second.size() == 1
                        && (this[e_it.first] instanceof protocol.Entity || this[e_it.first] instanceof EntityArray)
                        && this[e_it.first] != null) {
                        var entity = this[e_it.first];
                        var e_xml = e_it.second.at(0);
                        if (entity == null)
                            continue;
                        entity.construct(e_xml);
                    }
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
            /**
             * <p> Factory method of a child Entity. </p>
             *
             * <p> EntityArray::createChild() is a factory method creating a new child Entity which is belonged
             * to the EntityArray. This method is called by EntityArray::construct(). The children construction
             * methods Entity::construct() will be called by abstract method of the EntityArray::construct(). </p>
             *
             * @return A new child Entity belongs to EntityArray.
             */
            EntityArray.prototype.createChild = function (xml) {
                return null;
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
            EntityArray.prototype.has = function (key) {
                var i;
                if (key instanceof protocol.Entity || key instanceof EntityArray) {
                    for (i = 0; i < this.size(); i++)
                        if (this.at(i) == key)
                            return true;
                }
                else {
                    for (var i = 0; i < this.size(); i++)
                        if (this.at(i).key() == key)
                            return true;
                }
                return false;
            };
            /**
             * @inheritdoc
             */
            EntityArray.prototype.get = function (key) {
                for (var i = 0; i < this.size(); i++)
                    if (this.at(i).key() == key)
                        return this.at(i);
                throw Error("out of range");
            };
            /* ------------------------------------------------------------------
                ELEMENTS I/O
            ------------------------------------------------------------------ */
            //public set(key: string, entity: Ety): void
            //{
            //    this.push(entity);
            //}
            //public erase(key: string): std.Iterator<Ety>
            //{
            //    for (var i: number = this.length - 1; i >= 0; i--)
            //        if (this.at(i).key() == key)
            //        {
            //            this.splice(i, 1);
            //            return new std.VectorIterator<Ety>(this, i);
            //        }
            //    return this.end();
            //}
            /* ------------------------------------------------------------------
                EXPORTERS
            ------------------------------------------------------------------ */
            /**
             * @inheritdoc
             */
            EntityArray.prototype.TAG = function () { return ""; };
            /**
             * <p> A tag name of children objects. </p>
             */
            EntityArray.prototype.CHILD_TAG = function () { return ""; };
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
            EntityArray.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                // MEMBERS
                for (var key in this)
                    if (typeof key == "string" && key != "length" // LENGTH: MEMBER OF AN ARRAY
                        && (typeof this[key] == "string" || typeof this[key] == "number")) {
                        // ATOMIC
                        xml.setProperty(key, this[key]);
                    }
                // CHILDREN
                for (var i = 0; i < this.size(); i++)
                    xml.push(this.at(i).toXML());
                return xml;
            };
            return EntityArray;
        })(std.Vector);
        protocol.EntityArray = EntityArray;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
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
         * @author Jeongho Nam
         */
        var Entity = (function () {
            /**
             * <p> Default Constructor. </p>
             */
            function Entity() {
                //NOTHING
            }
            Entity.prototype.construct = function (xml) {
                // MEMBER VARIABLES; ATOMIC
                var propertyMap = xml.getPropertyMap();
                for (var v_it = propertyMap.begin(); v_it.equals(propertyMap.end()) != true; v_it = v_it.next())
                    if (this.hasOwnProperty(v_it.first) == true && (typeof this[v_it.first] == "number" || typeof this[v_it.first] == "string"))
                        this[v_it.first] = v_it.second;
                // MEMBER ENTITIES
                for (var e_it = xml.begin(); e_it.equals(xml.end()) != true; e_it = e_it.next()) {
                    if (this.hasOwnProperty(e_it.first) == true
                        && e_it.second.size() == 1
                        && (this[e_it.first] instanceof Entity || this[e_it.first] instanceof protocol.EntityArray)
                        && this[e_it.first] != null) {
                        var entity = this[e_it.first];
                        var e_xml = e_it.second.at(0);
                        if (entity == null)
                            continue;
                        entity.construct(e_xml);
                    }
                }
            };
            Entity.prototype.TAG = function () { return ""; };
            Entity.prototype.key = function () { return ""; };
            Entity.prototype.toXML = function () {
                var xml = new samchon.library.XML();
                xml.setTag(this.TAG());
                // MEMBERS
                for (var key in this)
                    if (typeof key == "string" &&
                        (typeof this[key] == "string" || typeof this[key] == "number")) {
                        xml.setProperty(key, this[key]);
                    }
                return xml;
            };
            return Entity;
        })();
        protocol.Entity = Entity;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../../protocol/EntityArray.ts" />
/// <reference path="../../protocol/Entity.ts" />
var samchon;
(function (samchon) {
    var example;
    (function (example) {
        var entity;
        (function (entity) {
            function main() {
                var str = "<memberList>\n" +
                    "   <member id='abcd' name='ABCD' />\n" +
                    "   <member id='efgh' name='EFGH' />\n" +
                    "</memberList>";
                var xml = new samchon.library.XML(str);
                samchon.trace(xml.toString());
                samchon.trace(new samchon.library.XML(xml.toString()).toString());
            }
            entity.main = main;
        })(entity = example.entity || (example.entity = {}));
    })(example = samchon.example || (samchon.example = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../../protocol/IEntity.ts" />
/// <reference path="../../API.ts" />
/// <reference path="../../protocol/EntityArray.ts" />
///     <referecen path="Product.ts" />
var samchon;
(function (samchon) {
    var example;
    (function (example) {
        var packer;
        (function (packer) {
            var ProductArray = (function (_super) {
                __extends(ProductArray, _super);
                /* ------------------------------------------------------------------
                    CONSTRUCTORS
                ------------------------------------------------------------------ */
                /**
                 * Default Constructor.
                 */
                function ProductArray() {
                    _super.call(this);
                }
                ProductArray.prototype.createChild = function (xml) {
                    return new packer.Product();
                };
                /* ------------------------------------------------------------------
                    EXPORTERS
                ------------------------------------------------------------------ */
                ProductArray.prototype.TAG = function () {
                    return "productArray";
                };
                ProductArray.prototype.CHILD_TAG = function () {
                    return "product";
                };
                return ProductArray;
            })(samchon.protocol.EntityArray);
            packer.ProductArray = ProductArray;
        })(packer = example.packer || (example.packer = {}));
    })(example = samchon.example || (samchon.example = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="ProductArray.ts" />
///     <reference path="Instance.ts" />
var samchon;
(function (samchon) {
    var example;
    (function (example) {
        var packer;
        (function (packer) {
            var Wrapper = (function (_super) {
                __extends(Wrapper, _super);
                function Wrapper() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    _super.call(this);
                    if (args.length == 1 && args[0] instanceof Wrapper) {
                        var wrapper = args[0];
                        this.name = wrapper.name;
                        this.price = wrapper.price;
                        this.volume = wrapper.volume;
                        this.weight = wrapper.weight;
                    }
                    else if (args.length == 4) {
                        this.name = args[0];
                        this.price = args[1];
                        this.volume = args[2];
                        this.weight = args[3];
                    }
                }
                Wrapper.prototype.createChild = function (xml) {
                    return new packer.Product();
                };
                /* --------------------------------------------------------------------
                    OPERATORS
                -------------------------------------------------------------------- */
                Wrapper.prototype.tryInsert = function (product) {
                    var volume = 0;
                    var weight = 0;
                    for (var i = 0; i < this.size(); i++) {
                        volume += this.at(i).getVolume();
                        weight += this.at(i).getWeight();
                    }
                    if (product.getVolume() + volume > this.volume ||
                        product.getWeight() + weight > this.weight) {
                        return false;
                    }
                    this.push(product);
                    return true;
                };
                /* --------------------------------------------------------------------
                    GETTERS
                -------------------------------------------------------------------- */
                Wrapper.prototype.getName = function () {
                    return this.name;
                };
                Wrapper.prototype.getPrice = function () {
                    return this.price;
                };
                Wrapper.prototype.getVolume = function () {
                    return this.volume;
                };
                Wrapper.prototype.getWeight = function () {
                    return this.weight;
                };
                /* --------------------------------------------------------------------
                    EXPORTERS
                -------------------------------------------------------------------- */
                Wrapper.prototype.TAG = function () {
                    return "wrapper";
                };
                return Wrapper;
            })(packer.ProductArray);
            packer.Wrapper = Wrapper;
        })(packer = example.packer || (example.packer = {}));
    })(example = samchon.example || (samchon.example = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../../protocol/EntityArray.ts" />
///     <reference path="Wrapper.ts" />
var samchon;
(function (samchon) {
    var example;
    (function (example) {
        var packer;
        (function (packer) {
            var WrapperArray = (function (_super) {
                __extends(WrapperArray, _super);
                /* --------------------------------------------------------------------
                    CONSTRUCTORS
                -------------------------------------------------------------------- */
                /**
                 * <p> Construct from a sample wrapper. </p>
                 *
                 * @param sample A sample wrapper used to copy wrappers.
                 */
                function WrapperArray(sample) {
                    if (sample === void 0) { sample = null; }
                    _super.call(this);
                    this.sample = sample;
                    this.reserved = new Array();
                }
                WrapperArray.prototype.construct = function (xml) {
                    _super.prototype.construct.call(this, xml);
                    this.sample = new packer.Wrapper();
                    this.sample.construct(xml);
                };
                WrapperArray.prototype.createChild = function (xml) {
                    return new packer.Wrapper();
                };
                /* --------------------------------------------------------------------
                    OPERATORS
                -------------------------------------------------------------------- */
                /**
                 * <p> Try to insert a product into reserved list. </p>
                 *
                 * <p> If the Product's volume and weight is equal or less than the Wrapper categorized so that enable to
                 * insert in a Wrapper, reserve the Product and returns <i>true</i>. If not, does not reserve and just
                 * return <i>false</i>. </p>
                 *
                 * @return Whether the Product's volume and weight is equal or less than the Wrapper.
                 */
                WrapperArray.prototype.tryInsert = function (product) {
                    if (product.getVolume() > this.sample.getVolume() ||
                        product.getWeight() > this.sample.getWeight()) {
                        return false;
                    }
                    this.reserved.push(product);
                    return true;
                };
                /**
                 * <p> Optimize to retrieve the best solution. </p>
                 *
                 * <p> Retrieves the best solution of packaging in level of WrapperArray. </p>
                 * <p> Shuffles sequence of reserved Product(s) by samchon::library::FactorialGenerator and insert the reserved
                 * Products(s) following the sequence creating Wrapper(s) as needed. Between the sequences from FactorialGenerator,
                 * retrieve and determine the best solution. </p>
                 *
                 * <h4> Note. </h4>
                 * <p> Sequence of inserting Product can affeact to numbers of Wrapper(s) to be used. </p>
                 * <p> It's the reason why even WrapperArray has the optimize() method. </p>
                 */
                WrapperArray.prototype.optimize = function () {
                    if (this.reserved.length == 0)
                        return;
                    var factorial = new samchon.library.FactorialGenerator(this.reserved.length);
                    var minWrapperArray;
                    for (var i = 0; i < factorial.size(); i++) {
                        var wrapperArray = new WrapperArray(this.sample);
                        var row = factorial.at(i);
                        for (var j = 0; j < row.length; j++) {
                            var product = this.reserved[row[j]];
                            if (wrapperArray.size() == 0 ||
                                wrapperArray.at(wrapperArray.size() - 1).tryInsert(product) == false) {
                                var wrapper = new packer.Wrapper(this.sample);
                                wrapper.tryInsert(product);
                                wrapperArray.push(wrapper);
                            }
                        }
                        if (minWrapperArray == null ||
                            wrapperArray.calcPrice() < minWrapperArray.calcPrice()) {
                            minWrapperArray = wrapperArray;
                        }
                    }
                    //REPLACE TO MIN_WRAPPER_ARRAY
                    this.splice(0, this.size());
                    for (var i = 0; i < minWrapperArray.size(); i++)
                        this.push(minWrapperArray.at(i));
                };
                /* --------------------------------------------------------------------
                    GETTERS
                -------------------------------------------------------------------- */
                /**
                 * <p> Calculate price of the Wrapper(s). </p>
                 *
                 * <p> Calculates price of all wrappers'. The price does not contain inserted products'. </p>
                 */
                WrapperArray.prototype.calcPrice = function () {
                    return this.sample.getPrice() * this.size();
                };
                /**
                 * <p> Get sample. </p>
                 */
                WrapperArray.prototype.getSample = function () {
                    return this.sample;
                };
                /* --------------------------------------------------------------------
                    EXPORTERS
                -------------------------------------------------------------------- */
                WrapperArray.prototype.TAG = function () {
                    return "wrapperArray";
                };
                WrapperArray.prototype.CHILD_TAG = function () {
                    return "wrapper";
                };
                WrapperArray.prototype.toXML = function () {
                    var xml = _super.prototype.toXML.call(this);
                    xml.addAllProperties(this.sample.toXML());
                    return xml;
                };
                return WrapperArray;
            })(samchon.protocol.EntityArray);
            packer.WrapperArray = WrapperArray;
        })(packer = example.packer || (example.packer = {}));
    })(example = samchon.example || (samchon.example = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../../protocol/EntityArray.ts" />
///     <reference path="WrapperArray.ts" />
var samchon;
(function (samchon) {
    var example;
    (function (example) {
        var packer;
        (function (packer_1) {
            /**
             * <p> A packer planning the best packaging. </p>
             * <p> Retrieves the solution of packaging by combination permuation and factorial case. </p>
             *
             * <h4> Warning. </h4>
             * <p> Be careful about number of products and wrappers. </p>
             * <p> The time complexity of Packer overs O(m^n). Elapsed time of calculation increases enourmously.
             * Do not use Packer if the digits of number of products or wrappers overs 2. </p>
             *
             * @author Jeongho Nam
             */
            var Packer = (function (_super) {
                __extends(Packer, _super);
                /* --------------------------------------------------------------------
                    CONSTRUCTORS
                -------------------------------------------------------------------- */
                /**
                 * <p> Construct from an argument. </p>
                 */
                function Packer(obj) {
                    if (obj === void 0) { obj = null; }
                    _super.call(this);
                    if (obj == null) {
                        this.productArray = new packer_1.ProductArray();
                        return;
                    }
                    if (obj instanceof packer_1.ProductArray) {
                        this.productArray = obj;
                    }
                    else if (obj instanceof Packer) {
                        var packer = obj;
                        this.productArray = packer.productArray;
                        for (var i = 0; i < packer.size(); i++)
                            this.push(new packer_1.WrapperArray(packer.at(i).getSample()));
                    }
                    else
                        throw "invalid argument";
                }
                Packer.prototype.createChild = function (xml) {
                    return new packer_1.WrapperArray();
                };
                /* --------------------------------------------------------------------
                    CALCULATORS
                -------------------------------------------------------------------- */
                /**
                 * <p> Find the best packaging method. </p>
                 */
                Packer.prototype.optimize = function (start, size) {
                    if (start === void 0) { start = 0; }
                    if (size === void 0) { size = -1; }
                    if (this.size() == 0 || this.productArray.size() == 0)
                        return;
                    var caseGenerator = new samchon.library.CombinedPermutationGenerator(this.size(), this.productArray.size());
                    var minPacker = null;
                    //ADJUST END INDEX
                    if (size == -1 || start + size > caseGenerator.size())
                        size = caseGenerator.size() - start;
                    //FIND THE BEST SOLUTION
                    for (var i = start; i < start + size; i++) {
                        var packer = new Packer(this);
                        var row = caseGenerator.at(i);
                        var validity = true;
                        for (var j = 0; j < row.length; j++) {
                            var product = this.productArray.at(j);
                            var wrapperArray = packer.at(row[j]);
                            if (wrapperArray.tryInsert(product) == false) {
                                validity = false;
                                break;
                            }
                        }
                        if (validity == false)
                            continue;
                        //OPTIMIZE ALL WRAPPERS IN A PACKER
                        for (var j = 0; j < packer.size(); j++)
                            packer.at(j).optimize();
                        if (minPacker == null || packer.calcPrice() < minPacker.calcPrice())
                            minPacker = packer;
                    }
                    //REPLACE TO MIN_PACKER
                    this.splice(0, this.size());
                    for (var i = 0; i < minPacker.size(); i++)
                        this.push(minPacker.at(i));
                };
                /**
                 * <p> Calculate price of the wrappers. </p>
                 */
                Packer.prototype.calcPrice = function () {
                    var price = 0;
                    for (var i = 0; i < this.size(); i++)
                        price += this.at(i).calcPrice();
                    return price;
                };
                /* --------------------------------------------------------------------
                    EXPORTERS
                -------------------------------------------------------------------- */
                Packer.prototype.TAG = function () {
                    return "packer";
                };
                Packer.prototype.CHILD_TAG = function () {
                    return "wrapperArray";
                };
                /* --------------------------------------------------------------------
                    STATIC MAIN
                -------------------------------------------------------------------- */
                Packer.main = function () {
                    var productArray = new packer_1.ProductArray();
                    productArray.push(new packer_1.Product("Eraser", 500, 10, 70), new packer_1.Product("Pencil", 400, 30, 35), new packer_1.Product("Pencil", 400, 30, 35), new packer_1.Product("Pencil", 400, 30, 35), new packer_1.Product("Book", 8000, 150, 300), new packer_1.Product("Book", 8000, 150, 300), new packer_1.Product("Drink", 1000, 75, 250), new packer_1.Product("Umbrella", 4000, 200, 1000), new packer_1.Product("Notebook-PC", 800000, 150, 850), new packer_1.Product("Tablet-PC", 600000, 120, 450));
                    var packer = new Packer(productArray);
                    packer.push(new packer_1.WrapperArray(new packer_1.Wrapper("Large", 100, 200, 1000)), new packer_1.WrapperArray(new packer_1.Wrapper("Medium", 70, 150, 500)), new packer_1.WrapperArray(new packer_1.Wrapper("Small", 50, 100, 250)));
                    packer.optimize();
                    samchon.trace(packer.toXML().toString());
                };
                return Packer;
            })(samchon.protocol.EntityArray);
            packer_1.Packer = Packer;
        })(packer = example.packer || (example.packer = {}));
    })(example = samchon.example || (samchon.example = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../../protocol/Entity.ts" />
var samchon;
(function (samchon) {
    var example;
    (function (example) {
        var packer;
        (function (packer) {
            var Product = (function (_super) {
                __extends(Product, _super);
                function Product(name, price, volume, weight) {
                    if (name === void 0) { name = ""; }
                    if (price === void 0) { price = 0; }
                    if (volume === void 0) { volume = 0; }
                    if (weight === void 0) { weight = 0; }
                    _super.call(this);
                    this.name = name;
                    this.price = price;
                    this.volume = volume;
                    this.weight = weight;
                }
                /* --------------------------------------------------------------------
                    GETTERS
                -------------------------------------------------------------------- */
                Product.prototype.getName = function () {
                    return this.name;
                };
                Product.prototype.getPrice = function () {
                    return this.price;
                };
                Product.prototype.getVolume = function () {
                    return this.volume;
                };
                Product.prototype.getWeight = function () {
                    return this.weight;
                };
                /* --------------------------------------------------------------------
                    EXPORTERS
                -------------------------------------------------------------------- */
                Product.prototype.TAG = function () {
                    return "product";
                };
                return Product;
            })(samchon.protocol.Entity);
            packer.Product = Product;
        })(packer = example.packer || (example.packer = {}));
    })(example = samchon.example || (samchon.example = {}));
})(samchon || (samchon = {}));
/// <reference path="library/StringUtil.ts" />
/// <reference path="../std/Pair.ts" />
var samchon;
(function (samchon) {
    var Global = (function () {
        function Global() {
        }
        return Global;
    })();
    samchon.Global = Global;
})(samchon || (samchon = {}));
var uid_ = 0;
Object.prototype["__getUID"] = function () {
    if (this.hasOwnProperty("uid__") == true)
        return this["uid__"];
    else {
        this["uid__"] = ++uid_;
        return this["uid__"];
    }
};
/// <reference path="../API.ts" />
/// <reference path="../../std/Exception.ts" />
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
         * @author Jeongho Nam
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
            /**
             * <p> Get index'th case. </p>
             *
             * @param index Index number
             * @return The row of the index'th in combined permuation case
             */
            CaseGenerator.prototype.at = function (index) {
                throw new std.AbstractMethodError("Don't create CaseGenerator directly.");
            };
            return CaseGenerator;
        })();
        library.CaseGenerator = CaseGenerator;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="CaseGenerator.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        /**
         * <p> A combined-permutation case generator. </p>
         * <p> <sub>n</sub>TT<sub>r</sub> </p>
         *
         * @inheritdoc
         * @author Jeongho Nam
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
                this.dividerArray = new Array();
                for (var i = 0; i < r; i++) {
                    var x = r - (i + 1);
                    var val = Math.pow(n, x);
                    this.dividerArray.push(val);
                }
            }
            CombinedPermutationGenerator.prototype.at = function (index) {
                var row = new Array();
                for (var i = 0; i < this.r_; i++) {
                    var val = Math.floor(index / this.dividerArray[i]) % this.n_;
                    row.push(val);
                }
                return row;
            };
            return CombinedPermutationGenerator;
        })(library.CaseGenerator);
        library.CombinedPermutationGenerator = CombinedPermutationGenerator;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
var std;
(function (std) {
    var Bind = (function () {
        function Bind(func, thisArg) {
            this.func = func;
            this.thisArg = thisArg;
        }
        Bind.prototype.apply = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.func.apply(this.thisArg, args);
        };
        Bind.prototype.equals = function (obj) {
            return this.func == obj.func && this.thisArg == obj.thisArg;
        };
        return Bind;
    })();
    std.Bind = Bind;
})(std || (std = {}));
/// <reference path="IEventDispatcher.ts" />
/// <reference path="../../std/Bind.ts" />
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
         * @author Migrated by Jeongho Nam
         */
        var EventDispatcher = (function () {
            function EventDispatcher(target) {
                if (target === void 0) { target = null; }
                if (target == null)
                    this.target = this;
                else
                    this.target = target;
                this.listeners = new std.UnorderedMap();
            }
            /**
             * @inheritdoc
             */
            EventDispatcher.prototype.hasEventListener = function (type) {
                return this.listeners.has(type);
            };
            /**
             * @inheritdoc
             */
            EventDispatcher.prototype.dispatchEvent = function (event) {
                event.target = this.target;
                if (this.listeners.has(event.type) == false)
                    return false;
                var listenerSet = this.listeners.get(event.type);
                for (var it = listenerSet.begin(); it.equals(listenerSet.end()) == false; it = it.next())
                    it.value.apply();
                return true;
            };
            /**
             * @inheritdoc
             */
            EventDispatcher.prototype.addEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                var listenerSet;
                if (this.listeners.has(type) == false) {
                    listenerSet = new std.UnorderedSet();
                    this.listeners.set(type, listenerSet);
                }
                else
                    listenerSet = this.listeners.get(type);
                listenerSet.insert(new std.Bind(listener, thisArg));
            };
            /**
             * @inheritdoc
             */
            EventDispatcher.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                if (this.listeners.has(type) == false)
                    return;
                var listenerSet = this.listeners.get(type);
                var bind = new std.Bind(listener, thisArg);
                if (listenerSet.has(bind) == false)
                    return;
                listenerSet.erase(bind);
                if (listenerSet.empty() == true)
                    this.listeners.erase(type);
            };
            return EventDispatcher;
        })();
        library.EventDispatcher = EventDispatcher;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="CaseGenerator.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
        /**
         * <p> A permutation case generator. </p>
         * <p> nPr </p>
         *
         * @author Jeongho Nam
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
        })(library.CaseGenerator);
        library.PermuationGenerator = PermuationGenerator;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="PermutationGenerator.ts" />
var samchon;
(function (samchon) {
    var library;
    (function (library) {
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
        })(library.PermuationGenerator);
        library.FactorialGenerator = FactorialGenerator;
    })(library = samchon.library || (samchon.library = {}));
})(samchon || (samchon = {}));
/// <reference path="API.ts" />
/// <reference path="Entity.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        /**
         * A parameter belongs to an Invoke.
         *
         * @see Invoke
         * @author Jeongho Nam
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
            }
            InvokeParameter.prototype.construct = function (xml) {
            };
            /* -------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------- */
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
            InvokeParameter.prototype.TAG = function () {
                return "parameter";
            };
            InvokeParameter.prototype.toXML = function () {
                var xml = _super.prototype.toXML.call(this);
                if (this.name != "")
                    xml.setProperty("name", this.name);
                xml.setProperty("type", this.type);
                // NOT CONSIDERED ABOUT THE BINARY DATA
                xml.setProperty("value", this.value);
                return xml;
            };
            return InvokeParameter;
        })(protocol.Entity);
        protocol.InvokeParameter = InvokeParameter;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="EntityArray.ts" />
///     <reference path="InvokeParameter.ts" />
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
         * @author Jeongho Nam
         */
        var Invoke = (function (_super) {
            __extends(Invoke, _super);
            function Invoke() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                _super.call(this);
            }
            /**
             * @inheritdoc
             */
            Invoke.prototype.construct = function (xml) {
                this.listener = xml.getProperty("listener");
                _super.prototype.construct.call(this, xml);
            };
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
            Invoke.prototype.TAG = function () {
                return "invoke";
            };
            Invoke.prototype.CHILD_TAG = function () {
                return "parameter";
            };
            return Invoke;
        })(protocol.EntityArray);
        protocol.Invoke = Invoke;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="Invoke.ts" />
/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Pair.ts" />
var std;
(function (std) {
    /**
     * <p> A set containing key values. </p>
     * <ul>
     *  <li> _Ty: Type of the elements. Each element in a Set is also uniquely identified by this value.
     *            Aliased as member types unordered_set::key_type and unordered_set::value_type. </li>
     * </ul>
     *
     * <p> Set is designed to pursuing formality in JavaScript. </p>
     * <h4> Definition of std::unordered_set. </h4>
     * <ul>
     *  <li> Reference: http://www.cplusplus.com/reference/unordered_set/unordered_set/ </li>
     * </ul>
     *
     * <p> Unordered sets are containers that store unique elements in no particular order, and which allow
     * for fast retrieval of individual elements based on their value. </p>
     *
     * <p> In an unordered_set, the value of an element is at the same time its key, that identifies it uniquely.
     * Keys are immutable, therefore, the elements in an unordered_set cannot be modified once in the container -
     * they can be inserted and removed, though. </p>
     *
     * <p> Internally, the elements in the unordered_set are not sorted in any particular order, but organized into
     * buckets depending on their hash values to allow for fast access to individual elements directly by their values
     * (with a constant average time complexity on average). </p>
     *
     * <p> unordered_set containers are faster than set containers to access individual elements by their key,
     * although they are generally less efficient for range iteration through a subset of their elements. </p>
     *
     * <p> Iterators in the container are at least forward iterators. </p>
     *
     * @author Jeongho Nam
     */
    var UnorderedSet = (function (_super) {
        __extends(UnorderedSet, _super);
        function UnorderedSet() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.call(this);
            this.data_ = new std.Vector();
            if (args.length == 1 && args[0] instanceof Array) {
                var array = args[0];
                this.data_ = new std.Vector(array);
            }
            else if (args.length == 1 && (args[0] instanceof std.Vector || args[1] instanceof std.Container)) {
                var container = args[0];
                this.assign(container.begin(), container.end());
            }
            else if (args.length == 2 && args[0] instanceof std.Iterator && args[1] instanceof std.Iterator) {
                var begin = args[0];
                var end = args[1];
                this.assign(begin, end);
            }
        }
        UnorderedSet.prototype.assign = function (begin, end) {
            this.data_.assign(begin, end);
        };
        UnorderedSet.prototype.clear = function () {
            this.data_.clear();
        };
        UnorderedSet.prototype.insert = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (args.length == 1) {
                var key = args[0];
                if (this.has(key) == true)
                    return new std.Pair(this.find(key), false);
                else {
                    this.data_.push(key);
                    return new std.Pair(this.end().prev(), true);
                }
            }
            else if (args.length == 2) {
                var position = args[0];
                var key = args[1];
                if (this.has(key) == true)
                    return new std.Pair(this.find(key), false);
                else {
                    var index = position.getIndex();
                    this.data_.insert(this.data_.begin().advance(index), key);
                    return new std.Pair(new UnorderedSetIterator(this, index + 1), true);
                }
            }
            else if (args.length == 3) {
                var position = args[0];
                var begin = args[1];
                var end = args[2];
                var index = position.getIndex();
                var inserted = 0;
                for (var it = begin; it.equals(end) == false; it = it.next()) {
                    if (this.has(it.value) == true)
                        continue;
                    this.data_.pushBack(it.value);
                    inserted++;
                }
                return;
                new std.Pair(new UnorderedSetIterator(this, index + inserted), (inserted != 0));
            }
        };
        ;
        UnorderedSet.prototype.erase = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (args.length == 1 && args[0] instanceof std.Iterator == false) {
                var key = args[0];
                if (this.has(key) == true)
                    this.erase(this.find(key));
                return this.size();
            }
            else if (args.length == 1 && args[0] instanceof std.Iterator) {
                var it = args[0];
                var index = it.getIndex();
                this.data_.splice(index);
                return new UnorderedSetIterator(this, index);
            }
            else if (args.length == 2 && args[0] instanceof std.Iterator && args[1] instanceof std.Iterator) {
                var begin = args[0];
                var end = args[1];
                this.data_.splice(begin.getIndex(), end.getIndex() - begin.getIndex());
                return new UnorderedSetIterator(this, begin.getIndex());
            }
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        UnorderedSet.prototype.begin = function () {
            if (this.empty() == true)
                return this.end();
            else
                return new UnorderedSetIterator(this, 0);
        };
        /**
         * @inheritdoc
         */
        UnorderedSet.prototype.end = function () {
            return new UnorderedSetIterator(this, -1);
        };
        UnorderedSet.prototype.find = function (key) {
            var i;
            if (key.hasOwnProperty("equals") == true) {
                for (i = 0; i < this.data_.size(); i++)
                    if (this.data_.at(i)["equals"](key) == true)
                        return new UnorderedSetIterator(this, i);
            }
            else {
                for (i = 0; i < this.data_.size(); i++)
                    if (this.data_.at(i) == key)
                        return new UnorderedSetIterator(this, i);
            }
            return this.end();
        };
        /**
         * <p> Get data. </p>
         * <p> Returns the source container of the Set. </p>
         *
         * <h4> Note </h4>
         * <p> Changes on the returned container influences the source Set. </p>
         */
        UnorderedSet.prototype.data = function () {
            return this.data_;
        };
        /**
         * <p> Return container size. </p>
         * <p> Returns the number of elements in Set container. </p>
         *
         * @return The number of elements in the container.
         */
        UnorderedSet.prototype.size = function () {
            return this.data_.size();
        };
        /**
         * <p> Whether have the item or not. </p>
         * <p> Indicates whether a map has an item having the specified identifier. </p>
         *
         * @param key Key value of the element whose mapped value is accessed.
         * @return Whether the map has an item having the specified identifier
         */
        UnorderedSet.prototype.has = function (key) {
            return !this.find(key).equals(this.end());
        };
        /* ---------------------------------------------------------
            COMPARE
        --------------------------------------------------------- */
        /**
         * <p> Whether a Set is equal with the Set. </p>
         *
         * @param obj A Set to compare
         * @return Indicates whether equal or not.
         */
        UnorderedSet.prototype.equals = function (obj) {
            if (this.size() != obj.size())
                return false;
            for (var i = 0; i < this.data_.size(); i++)
                if (this.data_.at(i) != obj.data_.at(i))
                    return false;
            return true;
        };
        return UnorderedSet;
    })(std.Container);
    std.UnorderedSet = UnorderedSet;
    /**
     * <p> An iterator of a Set. </p>
     * <ul>
     *  <li> _Ty: Type of the elements. Each element in a Set is also uniquely identified by this value.
     *            Aliased as member types unordered_set::key_type and unordered_set::value_type. </li>
     * </ul>
     *
     * @author Jeongho Nam
     */
    var UnorderedSetIterator = (function (_super) {
        __extends(UnorderedSetIterator, _super);
        /**
         * <p> Construct from source and index number. </p>
         *
         * <h4> Note </h4>
         * <p> Do not create iterator directly. </p>
         * <p> Use begin(), find() or end() in Map instead. </p>
         *
         * @param map The source Set to reference.
         * @param index Sequence number of the element in the source Set.
         */
        function UnorderedSetIterator(source, index) {
            _super.call(this, source);
            this.index = index;
        }
        Object.defineProperty(UnorderedSetIterator.prototype, "value", {
            /**
             * <p> Get key value of the iterator is pointing. </p>
             *
             * @return A key value of the iterator.
             */
            get: function () {
                return this.set.data().at(this.index);
            },
            set: function (key) {
                this.set.data().set(this.index, key);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnorderedSetIterator.prototype, "set", {
            /* ---------------------------------------------------------
                GETTERS
            --------------------------------------------------------- */
            get: function () {
                return this.source;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p> Whether an iterator is equal with the iterator. </p>
         * <p> Compare two iterators and returns whether they are equal or not. </p>
         *
         * <h4> Note </h4>
         * <p> Iterator's equals() only compare souce map and index number. </p>
         * <p> Although elements, key values are equals, if the source set or
         * index number is different, then the equals() will return false. If you want to
         * compare the key values, compare them directly by yourself. </p>
         *
         * @param obj An iterator to compare
         * @return Indicates whether equal or not.
         */
        UnorderedSetIterator.prototype.equals = function (obj) {
            return _super.prototype.equals.call(this, obj) && this.index == obj.index;
        };
        UnorderedSetIterator.prototype.getIndex = function () {
            return this.index;
        };
        /* ---------------------------------------------------------
            MOVERS
        --------------------------------------------------------- */
        /**
         * <p> Get iterator to previous element. </p>
         * <p> If current iterator is the first item(equal with <i>begin()</i>), returns end(). </p>
         *
         * @return An iterator of the previous item.
         */
        UnorderedSetIterator.prototype.prev = function () {
            if (this.index == 0)
                return this.set.end();
            else
                return new UnorderedSetIterator(this.set, this.index - 1);
        };
        /**
         * <p> Get iterator to next element. </p>
         * <p> If current iterator is the last item, returns end(). </p>
         *
         * @return An iterator of the next item.
         */
        UnorderedSetIterator.prototype.next = function () {
            if (this.index >= this.set.data().size() - 1)
                return this.set.end();
            else
                return new UnorderedSetIterator(this.set, this.index + 1);
        };
        return UnorderedSetIterator;
    })(std.Iterator);
    std.UnorderedSetIterator = UnorderedSetIterator;
})(std || (std = {}));
/// <reference path="IProtocol.ts" />
/// <reference path="Invoke.ts" />
/// <reference path="../library/StringUtil.ts" />
/// <reference path="../../std/Pair.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
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
         * @author Jeongho Nam
         */
        var ServerConnector = (function () {
            /**
             * <p> Constructor with parent. </p>
             */
            function ServerConnector(parent) {
                this.parent = parent;
                this.str = "";
            }
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
            ServerConnector.prototype.connect = function (ip, port) {
                if (ip.indexOf("ws://") == -1) {
                    if (ip.indexOf("://") != -1)
                        throw "only websocket is possible";
                    else
                        ip = "ws://" + ip;
                }
                this.socket = new WebSocket(ip + ":" + port);
                this.socket.onopen = this.handleConnect;
                this.socket.onmessage = this.handleReply;
            };
            /* ----------------------------------------------------
                IPROTOCOL'S METHOD
            ---------------------------------------------------- */
            /**
             * <p> Send data to the server. </p>
             */
            ServerConnector.prototype.sendData = function (invoke) {
                var xml = invoke.toXML();
                var str = xml.toString();
                this.socket.send(str);
            };
            /**
             * <p> Shift responsiblity of handling message to parent. </p>
             */
            ServerConnector.prototype.replyData = function (invoke) {
                this.parent.replyData(invoke);
            };
            /* ----------------------------------------------------
                HANDLING CONNECTION AND MESSAGES
            ---------------------------------------------------- */
            ServerConnector.prototype.handleConnect = function (event) {
                if (this.onopen == null)
                    return;
                this.onopen.apply([event]);
            };
            /**
             * <p> Handling replied message. </p>
             */
            ServerConnector.prototype.handleReply = function (event) {
                this.str += event.data;
                var invokeArray;
                var indexPair = null;
                var sizePair = new std.Pair(0, 0);
                var startIndex = 0;
                var endIndex = 0;
                while (true) {
                    var iPair = new std.Pair(this.str.indexOf("<invoke", startIndex), this.str.indexOf("</invoke>", startIndex)); //FIND WORDS
                    if (iPair.first != -1)
                        sizePair.first++;
                    if (iPair.second != -1)
                        sizePair.second++; //AND COUNTS
                    if (indexPair == null && sizePair.first == 1)
                        indexPair = new std.Pair(iPair.first, -1); //SPECIFY THE STARTING INDEX
                    //FAILED TO FIND ANYTHING
                    if (iPair.first == -1 || iPair.second == -1)
                        break;
                    /* FOUND SOMETHING FROM NOW ON */
                    //AN INVOKE HAS FOUND
                    if (indexPair != null && sizePair.first == sizePair.second) {
                        var start = indexPair.first;
                        var end = indexPair.second + ("</invoke>").length;
                        var xml = new samchon.library.XML(this.str.substring(start, end));
                        var invoke = new protocol.Invoke(xml);
                        invokeArray.push(invoke);
                        //CLEAR CURRENT'S INDEX PAIR
                        endIndex = end;
                        indexPair = null;
                    }
                    //ADJUST INDEX
                    startIndex = Math.max(Math.max(iPair.first, iPair.second), 1);
                }
                //ERASE USED CHARACTERS
                if (endIndex != 0)
                    this.str = this.str.substr(endIndex);
                //CALL REPLY_DATA
                for (var i = 0; i < invokeArray.length; i++)
                    this.replyData(invokeArray[i]);
            };
            return ServerConnector;
        })();
        protocol.ServerConnector = ServerConnector;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="EntityArray.ts" />
///     <reference path="ExternalSystemRole.ts" />
/// <reference path="IProtocol.ts" />
/// <reference path="ServerConnector.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
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
         * @author Jeongho Nam
         */
        var ExternalSystem = (function (_super) {
            __extends(ExternalSystem, _super);
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            /**
             * <p> Default Constructor. </p>
             */
            function ExternalSystem() {
                _super.call(this);
                this.driver = null;
            }
            /**
             * <p> Start interaction. </p>
             * <p> An abstract method starting interaction with an external system. </p>
             *
             * <p> If an external systems are a server, starts connection and listening Inovoke message,
             * else clients, just starts listening only. You also can addict your own procudures of starting
             * the driver, but if you directly override method of abstract ExternalSystem, be careful about
             * virtual inheritance. </p>
             */
            ExternalSystem.prototype.start = function () {
                if (this.driver != null)
                    return;
                this.driver = new protocol.ServerConnector(this);
                this.driver.connect(this.ip, this.port);
            };
            /* ------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------ */
            ExternalSystem.prototype.key = function () {
                return this.name;
            };
            /**
             * <p> Get name. </p>
             */
            ExternalSystem.prototype.getName = function () {
                return this.name;
            };
            /**
             * <p> Get ip address of the external system. </p>
             */
            ExternalSystem.prototype.getIP = function () {
                return this.ip;
            };
            /**
             * <p> Get port number of the external system. </p>
             */
            ExternalSystem.prototype.getPort = function () {
                return this.port;
            };
            /* ------------------------------------------------------------------
                CHAIN OF INVOKE MESSAGE
            ------------------------------------------------------------------ */
            ExternalSystem.prototype.sendData = function (invoke) {
                this.driver.sendData(invoke);
            };
            ExternalSystem.prototype.replyData = function (invoke) {
                invoke.apply(this);
                for (var i = 0; i < this.size(); i++)
                    this[i].replyData(invoke);
            };
            /* ------------------------------------------------------------------
               EXPORTERS
           ------------------------------------------------------------------ */
            ExternalSystem.prototype.TAG = function () {
                return "system";
            };
            ExternalSystem.prototype.CHILD_TAG = function () {
                return "role";
            };
            return ExternalSystem;
        })(protocol.EntityArray);
        protocol.ExternalSystem = ExternalSystem;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="IProtocol.ts" />
/// <reference path="ExternalSystem.ts" />
/// <reference path="../../std/UnorderedSet.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
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
         * @author Jeongho Nam
         */
        var ExternalSystemRole = (function (_super) {
            __extends(ExternalSystemRole, _super);
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            /**
             * <p> Construct from external system driver. </p>
             *
             * @param system A driver of external system the ExternalSystemRole is belonged to.
             */
            function ExternalSystemRole(system) {
                _super.call(this);
                this.system = system;
                this.sendListeners = new std.UnorderedSet();
            }
            ExternalSystemRole.prototype.construct = function (xml) {
                _super.prototype.construct.call(this, xml);
            };
            /* ------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------ */
            ExternalSystemRole.prototype.getName = function () {
                return this.name;
            };
            ExternalSystemRole.prototype.hasSendListener = function (key) {
                return this.sendListeners.has(key);
            };
            /* ------------------------------------------------------------------
                CHAIN OF INVOKE MESSAGE
            ------------------------------------------------------------------ */
            ExternalSystemRole.prototype.sendData = function (invoke) {
                this.system.sendData(invoke);
            };
            ExternalSystemRole.prototype.replyData = function (invoke) {
                invoke.apply(this);
            };
            /* ------------------------------------------------------------------
                EXPORTERS
            ------------------------------------------------------------------ */
            ExternalSystemRole.prototype.TAG = function () {
                return "role";
            };
            ExternalSystemRole.prototype.toXML = function () {
                var xml = _super.prototype.toXML.call(this);
                return xml;
            };
            return ExternalSystemRole;
        })(protocol.Entity);
        protocol.ExternalSystemRole = ExternalSystemRole;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="EntityArray.ts" />
///     <reference path="ExternalSystem.ts" />
/// <reference path="IProtocol.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
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
         * @author Jeongho Nam
         */
        var ExternalSystemArray = (function (_super) {
            __extends(ExternalSystemArray, _super);
            /* ------------------------------------------------------------------
                CONSTRUCTORS
            ------------------------------------------------------------------ */
            /**
             * Default Constructor.
             */
            function ExternalSystemArray() {
                _super.call(this);
            }
            /**
             * <p> Start interaction. </p>
             * <p> An abstract method starting interaction with external systems. </p>
             *
             * <p> If external systems are servers, starts connection to them, else clients, opens a server
             * and accepts the external systems. You can addict your own procudures of starting drivers, but
             * if you directly override method of abstract ExternalSystemArray, be careful about virtual
             * inheritance. </p>
             */
            ExternalSystemArray.prototype.start = function () {
                for (var i = 0; i < this.size(); i++)
                    this.at(i).start();
            };
            /* ------------------------------------------------------------------
                GETTERS
            ------------------------------------------------------------------ */
            /**
             * <p> Test whether has a role. </p>
             *
             * @param name Name of an ExternalSystemRole.
             * @return Whether has or not.
             */
            ExternalSystemArray.prototype.hasRole = function (key) {
                for (var i = 0; i < this.size(); i++)
                    if (this.at(i).has(key) == true)
                        return true;
                return false;
            };
            /**
             * <p> Get a role. </p>
             *
             * @param name Name of an ExternalSystemRole
             * @return A shared pointer of specialized role
             */
            ExternalSystemArray.prototype.getRole = function (key) {
                for (var i = 0; i < this.size(); i++)
                    if (this.at(i).has(key) == true)
                        return this.at(i).get(key);
                throw Error("out of range");
            };
            /* ------------------------------------------------------------------
                CHAIN OF INVOKE MESSAGE
            ------------------------------------------------------------------ */
            ExternalSystemArray.prototype.sendData = function (invoke) {
                var listener = invoke.getListener();
                for (var i = 0; i < this.size(); i++)
                    for (var j = 0; j < this.at(i).size(); j++)
                        if (this.at(i).at(j).hasSendListener(listener) == true)
                            this.at(i).sendData(invoke);
            };
            ExternalSystemArray.prototype.replyData = function (invoke) {
                invoke.apply(this);
            };
            /* ------------------------------------------------------------------
                EXPORTERS
            ------------------------------------------------------------------ */
            ExternalSystemArray.prototype.TAG = function () {
                return "systemArray";
            };
            ExternalSystemArray.prototype.CHILD_TAG = function () {
                return "system";
            };
            return ExternalSystemArray;
        })(protocol.EntityArray);
        protocol.ExternalSystemArray = ExternalSystemArray;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../API.ts" />
/// <reference path="Entity.ts" />
/// <referecen path="Invoke.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
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
         * @author Jeongho Nam
         */
        var InvokeHistory = (function (_super) {
            __extends(InvokeHistory, _super);
            /* -----------------------------------------------------------------
                CONSTRUCTORS
            ----------------------------------------------------------------- */
            /**
             * <p> Construct from an Invoke message. </p>
             *
             * <p> InvokeHistory does not archive entire Invoke message, only archives its listener. </p>
             *
             * @param invoke A message to archive its history log
             */
            function InvokeHistory(invoke) {
                _super.call(this);
                this.uid = invoke.get("invoke_history_uid").getValue();
                this.listener = invoke.getListener();
                this.startTime = new Date();
                //DELETE UID IN INVOKE
                //invoke.erase("invoke_history_uid");
            }
            /**
             * <p> Notify end of the process. </p>
             *
             * <p> Notifies end of a process handling the matched Invoke message to InvokeHistory. </p>
             * <p> InvokeHistory archives the end datetime and calculates elapsed time as nanoseconds. </p>
             */
            InvokeHistory.prototype.notifyEnd = function () {
                this.endTime = new Date();
            };
            /* -----------------------------------------------------------------
                EXPORTERS
            ----------------------------------------------------------------- */
            InvokeHistory.prototype.TAG = function () {
                return "invokeHistory";
            };
            InvokeHistory.prototype.toXML = function () {
                var xml = _super.prototype.toXML.call(this);
                /*xml.setProperty("uid", this.uid);
                xml.setProperty("listener", this.listener);*/
                xml.setProperty("startTime", this.startTime.getTime() * Math.pow(10.0, 6));
                xml.setProperty("endTime", this.endTime.getTime() * Math.pow(10.0, 6));
                return xml;
            };
            /**
             * <p> Get an Invoke message. </p>
             *
             * <p> Returns an Invoke message to report to a master that how much time was elapsed on a
             * process handling the Invoke message. In master, those reports are used to estimate
             * performance of each slave system. </p>
             *
             * @return An Invoke message to report master.
             */
            InvokeHistory.prototype.toInvoke = function () {
                return null;
                //return new Invoke("reportInvokeHistory", this.toXML());
            };
            return InvokeHistory;
        })(protocol.Entity);
        protocol.InvokeHistory = InvokeHistory;
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../IProtocol.ts" />
/// <reference path="Movie.ts" />
/// <reference path="../ServerConnector.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var service;
        (function (service) {
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
             * @author Jeongho Nam
             */
            var Application = (function () {
                /**
                 * <p> Construct from arguments. </p>
                 *
                 * @param movie A movie represents a service.
                 * @param ip An ip address of cloud server to connect.
                 * @param port A port number of cloud server to connect.
                 */
                function Application(movie, ip, port) {
                    this.movie = movie;
                    this.socket = new protocol.ServerConnector(this);
                    this.socket.onopen = this.handleConnect;
                    this.socket.connect(ip, port);
                }
                Application.prototype.handleConnect = function (event) {
                };
                /**
                 * <p> Handle replied message or shift the responsibility. </p>
                 */
                Application.prototype.replyData = function (invoke) {
                    if (invoke.apply(this) == false)
                        this.movie.sendData(invoke);
                };
                /**
                 * <p> Send a data to server. </p>
                 */
                Application.prototype.sendData = function (invoke) {
                    this.socket.sendData(invoke);
                };
                return Application;
            })();
            service.Application = Application;
        })(service = protocol.service || (protocol.service = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../IProtocol.ts" />
/// <reference path="Application.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var service;
        (function (service) {
            /**
             * A movie belonged to an Application.
             */
            var Movie = (function () {
                function Movie() {
                }
                /**
                 * Handle replied data.
                 */
                Movie.prototype.replyData = function (invoke) {
                    invoke.apply(this) == false;
                };
                /**
                 * Send data to server.
                 */
                Movie.prototype.sendData = function (invoke) {
                    this.application.sendData(invoke);
                };
                return Movie;
            })();
            service.Movie = Movie;
        })(service = protocol.service || (protocol.service = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../IProtocol.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var service;
        (function (service) {
            /**
             * A sub-movie.
             *
             * @author Jeongho Nam
             */
            var SubMovie = (function () {
                function SubMovie() {
                }
                SubMovie.prototype.replyData = function (invoke) {
                    invoke.apply(this);
                };
                SubMovie.prototype.sendData = function (invoke) {
                    this.parent.sendData(invoke);
                };
                return SubMovie;
            })();
        })(service = protocol.service || (protocol.service = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <reference path="../../API.ts" />
/// <reference path="../ExternalSystem.ts" />
/// <reference path="../InvokeHistory.ts" />
var samchon;
(function (samchon) {
    var protocol;
    (function (protocol) {
        var slave;
        (function (slave) {
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
             * @author Jeongho Nam
             */
            var SlaveSystem = (function (_super) {
                __extends(SlaveSystem, _super);
                /**
                 * <p> Default Constructor. </p>
                 */
                function SlaveSystem() {
                    _super.call(this);
                }
                /**
                 * @inheritdoc
                 */
                SlaveSystem.prototype.replyData = function (invoke) {
                    var history = new protocol.InvokeHistory(invoke);
                    _super.prototype.replyData.call(this, invoke);
                    history.notifyEnd();
                    this.sendData(history.toInvoke());
                };
                return SlaveSystem;
            })(protocol.ExternalSystem);
            slave.SlaveSystem = SlaveSystem;
        })(slave = protocol.slave || (protocol.slave = {}));
    })(protocol = samchon.protocol || (samchon.protocol = {}));
})(samchon || (samchon = {}));
/// <referecen path="samchon/API.ts" />
/// <referecen path="samchon/std.ts" />
/// <referecen path="samchon/library.ts" />
/// <referecen path="samchon/protocol.ts" /> 
/// <reference path="IMap.ts" />
/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />
/// <refence path="TreeNode.ts" />
var std;
(function (std) {
    var Map = (function (_super) {
        __extends(Map, _super);
        function Map() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.call(this);
            this.data_ = null;
            this.size_ = 0;
        }
        return Map;
    })(std.PairContainer);
    std.Map = Map;
})(std || (std = {}));
/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />
/// <refence path="TreeNode.ts" />
var std;
(function (std) {
    var Set = (function (_super) {
        __extends(Set, _super);
        function Set() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.call(this);
            this.data_ = null;
            //this.size_ = 0;
        }
        Set.prototype.assign = function (begin, end) {
        };
        Set.prototype.clear = function () {
            this.data_ = null;
            //this.size_ = 0;
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        Set.prototype.begin = function () {
            if (this.data_ == null)
                return this.end();
            var node = this.data_;
            // MOVE LEFT LEFT LEFT AND LEFT OF CHILDREN.
            while (node.getLeftChild() != null)
                node = node.getLeftChild();
            return new SetIterator(this, node);
        };
        Set.prototype.end = function () {
            return new SetIterator(this, null);
        };
        Set.prototype.data = function () {
            return this.data_;
        };
        Set.prototype.size = function () {
            if (this.data_ == null)
                return 0;
            else
                return this.data_.size();
        };
        Set.prototype.insert = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
        };
        Set.prototype.erase = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
        };
        return Set;
    })(std.Container);
    std.Set = Set;
    var SetIterator = (function (_super) {
        __extends(SetIterator, _super);
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        function SetIterator(source, node) {
            _super.call(this, source);
            this.node = node;
        }
        Object.defineProperty(SetIterator.prototype, "set", {
            get: function () { return this.source; },
            enumerable: true,
            configurable: true
        });
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        SetIterator.prototype.equals = function (obj) {
            return _super.prototype.equals.call(this, obj) && this.node == obj.node;
        };
        Object.defineProperty(SetIterator.prototype, "value", {
            get: function () {
                return this.node.getValue();
            },
            set: function (val) {
                this.node.setValue(val);
            },
            enumerable: true,
            configurable: true
        });
        /* ---------------------------------------------------------
            MOVERS
        --------------------------------------------------------- */
        SetIterator.prototype.prev = function () {
            if (this.node == null)
                return new SetIterator(this.set, this.set.data().back());
            else
                return new SetIterator(this.set, this.node.prev());
        };
        SetIterator.prototype.next = function () {
            if (this.node == null)
                return new SetIterator(this.set, this.set.data().front());
            return new SetIterator(this.set, this.node.next());
        };
        return SetIterator;
    })(std.Iterator);
    std.SetIterator = SetIterator;
})(std || (std = {}));
var std;
(function (std) {
    var TreeNode = (function () {
        /* -------------------------------------------------------------------
            CONSTRUCTORS
        ------------------------------------------------------------------- */
        function TreeNode(parent, value) {
            this.parent = parent;
            this.value = value;
        }
        /* -------------------------------------------------------------------
            ACCESSORS
        ------------------------------------------------------------------- */
        TreeNode.prototype.getParent = function () {
            return this.parent;
        };
        TreeNode.prototype.getLeftChild = function () {
            return this.leftChild;
        };
        TreeNode.prototype.getRightChild = function () {
            return this.rightChild;
        };
        TreeNode.prototype.getValue = function () {
            return this.value;
        };
        TreeNode.prototype.size = function () {
            var size = 1;
            if (this.leftChild != null)
                size += this.leftChild.size();
            if (this.rightChild != null)
                size += this.rightChild.size();
            return size;
        };
        /* -------------------------------------------------------------------
            LINKERS
        ------------------------------------------------------------------- */
        TreeNode.prototype.prev = function () {
            var node = null;
            if (this.leftChild != null)
                node = this.leftChild;
            else if (this.parent != null && this.parent.leftChild != this)
                node = this.parent.leftChild;
            // GO TO RIGHT, RIGHT, RIGHT AND RIGHT SIDE OF CHILDREN
            if (node != null)
                while (node.rightChild != null)
                    node = node.rightChild;
            return node;
        };
        TreeNode.prototype.next = function () {
            var node = null;
            if (this.rightChild != null)
                node = this.rightChild;
            else if (this.parent != null && this.parent.rightChild != this)
                node = this.parent.rightChild;
            // GO TO LEFT, LEFT, LEFT AND LEFT SIDE OF CHILDREN
            if (node != null)
                while (node.leftChild != null)
                    node = node.leftChild;
            return node;
        };
        TreeNode.prototype.front = function () {
            var node = this;
            // TO THE TOP
            while (node.parent != null)
                node = node.parent;
            // TO LEFT
            while (node.leftChild != null)
                node = node.leftChild;
            return node;
        };
        TreeNode.prototype.back = function () {
            var node = this;
            // TO THE TOP
            while (node.parent != null)
                node = node.parent;
            // TO RIGHT
            while (node.rightChild != null)
                node = node.rightChild;
            return node;
        };
        /* -------------------------------------------------------------------
            SETTERS
        ------------------------------------------------------------------- */
        TreeNode.prototype.setLeft = function (node) {
            this.leftChild = node;
        };
        TreeNode.prototype.setRight = function (node) {
            this.rightChild = node;
        };
        TreeNode.prototype.setValue = function (value) {
            this.value = value;
        };
        return TreeNode;
    })();
    std.TreeNode = TreeNode;
})(std || (std = {}));
//# sourceMappingURL=SamchonFramework.js.map