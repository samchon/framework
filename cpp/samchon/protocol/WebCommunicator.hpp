#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Communicator.hpp>

namespace samchon
{
namespace protocol
{
	/**
	 * A communicator following Web-socket protocol.
	 * 
	 * {@link WebCommunicator} is an abstract class who takes full charge of network communication with remote system, 
	 * following Web-socket protocol. Type of the {@link WebCommunicator} is specified to {@link WebServerConnector} and 
	 * {@link WebClientDriver} whether the remote system is a server (that my system is connecting to) or a client (a client 
	 * conneting to to my server).
	 *
	 * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
	 * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
	 * {@link IProtocol.replyData IProtocol.replyData()} method.
	 * 
	 * Note that, one of this or remote system is web-browser based, then there's not any alternative choice. Web browser
	 * supports only Web-socket protocol. In that case, you've use a type of this {@link WebCommunicator} class.
	 * 
	 * ![Basic Components](http://samchon.github.io/framework/images/design/cpp_class_diagram/protocol_basic_components.png)
	 *
	 * @see {@link WebClientDriver}, {@link WebServerConnector}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/CPP-Protocol-Basic_Components#icommunicator)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API WebCommunicator 
		: public virtual Communicator
	{
	private:
		bool is_server;

	public:
		WebCommunicator(bool is_server);
		virtual ~WebCommunicator();

		virtual void sendData(std::shared_ptr<Invoke>);

	protected:
		virtual void listen_message() override;

	private:
		auto listen_header() -> std::pair<unsigned char, size_t>;
		auto listen_string(size_t) -> std::shared_ptr<Invoke>;
		void listen_binary(size_t, std::shared_ptr<InvokeParameter>);
	};
};
};