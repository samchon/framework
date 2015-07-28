#pragma once
#include <samchon\API.hpp>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API IOperator
		{
		public:
			IOperator();
			virtual ~IOperator() = default;

			virtual auto operator<(const IOperator&) const -> bool = NULL;
			virtual auto operator==(const IOperator&) const -> bool = NULL;

			auto operator!=(const IOperator&) const -> bool;
			auto operator<=(const IOperator&) const -> bool;
			auto operator>(const IOperator&) const -> bool;
			auto operator>=(const IOperator&) const -> bool;
		};
	}
};