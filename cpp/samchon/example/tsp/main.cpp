#include <samchon/example/tsp/Scheduler.hpp>
#include <samchon/example/tsp/Travel.hpp>

using namespace samchon::example::tsp;

#ifdef _WIN64
#	ifdef _DEBUG
#		pragma comment(lib, "x64/Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "x64/Release/SamchonFramework.lib")
#	endif
#else
#	ifdef _DEBUG
#		pragma comment(lib, "Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "Release/SamchonFramework.lib")
#	endif
#endif

void main()
{
	Scheduler::main();
	
	system("pause");
}