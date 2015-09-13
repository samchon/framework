#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <vector>
#include <memory>
#include <samchon/Invoke.hpp>

namespace samchon
{
	using namespace std;

	template <typename C> class SAMCHON_LIBRARY_API BasicInvokeIF;
	typedef BasicInvokeIF<char> InvokeIF;
	typedef BasicInvokeIF<wchar_t> WInvokeIF;
	
	template <typename C>
	class SAMCHON_LIBRARY_API BasicInvokeIF
	{
	public:
		BasicInvokeIF();
		virtual ~BasicInvokeIF();

		virtual void sendData(shared_ptr<BasicInvoke<C>>) = NULL;
		virtual void sendData(shared_ptr<BasicInvoke<C>>, const vector<unsigned char>&) = NULL;
		virtual void replyData(shared_ptr<BasicInvoke<C>>) = NULL;
	};
};