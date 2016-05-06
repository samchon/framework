#include <iostream>
#include <thread>
#include <samchon/library/RWMutex.hpp>

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

void main()
{
	RWMutex mtx;

	for (size_t i = 0; i < 10; i++)
		thread([&mtx]() 
			{
				UniqueWriteLock uk(mtx);

				cout << "AAAAA" << endl;
				this_thread::sleep_for(1s);
			}).detach();

	system("pause");
}