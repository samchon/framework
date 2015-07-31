#pragma once
#include <samchon/protocol/SamchonProtocol.hpp>

#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	namespace protocol
	{
		class ExternalServer;

		class SAMCHON_PROTOCOL_API ExternalServerRole 
			: public virtual Entity
		{
		private:
			typedef Entity super;

		public:
			virtual auto TAG() const -> String;
			virtual auto key() const -> String = NULL;

		protected:
			ExternalServer *externalServer;

		public:
			ExternalServerRole(ExternalServer *);
			virtual ~ExternalServerRole() = default;
			virtual void construct(std::shared_ptr<library::XML>) = NULL;

			auto getExternalServer() const-> ExternalServer*;
		};
	};
};