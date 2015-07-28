#pragma once
#include <samchon\API.hpp>

#include <samchon/String.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API ISocket
		{
		protected:
			virtual auto MY_IP() const -> String;
			virtual auto PORT() const -> int = NULL;

		public:
			ISocket();
			virtual ~ISocket() = default;

			virtual void start() = NULL;
		};
	};
};