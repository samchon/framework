#pragma once

#include <samchon/Map.hpp>
#include <samchon/library/XML.hpp>

namespace samchon
{
	namespace library
	{
		class FTInstance;
		class FTFolder;
		class FTFile;

		/**
		 * @brief Factory for virtual files
		 */
		class FTFactory
		{
		protected:
			/**
			 * @brief Map of files
			 *
			 * @details
			 *	\li key: uid
			 *	\li value: pointer of file
			 */
			Map<int, FTInstance*> instanceMap;

		public:
			/**
			 * @brief Default Constructor
			 */
			FTFactory();
			virtual ~FTFactory() = default;

			/**
			 * @brief Factory method of file
			 */
			virtual auto createFile(FTFolder*, std::shared_ptr<XML>) -> FTFile* = 0;
		
			/**
			 * @brief Register file instance to map
			 */
			void registerInstance(FTInstance*);
		};
	};
};