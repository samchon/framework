#include <iostream>
#include <vector>

#include "Packer.hpp"
#	include "Product.hpp"
#	include "Wrapper.hpp"

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
using namespace samchon::example::packer;

void main()
{
	vector<Product> productArray =
	{
		
		Product("Eraser", 500, 10, 70),
		Product("Pencil", 400, 30, 35),
		Product("Pencil", 400, 30, 35),
		Product("Pencil", 400, 30, 35),
		Product("Book", 8000, 150, 300),
		Product("Book", 8000, 150, 300),
		Product("Drink", 1000, 75, 250),
		Product("Umbrella", 4000, 200, 1000),
		Product("Notebook-PC", 800000, 150, 850),
		Product("Tablet-PC", 600000, 120, 450)
	};
	vector<Wrapper> wrapperArray =
	{
		Wrapper("Large", 100, 200, 1000),
		Wrapper("Medium", 70, 150, 500),
		Wrapper("Small", 50, 100, 250)
	};

	Packer packer(&productArray, &wrapperArray);
	packer.optimize();

	cout << packer.toString() << endl;
	system("pause");
}