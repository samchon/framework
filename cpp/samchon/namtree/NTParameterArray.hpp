#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>
#include <samchon/namtree/NTParameter.hpp>

namespace samchon
{
	namespace namtree
	{
		/**
		 * @brief An Array of NTParameter
		 */
		class SAMCHON_FRAMEWORK_API NTParameterArray
			: public virtual protocol::SharedEntityArray<NTParameter>
		{
		private:
			typedef protocol::SharedEntityArray<NTParameter> super;

		public:
			virtual auto TAG() const -> std::string override;
			virtual auto CHILD_TAG() const -> std::string override;

			NTParameterArray();
			virtual ~NTParameterArray() = default;

		protected:
			virtual auto createChild(std::shared_ptr<library::XML>) -> NTParameter* override;
		};
	};
};