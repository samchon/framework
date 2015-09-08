#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/EntityGroup.hpp>
#include <vector>

namespace samchon
{
	namespace protocol
	{
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API EntityGroup<std::vector<std::shared_ptr<Entity>>>;

		class SAMCHON_FRAMEWORK_API SharedEntityArray
			: public EntityGroup<std::vector<std::shared_ptr<Entity>>>
		{
		private:
			typedef EntityGroup<std::vector<std::shared_ptr<Entity>>> super;

		public:
			SharedEntityArray();
			virtual ~SharedEntityArray() = default;

			auto operator[](size_t) const -> Entity*;
			auto at(size_t) const -> Entity*;
			auto get(const String&) const -> Entity*;
		};
	};
};

/* ------------------------------------------------------------------------------
	MACROS
------------------------------------------------------------------------------ */
//HEADER
#define SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(CHILD_TYPE) \
auto operator[](size_t) const -> CHILD_TYPE*; \
auto at(size_t) const -> CHILD_TYPE*; \
auto get(const samchon::String&) const -> CHILD_TYPE*;

//BODY
#define SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(THIS_TYPE, CHILD_TYPE) \
auto THIS_TYPE::operator[](size_t x) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::SharedEntityArray::operator[](x)); }; \
auto THIS_TYPE::at(size_t x) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::SharedEntityArray::at(x)); }; \
auto THIS_TYPE::get(const samchon::String &key) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::SharedEntityArray::get(key)); }