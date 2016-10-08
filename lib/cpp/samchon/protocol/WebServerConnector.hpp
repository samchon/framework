#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ServerConnector.hpp>
#include <samchon/protocol/WebCommunicator.hpp>

#include <map>
#include <samchon/library/RWMutex.hpp>

namespace samchon
{
namespace protocol
{
	/**
	 * A web-server connector.
	 * 
	 * The {@link WebServerConnector} is a type of {@link WebCommunicator}, specified for connecting to remote web-server
	 * who folows web-socket protocol and taking full charge of network communication with the remot web-server.
	 * 
	 * Create an {@link WebServerConnector} instance from a {@IProtocol listener} and call the {@link connect connect()} 
	 * method. Then whenever a replied message comes from the remote system, the message will be converted to an 
	 * {@link Invoke} object and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s 
	 * {@link IProtocol.replyData IProtocol.replyData()} method. Below code is an example connecting to remote server and 
	 * interacting with it.
	 * 
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-application.ts
	 * 
	 * Note that, {@link WebServerConnector} connects to a remote web-server who follows the web-socket protocol. If the 
	 * remote server is following not web-socket protocol, but protocol of Samchon Framework's own, then use 
	 * {@link ServerConnector} instead.
	 *
	 * Protocol                | Derived Type               | Connect to
	 * ------------------------|----------------------------|-------------------
	 * Samchon Framework's own | {@link ServerConnector}    | {@link Server}
	 * Web-socket protocol     | {@link WebServerConnector} | {@link WebServer}
	 *
	 * ![Basic Components](http://samchon.github.io/framework/images/design/cpp_class_diagram/protocol_basic_components.png)
	 *
	 * @see {@link WebServer}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/CPP-Protocol-Basic_Components#serverconnector)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API WebServerConnector
		: public ServerConnector,
		public WebCommunicator
	{
	private:
		typedef ServerConnector super;

		static std::map<std::pair<std::string, int>, std::string> s_cookies;
		static library::RWMutex s_mtx;

	public:
		WebServerConnector(IProtocol *listener);
		virtual ~WebServerConnector();

		/**
		 * Connect to a web server.
		 * 
		 * Connects to a server with specified *host* address, *port* number and empty *path*. After the connection has
		 * succeeded, callback function {@link onConnect} is called. Listening data from the connected server also begins.
		 * Replied messages from the connected server will be converted to {@link Invoke} classes and will be shifted to
		 * the {@link WebCommunicator.listener listener}'s {@link IProtocol.replyData replyData()} method.
		 * 
		 * If the connection fails immediately, either an event is dispatched or an exception is thrown: an error 
		 * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise, 
		 * the status of the connection is reported by an event. If the socket is already connected, the existing 
		 * connection is closed first.
		 * 
		 * @param ip The name or IP address of the host to connect to. 
		 *			 If no host is specified, the host that is contacted is the host where the calling file resides. 
		 *			 If you do not specify a host, use an event listener to determine whether the connection was 
		 *			 successful.
		 * @param port The port number to connect to.
		 */
		virtual void connect(const std::string &ip, int port);
		
		/**
		 * Connect to a web server.
		 * 
		 * Connects to a server with specified *host* address, *port* number and *path*. After the connection has
		 * succeeded, callback function {@link onConnect} is called. Listening data from the connected server also begins.
		 * Replied messages from the connected server will be converted to {@link Invoke} classes and will be shifted to
		 * the {@link WebCommunicator.listener listener}'s {@link IProtocol.replyData replyData()} method.
		 * 
		 * If the connection fails immediately, either an event is dispatched or an exception is thrown: an error 
		 * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise, 
		 * the status of the connection is reported by an event. If the socket is already connected, the existing 
		 * connection is closed first.
		 * 
		 * @param ip The name or IP address of the host to connect to. 
		 *			 If no host is specified, the host that is contacted is the host where the calling file resides. 
		 *			 If you do not specify a host, use an event listener to determine whether the connection was 
		 *			 successful.
		 * @param port The port number to connect to.
		 * @param path Path of service which you want.
		 */
		void connect(const std::string &ip, int port, const std::string &path);

	private:
		void handshake(const std::string &ip, int port, const std::string &path);
	};
};
};