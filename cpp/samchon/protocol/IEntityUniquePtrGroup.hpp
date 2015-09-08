#pragma once
#include <samchon/protocol/EntityGroup.hpp>

namespace samchon
{
	namespace protocol
	{
		template <typename _Container>
		class IEntityUniquePtrGroup
			: public virtual EntityGroup<_Container, std::unique_ptr<Entity>>
		{
		private:
			typedef EntityGroup<_Container, std::unique_ptr<Entity>> super;

		public:
			IEntityUniquePtrGroup()
				: super()
			{
			};
			virtual ~IEntityUniquePtrGroup() = default;

			virtual void push_back(Entity *entity)
			{
				//_Container::push_back(std::unique_ptr<Entity>(entity));
			};
		};
	};
};