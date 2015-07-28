#pragma once
#include <samchon/namtree/IFTFile.hpp>
#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace namtree
	{
		class FTFactory;

		class SAMCHON_FRAMEWORK_API FTFolder
			: public IFTFile,
			public virtual protocol::SharedEntityArray
		{
		private:
			typedef IFTFile super;

		protected:
			virtual auto TAG() const -> String;
			virtual auto CHILD_TAG() const -> String;
			
			FTFactory *factory;

		public:
			FTFolder(FTFactory*, FTFolder*);
			virtual ~FTFolder() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

		protected:
			virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::Entity*;

		public:
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(IFTFile)

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};