#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/IProtocol.hpp>

#include <samchon/Set.hpp>
#include <samchon/String.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API ISystemRole
			: public Entity,
			public virtual IProtocol
		{
		protected:
			/**
			 * @brief A name representing the role
			 */
			String name;

			/**
			 * @brief Listeners belonged to the role
			 */
			Set<String> listeners;

		public:
			/* ----------------------------------------------------
				CONSTRUCTORS
			---------------------------------------------------- */
			/**
			 * @brief Default Constructor
			 */
			ISystemRole();
			virtual ~ISystemRole();

			/*
			 * @copydoc Entity::construct()
			 */
			virtual void construct(std::shared_ptr<library::XML>);

			/* ----------------------------------------------------
				GETTERS
			---------------------------------------------------- */
			virtual auto key() const -> String;
			
			/**
			 * @brief Test whether to have the listener in the role
			 */
			auto hasListener(const String & const) -> bool;

			/* ----------------------------------------------------
				EXPORTERS
			---------------------------------------------------- */
			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};