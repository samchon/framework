#include <samchon/examples/packer/WrapperArray.hpp>

#include <samchon/library/FactorialGenerator.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::packer;

/* ---------------------------------------------------------
	CONSTRUCTOR
--------------------------------------------------------- */
WrapperArray::WrapperArray()
	: super()
{
	this->reserved = make_shared<ProductArray>();
	this->sample = make_shared<Wrapper>();
}
WrapperArray::WrapperArray(const string &name, int price, int volume, int weight)
	: super()
{
	this->reserved = make_shared<ProductArray>();
	this->sample = make_shared<Wrapper>(name, price, volume, weight);
}
WrapperArray::WrapperArray(const WrapperArray &wrapperArray)
	: super()
{
	this->reserved = make_shared<ProductArray>();
	this->sample = wrapperArray.sample;
}
void WrapperArray::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	sample->construct(xml);
}

auto WrapperArray::createChild(shared_ptr<XML>) -> Wrapper*
{
	return new Wrapper();
}

/* ---------------------------------------------------------
	CALCULATE AND OPTIMIZE
--------------------------------------------------------- */
auto WrapperArray::tryInsert(shared_ptr<Product> product) -> bool
{
	if (product->getVolume() > sample->getVolume() ||
		product->getWeight() > sample->getWeight())
	{
		return false;
	}
	
	reserved->push_back(product);
	return true;
}
void WrapperArray::optimize()
{
	if(reserved->empty() == true)
		return;
	
	FactorialGenerator factorial(reserved->size());
	shared_ptr<WrapperArray> minWrapperArray = nullptr;
	
	for (int i = 0; i < factorial.size(); i++)
	{
		shared_ptr<WrapperArray> wrapperArray(new WrapperArray(*this));
		vector<size_t> &row = factorial[i];

		for (size_t j = 0; j < row.size(); j++)
		{
			shared_ptr<Product> &product = this->reserved->at(row[j]);
			
			if (wrapperArray->empty() == true || 
				wrapperArray->at(wrapperArray->size() - 1)->tryInsert(product) == false)
			{
				Wrapper *wrapper = new Wrapper(*this->sample);
				wrapper->tryInsert(product);

				wrapperArray->emplace_back(wrapper);
			}
		}
		
		//unique_lock<mutex> uk(mtx);
		if (minWrapperArray == nullptr ||
			wrapperArray->size() < minWrapperArray->size())
		{
			minWrapperArray = wrapperArray;
		}
	}

	assign(minWrapperArray->begin(), minWrapperArray->end());
}
auto WrapperArray::calcPrice() const -> int
{
	return sample->getPrice() * (int)size();
}

/* ---------------------------------------------------------
	EXPORT
--------------------------------------------------------- */
auto WrapperArray::TAG() const -> string
{
	return "wrapperArray";
}
auto WrapperArray::CHILD_TAG() const -> string
{
	return "wrapper";
}

auto WrapperArray::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->addAllProperty(sample->toXML());

	return xml;
}

auto WrapperArray::toString() const -> string
{
	string str = "Category - " + sample->getName() + "\n";
	for (size_t i = 0; i < size(); i++)
		str += at(i)->toString() + "\n";

	return move(str);
}