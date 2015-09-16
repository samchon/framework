#include <samchon/InvokeParameter.hpp>

#include <samchon/XML.hpp>
#include <samchon/StringUtil.hpp>

namespace samchon
{
	auto InvokeParameter::key() const -> string
	{
		return name;
	}

	InvokeParameter::BasicInvokeParameter(const string &name, const string &type, const string &value)
	{
		this->name = name;
		this->type = type;
		this->value = value;
	}
	InvokeParameter::BasicInvokeParameter(const string &name, shared_ptr<XML> xml)
	{
		this->name = name;
		this->type = "xml";
		this->xml = xml;
	}
	InvokeParameter::BasicInvokeParameter(shared_ptr<XML> xml)
	{
		this->name = xml->getProperty("name");
		this->type = xml->getProperty("type");

		if (this->type == "xml")
			this->xml = xml->begin()->second->at(0);
		else
			this->value = xml->getValue();
	}

	auto InvokeParameter::getName() const -> string
	{
		return name;
	}
	auto InvokeParameter::getType() const -> string
	{
		return type;
	}
	auto InvokeParameter::getValue() const -> string
	{
		return value;
	}
	auto InvokeParameter::getXML() const -> shared_ptr<XML>
	{
		return xml;
	}

	auto InvokeParameter::toXML() const -> shared_ptr<XML>
	{
		shared_ptr<XML> xml(new XML());
		xml->setKey("parameter");
		xml->setProperty("name", name);
		xml->setProperty("type", type);

		if (type == "xml")
		{
			shared_ptr<XMLList> xmlList(new XMLList());
			xmlList->push_back(this->xml);

			xml->set(this->xml->getKey(), xmlList);
		}
		else
			xml->setValue(value);

		return xml;
	}
	auto InvokeParameter::toSQL() const -> string
	{
		//NAME, TYPE, VALUE
		string value;
		if (xml != nullptr)
			value = move(xml->to_string());
		else
			value = this->value;

		string &sql = StringUtil::substituteSQL("({1}, {2}, {3})", name, type, value);
		return move(sql);
	}
};