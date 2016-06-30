#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystemArrayServer.hpp>
#include <samchon/protocol/WebServer.hpp>

namespace samchon
{
namespace protocol
{
	class ExternalSystemArrayWebServer
		: public ExternalSystemArrayServer,
		public virtual WebServer
	{
	public:
		ExternalSystemArrayWebServer(ExternalSystemArray *systemArray)
			: WebServer(), 
			ExternalSystemArrayServer(systemArray)
		{
		};

		virtual ~ExternalSystemArrayWebServer()
		{
		};
	};
};
};