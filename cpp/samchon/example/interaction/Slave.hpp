#pragma once
#include <samchon/protocol/slave/ParallelClient.hpp>

#include <samchon/protocol/Invoke.hpp>
#include <iostream>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			/**
			 * @brief A slave system for optimizing something.
			 * 
			 * @details
			 * <p> Slave is an abstract and example class, for providing guidance of realizing parallel 
			 * processsing system for useres, within framework of slave. The Slave class represents 
			 * a slave system literally. You can study how to utilize the slave module in protocol. </p>
			 * 
			 * <p> A slave system (represented by Slave and SlaveDriver) is associated with a master 
			 * (represented by Master and MasterSlave) or mediator (PackerMediator) system. When slave 
			 * system gets order of optimization with its basic data, slave system calculates and derives 
			 * the best solution and reports it to the master system. </p>
			 *
			 * <p> @image html  cpp/example_interaction.png
			 *	   @image latex cpp/example_interaction.png </p>
			 * 
			 * <p> @image html  conception/example_interaction.png
			 *	   @image latex conception/example_interaction.png </p>
			 * 
			 * \par [Inherited]
			 *		@copydetails slave::ParallelClient
			 *
			 * @see protocol::slave
			 * @author Jeongho Nam
			 */
			class Slave
				: public protocol::slave::ParallelClient
			{
			private:
				typedef protocol::slave::ParallelClient super;

			public:
				/* ------------------------------------------------------------
					CONSTRUCTORS
				------------------------------------------------------------ */
				/**
				 * @brief Construct from ip address and port number of master.
				 * 		  
				 * @param ip IP address of master.
				 * @param port Port number of master.
				 */
				Slave(const std::string &ip, int port)
					: super()
				{
					this->ip = ip;
					this->port = port;
				};
				virtual ~Slave() = default;

				/* ------------------------------------------------------------
					INVOKE MESSAGE CHAIN
				------------------------------------------------------------ */
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
				 * @brief Optimize something and report the result.
				 * 
				 * @param xml XML object representing a Travel.
				 * @param index Starting index of a segmentation allocated to the Slave.
				 * @param size Size of the segmentation.
				 */
				virtual void optimize(std::shared_ptr<library::XML> xml, size_t index, size_t size)
				{
					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << "	OPTIMIZE FROM " << index << ", SIZE: " << size << std::endl;
					std::cout << "----------------------------------------------------------------------------" << std::endl;
				};

				/**
				 * @brief Send (report) optimization result to its master system.
				 * 		  
				 * @param xml XML object representing the best solution.
				 */
				void sendOptimization(std::shared_ptr<library::XML> xml)
				{
					sendData(std::make_shared<protocol::Invoke>("replyOptimization", xml));
				};
			};
		};
	};
};