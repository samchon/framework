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
					int port;

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