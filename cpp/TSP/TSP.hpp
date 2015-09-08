#pragma once
#include <memory>
#include <samchon/library/EventDispatcher.hpp>

class Travel;

/**
 * @brief Parameters for Genetic-Algorithm
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

class TSP
	: public samchon::library::EventDispatcher
{
private:
	typedef samchon::library::EventDispatcher super;

	/**
	 * @brief A travel to optimize
	 */
	std::shared_ptr<Travel> travel;

	/**
	 * @brief Parameters for Genetic-Algorithm
	 */
	struct GAParameters gaParameters;

public:
	TSP(std::shared_ptr<Travel> travel, const GAParameters &gaParameters);

	auto optimize() -> std::shared_ptr<Travel>;
};