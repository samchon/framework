#pragma once


#include <memory>

namespace samchon
{
	namespace namtree
	{
		class NTIterator;

		/** 
		 * @brief Abstract class for historical, studying data
		 */
		class  NTEntityGroup
		{
		public:
			NTEntityGroup();
			virtual ~NTEntityGroup() = default;

			virtual auto begin() const -> std::shared_ptr<NTIterator> = NULL;
			virtual auto end() const -> std::shared_ptr<NTIterator> = NULL;
		};
	};
};
