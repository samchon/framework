/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />

namespace std
{
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
    export class List<T>
        extends Container<T>
    {
        /**
         * An iterator of beginning.
         */
        protected begin_: ListIterator<T>;

        /**
         * An iterator of end. 
         */
        protected end_: ListIterator<T>;

        /**
         * Number of elements in the List.
         */
        protected size_: number;

        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        /**
         * Default Constructor
         */
        public constructor();

        /**
         * Construct from arguments. 
         *
         * @param args
         */
        public constructor(items: Array<T>);
        
        public constructor(size: number, val: T);

        /**
         * Copy Constructor. 
         *
         * @param container
         */
        public constructor(container: IContainer<T>);

        /**
         * Construct from begin and end iterators. 
         *
         * @param begin
         * @param end
         */
        public constructor(begin: Iterator<T>, end: Iterator<T>);

        public constructor(...args: any[])
        {
            super();

            if (args.length == 0)
            {
                this.clear();
            }
            else if (args.length == 1 && args[0] instanceof Array)
            {
                var array: Array<T> = args[0];

                this.clear();
                this.push(...array);
            }
            else if (args.length == 1 && (args[0] instanceof Vector || args[0] instanceof Container))
            {
                var container: IContainer<T> = args[0];

                this.assign(container.begin(), container.end());
            }
            else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
            {
                var begin: Iterator<T> = args[0];
                var end: Iterator<T> = args[1];

                this.assign(begin, end);
            }
            else if (args.length == 2 && typeof args[0] == "number")
            {
                var size: number = args[0];
                var val: T = <T>args[1];

                this.assign(size, val);
            }
        }

        public assign(size: number, val: T): void;

        /**
         * @inheritdoc
         */
        public assign(begin: Iterator<T>, end: Iterator<T>): void;

        public assign(par1: number | Iterator<T>, par2: T | Iterator<T>): void
        {
            if (par1 instanceof Iterator && par2 instanceof Iterator)
            {
                // PARAMETERS
                var begin: Iterator<T> = par1;
                var end: Iterator<T> = par2;

                // BODY
                var prev: ListIterator<T> = null;
                var item: ListIterator<T>;
            
                var it = begin;
            
                while (true)
                {
                    // CONSTRUCT ELEMENT ITEM
                    item = new ListIterator<T>
                            (
                                this, 
                                prev, 
                                null, 
                                (it != end ? it.value : null)
                            );

                    // SET PREVIOUS NEXT POINTER
                    if (prev != null)
                        prev.setNext(item);

                    // CONSTRUCT BEGIN AND END
                    if (it == begin)
                        this.begin_ = item;
                    else if (it == end)
                    {
                        this.end_ = item;
                        break;
                    }

                    // ADD COUNTS AND STEP TO THE NEXT
                    this.size_++;
                    it = it.next();
                }
            }
        }

        public clear(): void
        {
            var it = new ListIterator<T>(this, null, null, null);
            it.setPrev(it);
            it.setNext(it);

            this.begin_ = it;
            this.end_ = it;

            this.size_ = 0;
        }
        
        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public begin(): Iterator<T>
        {
            return this.begin_;
        }

        /**
         * @inheritdoc
         */
        public end(): Iterator<T>
        {
            return this.end_;
        }

        /**
         * @inheritdoc
         */
        public size(): number
        {
            return this.size_;
        }
        
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
        public front(): T
        {
            return this.begin_.value;
        }

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
        public back(): T
        {
            return this.end_.prev().value;
        }

        /* ---------------------------------------------------------
		    ELEMENTS I/O
	    --------------------------------------------------------- */
        public push(...args: T[]): number 
        {
            for (var i: number = 0; i < args.length; i++)
                this.pushBack(args[i]);
            
            return this.size();
        }
        
        public pushFront(val: T): void
        {
            var item: ListIterator<T> = new ListIterator<T>(this, null, this.begin_, val);

            // CONFIGURE BEGIN AND NEXT
            this.begin_.setPrev(item);

            if (this.size_ == 0) 
            {
                // IT WAS EMPTY
                this.end_ = new ListIterator<T>(this, item, item, null);
                item.setNext(this.end_);
            }
            else
                this.end_.setNext(item);

            // SET
            this.begin_ = item;
            this.size_++;
        }

        public pushBack(val: T): void
        {
            var prev: ListIterator<T> = <ListIterator<T>>this.end_.prev();
            var item: ListIterator<T> = new ListIterator<T>(this, <ListIterator<T>>this.end_.prev(), this.end_, val);
            
            prev.setNext(item);
            this.end_.setPrev(item);

            if (this.empty() == true)
            {
                this.begin_ = item;
                item.setPrev(this.end_);
            }
            this.size_++;
        }

        /**
         * <p> Delete first element. </p>
         * 
         * <p> Removes first last element in the List container, effectively reducing the container 
         * <code>size</code> by one. </p>
         */
        public popFront(): void
        {
            this.erase(this.begin_);
        }

        /**
         * <p> Delete last element. </p>
         * 
         * <p> Removes the last element in the List container, effectively reducing the container 
         * <code>size</code> by one. </p>
         */
        public popBack(): void
        {
            this.erase(this.end_.prev());
        }
        
        public insert(myEnd: Iterator<T>, it: Iterator<T>): Iterator<T>;
        public insert(myEnd: Iterator<T>, begin: Iterator<T>, end: Iterator<T>): Iterator<T>;

        public insert(myEnd: Iterator<T>, begin: Iterator<T>, end: Iterator<T> = null): Iterator<T>
        {
            if (this != myEnd.getSource())
                throw new InvalidArgument("Parametric Iterator is not this Container's own.");
            else if (end != null && begin.getSource() != end.getSource())
                throw new InvalidArgument("Parameter begin and end are not from same container.");
            
            if (end == null)
                end = begin.next();

            var myPrev: ListIterator<T> = <ListIterator<T>>myEnd;
            var myLast: ListIterator<T> = <ListIterator<T>>myEnd.next();
            var size: number = 0;
            
            for (var it = begin; it.equals(end) == false; it = it.next())
            {
                var myIt = new ListIterator<T>(this, myPrev, null, it.value);
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
        }

        public erase(it: Iterator<T>): Iterator<T>;
        public erase(begin: Iterator<T>, end: Iterator<T>): Iterator<T>;

        public erase(begin: Iterator<T>, end: Iterator<T> = null): Iterator<T>
        {
            if (this != begin.getSource() || begin.getSource() != end.getSource())
                throw new InvalidArgument("Parametric Iterator is not this Container's own.");

            var prev: ListIterator<T> = <ListIterator<T>>begin.prev();
            var next: ListIterator<T>  = (end == null) 
                    ? <ListIterator<T>>begin.next()
                    : <ListIterator<T>>end.next();

            prev.setNext(next);
            next.setPrev(prev);

            // CALCULATE THE SIZE
            var size: number = 0;

            if (end != null)
            {
                for (var it = begin; it.equals(end) == false; it = it.next())
                    size++;
            }
            else
                size = 1;

            this.size_ -= size;
            
            return prev;
        }
    }
    
    export class ListIterator<T>
        extends Iterator<T>
    {
        protected value_: T;

        protected prev_: ListIterator<T>;
        protected next_: ListIterator<T>;

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
        public constructor(source: List<T>, prev: ListIterator<T>, next: ListIterator<T>, value: T)
        {
            super(source);
            
            this.prev_ = prev;
            this.next_ = next;

            this.value_ = value;
        }

        public setPrev(prev: ListIterator<T>): void
        {
            this.prev_ = prev;
        }
        public setNext(next: ListIterator<T>): void
        {
            this.next_ = next;
        }

        /* ---------------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------------- */
        public equals(obj: Iterator<T>): boolean
        {
            if (obj instanceof ListIterator == false)
                return false;

            var it: ListIterator<T> = <ListIterator<T>>obj;

            return super.equals(obj) == true && this.prev_ == it.prev_ && this.next_ == it.next_;
        }
        
        public prev(): Iterator<T>
        {
            return this.prev_;
        }
        public next(): Iterator<T>
        {
            return this.next_;
        }

        public get value(): T
        {
            return this.value_;
        }
        public set value(val: T)
        {
            this.value_ = val;
        }
    }
}