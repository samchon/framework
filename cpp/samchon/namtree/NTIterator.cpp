#include <samchon/namtree/NTIterator.hpp>
#	include <samchon/namtree/NTEntityGroup.hpp>

using namespace samchon::namtree;

NTIterator::NTIterator(const NTEntityGroup *data)
	: super()
{
	this->data = data;
}