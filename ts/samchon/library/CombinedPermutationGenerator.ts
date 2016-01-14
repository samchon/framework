/// <reference path="../API.ts" />

/// <reference path="CaseGenerator.ts" />

namespace samchon.library
{
    /**
     * <p> A combined-permutation case generator. </p>
     * <p> <sub>n</sub>TT<sub>r</sub> </p>
     * 
     * @inheritdoc
     * @author Jeongho Nam
     */
    export class CombinedPermutationGenerator
        extends CaseGenerator
    {
        /**
         * <p> An array using for dividing each element index. </p>
         */
        private dividerArray: Array<number>;

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

            this.size_ = Math.pow(n, r);
            this.dividerArray = new Array<number>();

            for (var i: number = 0; i < r; i++)
            {
                var x: number = r - (i + 1);
                var val: number = Math.pow(n, x);

                this.dividerArray.push(val);
            }
        }

        public at(index: number): Array<number>
        {
            var row: Array<number> = new Array<number>();
            for (var i: number = 0; i < this.r_; i++)
            {
                var val: number = Math.floor(index / this.dividerArray[i]) % this.n_;

                row.push(val);
            }
            return row;
        }
    }
}