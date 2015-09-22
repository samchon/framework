#include "Packer.hpp"

#include "WrapperArray.hpp"
#include "Wrapper.hpp"
#include "Product.hpp"

#include <samchon/library/CombinedPermutationGenerator.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::packer;

Packer::Packer(vector<Product> *productArray, vector<Wrapper> *wrapperArray)
	: super()
{
	this->productArray = productArray;
	this->wrapperArray = wrapperArray;

	for(size_t i = 0; i < wrapperArray->size(); i++)
		emplace_back(new WrapperArray(&wrapperArray->at(i)));
}
Packer::Packer(const Packer &packer)
	: Packer(packer.productArray, packer.wrapperArray)
{
}

/* ---------------------------------------------------------
	CALCULATE AND OPTIMIZE
--------------------------------------------------------- */
void Packer::optimize()
{
	if(empty() == true || productArray->empty() == true)
		return;

	CombinedPermutationGenerator caseGenerator(size(), productArray->size());
	shared_ptr<Packer> minPacker = nullptr;
	
	for (size_t i = 0; i < caseGenerator.size(); i++)
	{
		vector<size_t> &row = caseGenerator[i];
		shared_ptr<Packer> packer(new Packer(*this));
		bool validity = true;

		for (size_t j = 0; j < row.size(); j++)
		{
			Product *product = &productArray->at(j);
			shared_ptr<WrapperArray> &wrapperArray = packer->at( row[j] );

			if (wrapperArray->tryInsert(product) == false)
			{
				validity = false;
				break;
			}
		}

		if(validity == false)
			continue;

		//OPTIMIZE ALL WRAPPERS IN A PACKER
		for (size_t j = 0; j < packer->size(); j++)
			packer->at(j)->optimize();

		if (minPacker == nullptr ||
			packer->calcPrice() < minPacker->calcPrice())
		{
			minPacker = packer;
		}
	}

	//COPY
	assign(minPacker->begin(), minPacker->end());
}
auto Packer::calcPrice() const -> int
{
	int price = 0;
	for (size_t i = 0; i < size(); i++)
		price += at(i)->calcPrice();

	return price;
}

/* ---------------------------------------------------------
	EXPORT
--------------------------------------------------------- */
auto Packer::toString() const -> string
{
	string str = "$" + to_string(calcPrice()) + "\n";
	for (int i = 0; i < size(); i++)
		str += at(i)->toString() + "\n";

	return move(str);
}