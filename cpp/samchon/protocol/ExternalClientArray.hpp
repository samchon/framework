#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystemArray.hpp>
#include <samchon/protocol/IServer.hpp>

namespace samchon
{
	class ExternalClient;

	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API ExternalClientArray
			: public virtual ExternalSystemArray,
			private virtual IServer
		{
		protected:
			typedef ExternalSystemArray super;
			
			std::string myIP;
			int port;

		public:
			/* ------------------------------------------------------------------
				CONSTRUCTORS
			------------------------------------------------------------------ */
			ExternalClientArray();
			virtual ~ExternalClientArray() = default;

			virtual void construct(std::shared_ptr<library::XML>) override;

			virtual void start() override;

		protected:
			/* ------------------------------------------------------------------
				ISERVER METHODS
			------------------------------------------------------------------ */
			virtual auto PORT() const -> int;
			virtual auto MY_IP() const -> std::string;
			
			virtual void addClient(Socket*) override;
			
		public:
			/* ------------------------------------------------------------------
				EXPORTERS
			------------------------------------------------------------------ */
			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};