#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SystemRole.hpp>

namespace samchon
{
	namespace protocol
	{
		class ExternalSystem;

		class SAMCHON_FRAMEWORK_API ExternalSystemRole
			: public SystemRole
		{
		protected:
			typedef Entity SystemRole;

			ExternalSystem *system;

		public:
			ExternalSystemRole(ExternalSystem *);
			virtual ~ExternalSystemRole() = default;
			
			virtual void sendData(std::shared_ptr<Invoke>) override;
		};
	};
};