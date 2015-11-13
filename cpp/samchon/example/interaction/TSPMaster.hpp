#pragma once
#include <samchon/example/interaction/Master.hpp>

#include <samchon/example/interaction/ChiefDriver.hpp>
#include <samchon/example/interaction/SlaveDriver.hpp>
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
			/**
			 * @brief A master for parallel system solving TSP problem.
			 * 
			 * @details
			 * \par [Inherited]
			 *		@copydetails interaction::Master
			 * 		  
			 * @author Jeongho Nam
			 */
			class TSPMaster
				: public Master
			{
			private:
				typedef Master super;

			protected:
				std::shared_ptr<tsp::Scheduler> scheduler;
				
			public:
				/* ---------------------------------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------------------------------- */
				/**
				 * @brief Default Constructor.
				 */
				TSPMaster()
					: super(37100)
				{
					scheduler = std::make_shared<tsp::Scheduler>();
				};
				virtual ~TSPMaster() = default;

			protected:
				/* ---------------------------------------------------------------------------------
					INVOKE MESSATE CHAIN
				--------------------------------------------------------------------------------- */
				virtual void optimize(std::shared_ptr<library::XML> xml) override
				{
					super::optimize(nullptr);

					scheduler->construct(xml);

					sendSegmentData
					(
						std::make_shared<protocol::Invoke>("optimize", scheduler->toXML()), 
						this->size()
					);
				};

				virtual void replyOptimization(std::shared_ptr<library::XML> xml) override
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

					chiefDriver->sendData(std::make_shared<protocol::Invoke>("replyOptimization", scheduler->toXML()));
				};

			public:
				/* ---------------------------------------------------------------------------------
					MAIN
				--------------------------------------------------------------------------------- */
				/**
				 * @brief Main function
				 */
				static void main()
				{
					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << "	TSP SOLVER MASTER" << std::endl;
					std::cout << "----------------------------------------------------------------------------" << std::endl;

					TSPMaster master;
					master.start();
				};
			};
		};
	};
};