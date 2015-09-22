#include "WrapperArray.hpp"
#	include "Wrapper.hpp"
#	include "Product.hpp"

#include <samchon/library/FactorialGenerator.hpp>
#include <mutex>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::packer;

/* ---------------------------------------------------------
	CONSTRUCTOR
--------------------------------------------------------- */
WrapperArray::WrapperArray(Wrapper *sample)
	: super()
{
	this->sample = sample;
}

/* ---------------------------------------------------------
	CALCULATE AND OPTIMIZE
--------------------------------------------------------- */
auto WrapperArray::tryInsert(Product *product) -> bool
{
	if (product->getVolume() > sample->getVolume() ||
		product->getWeight() > sample->getWeight())
	{
		return false;
	}

	reserved.push_back(product);
	return true;
}
void WrapperArray::optimize()
{
	if(reserved.empty() == true)
		return;
	
	FactorialGenerator factorial(reserved.size());
	shared_ptr<WrapperArray> minWrapperArray = nullptr;
	
	mutex mtx;

	#pragma omp parallel for
	for (int i = 0; i < factorial.size(); i++)
	{
		shared_ptr<WrapperArray> wrapperArray(new WrapperArray(this->sample));
		vector<size_t> &row = factorial[i];

		for (size_t j = 0; j < row.size(); j++)
		{
			Product *product = this->reserved[j];
			
			if (wrapperArray->empty() == true || 
				wrapperArray->at(wrapperArray->size() - 1)->tryInsert(product) == false)
			{
				Wrapper *wrapper = new Wrapper(*this->sample);
				wrapper->tryInsert(product);

				wrapperArray->emplace_back(wrapper);
			}
		}

		unique_lock<mutex> uk(mtx);
		if (minWrapperArray == nullptr ||
			wrapperArray->calcPrice() < minWrapperArray->calcPrice())
		{
			minWrapperArray = wrapperArray;
		}
	}

	//COPY
	assign(minWrapperArray->begin(), minWrapperArray->end());
}
auto WrapperArray::calcPrice() const -> int
{
	return sample->getPrice() * (int)size();
}

/* ---------------------------------------------------------
	EXPORT
--------------------------------------------------------- */
auto WrapperArray::toString() const -> string
{
	string str = "Category - " + sample->getName() + "\n";
	for (size_t i = 0; i < size(); i++)
		str += at(i)->toString() + "\n";

	return move(str);
}