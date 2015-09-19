#include "Scheduler.hpp"
#	include "Travel.hpp"

#include <samchon/library/GeneticAlgorithm.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::examples::tsp;

Scheduler::Scheduler(shared_ptr<Travel> travel, const GAParameters &gaParameteres)
{
	this->travel = travel;
	this->gaParameters = gaParameteres;
}
auto Scheduler::optimize() -> shared_ptr<Travel>
{
	GeneticAlgorithm<Travel> geneticAlgorithm
	(
		true,
		gaParameters.mutationRate,
		gaParameters.tornament
	);
	shared_ptr<GAPopulation<Travel>> population
		(new GAPopulation<Travel>(travel, gaParameters.population));

	for (size_t i = 0; i < gaParameters.generation; i++)
		population = geneticAlgorithm.evolvePopulation(population);

	travel = population->fitTest();
	
	return travel;
}