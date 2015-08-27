#pragma once
#include <samchon/protocol/IEntityGroup.hpp>

namespace samchon
{
	namespace protocol
	{
		/**
		 * EntityPtrGroup is an EntityGroup having children Entity as their pointers.\n
		 *
		 * @inheritDoc
		 */
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