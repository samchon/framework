#include <samchon/protocol/master/ParallelSystemArrayMediator.hpp>

#include <samchon/protocol/master/MediatorSystem.hpp>
#include <samchon/protocol/master/PRInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ParallelSystemArrayMediator::ParallelSystemArrayMediator()
	: super()
{
}
ParallelSystemArrayMediator::~ParallelSystemArrayMediator()
{
}

/* ---------------------------------------------------------
	NETWORK INITIALIZATION
--------------------------------------------------------- */
void ParallelSystemArrayMediator::start_mediator()
{
	if (mediator != nullptr)
		return;

	mediator.reset(this->createMediator());
	mediator->start();
}

/* ---------------------------------------------------------
	MESSAGE CHAIN
--------------------------------------------------------- */
void ParallelSystemArrayMediator::sendData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("invoke_history_uid") == true)
	{
		size_t piece_index = invoke->at(invoke->size() - 2)->getValue<size_t>();
		size_t piece_size = invoke->at(invoke->size() - 1)->getValue<size_t>();
		invoke->erase(invoke->end() - 2, invoke->end());

		this->sendPieceData(invoke, piece_index, piece_size);
	}
	else
		super::sendData(invoke);
}

void ParallelSystemArrayMediator::sendPieceData(shared_ptr<Invoke> invoke, size_t index, size_t size)
{
	// CHECK VALIDITY - RESERVED PARAMETER
	static const std::array<std::string, 3> RESERVED_PARAMETERS = { "invoke_history_uid", "piece_index", "piece_size" };

	for (size_t i = 0; i < RESERVED_PARAMETERS.size(); i++)
		if (invoke->has(RESERVED_PARAMETERS[i]) == false)
			throw std::domain_error("This is a mediator system. Don't send command directly by yourself.");

	// SPLIT TO PIECES AND SEND TO EACH SYSTEM
	for (size_t i = 0; i < this->size(); i++)
	{
		shared_ptr<ParallelSystem> &system = this->at(i);

		size_t piece_size = (i == this->size() - 1)
			? size - index
			: (size_t)(size / this->size() * system->getPerformance());
		if (piece_size == 0)
			continue;

		system->send_piece_data(invoke, index, piece_size);
		index += piece_size;
	}
}

auto ParallelSystemArrayMediator::notify_end(shared_ptr<PRInvokeHistory> history) -> bool
{
	bool ret = super::notify_end(history);
	if (ret == true)
		mediator->notify_end(history->getUID());
	
	return true;
}