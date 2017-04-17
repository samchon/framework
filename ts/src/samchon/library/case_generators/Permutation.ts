/// <reference path="../../API.ts" />

namespace samchon.library
{
	/**
	 * A permutation case generator.
	 * 
	 * <sub>n</sub>P<sub>r</sub>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class Permutation
		implements ICaseGenerator
	{
		/**
		 * @hidden
		 */
		private size_: number;

		/**
		 * @hidden
		 */
		private n_: number;

		/**
		 * @hidden
		 */
		private r_: number;

		/* ---------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------- */
		/**
		 * Construct from size of N and R.
		 * 
		 * @param n Size of candidates.
		 * @param r Size of elements of each case.
		 */
		public constructor(n: number, r: number) 
		{
			this.n_ = n;
			this.r_ = r;

			this.size_ = n;
			for (let i: number = n - 1; i > n - r; i--)
				this.size_ *= i;
		}

		/* -----------------------------------------------------------
			ACCESSORS
		----------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public size(): number
		{
			return this.size_;
		}

		/**
		 * Get N, number of candidates.
		 */
		public n(): number
		{
			return this.n_;
		}

		/**
		 * Get R, number of elements for each case.
		 */
		public r(): number
		{
			return this.r_;
		}

		/* -----------------------------------------------------------
			COMPUTATION
		----------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public at(index: number): number[]
		{
			let atoms: number[] = [];
			for (let i: number = 0; i < this.n_; i++)
				atoms.push(i);

			let row: number[] = [];

			for (let i: number = 0; i < this.r_; i++)
			{
				let item: number = index % atoms.length;
				index = Math.floor(index / atoms.length);

				row.push( atoms[item] );
				atoms.splice(item, 1);
			}
			return row;
		}

		public [Symbol.iterator](): IterableIterator<Array<number>>
		{
			return new _CGForOfAdaptor(this);
		}
	}
}
