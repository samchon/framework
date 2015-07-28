#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	namespace namtree
	{
		class FTFolder;

		class SAMCHON_FRAMEWORK_API IFTFile
			: public virtual protocol::Entity
		{
		private:
			typedef protocol::Entity super;

		protected:
			virtual auto TAG() const -> String;

			FTFolder *parent;
			int uid;
			String name;
			String comment;

		public:
			IFTFile(FTFolder*);
			virtual ~IFTFile() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

			virtual auto key() const -> String;
			auto getUID() const -> int;
			auto getParent() const -> FTFolder*;
			auto getName() const -> String;
			auto getComment() const -> String;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};