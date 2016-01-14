/// <reference path="../API.ts" />

/// <reference path="PermutationGenerator.ts" />

namespace samchon.library
{
    export class FactorialGenerator
        extends PermuationGenerator
    {
        /**
         * Construct from factorial size N. 
         *
         * @param n Factoria size N.
         */
        public constructor(n: number)
        {
            super(n, n);
        }
    }
}