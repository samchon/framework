#include <samchon/namtree/NTFactory.hpp>

#include <samchon/library/XML.hpp>

#include <samchon/namtree/NTFile.hpp>
#include <samchon/namtree/NTCriteria.hpp>
#include <samchon/namtree/NTSide.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::namtree;

NTFactory::NTFactory(NTEntityGroup *data)
	: super()
{
	this->data = data;
}

auto NTFactory::createFile(FTFolder *folder, shared_ptr<XML> xml) -> FTFile*
{
	if (xml->getProperty(_T("extension")) == _T("ntfx"))
		return new NTFile(this, folder);
	else
		return super::createFile(folder, xml);
}
auto NTFactory::createCriteria(NTCriteria *parent, shared_ptr<XML>) -> NTCriteria*
{
	return new NTCriteria(this, parent);
}
auto NTFactory::createSide(shared_ptr<XML>) -> NTSide*
{
	return new NTSide(this);
}