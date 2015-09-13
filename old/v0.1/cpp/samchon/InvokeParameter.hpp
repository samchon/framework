#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <memory>
#include <string>

namespace samchon
{
	using namespace std;

	template<typename C> class BasicXML;

	template<typename C> class SAMCHON_LIBRARY_API BasicInvokeParameter;
	typedef BasicInvokeParameter<char> InvokeParameter;
	typedef BasicInvokeParameter<wchar_t> WInvokeParameter;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicInvokeParameter
	{
	public:
		auto key() const -> basic_string<C>;

	protected:
		basic_string<C> name;
		basic_string<C> type;
		basic_string<C> value;
		shared_ptr<BasicXML<C>> xml;

	public:
		BasicInvokeParameter(const basic_string<C> &, const basic_string<C> &, const basic_string<C> &);
		BasicInvokeParameter(const basic_string<C> &, shared_ptr<BasicXML<C>>);
		BasicInvokeParameter(shared_ptr<BasicXML<C>>);
		
		auto getName() const -> basic_string<C>;
		auto getType() const -> basic_string<C>;
		auto getValue() const -> basic_string<C>;
		auto getXML() const -> shared_ptr<BasicXML<C>>;

		auto toXML() const -> shared_ptr<BasicXML<C>>;
		auto toSQL() const -> basic_string<C>;
	};

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicInvokeParameter<char>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<InvokeParameter>;

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicInvokeParameter<wchar_t>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<WInvokeParameter>;
};