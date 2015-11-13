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
			/**
			 * @brief A slave system for solving TSP.
			 * 
			 * @author Jeongho Nam
			 */
			class TSPSlave
				: public protocol::slave::ParallelClient
			{
			private:
				typedef protocol::slave::ParallelClient super;

			public:
				/* ---------------------------------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------------------------------- */
				/**
				 * @brief Construct from ip address of the master.
				 * 		  
				 * @param ip IP address of the master.
				 */
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
				/**
				 * @brief Optimize TSP and report the result.
				 * 
				 * @param xml XML object representing a Travel.
				 * @param index Starting index of a segmentation allocated to the Slave.
				 * @param size Size of the segmentation.
				 */
				void optimize(std::shared_ptr<library::XML> xml, size_t index, size_t size)
				{
					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << "	OPTIMIZE FROM " << index << ", SIZE: " << size << std::endl;
					std::cout << "----------------------------------------------------------------------------" << std::endl;

					tsp::Scheduler scheduler;
					scheduler.construct(xml);
					scheduler.optimize();

					std::cout << scheduler.toString() << std::endl << std::endl;
					sendData(std::make_shared<protocol::Invoke>("replyOptimization", scheduler.toXML()));
				};

			public:
				/* ---------------------------------------------------------------------------------
					MAIN
				--------------------------------------------------------------------------------- */
				/**
				 * @brief Main function.
				 */
				static void main()
				{
					std::string ip;
					int port;

					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << "	TSP SOLVER SLAVE" << std::endl;
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