#pragma once
#include <samchon/protocol/IEntityGroup.hpp>

namespace samchon
{
	namespace protocol
	{
		template <typename _Container>
		class IEntityUniquePtrGroup
			: public virtual IEntityGroup<_Container, std::unique_ptr<Entity>>
		{
		private:
			typedef IEntityGroup<_Container, std::unique_ptr<Entity>> super;

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