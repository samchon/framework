#pragma once
#include <vector>
#include <string>

class SAMCHON_FRAMEWORK Scheduler;
class SAMCHON_FRAMEWORK Branch;

/**
* @brief Represent a travel containing Branch(s)
*
* @author Jeongho Nam
*/
class SAMCHON_FRAMEWORK Travel
	: public std::vector<Branch*>
{
private:
	typedef std::vector<Branch*> super;

	/* --------------------------------------------------
		BASIC VARIABLES
	-------------------------------------------------- */
	/**
	 * @brief The starting point
	 *
	 * @details If the starting point is not specialized, travel is started from the first Branch.
	 */
	Branch *startPoint;

public:
	/* -----------------------------------------------------------
	CONSTRUCTORS
	----------------------------------------------------------- */
	/**
	 * @brief Default Constructor
	 *
	 * @details
	 * <p> Default constructor of Travel is for a case of the starting point is not specialized
	 * especially. In that case, the starting point will be position of the first Branch. </p>
	 */
	Travel();

	/**
	 * @brief Construct from starting point
	 *
	 * @param startPoint
	*/
	Travel(Branch*);

	/**
	 * @brief Calculate distance have moved
	 */
	auto calcDistance() const -> double;

	/* -----------------------------------------------------------
	OPTIMIZER
	----------------------------------------------------------- */
	/**
	 * @brief Compare which object is less
	 * @details Compares hours have spent. The result is used to optimize and evolve genes by G.A.
	 *
	 * @param Target object to compare
	 * @return Whether this object is less than target
	 */
	auto operator<(const Travel&) const -> bool;

	/* -----------------------------------------------------------
	EXPORTER
	----------------------------------------------------------- */
	/**
	* @brief Convert the Travel to std::string
	*
	* @details
	* <p> Have of form of tab and enter delimeters for Excel. </p>
	* <pre> {$uid1}	{$name1}	{$longitude1}	{$latitude1} 
	* {$uid2}	{$name2}	{$longitude2}	{$latitude2} 
	* {$uid3}	{$name3}	{$longitude3}	{$latitude3} 
	* ...</pRE>
	*
	* @return A string representing Travel
	*/
	auto toString() const->std::string;
};