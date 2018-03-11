import { ICaseGenerator } from "./ICaseGenerator";

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