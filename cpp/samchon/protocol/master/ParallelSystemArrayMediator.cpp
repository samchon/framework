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
		size_t piece_index = invoke->get("piece_index")->getValue<size_t>();
		size_t piece_size = invoke->get("piece_size")->getValue<size_t>();
		invoke->erase("piece_index");
		invoke->erase("piece_size");

		this->sendPieceData(invoke, piece_index, piece_size);
	}
	else
		super::sendData(invoke);
}

void ParallelSystemArrayMediator::sendPieceData(shared_ptr<Invoke> invoke, size_t index, size_t size)
{
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
	if (super::notify_end(history) == false)
		return false;

	mediator->notifyEnd(history->getUID());
	return true;
}