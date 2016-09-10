#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Server.hpp>

namespace samchon
{
namespace protocol
{
	class SAMCHON_FRAMEWORK_API WebServer 
		: public virtual Server
	{
	private:
		typedef Server super;

		size_t sequence;

	public:
		WebServer();
		virtual ~WebServer();

	private:
		virtual void handle_connection(std::shared_ptr<Socket> socket) override;
		
		auto issue_session_id() -> std::string;
	};
};
};