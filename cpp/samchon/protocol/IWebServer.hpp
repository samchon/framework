#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IServer.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API IWebServer
			: public virtual IServer
		{
		protected:
			typedef IServer super;

		public:
			IWebServer();
			virtual ~IWebServer() = default;

			virtual void open() override;
		};
	};
};