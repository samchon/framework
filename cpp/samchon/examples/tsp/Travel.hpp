#pragma once
#include <vector>
#include <string>

namespace samchon
{
	namespace example
	{
		namespace tsp
		{
			class GeometryPoint;

			/**
			 * @brief Represent a travel containning Point(s)
			 * @details Travel class is not only an array containing Point(s) but also a sequence listing of the Point(s).
			 *
			 * @author Jeongho Nam
			 */
			class Travel
				: public std::vector<GeometryPoint*>
			{
			private:
				typedef std::vector<GeometryPoint*> super;

				/**
				 * @brief Estimated hours to move
				 *
				 * @details A variable for avoiding duplicated calculation
				 * @see calcDistance()
				 */
				double distance;

			public:
				/* -----------------------------------------------------------
					CONSTRUCTORS
				----------------------------------------------------------- */
				/**
				 * @brief Default Constructor
				 */
				Travel();

				/**
				 * @brief Copy Constructor
				 *
				 * @details
				 * <p> Travel is an array of Point(s) as gene(s). The copy constructor of Travel doesn't copy
				 * member variables which are related to G.A. because the sequence of gene(Point)s can be shuffled
				 * by process of evolution of genetic algorithm. </p>
				 */
				Travel(const Travel&);

				/**
				 * @brief Move Constructor
				 */
				Travel(Travel&&);
	
			private:
				/* -----------------------------------------------------------
					CALCULATORS
				----------------------------------------------------------- */
				/**
				 * @brief Calculate distance to move
				 */
				auto calcDistance() const -> double;

			public:
				/**
				 * @brief Compare which object is less
				 * @details Compares distances to move. The result is used to optimize and evolve genes by G.A.
				 *
				 * @param Target object to compare
				 * @return Whether this object is less than target
				 */
				auto operator<(const Travel &) const -> bool;

				/* -----------------------------------------------------------
					EXPORTER
				----------------------------------------------------------- */
				/**
				 * @brief Convert the Travel to String
				 *
				 * @details 
				 * <p> Have of form of tab and enter delimeters for Excel. </p>
				 * <p><pre> {$uid1}	{$x}	{$y} </pre><br/>
				 * <pre> {$uid2}	{$x}	{$y} </pre><br/>
				 * <pre> {$uid3}	{$x}	{$y} </pre><br/>
				 * ...</p>
				 *
				 * @return A string can represent the Travel
				 */
				auto toString() const -> std::string;
			};
		};
	};
};