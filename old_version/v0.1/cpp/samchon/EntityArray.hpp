#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <string>
#include <samchon/Entity.hpp>
#include <samchon/VectorMap.hpp>

namespace samchon
{
	using namespace std;

	template <typename C> class SAMCHON_LIBRARY_API BasicEntityArray;
	typedef BasicEntityArray<char> EntityArray;
	typedef BasicEntityArray<wchar_t> WEntityArray;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicEntityArray
		: public virtual BasicEntity<C>, public virtual BasicVectorDict<C, BasicEntity<C>>
	{
	protected:
		virtual auto tag() const -> basic_string<C> = NULL;
		virtual auto child_tag() const -> basic_string<C> = NULL;

		virtual auto createChild() -> BasicEntity<C>* = NULL;

	public:
		BasicEntityArray();
		virtual void construct(shared_ptr<BasicXML<C>> xml);

		virtual auto toXML() const -> shared_ptr<BasicXML<C>>;

	private:
		auto isEmpty(shared_ptr<BasicXML<C>>) const -> bool;
	};

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicEntityArray<char>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<EntityArray>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API VectorMap<string, Entity>;

	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API BasicEntityArray<wchar_t>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API shared_ptr<WEntityArray>;
	SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API VectorMap<wstring, WEntity>;
};

/* ------------------------------------------------------------------------------
	BASIC_ENTITY_ARRAY<CHAR>
	------------------------------------------------------------------------------ */
//HEADER
#define ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER \
auto at(size_t x) const -> shared_ptr<CHILD_TYPE>;\
auto get(const string &key) const -> shared_ptr<CHILD_TYPE>;\

//BODY
#define ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(THIS_TYPE) \
auto THIS_TYPE::at(size_t x) const -> shared_ptr<CHILD_TYPE> { return dynamic_pointer_cast<CHILD_TYPE>(EntityArray::at(x)); };\
auto THIS_TYPE::get(const string &key) const -> shared_ptr<CHILD_TYPE> { return dynamic_pointer_cast<CHILD_TYPE>(EntityArray::get(key)); }\

//INLINE
#define ENTITY_ARRAY_ELEMENT_ACCESSOR_INLINE \
inline auto at(size_t x) const -> shared_ptr<CHILD_TYPE> { return dynamic_pointer_cast<CHILD_TYPE>(EntityArray::at(x)); };\
inline auto get(const string &key) const -> shared_ptr<CHILD_TYPE> { return dynamic_pointer_cast<CHILD_TYPE>(EntityArray::get(key)); };\

/* ------------------------------------------------------------------------------
	BASIC_ENTITY_ARRAY<WCHAR_T>
------------------------------------------------------------------------------ */
//HEADER
#define WENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER \
auto at(size_t x) const -> shared_ptr<CHILD_TYPE>;\
auto get(const wstring &key) const -> shared_ptr<CHILD_TYPE>;\

//BODY
#define WENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(THIS_TYPE) \
auto THIS_TYPE::at(size_t x) const -> shared_ptr<CHILD_TYPE> { return dynamic_pointer_cast<CHILD_TYPE>(WEntityArray::at(x)); };\
auto THIS_TYPE::get(const wstring &key) const -> shared_ptr<CHILD_TYPE> { return dynamic_pointer_cast<CHILD_TYPE>(WEntityArray::get(key)); };\

//INLINE
#define WENTITY_ARRAY_ELEMENT_ACCESSOR_INLINE \
inline auto at(size_t x) const -> shared_ptr<CHILD_TYPE> { return dynamic_pointer_cast<CHILD_TYPE>(WEntityArray::at(x)); };\
inline auto get(const wstring &key) const -> shared_ptr<CHILD_TYPE> { return dynamic_pointer_cast<CHILD_TYPE>(WEntityArray::get(key)); };\
//