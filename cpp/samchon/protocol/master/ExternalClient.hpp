#include <samchon/protocol/master/ExternalSystem.hpp>
#include <samchon/protocol/OneToOneServer.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalServerArray;

			class  ExternalClient
				: public virtual ExternalSystem,
				public virtual OneToOneServer
			{
			private:
				typedef ExternalSystem super;

			protected:
				virtual auto MY_IP() const -> std::string;
				virtual auto PORT() const -> int;

			public:
				ExternalClient(ExternalServerArray* = nullptr);
				virtual ~ExternalClient() = default;

				virtual void start();
			};
		};
	};
};