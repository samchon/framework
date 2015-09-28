#pragma once
#include <samchon/API.hpp>

#include <samchon/library/FTInstance.hpp>
#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace library
	{
		class FTFactory;

		/**
		 * @brief A folder
		 * @details A folder object has recursive and hierarchical relationship.
		 *
		 * @image html cpp/library_file_tree.png
		 * @image latex cpp/library_file_tree.png
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API FTFolder
			: public FTInstance,
			public virtual protocol::SharedEntityArray
		{
		private:
			typedef FTInstance super;

		protected:
			virtual auto TAG() const -> std::string override;
			virtual auto CHILD_TAG() const -> std::string override;
			
			/**
			 * @brief Factory instance for creating sub files
			 */
			FTFactory *factory;

		public:
			/**
			 * @brief Construct from factory and parent folder
			 *
			 * @param factory Factory instance
			 * @param parent Parent folder that this folder is belonged to
			 */
			FTFolder(FTFactory*, FTFolder*);
			virtual ~FTFolder() = default;

			virtual void construct(std::shared_ptr<library::XML> xml) override;

		protected:
			virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::Entity* override;

		public:
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(FTInstance)

			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};