/// <reference path="../../protocol/EntityArray.ts" />

namespace samchon.example.packer
{
	/**
	 * <p> A packer planning the best packaging. </p>
	 * <p> Retrieves the solution of packaging by combination permuation and factorial case. </p>
	 *
	 * <h4> Warning. </h4>
	 * <p> Be careful about number of products and wrappers. </p> 
	 * <p> The time complexity of Packer overs O(m^n). Elapsed time of calculation increases enourmously. 
	 * Do not use Packer if the digits of number of products or wrappers overs 2. </p>
	 *
	 * @author Jeongho Nam <http://samchon.org>
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
		/**
		 * <p> Construct from an argument. </p>
		 */
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
				let packer: Packer = obj;
	 
				this.productArray = packer.productArray;

				for (let i: number = 0; i < packer.size(); i++)
					this.push
					(
						new WrapperArray
						(
							packer.at(i).getSample()
						)
					);
			}
			else
				throw "invalid argument";
		}

		protected createChild(xml: library.XML): WrapperArray
		{
			return new WrapperArray();
		}

		/* --------------------------------------------------------------------
			CALCULATORS
		-------------------------------------------------------------------- */
		/**
		 * <p> Find the best packaging method. </p>
		 */
		public optimize(start: number = 0, size: number = -1): void
		{
			if (this.size() == 0 || this.productArray.size() == 0)
				return;

			let caseGenerator: library.CombinedPermutationGenerator =
				new library.CombinedPermutationGenerator(this.size(), this.productArray.size());
			let minPacker: Packer = null;

			//ADJUST END INDEX
			if (size == -1 || start + size > caseGenerator.size())
				size = caseGenerator.size() - start;
		
			//FIND THE BEST SOLUTION
			for (let i: number = start; i < start + size; i++) //ROW
			{
				let packer: Packer = new Packer(this);
				let row: Array<number> = caseGenerator.at(i);

				let validity: boolean = true;

				for (let j: number = 0; j < row.length; j++) //EACH ELEMENT
				{
					let product: Product = this.productArray.at(j);
					let wrapperArray: WrapperArray = packer.at( row[j] );

					if (wrapperArray.tryInsert(product) == false)
					{
						validity = false;
						break;
					}
				}

				if (validity == false)
					continue;

				//OPTIMIZE ALL WRAPPERS IN A PACKER
				for (let j: number = 0; j < packer.size(); j++)
					packer.at(j).optimize();

				if (minPacker == null || packer.calcPrice() < minPacker.calcPrice())
					minPacker = packer;
			}

			//REPLACE TO MIN_PACKER
			this.splice(0, this.size());

			for (let i: number = 0; i < minPacker.size(); i++)
				this.push(minPacker.at(i));
		}

		/**
		 * <p> Calculate price of the wrappers. </p>
		 */
		public calcPrice(): number
		{
			let price: number = 0;
			for (let i: number = 0; i < this.size(); i++)
				price += this.at(i).calcPrice();

			return price;
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

		/* --------------------------------------------------------------------
			STATIC MAIN
		-------------------------------------------------------------------- */
		public static main(): void
		{
			let productArray: ProductArray = new ProductArray();
			productArray.push
			(
				new Product("Eraser", 500, 10, 70),
				new Product("Pencil", 400, 30, 35),
				new Product("Pencil", 400, 30, 35),
				//new Product("Pencil", 400, 30, 35),
				//new Product("Book", 8000, 150, 300),
				//new Product("Book", 8000, 150, 300),
				//new Product("Drink", 1000, 75, 250),
				//new Product("Umbrella", 4000, 200, 1000),
				new Product("Notebook-PC", 800000, 150, 850),
				new Product("Tablet-PC", 600000, 120, 450)
			);

			let xml: library.XML = productArray.toXML();
			productArray.clear();
			productArray.construct(xml);

			let packer: Packer = new Packer(productArray);
			packer.push
			(
				new WrapperArray(new Wrapper("Large", 100, 200, 1000)),
				new WrapperArray(new Wrapper("Medium", 70, 150, 500)),
				new WrapperArray(new Wrapper("Small", 50, 100, 250))
			);

			packer.optimize();
			trace(packer.toXML().toString());
		}
	}
}