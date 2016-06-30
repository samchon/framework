#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IProtocol.hpp>
#include <samchon/protocol/Socket.hpp>

namespace samchon
{
namespace protocol
{
	class SAMCHON_FRAMEWORK_API Communicator 
		: public virtual IProtocol
	{
	protected:
		std::shared_ptr<Socket> socket;
		IProtocol *listener;

	public:
		Communicator();
		virtual ~Communicator();

		virtual void listen(IProtocol *listener);

	private:
		auto listen_string(size_t) -> std::shared_ptr<Invoke>;
		void listen_binary(size_t, std::shared_ptr<Invoke> &);

	public:
		virtual void replyData(std::shared_ptr<Invoke> invoke);

		virtual void sendData(std::shared_ptr<Invoke> invoke);
	};
};
};