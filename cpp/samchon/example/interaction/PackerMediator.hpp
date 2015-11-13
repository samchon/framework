#pragma once
#include <samchon/protocol/master/ParallelClientArrayMediator.hpp>
#include <samchon/protocol/master/ParallelSlaveClientMediator.hpp>

#include <samchon/example/interaction/SlaveDriver.hpp>
#include <samchon/example/packer/Packer.hpp>

#include <samchon/protocol/Invoke.hpp>
#include <samchon/library/CombinedPermutationGenerator.hpp>

#include <iostream>
#include <thread>
#include <mutex>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			class PackerMediator
				: public protocol::master::ParallelClientArrayMediator
			{
			private:
				typedef protocol::master::ParallelClientArrayMediator super;

			protected:
				std::shared_ptr<packer::Packer> packer;
				size_t optimized;

				std::mutex mtx;

			public:
				/* ---------------------------------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------------------------------- */
				PackerMediator()
					: super()
				{
					this->port = 37350;
					dynamic_cast<protocol::master::ParallelSlaveClientMediator*>(slave)->setAddress("127.0.0.1", 37300);

					packer = std::make_shared<packer::Packer>();
					optimized = 0;
				};
				virtual ~PackerMediator() = default;

			protected:
				virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::ExternalSystem* override
				{
					return new SlaveDriver();
				};

				virtual void addClient(protocol::Socket *socket) override
				{
					std::cout << "A client has connected." << std::endl;

					super::addClient(socket);
				};

			public:
				/* ---------------------------------------------------------------------------------
					INVOKE MESSATE CHAIN
				--------------------------------------------------------------------------------- */
				virtual void sendPieceData(std::shared_ptr<protocol::Invoke> invoke, size_t index, size_t size)
				{
					if (invoke->getListener() == "optimize")
					{
						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	OPTIMIZE FROM " << index << ", SIZE: " << size << std::endl;
						std::cout << "----------------------------------------------------------------------------" << std::endl;

						optimized = 0;
					}
					super::sendPieceData(invoke, index, size);
				};
				virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override
				{
					if (invoke->getListener() == "replyOptimization")
						replyOptimization(invoke->at(0)->getvalueAsXML());
				};

			protected:
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

					slave->sendData(std::make_shared<protocol::Invoke>("replyOptimization", packer->toXML()));
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
					std::cout << "	PACKER MEDIATOR" << std::endl;
					std::cout << "----------------------------------------------------------------------------" << std::endl;

					PackerMediator mediator;
					mediator.start();
				};
			};
		};
	};
};