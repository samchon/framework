#pragma once
#include <samchon/API.hpp>

#include <samchon/Map.hpp>
#include <samchon/library/XML.hpp>

namespace samchon
{
	namespace library
	{
		class FTFolder;
		class FTFile;

		/**
		 * @brief Factory for virtual files
		 */
		class SAMCHON_FRAMEWORK_API FTFactory
		{
		protected:
			/**
			 * @brief Map of files
			 *
			 * @details
			 *	\li key: uid
			 *	\li value: pointer of file
			 */
			Map<int, FTFile*> fileMap;

		public:
			/**
			 * @brief Default Constructor
			 */
			FTFactory();
			virtual ~FTFactory() = default;

			/**
			 * @brief Factory method of file
			 */
			virtual auto createFile(FTFolder*, std::shared_ptr<XML>) -> FTFile*;
		
			/**
			 * @brief Register file instance to map
			 */
			void registerFile(FTFile*);
		};
	};
};