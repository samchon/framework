/// <reference types="samchon-framework" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

namespace pack
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export interface Instance
		extends protocol.IEntity
	{
		getName(): string;
		getPrice(): number;
		getVolume(): number;
		getWeight(): number;
	}

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
		public constructor();
		public constructor(name: string, price: number, volume: number, weight: number);

		public constructor(name: string = "", price: number = 0, volume: number = 0, weight: number = 0)
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

	export class ProductArray
		extends protocol.EntityArray<Product>
	{
		public constructor()
		{
			super();
		}

		public createChild(xml: library.XML): Product
		{
			return new Product();
		}

		public TAG(): string
		{
			return "productArray";
		}
		public CHILD_TAG(): string
		{
			return "product";
		}
	}

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
		 * <p> Construct from arguments. </p>
		 */
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
			else
			{
				this.name = "";
				this.price = 0;
				this.volume = 0;
				this.weight = 0;
			}
		}

		public createChild(xml: library.XML): Product
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

			for (var i: number = 0; i < this.length; i++)
			{
				volume += this[i].getVolume();
				weight += this[i].getWeight();
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

	export class WrapperArray
		extends protocol.EntityArray<Wrapper>
	{
		/**
		 * <p> A list for reserved Product(s). </p>
		 */
		private reserved: std.Vector<Product>;

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
			this.reserved = new std.Vector<Product>();
		}

		public construct(xml: library.XML): void
		{
			this.sample = new Wrapper();
			this.sample.construct(xml);

			super.construct(xml);
		}

		public createChild(xml: library.XML): Wrapper
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
			for (let i: number = 0; i < this.reserved.length; i++)
			{
				let product: Product = this.reserved[i];
				
				if (this.empty() == true || this.back().tryInsert(product) == false)
				{
					this.push_back(new Wrapper(this.sample));
					this.back().tryInsert(product);
				}
			}

			//if (this.reserved.length == 0)
			//	return;

			//var factorial: library.FactorialGenerator = new library.FactorialGenerator(this.reserved.length);
			//var minWrapperArray: WrapperArray;

			//for (var i: number = 0; i < factorial.size(); i++)
			//{
			//	var wrapperArray: WrapperArray = new WrapperArray(this.sample);
			//	var row: number[] = factorial.at(i);

			//	for (var j: number = 0; j < row.length; j++)
			//	{
			//		var product: Product = this.reserved[row[j]];

			//		if (wrapperArray.length == 0 ||
			//			wrapperArray[wrapperArray.length - 1].tryInsert(product) == false)
			//		{
			//			var wrapper: Wrapper = new Wrapper(this.sample);
			//			wrapper.tryInsert(product);

			//			wrapperArray.push(wrapper);
			//		}
			//	}

			//	if (minWrapperArray == null ||
			//		wrapperArray.calcPrice() < minWrapperArray.calcPrice())
			//	{
			//		minWrapperArray = wrapperArray;
			//	}
			//}

			////REPLACE TO MIN_WRAPPER_ARRAY
			//this.splice(0, this.length);

			//for (var i: number = 0; i < minWrapperArray.length; i++)
			//	this.push(minWrapperArray[i]);
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
			return this.sample.getPrice() * this.length;
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
			xml.insertAllProperties(this.sample.toXML());

			return xml;
		}
	}

	/**
	 * <p> A packer planning the best packaging. </p>
	 * <p> Retrieves the solution of packaging by combination permuation and factorial case. </p>
	 *
	 * <h4> Warning. </h4>
	 * <p> Be careful about number of products and wrappers. </p> 
	 * <p> The time complexity of Packer overs O(m^n). Elapsed time of calculation increases enourmously. 
	 * Do not use Packer if the digits of number of products or wrappers overs 2. </p>
	 *
	 * @author Jeongho Nam
	 */
	export class Packer
		extends protocol.EntityArray<WrapperArray>
	{
		/**
		 * <p> Product(s) to package in some Wrapper(s). </p>
		 */
		protected productArray: ProductArray;

		/* --------------------------------------------------------------------
			CONSTRUCTORS
		-------------------------------------------------------------------- */
		public constructor();
		public constructor(productArray: ProductArray);
		public constructor(packer: Packer);

		public constructor(obj: any = null)
		{
			super();

			if (obj == null)
			{
				this.productArray = new ProductArray();
				return;
			}

			if (obj instanceof ProductArray)
			{
				this.productArray = obj;
			}
			else if (obj instanceof Packer)
			{
				var packer: Packer = obj;

				this.productArray = packer.productArray;

				for (var i: number = 0; i < packer.length; i++)
					this.push
					(
						new WrapperArray(packer[i].getSample())
					);
			}
			else
				throw "invalid argument";
		}
		public construct(xml: library.XML): void
		{
			super.construct(xml);

			this.productArray.construct(xml.get(this.productArray.TAG()).front());
		}

		public createChild(xml: library.XML): WrapperArray
		{
			return new WrapperArray();
		}

		/* --------------------------------------------------------------------
			OPTIMIZERS
		-------------------------------------------------------------------- */
		public optimize(): void;
		public optimize(start: number, size: number): void;

		public optimize(first: number = 0, last: number = -1): void
		{
			if (this.length == 0 || this.productArray.length == 0)
				return;

			var caseGenerator = new library.CombinedPermutationGenerator(this.length, this.productArray.length);
			var minPacker: Packer = null;

			//ADJUST END INDEX
			if (last == -1)
				last = caseGenerator.size();

			//FIND THE BEST SOLUTION
			for (var i: number = first; i < last; i++) //ROW
			{
				var packer: Packer = new Packer(this);
				var row: number[] = caseGenerator.at(i);

				var validity: boolean = true;

				for (var j: number = 0; j < row.length; j++) //EACH ELEMENT
				{
					var product: Product = this.productArray[j];
					var wrapperArray: WrapperArray = packer[row[j]];

					if (wrapperArray.tryInsert(product) == false)
					{
						validity = false;
						break;
					}
				}

				if (validity == false)
					continue;

				//OPTIMIZE ALL WRAPPERS IN A PACKER
				for (var j: number = 0; j < packer.length; j++)
					packer[j].optimize();

				if (minPacker == null || packer.computePrice() < minPacker.computePrice())
					minPacker = packer;
			}

			//REPLACE TO MIN_PACKER
			this.splice(0, this.length);
			if (minPacker == null)
				return;

			for (var i: number = 0; i < minPacker.length; i++)
				this.push(minPacker[i]);
		}

		/* --------------------------------------------------------------------
			ACCESORS
		-------------------------------------------------------------------- */
		/**
		 * <p> Calculate price of the wrappers. </p>
		 */
		public computePrice(): number
		{
			var price: number = 0;
			for (var i: number = 0; i < this.length; i++)
				price += this[i].calcPrice();

			return price;
		}

		public getProductArray(): ProductArray
		{
			return this.productArray;
		}

		/* --------------------------------------------------------------------
			EXPORTERS
		-------------------------------------------------------------------- */
		public TAG(): string
		{
			return "packer";
		}
		public CHILD_TAG(): string
		{
			return "wrapperArray";
		}

		public toXML(): library.XML
		{
			var xml: library.XML = super.toXML();
			xml.setProperty("price", this.computePrice() + "");
			xml.push(this.productArray.toXML());

			return xml;
		}

		public static main(): void
		{
			let productArray: ProductArray = new ProductArray();
			productArray.push
			(
				new Product("Eraser", 500, 10, 70),
				new Product("Pencil", 400, 30, 35),
				new Product("Book", 8000, 150, 300),
				new Product("Drink", 1000, 75, 250),
				new Product("Umbrella", 4000, 200, 1000),
				new Product("Notebook-PC", 800000, 150, 850),
				new Product("Tablet-PC", 600000, 120, 450)
			);

			let packer: Packer = new Packer(productArray);
			packer.push
			(
				new WrapperArray(new Wrapper("Large", 100, 200, 1000)),
				new WrapperArray(new Wrapper("Medium", 70, 150, 500)),
				new WrapperArray(new Wrapper("Small", 50, 100, 250))
			);

			packer.optimize();
			console.log("$" + packer.computePrice());
			console.log(packer.toXML().toString());
		}
	}
}

// pack.Packer.main();
export = pack;