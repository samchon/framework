#pragma once

#include <samchon/protocol/EntityGroup.hpp>
#include <vector>

namespace samchon
{
	namespace protocol
	{
		typedef EntityGroup<std::vector<std::shared_ptr<Entity>>> SharedEntityArray;
	};
};

/* ------------------------------------------------------------------------------
	MACROS
------------------------------------------------------------------------------ */
//HEADER
#define SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(CHILD_TYPE) \
auto operator[](size_t) const -> std::shared_ptr<CHILD_TYPE>; \
auto at(size_t) const -> std::shared_ptr<CHILD_TYPE>; \
auto get(const std::string&) const -> std::shared_ptr<CHILD_TYPE>;

//BODY
#define SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(THIS_TYPE, CHILD_TYPE) \
auto THIS_TYPE::operator[](size_t x) const -> std::shared_ptr<CHILD_TYPE> { return std::dynamic_pointer_cast<CHILD_TYPE>(samchon::protocol::SharedEntityArray::operator[](x)); }; \
auto THIS_TYPE::at(size_t x) const -> std::shared_ptr<CHILD_TYPE> { return std::dynamic_pointer_cast<CHILD_TYPE>(samchon::protocol::SharedEntityArray::at(x)); }; \
auto THIS_TYPE::get(const std::string &key) const -> std::shared_ptr<CHILD_TYPE> { return std::dynamic_pointer_cast<CHILD_TYPE>(samchon::protocol::SharedEntityArray::get(key)); }