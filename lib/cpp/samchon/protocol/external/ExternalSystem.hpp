#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityDeque.hpp>
#	include <samchon/protocol/external/ExternalSystemRole.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
namespace protocol
{
	class Communicator;
	class ClientDriver;

namespace external
{
	class ExternalSystemArray;
	class ExternalServer;
	
	class SAMCHON_FRAMEWORK_API ExternalSystem 
		: public SharedEntityDeque<ExternalSystemRole>,
		public virtual IProtocol
	{
		friend class ExternalClientArray;
		friend class ExternalServer;

	private:
		typedef SharedEntityDeque<ExternalSystemRole> super;

	protected:
		ExternalSystemArray *system_array_;
		std::string name;

	private:
		std::shared_ptr<Communicator> communicator_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		ExternalSystem(ExternalSystemArray*);
		ExternalSystem(ExternalSystemArray*, std::shared_ptr<ClientDriver>);
		virtual ~ExternalSystem();

		virtual void construct(std::shared_ptr<library::XML> xml) override;

	protected:
		ExternalSystem();

	public:
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		auto getSystemArray() const -> ExternalSystemArray*
		{
			return system_array_;
		};
		
		virtual auto key() const -> std::string
		{
			return name;
		};

		auto getName() const -> std::string
		{
			return name;
		};

	public:
		/* ---------------------------------------------------------
			NETWORK & MESSAGE CHAIN
		--------------------------------------------------------- */
		void close();

		virtual void sendData(std::shared_ptr<Invoke> invoke) override;

		virtual void replyData(std::shared_ptr<Invoke> invoke) override;

	public:
		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto TAG() const -> std::string override
		{
			return "system";
		};
		virtual auto CHILD_TAG() const -> std::string override
		{
			return "role";
		};

		virtual auto toXML() const -> std::shared_ptr<library::XML> override;
	};
};
};
};