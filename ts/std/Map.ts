/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />

/// <refence path="TreeNode.ts" />

namespace std
{
    export class Map<K, T>
        extends PairContainer<K, T>
    {
        protected data_: TreeNode<Pair<K, T>>;

        protected size_: number;

        public constructor(...args: any[])
        {
            super();

            this.data_ = null;
            this.size_ = 0;
        }
    }
}