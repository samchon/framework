#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <memory>
#include <vector>
#include <string>
#include <samchon/Map.hpp>

namespace samchon
{
	using namespace std;

	template <typename C> class SAMCHON_LIBRARY_API BasicXML;

	template<class C> using BasicXMLList = vector<shared_ptr<BasicXML<C>>>;
	template<class C> using BasicXMLListMap = Map<basic_string<C>, shared_ptr<BasicXMLList<C>>>;

	typedef BasicXML<char>				XML;
	typedef BasicXMLList<char>			XMLList;
	typedef BasicXMLListMap<char>		XMLListMap;

	typedef BasicXML<wchar_t>			WXML;
	typedef BasicXMLList<wchar_t>		WXMLList;
	typedef BasicXMLListMap<wchar_t>	WXMLListMap;

	//SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API Map<string, string>;
	//SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API Map<wstring, wstring>;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicXML :
		public BasicXMLListMap<C>
	{
	protected:
		BasicXML *parent;
		basic_string<C> key; //AS A LABEL: <tag asdf=asfds /> -> tag
		long level; //BasicXML TREE's DEPTH

		basic_string<C> value;
		Map<basic_string<C>, basic_string<C>> propertyMap;

	public:
		BasicXML();
		BasicXML(const basic_string<C> &str);
		~BasicXML();

	protected:
		//CONSTRUCTORS
		BasicXML(BasicXML<C> *, basic_string<C> &);

		void construct(basic_string<C> &);
		void constructKey(basic_string<C> &);
		void constructProperty(basic_string<C> &);
		auto constructValue(basic_string<C> &) -> bool;
		void constructChildren(basic_string<C> &);

		auto indexFilter(long value) -> long;

	public:
		void set(const basic_string<C> &, const shared_ptr<BasicXMLList<C>> &);
		void push_back(basic_string<C>&);
		void push_back(const shared_ptr<BasicXML<C>> &);

		/*
		===========================================
		Set Methods
		===========================================
		*/
		void setKey(const basic_string<C> &);
		void setValue(const basic_string<C> &val);
		auto setProperty(const basic_string<C> &, const basic_string<C> &) -> bool;

		/*
		===========================================
		Get Methods
		===========================================
		*/
		auto getParent() const -> BasicXML<C>*;
		auto getKey() const -> basic_string<C>;
		auto getLevel()	const -> long;
		auto getValue() const -> basic_string<C>;

		auto hasProperty(const basic_string<C> &) const -> bool;
		auto getProperty(const basic_string<C> &) const -> basic_string<C>;
		void eraseProperty(const basic_string<C>&);
		void clearProperty();

		auto getPropertyMap() const -> const Map<basic_string<C>, basic_string<C>>&;
		auto propertySize() const->size_t;

		auto to_string(long level = 0) const -> basic_string<C>;
	};

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicXML<char>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<XML>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API vector<shared_ptr<XML>>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<XMLList>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API Map<string, shared_ptr<XMLList>>;

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicXML<wchar_t>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<WXML>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API vector<shared_ptr<WXML>>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<WXMLList>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API Map<wstring, shared_ptr<WXMLList>>;
};