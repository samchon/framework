#pragma once
#include <samchon/protocol/ExternalServerArray.hpp>
#include <samchon/example/interaction/chief/System.hpp>

#include <samchon/protocol/Invoke.hpp>

#include <samchon/example/packer/Packer.hpp>
#include <samchon/example/tsp/Scheduler.hpp>

#include <thread>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			namespace chief
			{
				class Chief
					: public protocol::ExternalServerArray
				{
				private:
					typedef protocol::ExternalServerArray super;

				public:
					/* ---------------------------------------------------------------------------------
						CONSTRUCTORS
					--------------------------------------------------------------------------------- */
					Chief(const std::string &ip)
					{
						emplace_back(new System(this, "TSP", "127.0.0.1", 37110));
						emplace_back(new System(this, "Reporter", ip, 37200));
						emplace_back(new System(this, "Packer", ip, 37310));
					};
					virtual ~Chief() = default;

					virtual void start()
					{
						std::thread([this]()
						{
							super::start();
						}).detach();

						while (true)
						{
							int no;

							std::cout << "1. TSP Solver, 2. Packer: ";
							std::cin >> no;

							if (no == 1)
								callTSP();
							else if (no == 2)
								callPacker();
							else
								continue;
						}
					};

				protected:
					virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::ExternalSystem*
					{
						return nullptr;
					};

				public:
					/* ---------------------------------------------------------------------------------
						INVOKE MESSATE CHAIN
					--------------------------------------------------------------------------------- */
					virtual void replyData(std::shared_ptr<protocol::Invoke> invoke)
					{
						get("Reporter")->sendData(invoke);
					};

				private:
					void callPacker()
					{
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

						// SEND
						get("Packer")->sendData(std::make_shared<protocol::Invoke>("optimize", packer.toXML()));
					};

					void callTSP()
					{
						std::shared_ptr<tsp::Travel> travel = std::make_shared<tsp::Travel>();
						for(int i = 0; i < 20; i++)
							travel->emplace_back(new tsp::GeometryPoint(i + 1));

						// GENETIC ALGORITHM
						struct tsp::GAParameters gaParameters = {.03, 30, 400, 400};

						// SEND
						tsp::Scheduler scheduler(travel, gaParameters);
						get("TSP")->sendData(std::make_shared<protocol::Invoke>("optimize", scheduler.toXML()));
					};

				public:
					/* ---------------------------------------------------------------------------------
						MAIN
					--------------------------------------------------------------------------------- */
					static void main()
					{
						std::string ip;

						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	CHIEF" << std::endl;
						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	ip: ";	std::cin >> ip;

						Chief cheif(ip);
						cheif.start();
					};
				};
			};
		};
	};
};