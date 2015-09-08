#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	namespace library
	{
		class FTFolder;

		/**
		 * @brief Interface of virtual folder and file
		 *
		 * @author Jeongho Nam
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
			 * @brief Name of the file
			 */
			String name;

			/**
			 * @brief Comment of the file
			 */
			String comment;

		public:
			/* ========================================================
				CONSTRUCTORS
			======================================================== */
			/**
			 * @brief Construct from parent folder
			 *
			 * @param parent Parent folder that this instance is belonged to
			 */
			IFTFile(FTFolder*);
			virtual ~IFTFile() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

			/* ========================================================
				GETTERS
			======================================================== */
			virtual auto key() const -> String;

			/**
			 * @brief Get uid
			 */
			auto getUID() const -> int;

			/**
			 * @brief Get parent folder
			 */
			auto getParent() const -> FTFolder*;

			/**
			 * @brief Get name
			 */
			auto getName() const -> String;

			/**
			 * @brief Get comment
			 */
			auto getComment() const -> String;


			/* ========================================================
				EXPORTER
			======================================================== */
			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};