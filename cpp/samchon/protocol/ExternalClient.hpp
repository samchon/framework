#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystem.hpp>
#include <samchon/protocol/IClient.hpp>

namespace samchon
{
	namespace protocol
	{
		class ExternalClientArray;

		class SAMCHON_FRAMEWORK_API ExternalClient
			: public virtual ExternalSystem,
			public virtual IClient
		{
			friend class ExternalClientArray;

		private:
			typedef ExternalSystem super;

		public:
			ExternalClient();
			virtual ~ExternalClient() = default;

			virtual void start() override;
		};
	};
};