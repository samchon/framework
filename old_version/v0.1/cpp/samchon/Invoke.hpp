#pragma once

#include <string>
#include <memory>

#include <samchon/SamchonLibrary.hpp>
#include <samchon/VectorMap.hpp>
#include <samchon/InvokeParameter.hpp>

namespace samchon
{
	using namespace std;

	template<typename C> class BasicXML;
	template<typename C> class BasicInvokeParameter;

	template<typename C> class SAMCHON_LIBRARY_API BasicInvoke;
	typedef BasicInvoke<char> Invoke;
	typedef BasicInvoke<wchar_t> WInvoke;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicInvoke
		: public BasicVectorDict<C, BasicInvokeParameter<C>>
	{
	protected:
		basic_string<C> listener;

	public:
		BasicInvoke(const basic_string<C> &listener);
		BasicInvoke(shared_ptr<BasicXML<C>> xml);
		
		auto getListener() const -> basic_string<C>;

		void add(const basic_string<C> &name, const basic_string<C> &type, const basic_string<C> &val);
		void add(const basic_string<C> &name, shared_ptr<BasicXML<C>> xml);

		auto toXML() const -> shared_ptr<BasicXML<C>>;
		auto toSQL() const -> basic_string<C>;
	};

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicInvoke<char>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<Invoke>;

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicInvoke<wchar_t>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<WInvoke>;
};