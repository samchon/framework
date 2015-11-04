#include <iostream>
#include <vector>

#include "Packer.hpp"

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
	shared_ptr<ProductArray> productArray(new ProductArray());
	productArray->emplace_back(new Product("Eraser", 500, 10, 70));
	productArray->emplace_back(new Product("Pencil", 400, 30, 35));
	/*productArray->emplace_back(new Product("Pencil", 400, 30, 35));
	productArray->emplace_back(new Product("Pencil", 400, 30, 35));
	productArray->emplace_back(new Product("Book", 8000, 150, 300));*/
	productArray->emplace_back(new Product("Book", 8000, 150, 300));
	productArray->emplace_back(new Product("Drink", 1000, 75, 250));
	productArray->emplace_back(new Product("Umbrella", 4000, 200, 1000));
	productArray->emplace_back(new Product("Notebook-PC", 800000, 150, 850));
	productArray->emplace_back(new Product("Tablet-PC", 600000, 120, 450));

	Packer packer(productArray);
	packer.emplace_back(new WrapperArray("Large", 100, 200, 1000));
	packer.emplace_back(new WrapperArray("Medium", 70, 150, 500));
	packer.emplace_back(new WrapperArray("Small", 50, 100, 250));

	Packer packer2;
	packer2.construct(packer.toXML());

	packer2.optimize();

	cout << packer2.toString() << endl;
	system("pause");
}