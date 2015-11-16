#pragma once
#include <samchon/example/interaction/Master.hpp>

#include <samchon/example/interaction/ChiefDriver.hpp>
#include <samchon/example/interaction/SlaveDriver.hpp>
#include <samchon/protocol/Invoke.hpp>

#include <samchon/example/packer/Packer.hpp>
#include <samchon/library/CombinedPermutationGenerator.hpp>

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
				/**
				 * @brief A packer solver.
				 */
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
				virtual void optimize(std::shared_ptr<library::XML> xml) override
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
				virtual void replyOptimization(std::shared_ptr<library::XML> xml) override
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
					master.start();
				};
			};
		};
	};
};