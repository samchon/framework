#include <samchon/protocol/ExternalServerArray.hpp>

#include <samchon/protocol/ExternalSystem.hpp>

#include <vector>
#include <thread>

using namespace std;
using namespace samchon::protocol;

ExternalServerArray::ExternalServerArray()
	: super()
{
}
void ExternalServerArray::start()
{
	vector<thread> threadArray;
	for(size_t i = 0; i < size(); i++)
		threadArray.emplace_back(&ExternalSystem::start, at(i).get());

	for(size_t i = 0; i < threadArray.size(); i++)
		threadArray[i].join();
}