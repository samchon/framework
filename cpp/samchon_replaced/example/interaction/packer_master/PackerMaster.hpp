#pragma once
#include <samchon/protocol/master/ParallelClientArray.hpp>

#include <samchon/example/interaction/chief/ChiefDriver.hpp>
#include <samchon/example/interaction/MasterClient.hpp>
#include <samchon/protocol/Invoke.hpp>

#include <samchon/example/packer/Packer.hpp>
#include <samchon/library/CombinedPermutationGenerator.hpp>

#include <array>
#include <iostream>
#include <mutex>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			namespace packer_master
			{
				class PackerMaster
					: public protocol::master::ParallelClientArray
				{
				private:
					typedef protocol::master::ParallelClientArray super;

				protected:
					std::shared_ptr<packer::Packer> packer;
					size_t optimized;

					std::unique_ptr<chief::ChiefDriver> chiefDriver;
					std::mutex mtx;

				public:
					/* ---------------------------------------------------------------------------------
						CONSTRUCTORS
					--------------------------------------------------------------------------------- */
					PackerMaster()
						: super()
					{
						this->port = 37300;
						chiefDriver.reset(new chief::ChiefDriver(this, port + 10));

						packer = std::make_shared<packer::Packer>();
						optimized = 0;
					};
					virtual ~PackerMaster() = default;

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

						packer->construct(xml);
						optimized = 0;

						library::CombinedPermutationGenerator caseGen(packer->size(), packer->productSize());
						
						sendSegmentData
						(
							std::make_shared<protocol::Invoke>("optimize", packer->toXML()), 
							caseGen.size()
						);
					};
					void replyOptimization(std::shared_ptr<library::XML> xml)
					{
						std::unique_lock<std::mutex> uk(mtx);

						std::shared_ptr<packer::Packer> packer(new packer::Packer());
						packer->construct(xml);

						std::cout << "An optimization process from a slave system has completed" << std::endl;
						std::cout << "\tOrdinary minimum price: " << this->packer->calcPrice()
									<< ", New Price from the slave: " << packer->calcPrice() << std::endl;

						if (this->packer->calcPrice() == 0 || packer->calcPrice() < this->packer->calcPrice())
							this->packer = packer;

						if (++optimized < this->size())
							return;

						std::cout << "Parallel optimization has completed." << std::endl;
						std::cout << packer->toString() << std::endl << std::endl;

						chiefDriver->sendData(std::make_shared<protocol::Invoke>("replyOptimization", packer->toXML()));
					};

					/* ---------------------------------------------------------------------------------
						MAIN
					--------------------------------------------------------------------------------- */
				public:
					static void main()
					{
						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	PACKER MASTER" << std::endl;
						std::cout << "----------------------------------------------------------------------------" << std::endl;

						PackerMaster master;
						//master.start();
						
						std::thread(&PackerMaster::start, &master).detach();
						while (true)
						{
							int key;
							std::cin >> key;

							// CONSTRUCT PRODUCTS
							std::shared_ptr<packer::ProductArray> productArray(new packer::ProductArray());
							productArray->emplace_back(new packer::Product("Eraser", 500, 10, 70));
							productArray->emplace_back(new packer::Product("Pencil", 400, 30, 35));
							productArray->emplace_back(new packer::Product("Pencil", 400, 30, 35));
							productArray->emplace_back(new packer::Product("Pencil", 400, 30, 35));
							productArray->emplace_back(new packer::Product("Book", 8000, 150, 300));
							productArray->emplace_back(new packer::Product("Book", 8000, 150, 300));
							productArray->emplace_back(new packer::Product("Drink", 1000, 75, 250));
							productArray->emplace_back(new packer::Product("Umbrella", 4000, 200, 1000));
							productArray->emplace_back(new packer::Product("Notebook-PC", 800000, 150, 850));
							productArray->emplace_back(new packer::Product("Tablet-PC", 600000, 120, 450));

							// CONSTRUCT PACKER
							packer::Packer packer(productArray);
							packer.emplace_back(new packer::WrapperArray("Large", 100, 200, 1000));
							packer.emplace_back(new packer::WrapperArray("Medium", 70, 150, 500));
							packer.emplace_back(new packer::WrapperArray("Small", 50, 100, 250));

							// FAKE SEND
							master.replyData(std::make_shared<protocol::Invoke>("optimize", packer.toXML()));
						}
					};
				};
			};
		};
	};
};