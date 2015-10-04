#include <samchon/protocol/IHTMLEntity.hpp>

#include <samchon/WeakString.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::protocol;

IHTMLEntity::IHTMLEntity()
{
}
template<> auto IHTMLEntity::toTD(const WeakString &wstr) -> string
{
	return toTD(wstr.str());
}