#include <samchon/protocol/ISQLEntity.hpp>
#include <samchon/library/SQLStatement.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

ISQLEntity::ISQLEntity() 
{
}

void ISQLEntity::load(shared_ptr<SQLStatement>) 
{
}
void ISQLEntity::archive(shared_ptr<SQLStatement>) 
{
}

auto ISQLEntity::toSQL() const -> string
{
	return "";
}