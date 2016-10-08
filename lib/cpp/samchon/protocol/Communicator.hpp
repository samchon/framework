#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IProtocol.hpp>
#include <samchon/protocol/Socket.hpp>

#include <mutex>

namespace samchon
{
namespace protocol
{
	/**
	 * A communicator.
	 * 
	 * The {@link Communicator} is an abstract class who take full charge of network communication with remote system, without 
	 * reference to whether the remote system is a server or a client. Type of the {@link Communicator} is specified to 
	 * {@link ServerConnector} and {@link ClientDriver} whether the remote system is a server (that I've to connect) or a 
	 * client (a client connected to my server).
	 *
	 * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
	 * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
	 * {@link IProtocol.replyData IProtocol.replyData()} method.
	 *
	 * Note that, if one of this or remote system is web-browser based, then you don't have to use this {@link Communicator} 
	 * class who follows the Samchon Framework's own protocol. Web-browser supports only Web-socket protocol. Thus in that 
	 * case, you have to use {@link WebCommunicator} instead.
	 *
	 * ![Basic Components](http://samchon.github.io/framework/images/design/cpp_class_diagram/protocol_basic_components.png)
	 *
	 * @see {@link ClientDriver}, {@link ServerConnector}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/CPP-Protocol-Basic_Components#communicator)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API Communicator 
		: public virtual IProtocol
	{
	protected:
		std::shared_ptr<Socket> socket;
		IProtocol *listener;

		std::mutex send_mtx;

	public:
		Communicator();
		virtual ~Communicator();

		/**
		 * Close connection.
		 */
		virtual void close();

	protected:
		virtual void listen_message();

	private:
		auto listen_size() const -> size_t;
		auto listen_string(size_t) -> std::shared_ptr<Invoke>;
		void listen_binary(size_t, std::shared_ptr<InvokeParameter>);

	public:
		/** 
		 * Handle replied message.
		 * 
		 * Handles replied {@link Invoke} message recived from remove system. The {@link Invoke} message will be shifted to 
		 * the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} by this method.
		 *
		 * @param invoke An {@link Invoke} message received from remote system.
		 */
		virtual void replyData(std::shared_ptr<Invoke> invoke);

		/**
		 * Send message.
		 * 
		 * Send the {@link Invoke} message to remote system.
		 *
		 * @param invoke An {@link Invoke} message to send.
		 */
		virtual void sendData(std::shared_ptr<Invoke> invoke);
	};
};
};