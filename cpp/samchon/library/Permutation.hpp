#pragma once
#include <samchon/library/Case.hpp>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API Permutation
			: public Case
		{
		private:
			typedef Case super;

		public:
			Permutation(size_t indexSize, size_t levelSize);
			virtual ~Permutation() = default;

		protected:
			virtual auto MATRIX_SIZE() const->size_t;

		public:
			virtual auto isValid(const std::vector<size_t> &) const -> bool;
		};
	};
};