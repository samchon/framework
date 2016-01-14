/// <reference path="../../API.ts" />

/// <reference path="../../protocol/Entity.ts" />

namespace samchon.example.packer
{
    export class Product
        extends protocol.Entity
        implements Instance
    {
        protected name: string;
        protected price: number;
        protected volume: number;
        protected weight: number;

        /* --------------------------------------------------------------------
            CONSTRUCTORS
        -------------------------------------------------------------------- */
        /**
         * Default Constructor.
         */
        public constructor();

        /**
         * Construct from members. 
         *
         * @param name Name of the Product.
         * @param price Price of the Product.
         * @param volume Volume of the Product.
         * @param weight Weight of the Product.
         */
        public constructor(name: string, price: number, volume: number, weight: number);

        public constructor
            (
                name: string = "", 
                price: number = 0, volume: number = 0, weight: number = 0
            )
        {
            super();

            this.name = name;
            this.price = price;
            this.volume = volume;
            this.weight = weight;
        }

        /* --------------------------------------------------------------------
            GETTERS
        -------------------------------------------------------------------- */
        public getName(): string
        {
            return this.name;
        }
        public getPrice(): number
        {
            return this.price;
        }
        public getVolume(): number 
        {
            return this.volume;
        }
        public getWeight(): number 
        {
            return this.weight;
        }

        /* --------------------------------------------------------------------
            EXPORTERS
        -------------------------------------------------------------------- */
        public TAG(): string
        {
            return "product";
        }
    }
}