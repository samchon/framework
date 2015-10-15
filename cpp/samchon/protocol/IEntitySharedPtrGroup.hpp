#pragma once
#include <samchon/protocol/EntityGroup.hpp>

namespace samchon
{
	namespace protocol
	{
		template <typename _Container>
		class IEntitySharedPtrGroup
			: public virtual EntityGroup< _Container, std::shared_ptr<Entity>>
		{
		private:
			typedef EntityGroup<_Container, std::shared_ptr<Entity>> super;

		public:
			IEntitySharedPtrGroup()
				: super()
			{
			};
			virtual ~IEntitySharedPtrGroup() = default;

		protected:
			virtual auto capsuleChild(Entity *entity) -> std::shared_ptr<Entity>
			{
				return std::shared_ptr<Entity>(entity);
			}
		};
	};
};