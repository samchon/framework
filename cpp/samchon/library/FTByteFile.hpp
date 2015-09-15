#pragma once
#include <samchon/library/FTFile.hpp>

#include <samchon/ByteArray.hpp>

namespace samchon
{
	namespace library
	{
		/** 
		 * @brief A binary file
		 */
		class  FTByteFile
			: public FTFile
		{
		private:
			typedef protocol::Entity FTFile;

		protected:
			/**
			 * @brief Binary data of the file
			 */
			ByteArray data;

		public:
			/**
			 * @copydoc FTFile::FTfile()
			 */
			FTByteFile(FTFolder*);
			virtual ~FTByteFile() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

			auto getData() const -> ByteArray;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};