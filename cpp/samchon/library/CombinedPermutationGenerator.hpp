#pragma once
#include <samchon/library/CaseGenerator.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Combined-permutation case generator
		 */
		class SAMCHON_FRAMEWORK_API CombinedPermutationGenerator
			: public CaseGenerator
		{
		private:
			typedef CaseGenerator super;

		public:
			CombinedPermutationGenerator(size_t n, size_t r);
			virtual ~CombinedPermutationGenerator() = default;

			virtual auto at(size_t) const -> std::vector<size_t>;
		};
	};
};