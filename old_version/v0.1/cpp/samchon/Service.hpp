#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <samchon/IInvoke.hpp>
#include <samchon/UserClientPair.hpp>

#define KEEP_SERVICE_ALIVE auto &ucPair = __keepAlive();

namespace samchon
{
	using namespace std;

	template <typename C> class BasicClient;
	template <typename C> class BasicSQLi;
	template <typename C> class BasicXML;

	template <typename C> class SAMCHON_LIBRARY_API BasicService;
	typedef BasicService<char> Service;
	typedef BasicService<wchar_t> WService;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicService 
		: public IBasicInvoke<C>
	{
	private:
		typedef IBasicInvoke<C> super;

	public:
		virtual auto ID() const -> long = NULL;

	protected:
		const BasicClient<C> *client;

	public:
		BasicService(const BasicClient<C> *);
		virtual ~BasicService();

		virtual auto REQUIRE_AUTHORITY() const -> long = NULL;
		auto getClient() const -> const BasicClient<C>*;
		virtual auto getSQLi() const -> BasicSQLi<C>*;

	protected:
		auto __keepAlive() -> BasicUserClientPair<C>;

	public:
		virtual void replyData(shared_ptr<BasicInvoke<C>>) = NULL;

		virtual void sendData(shared_ptr<BasicInvoke<C>>);
		virtual void sendData(shared_ptr<BasicInvoke<C>>, const vector<unsigned char>&);
		virtual void sendError(const long);
	};
};