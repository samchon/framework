#pragma once
#include <samchon\API.hpp>

#include <samchon/Map.hpp>
#include <samchon/String.hpp>
#include <samchon/SmartPointer.hpp>
#include <memory>

#include <samchon/protocol/service/ServiceKeeper.hpp>

#define KEEP_USER_ALIVE auto &ucPair = __keepAlive(client);

namespace std
{
	class mutex;
};
namespace boost
{
	namespace asio
	{
		namespace ip
		{
			class tcp;
		};
		template <typename Protocol> class stream_socket_service;
		template <typename Protocol, typename StreamSocketService = stream_socket_service<Protocol>>
		class basic_stream_socket;
	};
};
namespace samchon
{
	namespace protocol
	{
		class Invoke;

		namespace service
		{
			class Server;
			class Client;

			class SAMCHON_FRAMEWORK_API User
				: public Map<long, SmartPointer<Client>>
			{
			private:
				typedef Map<long, SmartPointer<Client>> super;

			protected:
				Server *server;
				std::mutex *mtx;

				//KEY
				std::pair<String, String> ipPair; //1: IP, 2: ID OF BROWSER_GROUP
				long sequence;

				//ACCOUNT
				String id;
				long authority;

			public:
				User(Server*, const std::pair<String, String> &);
				virtual ~User();

				auto getServer() const->Server*;
				auto getIPPair() const->std::pair<String, String>;
				auto getID() const->String;
				auto getAuthority() const -> long;

			protected:
				virtual auto createClient(long, void*) const -> Client* = NULL;
				void setMember(const String&, long);

				auto __keepAlive(Client* = nullptr) -> ServiceKeeper;

				virtual auto doLogin(std::shared_ptr<Invoke>) -> bool = NULL;
				virtual auto doJoin(std::shared_ptr<Invoke>) -> bool = NULL;

			public:
				void addClient(boost::asio::basic_stream_socket<boost::asio::ip::tcp>*);
				void eraseClient(long);

				void goLogin(Client*, std::shared_ptr<Invoke>);
				void goJoin(Client*, std::shared_ptr<Invoke>);
				virtual void goLogout(Client*);
			};
		};
	};
};