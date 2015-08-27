#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	namespace library
	{
		class FTFolder;

		/**
		 * @brief Interface of virtual file instances
		 */
		class SAMCHON_FRAMEWORK_API IFTFile
			: public virtual protocol::Entity
		{
		private:
			typedef protocol::Entity super;

		protected:
			virtual auto TAG() const -> String;

			/**
			 * @brief Parent folder containing the instance
			 */
			FTFolder *parent;

			/**
			 * @brief Key, an unique id of file
			 */
			int uid;
			
			/**
			 * @brief File name
			 */
			String name;

			/**
			 * @brief Comment of file
			 */
			String comment;

		public:
			/**
			 * @brief Construct from parent folder
			 */
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