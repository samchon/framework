#pragma once
#include <samchon/example/interaction/Slave.hpp>

#include <samchon/example/tsp/Scheduler.hpp>

#include <iostream>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			/**
			 * @brief A slave system solving TSP.
			 * 
			 * @details
			 * \par [Inherited]
			 *		@copydetails slave::ParallelClient 
			 *
			 * @author Jeongho Nam
			 */
			class TSPSlave
				: public Slave
			{
			private:
				typedef Slave super;

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
					: super(ip, 37100)
				{
				};
				virtual ~TSPSlave() = default;

			protected:
				/* ---------------------------------------------------------------------------------
					INVOKE MESSAGE CHAIN
				--------------------------------------------------------------------------------- */
				virtual void optimize(std::shared_ptr<library::XML> xml, size_t index, size_t size) override
				{
					super::optimize(xml, index, size);

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