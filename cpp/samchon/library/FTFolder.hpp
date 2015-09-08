#pragma once
#include <samchon/library/IFTFile.hpp>
#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace library
	{
		class FTFactory;

		/**
		 * @brief A virtual folder
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API FTFolder
			: public IFTFile,
			public virtual protocol::SharedEntityArray
		{
		private:
			typedef IFTFile super;

		protected:
			virtual auto TAG() const -> String;
			virtual auto CHILD_TAG() const -> String;
			
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

			virtual void construct(std::shared_ptr<library::XML> xml);

		protected:
			virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::Entity*;

		public:
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(IFTFile)

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};