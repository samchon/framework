/// <reference path="../API.ts" />

/// <reference path="CaseGenerator.ts" />

namespace samchon.library
{
    /**
     * <p> A permutation case generator. </p>
     * <p> nPr </p>
     * 
     * @author Jeongho Nam
     * @inheritdoc
     */
    export class PermuationGenerator
        extends CaseGenerator
    {
        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        /**
         * <p> Construct from size of N and R. </p>
         * 
         * @param n Size of candidates.
         * @param r Size of elements of each case.
         */
        public constructor(n: number, r: number) 
        {
            super(n, r);

            this.size_ = n;
            for (var i: number = n - 1; i > n - r; i--)
                this.size_ *= i;
        }

        /**
         * @inheritdoc
         */
        public at(index: number): Array<number>
        {
            var atoms: Array<number> = new Array<number>();
            for (var i: number = 0; i < this.n_; i++)
                atoms.push(i);

            var row: Array<number> = new Array<number>();

            for (var i: number = 0; i < this.r_; i++)
            {
                var item: number = index % atoms.length;
                index = Math.floor(index / atoms.length);

                row.push( atoms[item] );
                atoms.splice(item, 1);
            }
            return row;
        }
    }
}