#pragma once
#include <samchon/API.hpp>

#include <samchon/String.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API IEntityGroup
		{
		protected:
			/**
			* @brief A tag name of children
			 * 
			 * @details
			 * <p>&lt; TAG&gt;\n
			 * &nbsp;&nbsp;&nbsp;&nbsp; &lt;CHILD_TAG /&gt;\n
			 * &nbsp;&nbsp;&nbsp;&nbsp; &lt;CHILD_TAG /&gt;\n
			 * &lt;/TAG&gt; </p>
			 */
			virtual auto CHILD_TAG() const -> String = NULL;

		public:
			/**
			 * @brief Default Constructor
			 */
			IEntityGroup();
			virtual ~IEntityGroup() = default;
		};
	};
};