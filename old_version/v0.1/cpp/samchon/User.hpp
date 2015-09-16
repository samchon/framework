#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <samchon/Map.hpp>
#include <memory>
#include <samchon/SmartPointer.hpp>

#include <samchon/UserClientPair.hpp>

#define KEEP_USER_ALIVE auto &ucPair = __keepAlive(client);

namespace samchon
{
	using namespace std;

	template<typename C> class BasicServer;
	template<typename C> class BasicClient;
	template<typename C> class BasicInvoke;

	template<typename C> class SAMCHON_LIBRARY_API BasicUser;
	typedef BasicUser<char> User;
	typedef BasicUser<wchar_t> WUser;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicUser : 
		public Map<long, SmartPointer<BasicClient<C>>>
	{
	private:
		typedef Map<long, SmartPointer<BasicClient<C>>> super;

	private:
		const BasicServer<C> *server;
		mutex mtx;

		//KEY
		pair<basic_string<C>, basic_string<C>> ipPair; //1: IP, 2: ID OF BROWSER_GROUP
		long sequence;

		//ACCOUNT
		basic_string<C> id;
		long authority;

	public:
		BasicUser(const BasicServer<C> *, const pair<basic_string<C>, basic_string<C>> &);
		virtual ~BasicUser();

		auto getServer() const -> const BasicServer<C>*;
		auto getIPPair() const -> pair<basic_string<C>, basic_string<C>>;
		auto getID() const -> basic_string<C>;
		auto getAuthority() const -> long;

	protected:
		virtual auto createClient(long, void*) const -> BasicClient<C>* = NULL;
		void setMember(const basic_string<C>&, long);

		auto __keepAlive(BasicClient<C>* = nullptr) -> BasicUserClientPair<C>;

		virtual auto doLogin(shared_ptr<BasicInvoke<C>>) -> bool = NULL;
		virtual auto doJoin(shared_ptr<BasicInvoke<C>>) -> bool = NULL;

	public:
		void addClient(void *socket);
		void eraseClient(long);

	public:
		void goLogin(BasicClient<C>*, shared_ptr<BasicInvoke<C>>);
		void goJoin(BasicClient<C>*, shared_ptr<BasicInvoke<C>>);
		virtual void goLogout(BasicClient<C>*);
	};
};