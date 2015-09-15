#pragma once


#include <samchon/namtree/INTExplore.hpp>
#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace namtree
	{
		class NTParameterDetermined;

		/**
		 * @brief A metadat of a parameter in a function
		 */
		class  NTParameter
			: public virtual protocol::SharedEntityArray,
			public INTExplore
		{
		private:
			typedef protocol::SharedEntityArray super;

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
			virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::Entity* override;

		public:
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(NTParameterDetermined);

			virtual auto key() const -> std::string override;
			auto getName() const -> std::string;
			auto getInitialValue() const -> double;

			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};