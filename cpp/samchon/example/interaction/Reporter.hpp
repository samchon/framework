#pragma once

#include <samchon/example/interaction/ChiefDriver.hpp>

#include <samchon/example/tsp/Scheduler.hpp>
#include <samchon/example/packer/Packer.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

#include <iostream>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			/**
			 * @brief A reporter printing optimization result on screen.
			 * 
			 * @details
			 * <p> A reporter system prints optimization results on screen which are gotten from cheif
			 * system. </p>
			 * 
			 * <p> Of course, the optimizatino results came from the Chief system are came from Master
			 * systems and even the Master systems also got those optimization results from those own
			 * Slave systems. </p>
			 *  
			 * <p> The ReportSystem class is built for be helpful for users to comprehend using chain of
			 * responsibility pattern in network level. </p>
			 *
			 * \par [Inherited]
			 *		@copydetails ChiefDriver 
			 *
			 * @author Jeongho Nam
			 */
			class Reporter
				: public ChiefDriver
			{
			private:
				typedef ChiefDriver super;

			public:
				/* ---------------------------------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------------------------------- */
				/**
				 * @brief Default Constructor.
				 */
				Reporter()
					: super(nullptr, 37200)
				{
				};
				virtual ~Reporter() = default;

			protected:
				virtual void addClient(protocol::Socket *socket) override
				{
					std::cout << "The chief has connected." << std::endl;

					super::addClient(socket);
				};

				/* ---------------------------------------------------------------------------------
					INVOKE MESSAGE CHAIN
				--------------------------------------------------------------------------------- */
			public:
				virtual void replyData(std::shared_ptr<protocol::Invoke> invoke)
				{
					//PRINT
					std::shared_ptr<library::XML> &xml = invoke->at(0)->getvalueAsXML();

					if (xml->getTag() == "scheduler")
						printTSP(xml);
					else if (xml->getTag() == "packer")
						printPacker(xml);
				};

			protected:
				/**
				 * @brief Print TSP result on screen.
				 * 		  
				 * @param xml XML object representing a Scheduler of TSP.
				 */
				void printTSP(std::shared_ptr<library::XML> xml)
				{
					tsp::Scheduler scheduler;
					scheduler.construct(xml);

					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << "	TSP SOLVER" << std::endl;
					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << scheduler.toString() << std::endl << std::endl;
				};

				/**
				 * @brief Print Packer result on screen.
				 * 
				 * @param xml XML object representing a Packer.
				 */
				void printPacker(std::shared_ptr<library::XML> xml)
				{
					packer::Packer packer;
					packer.construct(xml);

					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << "	PACKER" << std::endl;
					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << packer.toString() << std::endl << std::endl;
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
					std::string ip;

					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << "	REPOTER" << std::endl;
					std::cout << "----------------------------------------------------------------------------" << std::endl;
					std::cout << std::endl;

					Reporter reporter;
					reporter.open();
				};
			};
		};
	};
};