#include <samchon/example/packer/Packer.hpp>

#include <samchon/library/CombinedPermutationGenerator.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::packer;

Packer::Packer()
	: super()
{
	this->productArray = make_shared<ProductArray>();
}
Packer::Packer(std::shared_ptr<ProductArray> productArray)
	: super()
{
	this->productArray = productArray;
}
Packer::Packer(const Packer &packer)
	: Packer(packer.productArray)
{
	this->reserve(packer.size());

	for (size_t i = 0; i < packer.size(); i++)
		this->emplace_back(new WrapperArray(*packer[i]));
}

void Packer::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	productArray->construct(xml->get(productArray->TAG())->at(0));
}

auto Packer::createChild(shared_ptr<XML>) -> WrapperArray*
{
	return new WrapperArray();
}

/* ---------------------------------------------------------
	CALCULATE AND OPTIMIZE
--------------------------------------------------------- */
void Packer::optimize(size_t start, size_t size)
{
	if(empty() == true || productArray->empty() == true)
		return;

	CombinedPermutationGenerator caseGenerator(this->size(), productArray->size());
	shared_ptr<Packer> minPacker = nullptr;
	
	if (size == -1 || start + size > caseGenerator.size())
		size = caseGenerator.size() - start;

	for (size_t i = start; i < start + size; i++)
	{
		vector<size_t> &row = caseGenerator[i];
		shared_ptr<Packer> packer(new Packer(*this));
		bool validity = true;

		for (size_t j = 0; j < row.size(); j++)
		{
			shared_ptr<Product> &product = productArray->at(j);
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
auto Packer::TAG() const -> string
{
	return "packer";
}
auto Packer::CHILD_TAG() const -> string
{
	return "wrapperArray";
}

auto Packer::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->push_back(productArray->toXML());

	return xml;
}
auto Packer::toString() const -> string
{
	string str = "$" + to_string(calcPrice()) + "\n";
	for (int i = 0; i < size(); i++)
		str += at(i)->toString() + "\n";

	return move(str);
}