#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Server.hpp>

namespace samchon
{
namespace protocol
{
	/**
	 * A web server.
	 *
	 * The {@link WebServer} is an abstract class providing methods for {@link open opening a web-server} and
	 * {@link WebClientDriver accepting web-clients}. The web-server opened by this {@link WebServer} class follows the 
	 * protocol of web-socket.
	 * 
	 * To open a web-server, extends the {@link WebServer} class and overrides {@link addClient addClient()} methods to 
	 * define what to do with a newly conneted {@link WebClientDriver remote web-clietns}. At last, call {@link open open()}
	 * method with the specified port number.
	 *
	 * Below codes and classes will be good examples for comprehending how to open a server and handle remote clients.
	 *
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
	 * - {@link service::Server}
	 * - {@link external::ExternalClientArray}
	 * - {@link slave::SlaveServer}
	 *
	 * Note that, this {@link WebServer} class follows the web-socket protocol, not Samchon Framework's own protocol. If you
	 * want to open a server following the protocol of Samchon Framework's own, then extends {@link Server} instead.
	 *
	 * Protocol                | Derived Type      | Related {@link ClientDriver}
	 * ------------------------|-------------------|------------------------------
	 * Samchon Framework's own | {@link Server}    | {@link ClientDriver}
	 * Web-socket protocol     | {@link WebServer} | {@link WebClientDriver}
	 *
	 * ![Basic Components](http://samchon.github.io/framework/images/design/cpp_class_diagram/protocol_basic_components.png)
	 *
	 * @see {@link WebClientDriver}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/CPP-Protocol-Basic_Components#server)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API WebServer 
		: public virtual Server
	{
	private:
		typedef Server super;

		size_t sequence;

	public:
		/**
		 * Default Constructor.
		 */
		WebServer();
		virtual ~WebServer();

	private:
		virtual void handle_connection(std::shared_ptr<Socket> socket) override;
		
		auto issue_session_id() -> std::string;
	};
};
};