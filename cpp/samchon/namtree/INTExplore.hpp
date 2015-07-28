#pragma once
#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	namespace namtree
	{
		class SAMCHON_FRAMEWORK_API INTExplore
			: public virtual protocol::Entity
		{
		private:
			typedef protocol::Entity super;

		protected:
			double minimum;
			double maximum;
			double bin;

		public:
			INTExplore();
			virtual ~INTExplore() = default;

			virtual void construct(std::shared_ptr<library::XML>);

			auto getMinimum() const -> double;
			auto getMaximum() const -> double;
			auto getBin() const -> double;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};