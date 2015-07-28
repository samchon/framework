#pragma once
#include <samchon/API.hpp>

#include <samchon/library/XML.hpp>

namespace samchon
{
	template <typename K, typename T, typename O = std::less<K>, typename Alloc = std::allocator<std::pair<const K, T>>>
	class Map;

	namespace namtree
	{
		class IFTFile;
		class FTFolder;
		class FTFile;

		class SAMCHON_FRAMEWORK_API FTFactory
		{
		protected:
			FTFolder *topFolder;
			Map<int, IFTFile*> *fileMap;

		public:
			FTFactory();
			virtual ~FTFactory() = default;

			virtual auto createFile(FTFolder*, std::shared_ptr<library::XML>) -> FTFile*;
		
			void registerFile(IFTFile*);
		};
	};
};