#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Communicator.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API NormalCommunicator
			: public virtual Communicator
		{
		public:
			NormalCommunicator();
			virtual ~NormalCommunicator();

			virtual void listen() override;

			virtual void sendData(std::shared_ptr<Invoke>);

		private:
			auto listen_string(size_t) -> std::shared_ptr<Invoke>;
			void listen_binary(size_t, std::shared_ptr<Invoke> &);
		};
	};
};