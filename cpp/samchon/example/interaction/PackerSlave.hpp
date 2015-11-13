#pragma once
#include <samchon/example/interaction/Slave.hpp>

#include <samchon/example/packer/Packer.hpp>
#include <samchon/protocol/Invoke.hpp>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			/**
			 * @brief A slave system for solving Packer.
			 * 
			 * @details
			 * \par [Inherited]
			 *		@copydetails slave::ParallelClient 
			 *
			 * @author Jeongho Nam
			 */
			class PackerSlave
				: public Slave
			{
			private:
				typedef Slave super;

			public:
				/* ---------------------------------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------------------------------- */
				/**
				 * @brief Construct from ip and port of the master.
				 *
				 * @param ip IP address of the master.
				 * @param port Port number of the master.
				 */
				PackerSlave(const std::string &ip, int port)
					: super(ip, port)
				{
				};
				virtual ~PackerSlave() = default;

			protected:
				/* ---------------------------------------------------------------------------------
					INVOKE MESSAGE CHAIN
				--------------------------------------------------------------------------------- */
				/**
				 * @brief Optimize TSP and report the result.
				 * 
				 * @param xml XML object representing a Travel.
				 * @param index Starting index of a segmentation allocated to the Slave.
				 * @param size Size of the segmentation.
				 */
				virtual void optimize(std::shared_ptr<library::XML> xml, size_t index, size_t size) override
				{
					super::optimize(xml, index, size);

					packer::Packer packer;
					packer.construct(xml);
					packer.optimize(index, size);

					std::cout << packer.toString() << std::endl << std::endl;
					sendOptimization(packer.toXML());
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
					std::cout << "	PACKER SLAVE" << std::endl;
					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << "	ip: ";		std::cin >> ip;
					std::cout << "	port: ";	std::cin >> port;

					PackerSlave slave(ip, port);
					slave.start();
				};
			};
		};
	};
};