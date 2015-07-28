#pragma once
#include <samchon/library/Permutation.hpp>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API Factorial
			: public Permutation
		{
		private:
			typedef Permutation super;

		public:
			Factorial(size_t size);
			virtual ~Factorial() = default;
		};
	};
};