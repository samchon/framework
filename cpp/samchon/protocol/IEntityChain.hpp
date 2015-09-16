#pragma once
#include <samchon/API.hpp>

namespace samchon
{
	namespace protocol
	{
		class Entity;

		/**
		 * 
		 */
		class SAMCHON_FRAMEWORK_API IEntityChain
		{
		protected:
			Entity *entity;

		public:
			IEntityChain(Entity*);
			virtual ~IEntityChain() = default;
		};
	};
};