#include "GeometryPoint.hpp"

#include <random>
#include <cmath>
#include <samchon/library/Math.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::tsp;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
GeometryPoint::GeometryPoint(int uid)
{
	this->uid = uid;
	this->longitude = Math::random() * 180.0;
	this->latitude = Math::random() * 180 - 90.0;
}
GeometryPoint::GeometryPoint(int uid, double longitude, double latitude)
{
	this->uid = uid;
	this->longitude = longitude;
	this->latitude = latitude;
}

/* -----------------------------------------------------------
	CALCULATOR
----------------------------------------------------------- */
auto GeometryPoint::calcDistance(const GeometryPoint &point) const -> double
{
	if (longitude == point.longitude && latitude == point.latitude)
		return 0.0;

	double latitude_radian1 = Math::degree_to_radian(this->latitude);
	double latitude_radian2 = Math::degree_to_radian(point.latitude);
	double theta = this->longitude - point.longitude;

	double val =
		sin(latitude_radian1) * sin(latitude_radian2)
		+ cos(latitude_radian1) * cos(latitude_radian2) * cos(Math::degree_to_radian(theta));

	val = acos(val);
	val = Math::radian_to_degree(val);
	val = val * 60 * 1.1515;
	val = val * 1.609344;

	return val;
}

/* -----------------------------------------------------------
	EXPORTER
----------------------------------------------------------- */
auto GeometryPoint::toString() const -> string
{
	return StringUtil::substitute
		(
			"{1}\t{2}\t{3}",
			uid, longitude, latitude
		);
}