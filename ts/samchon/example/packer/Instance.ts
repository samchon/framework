/// <reference path="../../API.ts" />

/// <reference path="../../protocol/IEntity.ts" />

namespace samchon.example.packer
{
    export interface Instance
        extends protocol.IEntity
    {
        /**
         * Get name.
         */
        getName(): string;

        /**
         * Get price.
         */
        getPrice(): number;

        /**
         * Get volume.
         */
        getVolume(): number;

        /**
         * Get weight.
         */
        getWeight(): number;
    }
}