/// <reference path="../../API.ts" />

/// <reference path="../../protocol/EntityArray.ts" />
///     <reference path="Wrapper.ts" />

namespace samchon.example.packer
{
    export class WrapperArray
        extends protocol.EntityArray<Wrapper>
    {
        /**
         * <p> A list for reserved Product(s). </p>
         */
        private reserved: Array<Product>;

        /**
         * <p> A sample wrapper used to copy. </p>
         */
        private sample: Wrapper;
    
        /* --------------------------------------------------------------------
            CONSTRUCTORS
        -------------------------------------------------------------------- */
        /**
	     * <p> Construct from a sample wrapper. </p>
	     *
	     * @param sample A sample wrapper used to copy wrappers.
	     */
        public constructor(sample: Wrapper = null)
        {
            super();

            this.sample = sample;
            this.reserved = new Array<Product>();
        }
        public construct(xml: library.XML): void
        {
            super.construct(xml);

            this.sample = new Wrapper();
            this.sample.construct(xml);
        }

        protected createChild(xml: library.XML): Wrapper
        {
            return new Wrapper();
        }

        /* --------------------------------------------------------------------
            OPERATORS
        -------------------------------------------------------------------- */
        /**
	     * <p> Try to insert a product into reserved list. </p>
	     *
	     * <p> If the Product's volume and weight is equal or less than the Wrapper categorized so that enable to
	     * insert in a Wrapper, reserve the Product and returns <i>true</i>. If not, does not reserve and just
	     * return <i>false</i>. </p>
	     *
	     * @return Whether the Product's volume and weight is equal or less than the Wrapper.
	     */
        public tryInsert(product: Product): boolean
        {
            if (product.getVolume() > this.sample.getVolume() ||
                product.getWeight() > this.sample.getWeight())
            {
                return false;
            }

            this.reserved.push(product);
            return true;
        }

        /**
	     * <p> Optimize to retrieve the best solution. </p>
	     *
	     * <p> Retrieves the best solution of packaging in level of WrapperArray. </p>
	     * <p> Shuffles sequence of reserved Product(s) by samchon::library::FactorialGenerator and insert the reserved
	     * Products(s) following the sequence creating Wrapper(s) as needed. Between the sequences from FactorialGenerator,
	     * retrieve and determine the best solution. </p>
	     *
	     * <h4> Note. </h4>
	     * <p> Sequence of inserting Product can affeact to numbers of Wrapper(s) to be used. </p>
	     * <p> It's the reason why even WrapperArray has the optimize() method. </p>
	     */
        public optimize(): void
        {
            if (this.reserved.length == 0)
                return;

            var factorial: library.FactorialGenerator = new library.FactorialGenerator(this.reserved.length);
            var minWrapperArray: WrapperArray;

            for (var i: number = 0; i < factorial.size(); i++)
            {
                var wrapperArray: WrapperArray = new WrapperArray(this.sample);
                var row: Array<number> = factorial.at(i);

                for (var j: number = 0; j < row.length; j++)
                {
                    var product: Product = this.reserved[row[j]];

                    if (wrapperArray.size() == 0 ||
                        wrapperArray.at(wrapperArray.size() - 1).tryInsert(product) == false)
                    {
                        var wrapper: Wrapper = new Wrapper(this.sample);
                        wrapper.tryInsert(product);

                        wrapperArray.push(wrapper);
                    }
                }

                if (minWrapperArray == null ||
                    wrapperArray.calcPrice() < minWrapperArray.calcPrice())
                {
                    minWrapperArray = wrapperArray;
                }
            }

            //REPLACE TO MIN_WRAPPER_ARRAY
            this.splice(0, this.size());

            for (var i: number = 0; i < minWrapperArray.size(); i++)
                this.push( minWrapperArray.at(i) );
        }

        /* --------------------------------------------------------------------
            GETTERS
        -------------------------------------------------------------------- */
        /**
         * <p> Calculate price of the Wrapper(s). </p>
         * 
         * <p> Calculates price of all wrappers'. The price does not contain inserted products'. </p>
         */
        public calcPrice(): number
        {
            return this.sample.getPrice() * this.size();
        }

        /**
         * <p> Get sample. </p>
         */
        public getSample(): Wrapper
        {
            return this.sample;
        }

        /* --------------------------------------------------------------------
            EXPORTERS
        -------------------------------------------------------------------- */
        public TAG(): string 
        {
            return "wrapperArray";
        }
        public CHILD_TAG(): string 
        {
            return "wrapper";
        }

        public toXML(): library.XML
        {
            var xml: library.XML = super.toXML();
            xml.addAllProperties(this.sample.toXML());

            return xml;
        }
    }
}