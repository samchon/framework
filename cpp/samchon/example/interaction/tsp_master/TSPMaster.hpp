#pragma once
#include <samchon/protocol/master/ParallelClientArray.hpp>

#include <samchon/example/interaction/chief/ChiefDriver.hpp>
#include <samchon/example/interaction/MasterClient.hpp>
#include <samchon/protocol/Invoke.hpp>

#include <samchon/example/tsp/Scheduler.hpp>

#include <array>
#include <iostream>
#include <mutex>
#include <thread>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			namespace tsp_master
			{
				class TSPMaster
					: public protocol::master::ParallelClientArray
				{
				private:
					typedef protocol::master::ParallelClientArray super;

				protected:
					std::shared_ptr<tsp::Scheduler> scheduler;
					size_t optimized;

					std::unique_ptr<chief::ChiefDriver> chiefDriver;
					std::mutex mtx;

				public:
					/* ---------------------------------------------------------------------------------
						CONSTRUCTORS
					--------------------------------------------------------------------------------- */
					TSPMaster()
						: super()
					{
						this->port = 37100;
						chiefDriver.reset(new chief::ChiefDriver(this, port + 10));

						scheduler = std::make_shared<tsp::Scheduler>();
						optimized = 0;
					};
					virtual ~TSPMaster() = default;

					virtual void start() override
					{
						std::array<std::thread, 2> threadArray =
						{
							std::thread([this]()
							{
								super::start();
							}),
							std::thread([this]()
							{
								chiefDriver->open();
							})
						};

						for (auto it = threadArray.begin(); it != threadArray.end(); it++)
							it->join();
					};

				protected:
					virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::ExternalSystem* override
					{
						return new MasterClient();
					};

				public:
					/* ---------------------------------------------------------------------------------
						INVOKE MESSATE CHAIN
					--------------------------------------------------------------------------------- */
					virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override
					{
						if (invoke->getListener() == "optimize")
							optimize(invoke->at(0)->getvalueAsXML());
						else if (invoke->getListener() == "replyOptimization")
							replyOptimization(invoke->at(0)->getvalueAsXML());
					};

				protected:
					virtual void addClient(protocol::Socket *socket) override
					{
						std::cout << "A client has connected." << std::endl;

						super::addClient(socket);
					};

					void optimize(std::shared_ptr<library::XML> xml)
					{
						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	OPTIMIZE" << std::endl;
						std::cout << "----------------------------------------------------------------------------" << std::endl;

						scheduler->construct(xml);
						optimized = 0;
						
						sendSegmentData
						(
							std::make_shared<protocol::Invoke>("optimize", scheduler->toXML()), 
							this->size()
						);
					};
					void replyOptimization(std::shared_ptr<library::XML> xml)
					{
						std::unique_lock<std::mutex> uk(mtx);

						std::shared_ptr<tsp::Scheduler> scheduler(new tsp::Scheduler());
						scheduler->construct(xml);

						std::cout << "An optimization process from a slave system has completed" << std::endl;
						std::cout << "\tOrdinary minimum distance: " << this->scheduler->calcDistance()
							<< ", New Price from the slave: " << scheduler->calcDistance() << std::endl;

						if (scheduler->calcDistance() < this->scheduler->calcDistance())
							this->scheduler = scheduler;

						if (++optimized < this->size())
							return;

						std::cout << std::endl;
						std::cout << "Parallel optimization has completed." << std::endl;
						std::cout << scheduler->toString() << std::endl << std::endl;
					};

				public:
					/* ---------------------------------------------------------------------------------
						MAIN
					--------------------------------------------------------------------------------- */
					static void main()
					{
						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	TSP SOLVER MASTER" << std::endl;
						std::cout << "----------------------------------------------------------------------------" << std::endl;

						TSPMaster master;
						master.start();

						/*std::thread(&TSPMaster::start, &master).detach();

						while (true)
						{
							int key;
							std::cin >> key;

							std::shared_ptr<tsp::Travel> travel = std::make_shared<tsp::Travel>();
							for(int i = 0; i < 20; i++)
								travel->emplace_back(new tsp::GeometryPoint(i + 1));

							// GENETIC ALGORITHM
							struct tsp::GAParameters gaParameters = {.03, 50, 100, 300};

							// SEND
							tsp::Scheduler scheduler(travel, gaParameters);
							master.replyData(std::make_shared<protocol::Invoke>("optimize", scheduler.toXML()));
						}*/
					};
				};
			};
		};
	};
};