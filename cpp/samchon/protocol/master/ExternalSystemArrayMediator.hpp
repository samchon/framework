#pragma once
#include <samchon/protocol/master/ExternalSystemArray.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class MediatorSocket;

			class  ExternalSystemArrayMediator
				: public virtual ExternalSystemArray
			{
				friend class MediatorSocket;

			private:
				typedef ExternalSystemArray super;

			protected:
				MediatorSocket *socket;

			public:
				ExternalSystemArrayMediator(IProtocol *);
				virtual ~ExternalSystemArrayMediator() = default;

			protected:
				virtual void replyDataFromMaster(std::shared_ptr<Invoke>);

			public:
				virtual auto toXML() const -> std::shared_ptr<library::XML>;
			};
		};
	};
};