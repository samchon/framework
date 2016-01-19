/// <reference path="BasicEvent.ts" />

namespace samchon.library
{
    export class ProgressEvent
        extends BasicEvent
    {
        public static get PROGRESS(): string { return "progress"; }

        protected numerator_: number;
        protected denominator_: number;

        public constructor(type: string, numerator: number, denominator: number)
        {
            super(type);

            this.numerator_ = numerator;
            this.denominator_ = denominator;
        }

        public get numerator(): number
        {
            return this.numerator_;
        }
        public get denominator(): number
        {
            return this.denominator_;
        }
    }
}