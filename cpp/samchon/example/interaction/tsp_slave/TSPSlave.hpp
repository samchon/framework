#pragma once
#include <samchon/protocol/slave/ParallelClient.hpp>

#include <samchon/protocol/Invoke.hpp>

#include <samchon/example/tsp/Scheduler.hpp>

#include <iostream>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			namespace tsp_slave
			{
				class TSPSlave
					: public protocol::slave::ParallelClient
				{
				private:
					typedef protocol::slave::ParallelClient super;

				public:
					/* ---------------------------------------------------------------------------------
						CONSTRUCTORS
					--------------------------------------------------------------------------------- */
					TSPSlave(const std::string &ip)
						: super()
					{
						this->ip = ip;
						this->port = 37100;
					};
					virtual ~TSPSlave() = default;

					/* ---------------------------------------------------------------------------------
						INVOKE MESSAGE CHAIN
					--------------------------------------------------------------------------------- */
					virtual void replyPieceData(std::shared_ptr<protocol::Invoke> invoke, size_t index, size_t size) override
					{
						if (invoke->getListener() == "optimize")
							optimize
							(
								invoke->at(0)->getvalueAsXML(),
								index,
								size
							);
					};

				protected:
					void optimize(std::shared_ptr<library::XML> xml, size_t index, size_t size)
					{
						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	OPTIMIZE FROM " << index << " TO " << size << std::endl;
						std::cout << "----------------------------------------------------------------------------" << std::endl;

						std::shared_ptr<tsp::Scheduler> scheduler(new tsp::Scheduler());
						scheduler->construct(xml);
						scheduler->optimize();

						std::cout << scheduler->toString() << std::endl << std::endl;
						sendData(std::make_shared<protocol::Invoke>("replyOptimization", scheduler->toXML()));
					};

				public:
					/* ---------------------------------------------------------------------------------
						MAIN
					--------------------------------------------------------------------------------- */
					static void main()
					{
						std::string ip;
						int port;

						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	PACKER SLAVE" << std::endl;
						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	ip: ";		std::cin >> ip;
						std::cout << std::endl;

						TSPSlave slave(ip);
						slave.start();
					};
				};
			};
		};
	};
};