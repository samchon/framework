import { Permutation } from "./Permutation";

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