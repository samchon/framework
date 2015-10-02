#include <samchon/protocol/master/DistributedSystemArray.hpp>
#	include <samchon/protocol/master/DistributedSystem.hpp>
#	include <samchon/protocol/master/DistributedSystemRole.hpp>

#include <samchon/IndexPair.hpp>
#include <samchon/library/Math.hpp>
#include <samchon/library/XML.hpp>
#include <samchon/library/CombinedPermutation.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

DistributedSystemArray::DistributedSystemArray(IProtocol *parent)
	: super(parent)
{
	this->parent = parent;
}

SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(DistributedSystemArray, DistributedSystem)

void DistributedSystemArray::distributeRoles()
{
	CombinedPermutation caseGen(roleMap.size(), size());
	IndexPair<double> minIndexPair;

	for (size_t i = 0; i < caseGen.size(); i++)
	{
		vector<size_t> &row = caseGen[i];
		vector<double> saturationArray(size(), 0.0);

		double variance = 0.0;
		if (variance < minIndexPair.getValue())
			minIndexPair = { i, variance };
	}

	for (size_t i = 0; i < size(); i++)
		at(i)->clear();

	vector<size_t> &row = caseGen[ minIndexPair.getIndex() ];
}