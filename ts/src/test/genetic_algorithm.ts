/// <reference path="API.ts" />

namespace example
{
	export function genetic_algorithm(): void
	{
		let numbers: std.Vector<number> = new std.Vector<number>();
		for (let i: number = 0; i < 10; i++)
			numbers.push_back(i);
		std.random_shuffle(numbers.begin(), numbers.end());
		console.log(numbers.data());

		let ga: library.GeneticAlgorithm = new library.GeneticAlgorithm();
		let ret = ga.evolveGeneArray(numbers, 50, 50, compare, cloner);

		console.log(ret.data());
	}

	function compare(x: std.Vector<number>, y: std.Vector<number>): boolean
	{
		return compute_score(x) > compute_score(y);
	}
	function cloner(x: std.Vector<number>): std.Vector<number>
	{
		return new std.Vector<number>(x);
	}
	
	function compute_score(v: std.Vector<number>): number
	{
		let score: number = 0;
		for (let i: number = 0; i < v.size(); i++)
			if (i == v.at(i))
				++score;
		return score;
	}
}