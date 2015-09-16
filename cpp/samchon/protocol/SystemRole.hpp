#pragma once
#include <samchon/protocol/IProtocol.hpp>

#include <samchon/Set.hpp>
#include <string>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API SystemRole
			: public virtual IProtocol
		{
		protected:
			/**
			 * @brief A name representing the role
			 */
			std::string name;

			/**
			 * @brief Listeners belongs to the role
			 */
			Set<std::string> listeners;

		public:
			/* ----------------------------------------------------
				CONSTRUCTORS
			---------------------------------------------------- */
			/**
			 * @brief Default Constructor
			 */
			SystemRole();
			virtual ~SystemRole() = default;

			/* ----------------------------------------------------
				GETTERS
			---------------------------------------------------- */
			/**
			 * @brief Test whether to have the listener in the role
			 */
			auto hasListener(const std::string &) const -> bool;
		};
	};
};