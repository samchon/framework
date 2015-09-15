#pragma once


namespace samchon
{
	namespace protocol
	{
		class Entity;

		/**
		 * 
		 */
		class  IEntityChain
		{
		protected:
			Entity *entity;

		public:
			IEntityChain(Entity*);
			virtual ~IEntityChain() = default;
		};
	};
};