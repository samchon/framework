#include <samchon/InvokeParameter.hpp>

#include <samchon/XML.hpp>
#include <samchon/StringUtil.hpp>

namespace samchon
{
	auto WInvokeParameter::key() const -> wstring
	{
		return name;
	}

	WInvokeParameter::BasicInvokeParameter(const wstring &name, const wstring &type, const wstring &value)
	{
		this->name = name;
		this->type = type;
		this->value = value;
	}
	WInvokeParameter::BasicInvokeParameter(const wstring &name, shared_ptr<WXML> xml)
	{
		this->name = name;
		this->type = L"xml";
		this->xml = xml;
	}
	WInvokeParameter::BasicInvokeParameter(shared_ptr<WXML> xml)
	{
		this->name = xml->getProperty(L"name");
		this->type = xml->getProperty(L"type");

		if (this->type == L"xml")
			this->xml = xml->begin()->second->at(0);
		else
			this->value = xml->getValue();
	}

	auto WInvokeParameter::getName() const -> wstring
	{
		return name;
	}
	auto WInvokeParameter::getType() const -> wstring
	{
		return type;
	}
	auto WInvokeParameter::getValue() const -> wstring
	{
		return value;
	}
	auto WInvokeParameter::getXML() const -> shared_ptr<WXML>
	{
		return xml;
	}

	auto WInvokeParameter::toXML() const -> shared_ptr<WXML>
	{
		shared_ptr<WXML> xml(new WXML());
		xml->setKey(L"parameter");
		xml->setProperty(L"name", name);
		xml->setProperty(L"type", type);

		if (type == L"xml")
		{
			shared_ptr<WXMLList> xmlList(new WXMLList());
			xmlList->push_back(this->xml);

			xml->set(this->xml->getKey(), xmlList);
		}
		else
			xml->setValue(value);

		return xml;
	}
	auto WInvokeParameter::toSQL() const -> wstring
	{
		//NAME, TYPE, VALUE
		wstring value;
		if (xml != nullptr)
			value = move(xml->to_string());
		else
			value = this->value;

		wstring &sql = WStringUtil::substituteSQL(L"({1}, {2}, {3})", name, type, value);
		return move(sql);
	}
};