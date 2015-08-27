#pragma once
#include <samchon/library/FTFactory.hpp>

namespace samchon
{
	namespace namtree
	{
		class NTEntityGroup;
		class NTCriteria;
		class NTSide;

		/** 
		 * Factory for Nam-Tree files
		 */
		class SAMCHON_FRAMEWORK_API NTFactory
			: public library::FTFactory
		{
		private:
			typedef library::FTFactory super;

		protected:
			NTEntityGroup *data;

		public:
			/**
			 * @brief Construct from historical(studying) data
			 */
			NTFactory(NTEntityGroup*);
			virtual ~NTFactory() = default;

			virtual auto createFile(library::FTFolder*, std::shared_ptr<library::XML>) -> library::FTFile*;
			virtual auto createCriteria(NTCriteria*, std::shared_ptr<library::XML>) -> NTCriteria*;
			virtual auto createSide(std::shared_ptr<library::XML>) -> NTSide*;
		};
	};
};