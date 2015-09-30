#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>
#include <samchon/namtree/NTParameterDetermined.hpp>
#include <samchon/namtree/INTExplore.hpp>

namespace samchon
{
	namespace namtree
	{
		/**
		 * @brief A metadat of a parameter in a function
		 */
		class SAMCHON_FRAMEWORK_API NTParameter
			: public virtual protocol::SharedEntityArray<NTParameterDetermined>,
			public INTExplore
		{
		private:
			typedef protocol::SharedEntityArray<NTParameterDetermined> super;

		protected:
			virtual auto TAG() const -> std::string override;
			virtual auto CHILD_TAG() const -> std::string override;

			std::string name;
			double initialValue;

		public:
			NTParameter();
			virtual ~NTParameter() = default;

			virtual void construct(std::shared_ptr<library::XML>) override;

		protected:
			virtual auto createChild(std::shared_ptr<library::XML>) -> NTParameterDetermined* override;

		public:
			virtual auto key() const -> std::string override;
			auto getName() const -> std::string;
			auto getInitialValue() const -> double;

			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};