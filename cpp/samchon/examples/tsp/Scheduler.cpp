#include "Scheduler.hpp"
#	include "Travel.hpp"

#include <samchon/library/GeneticAlgorithm.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::tsp;

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
	
	travel = 
		geneticAlgorithm.evolveGeneArray
		(
			travel, 
			gaParameters.population, 
			gaParameters.generation
		);
	return travel;
}