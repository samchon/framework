#pragma once
#include <samchon/API.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief A structure containing parameters of genetic algorithm
		 *
		 * @details
		 * <p> The number and rate parameters in the structure affects success of evolution of genetic algorithm. </p> 
		 *
		 * \par Example Sources
		 *	\li example::tsp
		 *
		 * @see library::GeneticAlgorithm
		 * @see library::GAPopulation
		 * @see example::tsp
		 * @author Jeongho Nam
		 */
		struct GAParameters
		{
			/**
			 * @brief A number of generation of evolution.
			 */
			size_t generation;

			/**
			 * @brief A number of population in a generation.
			 */
			size_t population;

			/**
			 * @brief A number of tournament in a selection.
			 */
			size_t tournament;

			/**
			 * @brief Rate of mutate ocurrence.
			 *
			 * @details
			 * <p> A mutation rate determines the percentage of occurence of mutation in a sequence list. </p>
			 *	\li Value from 0.0 to 1.0
			 *
			 * @note
			 *	\li When mutationRate is too high, it is hard to ancitipate studying on genetic algorithm.
			 *	\li When mutationRate is too low and initial set of genes(GeneArray) is far away from optimal,
			 *	the evolution tends to wandering outside of he optimal.
			 */
			double mutationRate;
		};
	};
}