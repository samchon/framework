#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace namtree
	{
		class NTParameter;

		/**
		 * @brief An Array of NTParameter
		 */
		class SAMCHON_FRAMEWORK_API NTParameterArray
			: public virtual protocol::SharedEntityArray
		{
		private:
			typedef protocol::SharedEntityArray super;

		public:
			virtual auto TAG() const -> std::string override;
			virtual auto CHILD_TAG() const -> std::string override;

			NTParameterArray();
			virtual ~NTParameterArray() = default;

		protected:
			virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::Entity* override;

		public:
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(NTParameter)
		};
	};
};