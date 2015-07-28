#include <samchon/String.hpp>

#ifdef _UNICODE
#	define STD_TO_STRING(X) std::to_wstring(X)
#else
#	define STD_TO_STRING(X) std::to_string(X)
#endif

auto samchon::toString(int val) -> samchon::String
{
	return STD_TO_STRING(val);
}
auto samchon::toString(unsigned int val) -> samchon::String
{
	return STD_TO_STRING(val);
}
auto samchon::toString(long val) -> samchon::String
{
	return STD_TO_STRING(val);
}
auto samchon::toString(unsigned long val) -> samchon::String
{
	return STD_TO_STRING(val);
}
auto samchon::toString(long long val) -> samchon::String
{
	return STD_TO_STRING(val);
}
auto samchon::toString(unsigned long long val) -> samchon::String
{
	return STD_TO_STRING(val);
}
auto samchon::toString(long double val) -> samchon::String
{
	return STD_TO_STRING(val);
}
auto samchon::toString(double val) -> samchon::String
{
	return STD_TO_STRING(val);
}
auto samchon::toString(float val) -> samchon::String
{
	return STD_TO_STRING(val);
}