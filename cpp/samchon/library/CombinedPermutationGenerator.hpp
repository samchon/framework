#pragma once
#include <samchon/API.hpp>

#include <samchon/library/CaseGenerator.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief A combined-permutation case generator; <sub>n</sub>TT<sub>r</sub>
		 */
		class SAMCHON_FRAMEWORK_API CombinedPermutationGenerator
			: public CaseGenerator
		{
		private:
			typedef CaseGenerator super;

		public:
			/**
			 * @brief Construct from n, r
			 *
			 * @copydoc CaseGenerator::CaseGenerator()
			 */
			CombinedPermutationGenerator(size_t n, size_t r);
			virtual ~CombinedPermutationGenerator() = default;

			virtual auto operator[](size_t) const -> std::vector<size_t> override;
		};
	};
};