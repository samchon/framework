#include <samchon/protocol/WebClientDriver.hpp>

#include <samchon/protocol/WebServer.hpp>

#include <iostream>
#include <array>
#include <random>
#include <boost/asio.hpp>
#include <samchon/protocol/WebSocketUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
WebClientDriver::WebClientDriver(shared_ptr<Socket> socket)
	: super(socket),
	WebCommunicator(true)
{
}
WebClientDriver::~WebClientDriver()
{
}