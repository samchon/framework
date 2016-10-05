#include <samchon/templates/external/ExternalServerArray.hpp>

#include <thread>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::external;

ExternalServerArray::ExternalServerArray()
	: ExternalSystemArray()
{
}
ExternalServerArray::~ExternalServerArray()
{
}

void ExternalServerArray::connect()
{
	vector<thread> thread_array;

	for (size_t i = 0; i < size(); i++)
	{
		auto external_server = std::dynamic_pointer_cast<ExternalServer>(this->at(i));
		if (external_server == nullptr)
			continue;

		thread_array.emplace_back(&ExternalServer::connect, external_server.get());
	}

	for (size_t i = 0; i < thread_array.size(); i++)
		thread_array[i].join();
}