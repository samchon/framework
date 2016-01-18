/// <reference path="Container.ts" />

/// <reference path="Exception.ts" />

namespace std
{
    export class Iterator<T>
    {
        protected source: Container<T>;

        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        /**
         * Construct from the source Container.
         *
         * @param source The source Container.
         */
        public constructor(source: Container<T>)
        {
            this.source = source;
        }

        /* ---------------------------------------------------------
		    MOVERS
	    --------------------------------------------------------- */
        /**
         * Get iterator to previous element.
         */
        public prev(): Iterator<T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /**
         * Return an Iterator. 
         */
        public next(): Iterator<T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /**
         * Advances the Iterator by n element positions.
         *
         * @param n Number of element positions to advance.
         * @return An advanced Iterator.
         */
        public advance(n: number): Iterator<T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        public equals<U extends T>(obj: Iterator<U>): boolean
        {
            return this.source == obj.source;
        }

        /**
         * Get source.
         */
        public getSource(): Container<T>
        {
            return this.source;
        }
        
        /**
         * Get value.
         */
        public get value(): T
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /**
         * Set value.
         */
        public set value(val: T)
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
    }

    export class PairIterator<K, T>
        extends Iterator<Pair<K, T>>
    {
        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        /**
         * Construct from the source PairContainer. 
         *
         * @param source The source PairContainer.
         */
        public constructor(source: PairContainer<K, T>)
        {
            super(source);
        }

        /* ---------------------------------------------------------
		    MOVERS
	    --------------------------------------------------------- */
        public prev(): PairIterator<K, T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        public next(): PairIterator<K, T> 
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        public equals<U extends T>(obj: PairIterator<K, U>): boolean 
        {
            return this.source == obj.source;
        }

        public get first(): K
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
        public get second(): T
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        public set first(val: K)
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
        public set second(val: T)
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
    }
}