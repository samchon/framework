#pragma once
#include <string>

namespace samchon
{
	namespace example
	{
		namespace tsp
		{
			/**
			 * @brief A geometry coordinates (point)
			 *
			 * @author Jeongho Nam
			 */
			class GeometryPoint
			{
			private:
				/**
				 * @brief An unique id for uniqueness
				 */
				int uid;

				/**
				 * @brief The longitude; coordinates X
				 */
				double longitude;

				/**
				 * @brief The latitude, coordinates Y
				 */
				double latitude;

			public:
				/* -----------------------------------------------------------
					CONSTRUCTORS
				----------------------------------------------------------- */
				/**
				 * @brief Construct from uid.
				 * @details Geometry coordinates, longitude and latitude will have a random value between
				 *	\li Longitude between 0 and 180.
				 *	\li Latitude between -90 and 90.
				 */
				GeometryPoint(int);

				/**
				 * @brief Construct from uid and geometry coordinates.
				 *
				 * @param longitude Longitude, a coordinate of the geometry point
				 * @param latitude Latitude, a coordinate of the geometry point
				 */
				GeometryPoint(int, double, double);

				/* -----------------------------------------------------------
					CALCULATOR
				----------------------------------------------------------- */
				/**
				 * @brief Calculate distance between target Branch
				 *
				 * @details Referenced from http://thesunrises.tistory.com/958 (Geometry points to killometers)
				 * @param branch The target Branch to calculate
				 */
				auto calcDistance(const GeometryPoint &) const -> double;

				/* -----------------------------------------------------------
					EXPORTER
				----------------------------------------------------------- */
				/**
				 * @brief Convert the Branch to String
				 *
				 * @details Have of form of tab and enter delimeters for Excel.
				 *  \li <pre> {$uid}	{$longitude}	{$latitude} </pre>
				 *
				 * @return A string represents the GeometryPoint
				 */
				auto toString() const -> std::string;
			};
		};
	};
};