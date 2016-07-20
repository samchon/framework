/// <reference path="../API.ts" />

namespace samchon.library
{
	/**
	 * <p> Case generator. </p>
	 * 
	 * <p> {@link CaseGenerator} is an abstract case generator being used like a matrix. </p>
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
		 * <p> Size, the number of all cases. </p>
		 */
		protected size_: number;

		/**
		 * <p> N, size of the candidates. </p>
		 */
		protected n_: number;

		/**
		 * <p> R, size of elements of each case. </p>
		 */
		protected r_: number;

		/* ---------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------- */
		/**
		 * <p> Construct from size of N and R. </p>
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
		 * <p> Get size of all cases. </p>
		 *
		 * @return Get a number of the all cases.
		 */
		public size(): number
		{
			return this.size_;
		}

		/**
		 * <p> Get size of the N. </p>
		 */
		public n(): number
		{
			return this.n_;
		}

		/**
		 * <p> Get size of the R. </p>
		 */
		public r(): number
		{
			return this.r_;
		}

		/**
		 * <p> Get index'th case. </p>
		 *
		 * @param index Index number
		 * @return The row of the index'th in combined permuation case
		 */
		public abstract at(index: number): number[];
	}

	/**
	 * <p> A combined-permutation case generator. </p>
	 * 
	 * <p> <sub>n</sub>¢³<sub>r</sub> </p>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class CombinedPermutationGenerator
		extends CaseGenerator
	{
		/**
		 * <p> An array using for dividing each element index. </p>
		 */
		private divider_array: Array<number>;

		/* ---------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------- */
		/**
		 * <p> Construct from size of N and R. </p>
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
	 * <p> A permutation case generator. </p>
	 * 
	 * <p> <sub>n</sub>P<sub>r</sub> </p>
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
		 * <p> Construct from size of N and R. </p>
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
	 * <p> Factorial case generator. </p>
	 * 
	 * <p> n! = <sub>n</sub>P<sub>n</sub> </p>
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