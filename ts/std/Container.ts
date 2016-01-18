/// <reference path="Iterator.ts" />

/// <reference path="Exception.ts" />

namespace std
{
    export interface IContainer<T>
    {
        /* ---------------------------------------------------------------
            SEMI-CONSTRUCTORS
        --------------------------------------------------------------- */
        assign(begin: Iterator<T>, end: Iterator<T>): void;

        clear(): void;

        /* ---------------------------------------------------------------
            ELEMENTS I/O
        --------------------------------------------------------------- */
        push<U extends T>(...items: U[]): number;

        erase(position: Iterator<T>): Iterator<T>;

        erase<U extends T>(begin: Iterator<U>, end: Iterator<U>): Iterator<T>;

        /* ---------------------------------------------------------------
            GETTERS
        --------------------------------------------------------------- */
        begin(): Iterator<T>;

        end(): Iterator<T>;

        size(): number;

        empty(): boolean;
    }

    /**
     * An abstract class containing elements.
     *
     * @author Jeongho Nam
     */
    export class Container<T>
        implements IContainer<T>
    {
        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        /**
         * Default Constructor
         */
        public constructor();

        /**
         * <p> Copy Constructor. </p>
         *
         * <p> Constructs a container with a copy of each of the elements in <code>container</code>, 
         * in the same order. </p>
         *
         * @param container Another Container object of the same type (with the same class template 
         *                  arguments T), whose contents are either copied or acquired.
         */
        public constructor(container: IContainer<T>);

        /**
         * <p> Construct from iterators of begin and end. </p>
         *
         * <p> Constructs a Container with as many elements as the range (begin, end), with each element 
         * emplace-constructed from its corresponding element in that range, in the same order. </p>
         *
         * @param begin Input interator of the initial position in a sequence.
         * @param end Input interator of the final position in a sequence.
         */
        public constructor(begin: Iterator<T>, end: Iterator<T>);
        
        public constructor(...args: any[])
        {
            if (args.length == 1 && (args[0] instanceof Vector || args[0] instanceof Container))
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
        public assign<U extends T>(begin: Iterator<U>, end: Iterator<U>): void
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /**
	     * <p> Clear content. </p>
         *
	     * <p> Removes all elements from the Container, leaving the container with a size of 0. </p>
	     */
        public clear(): void
        {
            this.erase(this.begin(), this.end());
        }

        /* ---------------------------------------------------------------
            ELEMENTS I/O
        --------------------------------------------------------------- */
        public push<U extends T>(...items: U[]): number
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
        
        /**
         * <p> Erase an element. </p>
         * <p> Remoes from the Container either as a single element. </p>
         *
         * <p> This effectively reduces the container size by the number of elements removed. </p>
         *
         * @param position Iterator pointing to a single element to be removed from the Container.
         *
         * @return An Iterator pointing to the new location of the element that followed the last element 
         *         erased by the function call. This is the container end if the operation erased the last 
         *         element in the sequence.
         */
        public erase(position: Iterator<T>): Iterator<T>;

        /**
         * <p> Erase elements. </p>
         * <p> Removes from the Container either as a range of elements. </p>
         *
         * <p> This effectively reduces the container size by the number of elements removed. </p>
         *
         * @param begin An iterator specifying a range of beginning to erase.
         * @param end An iterator specifying a range of end to erase.
         */
        public erase<U extends T>(begin: Iterator<U>, end: Iterator<U>): Iterator<T>;

        public erase(...args: any[]): any
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

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
        public begin(): Iterator<T>
        {
            if (this.size() == 0)
                return this.end();
            else
                throw new std.AbstractMethodError("Have to be overriden.");
        }

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
        public end(): Iterator<T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /**
         * Return the number of elements in the Container.
         */
        public size(): number
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
        
        /**
         * Test whether the Container is empty.
         */
        public empty(): boolean
        {
            return this.size() == 0;
        }
    }

    export class PairContainer<K, T>
        extends Container<Pair<K, T>>
    {
        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        /**
         * Default Constructor
         */
        public constructor()
        {
            super();
        }

        public assign<U extends T>(begin: PairIterator<K, U>, end: PairIterator<K, U>): void
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        public clear()
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        public size(): number
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        public begin(): PairIterator<K, T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
        public end(): PairIterator<K, T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        public find(key: K): PairIterator<K, T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        public has(key: K): boolean
        {
            return !this.find(key).equals(this.end());
        }
        public get(key: K): T
        {
            return this.find(key).second;
        }

        /* ---------------------------------------------------------
		    ELEMENTS I/O
	    --------------------------------------------------------- */
        public erase(key: K): number;
        public erase(it: PairIterator<K, T>): PairIterator<K, T>;
        public erase<U extends T>(begin: PairIterator<K, U>, end: PairIterator<K, U>): PairIterator<K, T>;

        public erase(...args: any[]): any
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
    }
}