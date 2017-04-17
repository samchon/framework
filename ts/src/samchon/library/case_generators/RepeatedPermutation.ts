/// <refence path="../../API.ts" />

namespace samchon.library
{
	/**
	 * A repeated-permutation case generator.
	 * 
	 * <sub>n</sub>��<sub>r</sub>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class RepeatedPermutation
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

		/**
		 * @hidden
		 */
		private divider_array: Array<number>;

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
			this.size_ = Math.pow(n, r);

			this.divider_array = new Array<number>();

			for (let i: number = 0; i < r; i++)
			{
				let x: number = r - (i + 1);
				let val: number = Math.pow(n, x);

				this.divider_array.push(val);
			}
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
			let row: number[] = [];
			for (let i: number = 0; i < this.r_; i++)
			{
				let val: number = Math.floor(index / this.divider_array[i]) % this.n_;

				row.push(val);
			}
			return row;
		}

		public [Symbol.iterator](): IterableIterator<Array<number>>
		{
			return new _CGForOfAdaptor(this);
		}
	}
}
