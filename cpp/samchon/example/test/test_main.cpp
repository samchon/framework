#include <iostream>
#include <unordered_map>

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

void main()
{
	unordered_map<int, int> intMap;
	for (int i = 1; i <= 10; i++)
		intMap[i] = i;

	for (unordered_map<int, int>::iterator it = intMap.begin(); it != intMap.end(); it++)
	{
		if (it->first == 3)
		{
			int val = it->second;

			it = intMap.erase(it);
			intMap.insert(it, {33, val});
		}
	}

	for (auto it = intMap.begin(); it != intMap.end(); it++)
		cout << it->first << ", " << it->second << endl;

	system("pause");
}