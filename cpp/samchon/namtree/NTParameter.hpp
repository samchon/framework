#pragma once
#include <samchon/API.hpp>

#include <samchon/namtree/INTExplore.hpp>
#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace namtree
	{
		class NTParameterDetermined;

		class SAMCHON_FRAMEWORK_API NTParameter
			: public virtual protocol::SharedEntityArray,
			public INTExplore
		{
		private:
			typedef protocol::SharedEntityArray super;

		protected:
			virtual auto TAG() const -> String;
			virtual auto CHILD_TAG() const -> String;

			String name;
			double initialValue;

		public:
			NTParameter();
			virtual ~NTParameter() = default;

			virtual void construct(std::shared_ptr<library::XML>);

		protected:
			virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::Entity*;

		public:
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(NTParameterDetermined);

			virtual auto key() const -> String;
			auto getName() const -> String;
			auto getInitialValue() const -> double;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};