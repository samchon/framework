#pragma once
#include <samchon/example/interaction/Master.hpp>

#include <samchon/example/interaction/ChiefDriver.hpp>
#include <samchon/example/interaction/SlaveDriver.hpp>
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
			/**
			 * @brief A master of parallel system solving packaging problem.
			 * 		  
			 * @details
			 * <p> . </p> 		   
			 *
			 * \par [Inherited]
			 *		@copydetails interaction::Master
			 *
			 * @author Jeongho Nam
			 */
			class PackerMaster
				: public Master
			{
			private:
				typedef Master super;

			protected:
				std::shared_ptr<packer::Packer> packer;
				
			public:
				/* ---------------------------------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------------------------------- */
				/**
				 * @brief Default Constructor.
				 */
				PackerMaster()
					: super(37300)
				{
					packer = std::make_shared<packer::Packer>();
				};
				virtual ~PackerMaster() = default;

			protected:
				/* ---------------------------------------------------------------------------------
					INVOKE MESSATE CHAIN
				--------------------------------------------------------------------------------- */
				void optimize(std::shared_ptr<library::XML> xml)
				{
					super::optimize(nullptr);

					packer->construct(xml);
					
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
				/**
				 * @brief Main functino.
				 */
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