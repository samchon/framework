#pragma once
#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystem.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class ParallelSystemArray;

	class ParallelSystem : public ExternalSystem
	{
	private:
		typedef ExternalSystem super;

		double performance;

	public:
		ParallelSystem(ParallelSystemArray *systemArray) 
			: super((ExternalSystemArray*)systemArray)
		{
			performance = 1.0;
		};
		virtual ~ParallelSystem()
		{
		};

		virtual void construct(std::shared_ptr<library::XML> xml)
		{
			performance = xml->getProperty<double>("performance");

			super::construct(xml);
		};

	private:
		void send_piece_data(std::shared_ptr<Invoke> invoke, size_t first, size_t last)
		{
			sendData(invoke);
		};

		virtual auto toXML() const -> std::shared_ptr<library::XML>
		{
			std::shared_ptr<library::XML> &xml = super::toXML();
			xml->setProperty("performance", performance);

			return xml;
		};
	};
};
};
};