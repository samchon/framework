/// <reference path="../API.ts" />

namespace samchon.library
{
	/**
	 * Case generator.
	 * 
	 * {@link CaseGenerator} is an abstract case generator being used like a matrix.
	 * <ul>
	 *  <li> n¢³r(n^r) -> {@link CombinedPermutationGenerator} </li>
	 *  <li> nPr -> {@link PermutationGenerator} </li>
	 *  <li> n! -> {@link FactorialGenerator} </li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class CaseGenerator
	{
		/**
		 * Size, the number of all cases.
		 */
		protected size_: number;

		/**
		 * N, size of the candidates.
		 */
		protected n_: number;

		/**
		 * R, size of elements of each case.
		 */
		protected r_: number;

		/* ---------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------- */
		/**
		 * Construct from size of N and R.
		 * 
		 * @param n Size of candidates.
		 * @param r Size of elements of each case.
		 */
		constructor(n: number, r: number)
		{
			this.n_ = n;
			this.r_ = r;
		}

		/* ---------------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------------- */
		/**
		 * Get size of all cases.
		 *
		 * @return Get a number of the all cases.
		 */
		public size(): number
		{
			return this.size_;
		}

		/**
		 * Get size of the N.
		 */
		public n(): number
		{
			return this.n_;
		}

		/**
		 * Get size of the R.
		 */
		public r(): number
		{
			return this.r_;
		}

		/**
		 * Get index'th case.
		 *
		 * @param index Index number
		 * @return The row of the index'th in combined permuation case
		 */
		public abstract at(index: number): number[];
	}

	/**
	 * A combined-permutation case generator.
	 * 
	 * <sub>n</sub>¢³<sub>r</sub>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class CombinedPermutationGenerator
		extends CaseGenerator
	{
		/**
		 * An array using for dividing each element index.
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
			super(n, r);

			this.size_ = Math.pow(n, r);
			this.divider_array = new Array<number>();

			for (let i: number = 0; i < r; i++)
			{
				let x: number = r - (i + 1);
				let val: number = Math.pow(n, x);

				this.divider_array.push(val);
			}
		}

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
	export class PermuationGenerator
		extends CaseGenerator
	{
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
			super(n, r);

			this.size_ = n;
			for (let i: number = n - 1; i > n - r; i--)
				this.size_ *= i;
		}

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
	export class FactorialGenerator
		extends PermuationGenerator
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