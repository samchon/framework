#pragma once
#include <samchon/API.hpp>

#include <samchon/library/PermutationGenerator.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Factorical case generator
		 * @details n! = nPn
		 */
		class SAMCHON_FRAMEWORK_API FactorialGenerator
			: public PermutationGenerator
		{
		private:
			typedef PermutationGenerator super;

		public:
			FactorialGenerator(size_t size);
			virtual ~FactorialGenerator() = default;
		};
	};
};