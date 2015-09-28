#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
	namespace protocol
	{
		class ExternalSystemRole;

		class SAMCHON_FRAMEWORK_API ExternalSystem
			: public virtual SharedEntityArray,
			public virtual IProtocol
		{
		protected:
			typedef SharedEntityArray super;
			
			std::string name;
			std::string ip;
			int port;

		public:
			/* ------------------------------------------------------------------
				CONSTRUCTORS
			------------------------------------------------------------------ */
			/**
			* @brief Construct from parent
			*
			* @param systemArray Parent manager
			*/
			ExternalSystem();
			virtual ~ExternalSystem() = default;

			virtual void construct(std::shared_ptr<library::XML>) override;

			virtual void start() = 0;

			/* ------------------------------------------------------------------
				GETTERS
			------------------------------------------------------------------ */
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ExternalSystemRole)

			virtual auto key() const -> std::string override;

			/* ------------------------------------------------------------------
				CHAIN OF INVOKE MESSAGE
			------------------------------------------------------------------ */
			/**
			* @brief Handling replied message from an external system
			*
			* @param invoke Replied invoke message
			*/
			virtual void replyData(std::shared_ptr<Invoke>) override;
			
		public:
			/* ------------------------------------------------------------------
				EXPORTERS
			------------------------------------------------------------------ */
			virtual auto TAG() const -> std::string override;
			virtual auto CHILD_TAG() const -> std::string override;

			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};