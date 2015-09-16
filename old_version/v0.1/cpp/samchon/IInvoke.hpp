#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <vector>
#include <memory>
#include <samchon/Invoke.hpp>

namespace samchon
{
	using namespace std;

	template <typename C> class SAMCHON_LIBRARY_API IBasicInvoke;
	typedef IBasicInvoke<char> IInvoke;
	typedef IBasicInvoke<wchar_t> IWInvoke;
	
	template <typename C>
	class SAMCHON_LIBRARY_API IBasicInvoke
	{
	public:
		IBasicInvoke();
		virtual ~IBasicInvoke();

		virtual void replyData(shared_ptr<BasicInvoke<C>>) = NULL;
		virtual void sendData(shared_ptr<BasicInvoke<C>>) = NULL;
		virtual void sendData(shared_ptr<BasicInvoke<C>>, const vector<unsigned char>&) = NULL;
		virtual void sendError(long) = NULL;
	};
};