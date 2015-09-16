#include <samchon/IInvoke.hpp>

namespace samchon
{
	IInvoke::IBasicInvoke() {}
	template<> IInvoke::~IBasicInvoke() {}
};