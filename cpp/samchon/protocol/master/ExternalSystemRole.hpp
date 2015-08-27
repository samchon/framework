#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/Entity.hpp>
#include <samchon/Set.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalSystem;

			class SAMCHON_FRAMEWORK_API ExternalSystemRole
				: public virtual Entity
			{
			private:
				typedef Entity super;

			protected:
				virtual auto TAG() const -> String;

				ExternalSystem *externalSystem;
				Set<String> listenerSet;

			public:
				ExternalSystemRole(ExternalSystem *);
				virtual ~ExternalSystemRole() = default;

				virtual auto key() const->String = NULL;
				auto getSystem() const->ExternalSystem*;
				auto hasListener(const String &) const -> bool;
			};
		};
	};
};