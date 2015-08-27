#pragma once
#include <samchon/protocol/IProtocol.hpp>

#include <samchon/protocol/Entity.hpp>
#include <samchon/Set.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace service
		{
			class Service;

			class SAMCHON_FRAMEWORK_API ServiceRole
				: public IProtocol
			{
			protected:
				/**
				 * @brief Related service
				 */
				Service *service;

				/**
				 * @brief The name can represent the role
				 */
				String name;

				/**
				 * @brief Listeners handled by the ServiceRole
				 */
				Set<String> listenerSet;

			public:
				/**
				 * @brief Construct from service and name
				 *
				 * @param service A service the role is belonged to
				 * @param name Name of the role
				 */
				ServiceRole(Service*, const String&);
				virtual ~ServiceRole() = default;

				virtual void sendData(std::shared_ptr<Invoke>);
			};
		};
	};
};