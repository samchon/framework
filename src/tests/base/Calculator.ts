import * as std from "tstl";

export class Calculator
{
	public plus(x: number, y: number): number
	{
		return std.plus(x, y);
	}
	public minus(x: number, y: number): number
	{
		return std.minus(x, y);
	}

	public multiplies(x: number, y: number): number
	{
		return std.multiplies(x, y);
	}
	public divides(x: number, y: number): number
	{
		if (y === 0)
			throw new std.InvalidArgument("Unable to divide by zero.");

		return x / y;
	}
}

export interface ICalculator
{
	plus(x: number, y: number): Promise<number>;
	minus(x: number, y: number): Promise<number>;

	multiplies(x: number, y: number): Promise<number>;
	divides(x: number, y: number): Promise<number>;
}
export namespace ICalculator
{
	export async function main(driver: ICalculator): Promise<void>
	{
		// VALIDATOR
		let validator: Calculator = new Calculator();

		// CALL FUNCTIONS IN SERVER FROM CLIENT
		for (let i: number = 0; i < 5; ++i)
			validate(driver, validator);

		// EXCEPTION THROWN BY THE SERVER
		if (await get_exception(driver) === null)
			throw new std.DomainError("Throwing exception doesn't work.");
	}

	async function validate(driver: ICalculator, validator: Calculator): Promise<void>
	{
		const METHODS: (keyof ICalculator)[] = ["plus", "minus", "multiplies", "divides"];

		let method: keyof ICalculator = METHODS[std.randint(0, METHODS.length - 1)];
		let x: number = std.randint(1, 10);
		let y: number = std.randint(1, 10);
		
		let ret = await driver[method](x, y);
		if (ret !== validator[method](x, y))
			throw new std.DomainError("Error on function calling.");
	}

	export async function get_exception(driver: ICalculator): Promise<string>
	{
		try 
		{ 
			await driver.divides(2, 0); 
		}
		catch (exp) 
		{
			return exp.message; 
		}
		return null;
	}
}

