/// <reference path="../library/EventDispatcher.ts" />
/// <reference path="Iterator.ts" />

/// <reference path="Exception.ts" />

namespace samchon.std
{
    export class Container<T>
    {
        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        /**
         * Default Constructor
         */
        public constructor()
        {
            //super();
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
	     * <p> Removes all elements from the map container (which are destroyed), 
	     * leaving the container with a size of 0. </p>
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

        /*public insert(pos: Iterator<T>, val: T): Iterator<T>;
        public insert<U extends T>(last: Iterator<T>, begin: Iterator<U>, end: Iterator<U>): Iterator<T>;

        public insert(...args: any[]): any
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }*/

        public erase(it: Iterator<T>): Iterator<T>;
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

        public size(): number
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
        
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
        public get length(): number
        {
            return this.size();
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