#pragma once
#include <samchon/API.hpp>

#include <samchon/library/CaseGenerator.hpp>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API PermutationGenerator
			: public CaseGenerator
		{
		private:
			typedef CaseGenerator super;

		public:
			PermutationGenerator(size_t n, size_t r);
			virtual ~PermutationGenerator() = default;

			virtual auto operator[](size_t) const -> std::vector<size_t> override;
		};
	};
};