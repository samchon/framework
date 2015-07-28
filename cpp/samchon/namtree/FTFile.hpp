#pragma once
#include <samchon/namtree/IFTFile.hpp>

namespace samchon
{
	namespace namtree
	{
		class SAMCHON_FRAMEWORK_API FTFile
			: public IFTFile
		{
		private:
			typedef IFTFile super;

		protected:
			String extension;

		public:
			FTFile(FTFolder*);
			virtual ~FTFile() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

			auto getExtension() const -> String;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};