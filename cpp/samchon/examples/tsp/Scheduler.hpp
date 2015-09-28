#pragma once
#include <vector>
#include <memory>

namespace samchon
{
	namespace example
	{
		namespace tsp
		{
			class Travel;

			/**
			 * @brief Parameters for Genetic-Algorithm
			 *
			 * @details
			 * <p> @image html cpp/example_tsp.png
			 * @image latex cpp/example_tsp.png </p>
			 *
			 * @see samchon::library::GeneticAlgorithm
			 * @author Jeongho Nam
			 */
			struct GAParameters
			{
				double mutationRate;
				size_t tornament;

				size_t population;
				size_t generation;
			};

			/**
			 * @brief A scheduler
			 * @details Scheduler deducts an optimal schdule(Travel) by genetic algorithm. 
			 *
			 * @author Jeongho Nam
			 */
			class Scheduler
			{
			private:
				/**
				 * @brief A travel to optimize or optimized
				 */
				std::shared_ptr<Travel> travel;

				/**
				 * @brief Parameters for Genetic-Algorithm
				 */
				struct GAParameters gaParameters;

			public:
				/**
				 * @brief Construct from points and parameter of genetic algorithm.
				 */
				Scheduler(std::shared_ptr<Travel>, const struct GAParameters &);

				/**
				 * @brief Derive optimized schedule
				 *
				 * @details
				 * 
				 * @return An optimized travel schedule.
				 */
				auto optimize() -> std::shared_ptr<Travel>;
			};
		};
	};
};