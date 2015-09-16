#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	namespace namtree
	{
		/**
		 * @brief A pre-determined parameter
		 */
		class SAMCHON_FRAMEWORK_API NTParameterDetermined
			: public virtual protocol::Entity
		{
		private:
			typedef protocol::Entity super;

		protected:
			virtual auto TAG() const -> std::string override;

			std::string label;
			double value;

		public:
			NTParameterDetermined();
			virtual ~NTParameterDetermined() = default;

			virtual void construct(std::shared_ptr<library::XML>) override;

			virtual auto key() const -> std::string override;
			auto getLabel() const -> std::string;
			auto getValue() const -> double;

			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};