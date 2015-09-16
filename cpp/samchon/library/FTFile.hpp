#pragma once
#include <samchon/API.hpp>

#include <samchon/library/FTInstance.hpp>

namespace samchon
{
	namespace library
	{
		/** 
		 * @brief A virtual file
		 */
		class SAMCHON_FRAMEWORK_API FTFile
			: public FTInstance
		{
		private:
			typedef FTInstance super;

		protected:
			std::string extension;

		public:
			FTFile(FTFolder*);
			virtual ~FTFile() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

			auto getExtension() const -> std::string;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};