/// <reference path="../API.ts" />

/// <reference path="../../std/Exception.ts" />

namespace samchon.library
{
    /**
     * <p> Case generator. </p>
     * 
     * <p> CaseGenerator is an abstract case generator using like a matrix. </p>
     * <ul>
     *  <li> nTTr(n^r) -> CombinedPermutationGenerator </li>
     *  <li> nPr -> PermutationGenerator </li>
     *  <li> n! -> FactorialGenerator </li>
     * </ul>
     * 
     * @author Jeongho Nam
     */
    export class CaseGenerator
    {
        /**
         * <p> Size, the number of all cases. </p>
         */
        protected size_: number;

        /**
         * <p> N, size of the candidates. </p>
         */
        protected n_: number;

        /**
         * <p> R, size of elements of each case. </p>
         */
        protected r_: number;

        /* ---------------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------------- */
        /**
         * <p> Construct from size of N and R. </p>
         * 
         * @param n Size of candidates.
         * @param r Size of elements of each case.
         */
        constructor(n: number, r: number)
        {
            this.n_ = n;
            this.r_ = r;
        }

        /* ---------------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------------- */
        /**
         * <p> Get size of all cases. </p>
         *
         * @return Get a number of the all cases.
         */
        public size(): number
        {
            return this.size_;
        }

        /**
         * <p> Get size of the N. </p>
         */
        public n(): number
        {
            return this.n_;
        }

        /**
         * <p> Get size of the R. </p>
         */
        public r(): number
        {
            return this.r_;
        }

        /**
	     * <p> Get index'th case. </p>
	     *
         * @param index Index number
	     * @return The row of the index'th in combined permuation case
	     */
        public at(index: number): Array<number>
        {
            throw new std.AbstractMethodError("Don't create CaseGenerator directly.");
        }
}
}