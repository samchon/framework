#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	namespace namtree
	{
		class SAMCHON_FRAMEWORK_API NTParameterDetermined
			: public virtual protocol::Entity
		{
		private:
			typedef protocol::Entity super;

		protected:
			virtual auto TAG() const -> String;

			String label;
			double value;

		public:
			NTParameterDetermined();
			virtual ~NTParameterDetermined() = default;

			virtual void construct(std::shared_ptr<library::XML>);

			virtual auto key() const -> String;
			auto getLabel() const -> String;
			auto getValue() const -> double;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};