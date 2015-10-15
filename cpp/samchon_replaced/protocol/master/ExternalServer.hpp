#include <samchon/API.hpp>

#include <samchon/protocol/master/ExternalSystem.hpp>
#include <samchon/protocol/ServerConnector.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalServerArray;

			class SAMCHON_FRAMEWORK_API ExternalServer
				: public virtual ExternalSystem,
				public virtual ServerConnector
			{
			private:
				typedef ExternalSystem super;

			protected:
				virtual auto getIP() const -> std::string;
				virtual auto MY_IP() const -> std::string;
				virtual auto PORT() const -> int;

			public:
				ExternalServer(ExternalServerArray* = nullptr);
				virtual ~ExternalServer() = default;

				virtual void start();
			};
		};
	};
};