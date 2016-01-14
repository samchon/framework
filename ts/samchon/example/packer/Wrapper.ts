/// <reference path="../../API.ts" />

/// <reference path="ProductArray.ts" />
///     <reference path="Instance.ts" />

namespace samchon.example.packer
{
    export class Wrapper
        extends ProductArray
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
         * Copy Constructor. 
         *
         * @param wrapper A Wrapper to copy
         */
        public constructor(wrapper: Wrapper);

        /**
         * Construct from members. 
         *
         * @param name Name of the Wrapper.
         * @param price Price of the Wrapper.
         * @param volume Volume of the Wrapper.
         * @param weight Weight of the Wrapper.
         */
        public constructor(name: string, price: number, volume: number, weight: number);
        
        public constructor(...args: any[]) 
        {
            super();

            if (args.length == 1 && args[0] instanceof Wrapper)
            {
                var wrapper: Wrapper = args[0];

                this.name = wrapper.name;
                this.price = wrapper.price;
                this.volume = wrapper.volume;
                this.weight = wrapper.weight;
            }
            else if (args.length == 4)
            {
                this.name = args[0];
                this.price = args[1];
                this.volume = args[2];
                this.weight = args[3];
            }
        }

        protected createChild(xml: library.XML): Product
        {
            return new Product(); 
        }

        /* --------------------------------------------------------------------
            OPERATORS
        -------------------------------------------------------------------- */
        public tryInsert(product: Product): boolean
        {
            var volume: number = 0;
            var weight: number = 0;

            for (var i: number = 0; i < this.size(); i++)
            {
                volume += this.at(i).getVolume();
                weight += this.at(i).getWeight();
            }

            if (product.getVolume() + volume > this.volume || 
                product.getWeight() + weight > this.weight) 
            {
                return false;
            }

            this.push(product);
            return true;
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
            return "wrapper";
        }
    }
}