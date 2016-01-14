/// <reference path="../API.ts" />

namespace samchon.std
{
    /* =========================================================
        + EXCEPTION
            + LOGIC_ERROR
                - DOMAIN_ERROR
                - INVALID_ARGUMENT
                - LENGTH_ERROR
                - OUT_OF_RANGE
            + RUNTIME_ERROR
                - OVERFLOW_ERROR
                - RANGE_ERROR
                - SYSTEM_ERROR
                - UNDERFLOW_ERROR
    ========================================================= */

    export class Exception
    {
        protected what_: string;

        public constructor(what: string)
        {
            this.what_ = what;
        }

        public what(): string
        {
            return this.what_;
        }
    }

    /* =========================================================
        + LOGIC_ERROR
            - DOMAIN_ERROR
            - INVALID_ARGUMENT
            - LENGTH_ERROR
            - OUT_OF_RANGE
            - ABSTRACT_METHOD_ERROR
	========================================================= */
    export class LogicError
        extends Exception
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    export class DomainError
        extends LogicError
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    //export class FutureError
    //    extends LogicError
    //{
    //    public constructor(what: string)
    //    {
    //        super(what);
    //    }
    //}

    export class InvalidArgument
        extends LogicError
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    export class LengthError
        extends LogicError
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    export class OutOfRange
        extends LogicError
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    export class AbstractMethodError
        extends LogicError
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    /* =========================================================
        + RUNTIME_ERROR
            - OVERFLOW_ERROR
            - RANGE_ERROR
            - SYSTEM_ERROR
            - UNDERFLOW_ERROR
	========================================================= */
    export class RuntimeError
        extends Exception
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    export class OverflowError
        extends RuntimeError
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    export class UnderflowError
        extends RuntimeError
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    export class RangeError
        extends RuntimeError
    {
        public constructor(what: string)
        {
            super(what);
        }
    }

    export class SystemError
        extends RuntimeError
    {
        public constructor(what: string)
        {
            super(what);
        }
    }
}