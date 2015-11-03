#include "Travel.hpp"
#	include "GeometryPoint.hpp"

#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::tsp;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
Travel::Travel()
	: super()
{
	distance = INT_MIN;
}
Travel::Travel(const Travel &travel)
	: super(travel)
{
	distance = INT_MIN;
}
Travel::Travel(Travel &&travel)
	: super(move(travel))
{
	distance = travel.distance;
}

/* -----------------------------------------------------------
	CALCULATORS
----------------------------------------------------------- */
auto Travel::calcDistance() const -> double
{
	if(this->distance != INT_MIN)
		return this->distance;

	double distance = 0.0;
	for(size_t i = 1; i < size(); i++)
		distance += at(i-1)->calcDistance(*at(i));

	((Travel*)this)->distance = distance;
	return distance;
}
auto Travel::operator<(const Travel &travel) const -> bool
{
	return this->calcDistance() < travel.calcDistance();
}

/* -----------------------------------------------------------
	EXPORTER
----------------------------------------------------------- */
auto Travel::toString() const -> string
{
	string str =
		"Distance: " + StringUtil::numberFormat(calcDistance()) + " km\n" + 
		"uid	longitude	latitude\n";

	for(size_t i = 0; i < size(); i++)
		str += at(i)->toString() + "\n";

	return move(str);
}