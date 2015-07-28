#pragma once
#include <samchon/namtree/FTFile.hpp>

namespace samchon
{
	namespace namtree
	{
		class SAMCHON_FRAMEWORK_API FTTextFile
			: public FTFile
		{
		private:
			typedef protocol::Entity FTFile;

		protected:
			String text;

		public:
			FTTextFile(FTFolder*);
			virtual ~FTTextFile() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

			auto getText() const -> String;

			virtual auto toXML() const->std::shared_ptr<library::XML>;
		};
	};
};