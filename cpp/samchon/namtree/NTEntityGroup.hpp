#pragma once
#include <samchon/API.hpp>

#include <memory>

namespace samchon
{
	namespace namtree
	{
		class NTIterator;

		/** 
		 * @brief Abstract class for historical, studying data
		 */
		class SAMCHON_FRAMEWORK_API NTEntityGroup
		{
		public:
			NTEntityGroup();
			virtual ~NTEntityGroup() = default;

			virtual auto begin() const -> std::shared_ptr<NTIterator> = 0;
			virtual auto end() const -> std::shared_ptr<NTIterator> = 0;
		};
	};
};
