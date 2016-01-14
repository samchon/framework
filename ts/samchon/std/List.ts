/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />

namespace samchon.std
{
    export class List<T>
        extends Container<T>
    {
        protected begin_: ListIterator<T>;

        protected end_: ListIterator<T>;

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
        public constructor(...args: T[]);

        public constructor(size: number);

        public constructor(size: number, val: T);

        /**
         * Copy Constructor. 
         *
         * @param container
         */
        public constructor(container: Container<T>);

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

            this.clear();
        }

        public assign(begin: Iterator<T>, end: Iterator<T>): void
        {
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
		    ELEMENTS I/O
	    --------------------------------------------------------- */
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
            var item: ListIterator<T> = new ListIterator<T>(this, <ListIterator<T>>this.end_.prev(), this.end_, val);
            this.end_.setPrev(item);

            if (this.size_ == 0)
            {
                this.begin_ = item;
                item.setPrev(this.end_);
            }

            this.size_++;
        }

        public insert(myEnd: Iterator<T>, begin: Iterator<T>, end: Iterator<T> = null): Iterator<T>
        {
            // TODO

            return null;
        }

        public erase(begin: Iterator<T>, end: Iterator<T> = null): Iterator<T>
        {
            // TODO

            var prev: ListIterator<T> = <ListIterator<T>>begin.prev();
            var next: ListIterator<T>  = (end == null) 
                    ? <ListIterator<T>>begin.next() 
                    : <ListIterator<T>>end.next();

            prev.setNext(next);
            next.setPrev(prev);

            // CALCULATE THE SIZE
            var size: number = 0;

            if (end == null)
                for (var it = begin; it.equals(end) == false; it = it.next())
                    size++;
            else
                size = 1;

            this.size_ -= size;
            
            return prev;
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        public begin(): Iterator<T>
        {
            return this.begin_;
        }

        public end(): Iterator<T>
        {
            return this.end_;
        }

        public size(): number
        {
            return this.size_;
        }
    }
    
    export class ListIterator<_Ty>
        extends Iterator<_Ty>
    {
        protected value_: _Ty;

        protected prev_: ListIterator<_Ty>;
        protected next_: ListIterator<_Ty>;

        /**
         * <p> Construct from source List. </p>
         *
         * <h4> Note </h4>
         * <p> Do not create iterator directly. </p>
         * <p> Use begin(), find() or end() in List instead. </p> 
         *
         * @param list The source vector to reference.
         */
        public constructor(source: List<_Ty>, prev: ListIterator<_Ty>, next: ListIterator<_Ty>, value: _Ty)
        {
            super(source);
            
            this.prev_ = prev;
            this.next_ = next;

            this.value_ = value;
        }

        public setPrev(prev: ListIterator<_Ty>): void
        {
            this.prev_ = prev;
        }
        public setNext(next: ListIterator<_Ty>): void
        {
            this.next_ = next;
        }

        public prev(): Iterator<_Ty>
        {
            return this.prev_;
        }
        public next(): Iterator<_Ty>
        {
            return this.next_;
        }

        public equals(obj: Iterator<_Ty>): boolean
        {
            if (obj instanceof ListIterator == false)
                return false;

            var it: ListIterator<_Ty> = <ListIterator<_Ty>>obj;

            return super.equals(obj) == true && this.prev_ == it.prev_ && this.next_ == it.next_;
        }
    }
}