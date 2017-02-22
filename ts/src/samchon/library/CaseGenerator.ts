/// <reference path="../API.ts" />

namespace samchon.library
{
	/**
	 * Case generator.
	 * 
	 * {@link ICaseGenerator} is an interface for case generators being used like a matrix.
	 * <ul>
	 * 	<li> A x B x ... x Z -> {@link CartesianProduct} </li>
	 *  <li> n��r(n^r) -> {@link RepeatedPermutation} </li>
	 *  <li> nPr -> {@link Permutation} </li>
	 *  <li> n! -> {@link Factorial} </li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface ICaseGenerator
	{
		/**
		 * Get size of all cases.
		 *
		 * @return Get a number of the all cases.
		 */
		size(): number;

		/**
		 * Get index'th case.
		 *
		 * @param index Index number
		 * @return The row of the index'th in combined permuation case
		 */
		at(index: number): Array<number>;
	}

	/**
	 * A cartesian-product case generator.
	 * 
	 * A<sub>1</sub> X A<sub>2</sub> X ... X A<sub>n</sub>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class CartesianProduct
		implements ICaseGenerator
	{
		/**
		 * @hidden
		 */
		private digits_: Array<number>;

		/**
		 * @hidden
		 */
		private dividers_: Array<number>;

		/**
		 * @hidden
		 */
		private size_: number;

		/* -----------------------------------------------------------
			CONSTRUCTORS
		----------------------------------------------------------- */
		/**
		 * Initializer Constructor.
		 * 
		 * @param digits Max number (size) of each digit.
		 */
		public constructor(...digits: number[])
		{
			this.digits_ = digits;

			this.dividers_ = new Array<number>(digits.length);
			this.size_ = 1;

			for (let i: number = digits.length - 1; i >= 0; i--)
			{
				this.dividers_[i] = this.size_;
				this.size_ *= digits[i];
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
		 * Get digits, Max number (size) of each digit.
		 */
		public digits(): number[]
		{
			return this.digits_;
		}

		/* -----------------------------------------------------------
			COMPUTATION
		----------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public at(index: number): Array<number>
		{
			let row: Array<number> = [];
			for (let i: number = 0; i < this.digits_.length; i++)
			{
				let val: number = Math.floor(index / this.dividers_[i]);
				val = val % this.digits_[i];

				row.push(val);
			}

			return row;
		}
	}

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
	}

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
	}

	/**
	 * Factorial case generator.
	 * 
	 * n! = <sub>n</sub>P<sub>n</sub>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class Factorial
		extends Permutation
	{
		/**
		 * Construct from factorial size N. 
		 *
		 * @param n Factoria size N.
		 */
		public constructor(n: number)
		{
			super(n, n);
		}
	}
}