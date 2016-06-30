#pragma once
#include <samchon/protocol/NormalServerConnector.hpp>

using namespace samchon::protocol;

NormalServerConnector::NormalServerConnector(IProtocol *listener)
	: super(listener),
	NormalCommunicator()
{
}

NormalServerConnector::~NormalServerConnector()
{
}