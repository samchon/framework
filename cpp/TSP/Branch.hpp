#pragma once
#include <string>

class SAMCHON_FRAMEWORK Branch
{
private:
	/**
	* @brief Identifier id(number) of the Branch
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
	/**
	 * @brief Construct from elements
	 *
	 * @param uid Identifier representing uniqueness of the Branch
	 * @param longitude Longitude, a coordinate of the Branch
	 * @param latitude Latitude, a coordinate of the Branch
	 */
	Branch(int uid, double longitude, double latitude);

	/**
	 * @brief Construct from only uid
	 * @details Constructs Branch with random longitude and latitude 
	 *
	 * @param uid Identifier representing uniqueness of the Branch
	 */
	Branch(int uid);

	/**
	 * @brief Calculate distance between target Branch
	 *
	 * @details Referenced from http://thesunrises.tistory.com/958 (longtitude, latitude to killometers)
	 * @param branch The target Branch to calculate
	 */
	auto calcDistance(const Branch&) const -> double;

	/**
	 * @brief Convert the Branch to std::string
	 *
	 * @details Have of form of tab and enter delimeters for Excel.
	 *  \li <pre> {$uid}	{$longitude}	{$latitude} </pre>
	 *
	 * @return A string represents the Branch
	 */
	auto toString() const->std::string;
};