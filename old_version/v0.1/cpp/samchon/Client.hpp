#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <memory>
#include <mutex>

#include <samchon/IInvoke.hpp>
#include <samchon/UserClientPair.hpp>

#define KEEP_CLIENT_ALIVE auto &ucPair = __keepAlive();

namespace boost
{
	namespace asio
	{
		namespace ip
		{
			class tcp;
		};
		template <typename Protocol> class stream_socket_service;
		template <typename Protocol, typename StreamSocketService = stream_socket_service<Protocol> >
			class basic_stream_socket;
	};
};
namespace samchon
{
	using namespace std;

	template <typename T> class SmartPointer;
	template <typename C> class BasicServer;
	template <typename C> class BasicUser;
	template <typename C> class BasicService;

	template <typename C> class SAMCHON_LIBRARY_API BasicClient;
	typedef BasicClient<char> Client;
	typedef BasicClient<wchar_t> WClient;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicClient
		: public IBasicInvoke<C>
	{
	template <typename T> friend class BasicUser;

	private:
		typedef IBasicInvoke<C> super;
		
		const BasicUser<C> *user; //PARENT
		long no; //PK

		//SOCKET
		boost::asio::basic_stream_socket<boost::asio::ip::tcp> *socket;
		mutex socketMutex;

		//SERVICE
		unique_ptr<BasicService<C>> service;

	public:
		BasicClient(const BasicUser<C>*, long, void*);
		virtual ~BasicClient();

	protected:
		virtual auto BUFFER_SIZE() const -> long = NULL;
		virtual auto createService(const basic_string<C> &) const -> BasicService<C>* = NULL;

		auto __keepAlive() -> BasicUserClientPair<C>;

	public:
		//GETTERS
		auto getUser() const -> const BasicUser<C>*;
		auto getService() const -> BasicService<C>*;
		auto getNo() const -> long;

	private:
		//SOCKET
		void listen();

	public:
		virtual void replyData(shared_ptr<BasicInvoke<C>>);

		virtual void sendData(shared_ptr<BasicInvoke<C>>);
		virtual void sendData(shared_ptr<BasicInvoke<C>>, const vector<unsigned char>&);
		virtual void sendError(const long);

	protected:
		virtual void archiveReplyDataHistory(shared_ptr<BasicInvoke<C>>);

	private:
		void goService(const basic_string<C> &);
	};
};