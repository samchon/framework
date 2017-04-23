/// <reference path="../../API.ts" />

namespace samchon.library
{
	/**
	 * A population in a generation.
	 * 
	 * {@link GAPopulation} is a class representing population of candidate genes (sequence listing) having an array 
	 * of GeneArray as a member. {@link GAPopulation} also manages initial set of genes and handles fitting test direclty 
	 * by the method {@link fitTest fitTest()}.
	 *
	 * The success of evolution of genetic algorithm is depend on the {@link GAPopulation}'s initial set and fitting 
	 * test. (*GeneArray* and {@link compare}.)
	 * 
	 * <h4> Warning </h4>
	 * Be careful for the mistakes of direction or position of the {@link compare}.
	 * Most of logical errors failed to access optimal solution are occured from those mistakes.
	 * 
	 * @param <T> Type of gene elements.
	 * @param <GeneArray> An array containing genes as elments; sequnce listing.
	 * 
	 * @author Jeongho Nam <http://samcho.org>
	 */
	export class GAPopulation<T, GeneArray extends std.base.IArrayContainer<T>>
	{
		/**
		 * @hidden 
		 */
		private children_: std.Vector<GeneArray>;

		/**
		 * @hidden
		 */
		private compare_: (x: GeneArray, y: GeneArray) => boolean;

		/**
		 * @hidden
		 */
		private cloner_: (obj: GeneArray) => GeneArray;
		
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Copy constructor.
		 * 
		 * @param obj Target to copy.
		 */
		public constructor(obj: GAPopulation<T, GeneArray>);
		
		/**
		 * Constructor from a GeneArray, size of the poluation and custom comparison function.
		 * 
		 * This public constructor creates *GeneArray(s)* as population (size) having shuffled genes which are
		 * came from the initial set of genes (*geneArray*). The *compare* is used for comparison function. 
		 *
		 * 
		 * @param geneArray An initial sequence listing.
		 * @param size The size of population to have as children.
		 * @param compare A comparison function returns whether left gene is more optimal.
		 * @param cloner Copy constructor of the *GeneArray*.
		 */
		public constructor(geneArray: GeneArray, size: number, compare: (x: GeneArray, y: GeneArray) => boolean, cloner: (obj: GeneArray) => GeneArray);

		public constructor(...args: any[])
		{
			if (args.length == 1)
			{
				let obj: GAPopulation<T, GeneArray> = args[0];

				this.children_ = new std.Vector<GeneArray>(obj.children_);
				this.compare_ = obj.compare_;
				this.cloner_ = obj.cloner_;
			}
			else
			{
				let geneArray: GeneArray = args[0];
				let size: number = args[1];
				this.compare_ = args[2];
				this.cloner_ = args[3];

				this.children_ = new std.Vector<GeneArray>();
				for (let i: number = 0; i < size; i++)
				{
					let child: GeneArray = this.cloner_(geneArray);

					if (i > 0) // DO NOT TOUCH THE FIRST, THE ELITEST ELEMENT; ELITICISM
						std.random_shuffle
						(
							child.begin() as std.base.IArrayIterator<T>,
							child.end() as std.base.IArrayIterator<T>
						);
					this.children_.push_back(child);
				}
			}
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Genes representing the population.
		 */
		public getChildren(): std.base.IArrayContainer<GeneArray>
		{
			return this.children_;
		}

		/**
		 * A comparison function returns whether left gene is more optimal, greater.
		 * 
		 * Default value of this {@link compare} is {@link std.greater}. It means to compare two array 
		 * (GeneArray must be a type of {@link std.base.IArrayContainer}). Thus, you've to keep follwing rule.
		 *
		 * <ul>
		 *	<li> GeneArray is implemented from {@link std.base.IArrayContainer}. </li>
		 *	<ul>
		 *		<li> {@link std.Vector} </li>
		 *		<li> {@link std.Deque} </li>
		 *	</ul>
		 *	<li> GeneArray has custom <code>public less(obj: T): boolean;</code> function. </li>
		 * </ul>
		 *
		 * If you don't want to follow the rule or want a custom comparison function, you have to realize a 
		 * comparison function.
		 */
		public getCompare(): (x: GeneArray, y: GeneArray) => boolean
		{
			return this.compare_;
		}

		/**
		 * Copy constructor of the *GeneArray*.
		 */
		public getCloner(): (obj: GeneArray) => GeneArray
		{
			return this.cloner_;
		}

		/* ---------------------------------------------------------
			MAIN PROCEDURE - THE FIT TEST
		--------------------------------------------------------- */
		/**
		 * Test fitness of each *GeneArray* in the {@link population}.
		 * 
		 * @return The best *GeneArray* in the {@link population}.
		 */
		public fitTest(): GeneArray
		{
			let best: GeneArray = this.children_.front();

			for (let i: number = 1; i < this.children_.size(); i++)
				if (this.compare_(this.children_.at(i), best) == true)
					best = this.children_.at(i);

			return best;
		}
	}
}