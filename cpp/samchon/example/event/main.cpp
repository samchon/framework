#include <iostream>
#include <thread>
#include <chrono>

#include <samchon/library/EventDispatcher.hpp>
#include <samchon/library/Event.hpp>
#include <samchon/library/ProgressEvent.hpp>

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

using namespace std;
using namespace samchon::library;

class Process
	: public EventDispatcher
{
public:
	Process()
	{

	};

	void run()
	{
		dispatchEvent(shared_ptr<Event>(new Event(this, Event::ACTIVATE)));

		for (size_t i = 0; i < 100; i++)
		{
			this_thread::sleep_for(chrono::seconds(1));
			dispatchEvent(shared_ptr<Event>(new ProgressEvent(this, i + 1, 100)));
		}

		dispatchEvent(shared_ptr<Event>(new Event(this, Event::COMPLETE)));
	};
};

void handleActivate(shared_ptr<Event> event)
{
	cout << "Activated" << endl;
}
void handleComplete(shared_ptr<Event> event)
{
	cout << "Completed" << endl;
}
void handleProgress(shared_ptr<Event> event)
{
	cout << dynamic_pointer_cast<ProgressEvent>(event)->getPercent() * 100.0 << "%" << endl;
}

void main()
{
	Process process;

	process.addEventListener(Event::ACTIVATE, handleActivate);
	process.addEventListener(Event::COMPLETE, handleComplete);
	process.addEventListener(ProgressEvent::PROGRESS, handleProgress);

	process.run();
	system("pause");
}