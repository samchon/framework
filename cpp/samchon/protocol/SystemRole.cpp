#include <samchon/protocol/SystemRole.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::protocol;

SystemRole::SystemRole()
	: IProtocol()
{

}
auto SystemRole::hasListener(const string &name) const -> bool
{
	return listeners.has(name);
}