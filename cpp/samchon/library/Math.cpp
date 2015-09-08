#include <samchon/library/Math.hpp>
#include <cmath>
#include <random>

using namespace std;
using namespace samchon;
using namespace samchon::library;

/* ========================================================
	STATIC VARIABLES
======================================================== */
const double Math::E = exp(1.0);
const double Math::PI = 3.141592653589793;

const double Math::LN2 = 1.0 / log2(E);
const double Math::LN10 = 1.0 / log10(E);
const double Math::LOG2E = log2(E);
const double Math::LOG10E = log10(E);

const double Math::SQRT1_2 = sqrt(.5);
const double Math::SQRT2 = sqrt(2.0);

/* ========================================================
	PIE
======================================================== */
auto Math::degree_to_radian(double val) -> double
{
	return val * PI / 180.0;
}
auto Math::radian_to_degree(double val) -> double
{
	return val * 180.0 / PI;
}

/* ========================================================
	RANDOM
======================================================== */
auto Math::random() -> double
{
	static random_device device;
	static uniform_real_distribution<double> distribution(0.0, 1.0);

	return distribution(device);
}