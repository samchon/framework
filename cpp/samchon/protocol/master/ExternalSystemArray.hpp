#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>
#include <samchon/protocol/IProtocol.hpp>

#include <samchon/Map.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalSystem;
			class ExternalSystemRole;

			class SAMCHON_FRAMEWORK_API ExternalSystemArray
				: public virtual SharedEntityArray,
				public virtual IProtocol
			{
			private:
				typedef SharedEntityArray super;

			protected:
				virtual auto TAG() const -> String;
				virtual auto CHILD_TAG() const->String;

				IProtocol *parent;
				Map<String, ExternalSystemRole*> roleMap;

			public:
				ExternalSystemArray(IProtocol* = nullptr); //BE CAREFUL FOR VIRTUAL INHERITANCE -> NO DEFAULT CONSTRUCTOR ISSUE
				virtual ~ExternalSystemArray() = default;

				virtual void start() = NULL;
				virtual auto createRole(std::shared_ptr<library::XML>) -> ExternalSystemRole* = NULL;

				SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ExternalSystem)
				auto hasRole(const String&) const -> bool;
				auto getRole(const String&) const -> ExternalSystemRole*;

			public:
				virtual void sendData(std::shared_ptr<Invoke>);
				virtual void replyData(std::shared_ptr<Invoke>);
			};
		};
	};
};