#pragma once
#include <samchon\API.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API FlashPolicyServer
		{
		public:
			FlashPolicyServer();
			void openServer();

		private:
			void accept(void *);
		};
	};
};