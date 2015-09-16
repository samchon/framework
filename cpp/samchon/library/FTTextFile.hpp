#pragma once
#include <samchon/API.hpp>

#include <samchon/library/FTFile.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief A text file
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
			std::string data;

		public:
			/**
			 * @copydoc FTFile::FTFile()
			 */
			FTTextFile(FTFolder*);
			virtual ~FTTextFile() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

			auto getData() const -> std::string;

			virtual auto toXML() const->std::shared_ptr<library::XML>;
		};
	};
};