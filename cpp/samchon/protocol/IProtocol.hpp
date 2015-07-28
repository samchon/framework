#pragma once
#include <samchon\API.hpp>

#include <vector>
#include <memory>

namespace samchon
{
	namespace protocol
	{
		class Invoke;

		class SAMCHON_FRAMEWORK_API IProtocol
		{
		public:
			IProtocol();
			virtual ~IProtocol() = default;

			virtual void replyData(std::shared_ptr<Invoke>) = NULL;
			virtual void sendData(std::shared_ptr<Invoke>) = NULL;
// 			virtual void sendData(std::shared_ptr<Invoke>, const std::vector<unsigned char>&) = NULL;
// 			virtual void sendError(long) = NULL;
		};
	};
};