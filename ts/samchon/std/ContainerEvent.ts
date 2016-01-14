/// <reference path="../API.ts" />

namespace samchon.std
{
    export class ContainerEvent
        extends Event
    {
        public static get ADD(): string { return "add"; }
        public static get REMOVE(): string { return "remove"; }

        public constructor(type: string)
        {
            super(type);
            
            var ev: EventListener = this.dummy;
        }

        public dummy(event: Event): void
        {
        }
    }
}