/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />

/// <refence path="TreeNode.ts" />

namespace std
{
    export class Set<T>
        extends Container<T>
    {
        protected data_: TreeNode<T>;

        //protected size_: number;

        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        public constructor();

        public constructor(array: Array<T>);

        public constructor(container: Container<T>);

        public constructor(begin: Iterator<T>, end: Iterator<T>);
        
        public constructor(...args: any[])
        {
            super();

            this.data_ = null;
            //this.size_ = 0;
        }

        public assign<U extends T>(begin: Iterator<U>, end: Iterator<U>): void
        {

        }

        public clear(): void
        {
            this.data_ = null;
            //this.size_ = 0;
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        public begin(): Iterator<T>
        {
            if (this.data_ == null)
                return this.end();

            var node: TreeNode<T> = this.data_;

            // MOVE LEFT LEFT LEFT AND LEFT OF CHILDREN.
            while(node.getLeftChild() != null)
                node = node.getLeftChild();

            return new SetIterator<T>(this, node);
        }
        public end(): Iterator<T>
        {
            return new SetIterator<T>(this, null);
        }
        
        public data(): TreeNode<T>
        {
            return this.data_;
        }
        public size(): number
        {
            if (this.data_ == null)
                return 0;
            else
                return this.data_.size();
        }

        /* ---------------------------------------------------------
		    ELEMENTS I/O
	    --------------------------------------------------------- */
        public insert(key: T): std.Pair<Iterator<T>, boolean>;
        public insert(hint: Iterator<T>, key: T): Iterator<T>;
        public insert(begin: Iterator<T>, end: Iterator<T>): Iterator<T>;

        public insert(...args: any[]): any
        {

        }

        public erase(it: Iterator<T>): Iterator<T>;
        public erase(key: T): number;
        public erase<U extends T>(begin: Iterator<U>, end: Iterator<U>): Iterator<T>;

        public erase(...args: any[]): any
        {

        }
    }

    export class SetIterator<Key>
        extends Iterator<Key>
    {
        private get set(): Set<Key> { return <Set<Key>>this.source; }

        private node: TreeNode<Key>
        
        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        public constructor(source: Set<Key>, node: TreeNode<Key>)
        {
            super(source);

            this.node = node;
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        public equals<U extends Key>(obj: Iterator<U>): boolean
	    {
            return super.equals(obj) && this.node == (<SetIterator<U>>obj).node;
	    }
        
        public get value(): Key
        {
            return this.node.getValue();
        }
        public set value(val: Key)
        {
            this.node.setValue(val);
        }

        /* ---------------------------------------------------------
		    MOVERS
	    --------------------------------------------------------- */
        public prev(): Iterator<Key>
        {
            if (this.node == null)
                return new SetIterator(this.set, this.set.data().back());
            else
                return new SetIterator<Key>(this.set, this.node.prev());
        }

        public next(): Iterator<Key>
        {
            if (this.node == null)
                return new SetIterator(this.set, this.set.data().front());

            return new SetIterator(this.set, this.node.next());
        }
    }
}