#pragma once
#include <samchon/protocol/SharedEntityArray.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
	namespace protocol
	{
		class ExternalServer;
		class ExternalServerRole;

		class SAMCHON_PROTOCOL_API ExternalServerArray 
			: public virtual SharedEntityArray,
			public virtual IProtocol
		{
		private:
			typedef SharedEntityArray super;
			
		public:
			virtual auto TAG() const -> String;
			virtual auto CHILD_TAG() const -> String;

		protected:
			IProtocol *parent;

		public:
			ExternalServerArray(IProtocol*);
			virtual ~ExternalServerArray() = default;

			virtual void connect();

			//GETTERS
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ExternalServer);
			auto hasRole(const String &) const -> bool;
			auto getRole(const String&) const -> ExternalServerRole*;

			//XML AND INVOKE
			virtual void replyData(std::shared_ptr<Invoke>);
		};
	};
};

// #define EXTERNAL_SEVER_ARRAY_GET_ROLE_HEADER \
// auto getRole(const String &key) -> ROLE_TYPE*; \
// 
// #define EXTERNAL_SEVER_ARRAY_GET_ROLE_BODY(THIS_TYPE) \
// auto THIS_TYPE::getRole(const String &key) const -> ROLE_TYPE* \
// { \
// 	return std::dynamic_cast<ROLE_TYPE*>(samchon::protocol::ExternalServerArray::getRole(key)); \
// } \
