#pragma once
#include <samchon/library/CaseGenerator.hpp>

namespace samchon
{
	namespace library
	{
		class PermutationGenerator
			: public CaseGenerator
		{
		private:
			typedef CaseGenerator super;

		public:
			PermutationGenerator(size_t n, size_t r);
			virtual ~PermutationGenerator() = default;

			virtual auto at(size_t) const -> std::vector<size_t>;
		};
	};
};