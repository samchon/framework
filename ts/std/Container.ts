/// <reference path="Iterator.ts" />

/// <reference path="Exception.ts" />

namespace std
{
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
         * @inheritdoc
         */
        public assign<U extends T>(begin: Iterator<U>, end: Iterator<U>): void
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /**
         * @inheritdoc
         */
        public clear(): void
        {
            this.erase(this.begin(), this.end());
        }

        /* ---------------------------------------------------------------
            ELEMENTS I/O
        --------------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public push<U extends T>(...items: U[]): number
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
        
        /**
         * @inheritdoc
         */
        public erase(position: Iterator<T>): Iterator<T>;

        /**
         * @inheritdoc
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
         * @inheritdoc
         */
        public begin(): Iterator<T>
        {
            if (this.size() == 0)
                return this.end();
            else
                throw new std.AbstractMethodError("Have to be overriden.");
        }

        /**
         * @inheritdoc
         */
        public end(): Iterator<T>
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }

        /**
         * @inheritdoc
         */
        public size(): number
        {
            throw new std.AbstractMethodError("Have to be overriden.");
        }
        
        /**
         * @inheritdoc
         */
        public empty(): boolean
        {
            return this.size() == 0;
        }
    }
}