#pragma once
#include <samchon/namtree/FTFactory.hpp>

namespace samchon
{
	namespace namtree
	{
		class NTEntityGroup;
		class NTCriteria;
		class NTSide;

		class SAMCHON_FRAMEWORK_API NTFactory
			: public FTFactory
		{
		private:
			typedef FTFactory super;

		protected:
			NTEntityGroup *data;

		public:
			NTFactory(NTEntityGroup*);
			virtual ~NTFactory() = default;

			virtual auto createFile(FTFolder*, std::shared_ptr<library::XML>) -> FTFile*;
			virtual auto createCriteria(NTCriteria*, std::shared_ptr<library::XML>) -> NTCriteria*;
			virtual auto createSide(std::shared_ptr<library::XML>) -> NTSide*;
		};
	};
};