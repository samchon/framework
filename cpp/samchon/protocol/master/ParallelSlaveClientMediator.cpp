#include <samchon/protocol/master/ParallelSlaveClientMediator.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

ParallelSlaveClientMediator::ParallelSlaveClientMediator()
	: super(),
	network_super()
{
}

void ParallelSlaveClientMediator::setAddress(const string &ip, int port, const string &myIP)
{
	this->ip = ip;
	this->port = port;
	this->myIP = myIP;
}