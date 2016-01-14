/// <reference path="Container.ts" />

/// <reference path="Exception.ts" />

namespace samchon.std
{
    export class Iterator<T>
    {
        protected source: Container<T>;

        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        public constructor(source: Container<T>)
        {
            this.source = source;
        }

        /* ---------------------------------------------------------
		    MOVERS
	    --------------------------------------------------------- */
        public prev(): Iterator<T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        public next(): Iterator<T>
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
        
        public get value(): T
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
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