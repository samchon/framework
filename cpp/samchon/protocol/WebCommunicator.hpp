#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Communicator.hpp>

namespace samchon
{
namespace protocol
{
	class SAMCHON_FRAMEWORK_API WebCommunicator 
		: public virtual Communicator
	{
	private:
		bool is_server;

	public:
		WebCommunicator(bool is_server);
		virtual ~WebCommunicator();

		virtual void listen(IProtocol *listener) override;

		virtual void sendData(std::shared_ptr<Invoke>);

	private:
		auto listen_header() -> std::pair<unsigned char, size_t>;
		auto listen_string(size_t) -> std::shared_ptr<Invoke>;
		void listen_binary(size_t, std::shared_ptr<Invoke> &);
	};
};
};