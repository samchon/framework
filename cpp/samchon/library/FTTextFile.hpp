#pragma once
#include <samchon/library/FTFile.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Vitual text file
		 */
		class SAMCHON_FRAMEWORK_API FTTextFile
			: public FTFile
		{
		private:
			typedef protocol::Entity FTFile;

		protected:
			/**
			 * @brief Text recorded in the file
			 */
			String data;

		public:
			/**
			 * @copydoc FTFile::FTFile()
			 */
			FTTextFile(FTFolder*);
			virtual ~FTTextFile() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

			auto getData() const -> String;

			virtual auto toXML() const->std::shared_ptr<library::XML>;
		};
	};
};