#pragma once
#include <samchon/protocol/IServerConnector.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>

namespace std
{
	template <typename _Ty> struct atomic;
	class condition_variable;
	class mutex;
};
namespace boost
{
	namespace asio
	{
		namespace ip
		{
			class tcp;
			template <typename InternetProtocol> class basic_endpoint;
		};
		class io_service;

		template <typename Protocol> class stream_socket_service;
		template <typename Protocol, typename StreamSocketService = stream_socket_service<Protocol>>
		class basic_stream_socket;
	};
};
namespace samchon
{
	namespace protocol
	{
		class ExternalServerArray;
		class ExternalServerRole;

		class SAMCHON_PROTOCOL_API ExternalServer 
			: public virtual SharedEntityArray,
			public virtual IServerConnector
		{
		private:
			typedef SharedEntityArray super;
			
		public:
			virtual auto TAG() const -> String;
			virtual auto CHILD_TAG() const -> String;
			virtual auto key() const -> String;

		protected:
			ExternalServerArray *externalServerArray;
			String name;
			String ip;
			int port;
			String myIP;

			virtual auto IP() const -> String;
			virtual auto PORT() const -> int;
			virtual auto MY_IP() const -> String;

		public:
			ExternalServer(ExternalServerArray* = nullptr);
			virtual ~ExternalServer() = default;
			virtual void construct(std::shared_ptr<library::XML> xml);

			//GETTERS
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ExternalServerRole);
			auto getName() const -> String;
			virtual auto getIP() const -> String;
			virtual auto getPort() const -> int;

			//XML AND INVOKE
			virtual void replyData(std::shared_ptr<Invoke>);
			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};