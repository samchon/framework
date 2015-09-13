#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <samchon/Map.hpp>
#include <string>
#include <memory>
#include <mutex>

#include <samchon/SmartPointer.hpp>

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

	template <typename C> class BasicUser;
	template <typename C> class BasicClient;
	template <typename C> class BasicSQLi;
	template <typename C> class BasicSQLStatement;

	template <typename C> class SAMCHON_LIBRARY_API BasicServer;
	typedef BasicServer<char> Server;
	typedef BasicServer<wchar_t> WServer;

	template<typename C>
	class SAMCHON_LIBRARY_API BasicServer 
		: public Map<pair<basic_string<C>, basic_string<C>>, SmartPointer<BasicUser<C>>>
	{
	template <typename T> friend class BasicUser;

	private:
		typedef Map<pair<basic_string<C>, basic_string<C>>, SmartPointer<BasicUser<C>>> super;
		
		basic_string<C> ip;		
		mutex mtx;
	
	protected:
		virtual auto PORT() const -> long = NULL;
		unique_ptr<BasicSQLi<C>> sqli;

	public:
		BasicServer();
		virtual ~BasicServer();

	protected:
		virtual auto createUser(const pair<basic_string<C>, basic_string<C>> &ipPair) const -> BasicUser<C>* = NULL;
		
	public:
		auto getIP() const -> basic_string<C>;
		auto getSQLi() const -> BasicSQLi<C>*;

	public:
		void addClient(void*);
		void eraseUser(const pair<basic_string<C>, basic_string<C>> &);

		virtual void openServer();
		virtual void closeServer();
	};
};