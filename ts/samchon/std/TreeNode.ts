namespace samchon.std
{
    export class TreeNode<T>
    {
        protected parent: TreeNode<T>;

        protected leftChild: TreeNode<T>;

        protected rightChild: TreeNode<T>;

        protected value: T;

        /* -------------------------------------------------------------------
		    CONSTRUCTORS
	    ------------------------------------------------------------------- */
        public constructor(parent: TreeNode<T>, value: T)
        {
            this.parent = parent;
            this.value = value;
        }

        /* -------------------------------------------------------------------
		    ACCESSORS
	    ------------------------------------------------------------------- */
        public getParent(): TreeNode<T>
        {
            return this.parent;
        }
        public getLeftChild(): TreeNode<T>
        {
            return this.leftChild;
        }
        public getRightChild(): TreeNode<T>
        {
            return this.rightChild;
        }

        public getValue(): T 
        {
            return this.value;
        }

        public size(): number
        {
            var size: number = 1;

            if (this.leftChild != null)
                size += this.leftChild.size();
            if (this.rightChild != null)
                size += this.rightChild.size();

            return size;
        }

        /* -------------------------------------------------------------------
		    LINKERS
	    ------------------------------------------------------------------- */
        public prev(): TreeNode<T>
        {
            var node: TreeNode<T> = null;

            if (this.leftChild != null)
                node = this.leftChild;
            else if (this.parent != null && this.parent.leftChild != this)
                node = this.parent.leftChild;

            // GO TO RIGHT, RIGHT, RIGHT AND RIGHT SIDE OF CHILDREN
            if (node != null)
                while (node.rightChild != null)
                    node = node.rightChild;

            return node;
        }
        public next(): TreeNode<T>
        {
            var node: TreeNode<T> = null;

            if (this.rightChild != null)
                node = this.rightChild;
            else if (this.parent != null && this.parent.rightChild != this)
                node = this.parent.rightChild;

            // GO TO LEFT, LEFT, LEFT AND LEFT SIDE OF CHILDREN
            if (node != null)
                while (node.leftChild != null)
                    node = node.leftChild;

            return node;
        }

        public front(): TreeNode<T>
        {
            var node: TreeNode<T> = this;

            // TO THE TOP
            while (node.parent != null)
                node = node.parent;

            // TO LEFT
            while (node.leftChild != null)
                node = node.leftChild;

            return node;
        }

        public back(): TreeNode<T>
        {
            var node: TreeNode<T> = this;

            // TO THE TOP
            while (node.parent != null)
                node = node.parent;

            // TO RIGHT
            while (node.rightChild != null)
                node = node.rightChild;

            return node;
        }

        /* -------------------------------------------------------------------
		    SETTERS
	    ------------------------------------------------------------------- */
        public setLeft(node: TreeNode<T>):void
        {
            this.leftChild = node;
        }
        public setRight(node: TreeNode<T>): void
        {
            this.rightChild = node;
        }
        public setValue(value: T): void
        {
            this.value = value;
        }
    }
}