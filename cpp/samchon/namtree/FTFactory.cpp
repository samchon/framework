#include <samchon/namtree/FTFactory.hpp>

#include <samchon/Map.hpp>
#include <samchon/library/XML.hpp>

#include <samchon/namtree/FTFile.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::namtree;

FTFactory::FTFactory()
{
	fileMap = new Map<int, IFTFile*>();
}

auto FTFactory::createFile(FTFolder *folder, shared_ptr<XML> xml) -> FTFile*
{
	return new FTFile(folder);
}

void samchon::namtree::FTFactory::registerFile(IFTFile *file)
{
	fileMap->set(file->getUID(), file);
}
