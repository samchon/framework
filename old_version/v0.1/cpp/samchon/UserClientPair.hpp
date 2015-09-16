#pragma once
#include <samchon/SamchonLibrary.hpp>
#include <samchon/SmartPointer.hpp>

namespace samchon
{
	template<typename C> class BasicUser;
	template<typename C> class BasicClient;
	template<typename T> class SmartPointer;

	template<typename C> class SAMCHON_LIBRARY_API BasicUserClientPair;
	typedef BasicUserClientPair<char> UserClientPair;
	typedef BasicUserClientPair<wchar_t> WUserClientPair;

	template<typename C> class SAMCHON_LIBRARY_API BasicUserClientPair
	{
	private:
		SmartPointer<BasicUser<C>> user;
		SmartPointer<BasicClient<C>> client;

	public:
		BasicUserClientPair(BasicUser<C> *user, BasicClient<C> *client);
		BasicUserClientPair(const BasicUserClientPair&);
		BasicUserClientPair(BasicUserClientPair&&);
	};
};