#include "Branch.hpp"

#include <samchon/library/Math.hpp>

using namespace std;
using namespace samchon::library;

Branch::Branch(int uid, double longitude, double latitude)
{
	this->uid = uid;

	this->longitude = longitude;
	this->latitude = latitude;
}
Branch::Branch(int uid)
	: Branch(uid, Math::random() * 100.0, Math::random() * 100.0)
{
}