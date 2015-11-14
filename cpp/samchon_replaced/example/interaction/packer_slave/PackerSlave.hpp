#pragma once
#include <samchon/protocol/slave/ParallelClient.hpp>

#include <samchon/example/packer/Packer.hpp>
#include <samchon/protocol/Invoke.hpp>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			namespace packer_slave
			{
				class PackerSlave
					: public protocol::slave::ParallelClient
				{
				private:
					typedef protocol::slave::ParallelClient super;

				protected:
					std::shared_ptr<packer::Packer> packer;

				public:
					/* ---------------------------------------------------------------------------------
						CONSTRUCTORS
					--------------------------------------------------------------------------------- */
					PackerSlave(const std::string &ip, int port)
						: super()
					{
						this->ip = ip;
						this->port = port;

						packer = std::make_shared<packer::Packer>();
					};
					virtual ~PackerSlave() = default;

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
					void optimize(std::shared_ptr<library::XML> xml, size_t index, size_t size)
					{
						std::cout << "----------------------------------------------------------------------------" << std::endl;
						std::cout << "	OPTIMIZE FROM " << index << ", SIZE: " << size << std::endl;
						std::cout << "----------------------------------------------------------------------------" << std::endl;

						packer->construct(xml);
						packer->optimize(index, size);

						std::cout << packer->toString() << std::endl << std::endl;
						sendData(std::make_shared<protocol::Invoke>("replyOptimization", packer->toXML()));
					};

				public:
					/* ---------------------------------------------------------------------------------
						MAIN
					--------------------------------------------------------------------------------- */
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
};