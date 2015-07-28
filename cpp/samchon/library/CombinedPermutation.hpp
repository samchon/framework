#pragma once
#include <samchon/library/Case.hpp>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API CombinedPermutation
			: public Case
		{
		private:
			typedef Case super;

		public:
			CombinedPermutation(size_t indexSize, size_t levelSize);
			virtual ~CombinedPermutation() = default;

		protected:
			virtual auto MATRIX_SIZE() const -> size_t;

		public:
			virtual auto isValid(const std::vector<size_t> &) const -> bool;
		};
	};
};