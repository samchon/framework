#pragma once
#include <samchon/protocol/IEntityGroup.hpp>

namespace samchon
{
	namespace protocol
	{
		template <typename _Container>
		class IEntityPtrGroup
			: public virtual IEntityGroup<_Container, Entity*>
		{
		private:
			typedef IEntityGroup<_Container, Entity*> super;

		public:
			IEntityPtrGroup()
				: super()
			{
			};

		protected:
			virtual auto capsuleChild(Entity *entity) -> Entity*
			{
				return entity;
			};
		};
	};
};