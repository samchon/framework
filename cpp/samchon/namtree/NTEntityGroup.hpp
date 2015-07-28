#pragma once
#include <samchon/API.hpp>

#include <memory>

namespace samchon
{
	namespace namtree
	{
		class NTIterator;

		class SAMCHON_FRAMEWORK_API NTEntityGroup
		{
		public:
			NTEntityGroup();
			virtual ~NTEntityGroup() = default;

			virtual auto begin() const -> std::shared_ptr<NTIterator> = NULL;
			virtual auto end() const -> std::shared_ptr<NTIterator> = NULL;
		};
	};
};
