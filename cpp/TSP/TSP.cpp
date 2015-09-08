#include "TSP.hpp"
#	include "Travel.hpp"

#include <samchon/library/GeneticAlgorithm.hpp>
#include <samchon/library/ProgressEvent.hpp>

using namespace std;
using namespace samchon::library;

TSP::TSP(shared_ptr<Travel> travel, const GAParameters &gaParameters)
	: super()
{
	this->travel = travel;
	this->gaParameters = gaParameters;
}

auto TSP::optimize() -> shared_ptr<Travel>
{
	GeneticAlgorithm<Travel> geneticAlgorithm
		(
			true,
			gaParameters.mutationRate,
			gaParameters.tornament,
			true
			);
	shared_ptr<GAPopulation<Travel>> population
		(new GAPopulation<Travel>(travel, gaParameters.population));

	for (size_t i = 0; i < gaParameters.generation; i++)
	{
		population = geneticAlgorithm.evolvePopulation(population);

		ProgressEvent *progressEvent = new ProgressEvent(this, (double)i, (double)gaParameters.generation);
		dispatchEvent(shared_ptr<Event>(progressEvent));
	}
	
	dispatchEvent(shared_ptr<Event>(new Event(this, Event::COMPLETE)));
	return population->fitTest();
}