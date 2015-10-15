#include <samchon/Invoke.hpp>

#include <samchon/XML.hpp>
#include <samchon/StringUtil.hpp>

namespace samchon
{
	Invoke::BasicInvoke(const string &listener)
		: VectorDict<InvokeParameter>()
	{
		this->listener = listener;
	}
	Invoke::BasicInvoke(shared_ptr<XML> xml)
		: Invoke(xml->getProperty("listener"))
	{
		if (xml->has("parameter") == false)
			return;

		std::shared_ptr<XMLList> xmlList = xml->get("parameter");
		for (auto it = xmlList->begin(); it != xmlList->end(); it++)
			push_back(new InvokeParameter(*it));
	}

	auto Invoke::getListener() const -> string
	{
		return listener;
	}

	void Invoke::add(const string &name, const string &type, const string &val)
	{
		if (dictionary.has(name) == true)
			return;

		push_back(new InvokeParameter(name, type, val));
	}
	void Invoke::add(const string &name, shared_ptr<XML> xml)
	{
		if (dictionary.has(name) == true)
			return;

		push_back(new InvokeParameter(name, xml));
	}

	auto Invoke::toXML() const -> shared_ptr<XML>
	{
		std::shared_ptr<XML> xml(new XML());
		xml->setKey("invoke");
		xml->setProperty("listener", listener);

		std::shared_ptr<XMLList> xmlList(new XMLList());
		xmlList->reserve(size());

		for (auto it = begin(); it != end(); it++)
			xmlList->push_back((*it)->toXML());

		xml->set("parameter", xmlList);
		return xml;
	}
	auto Invoke::toSQL() const -> string
	{
		string sql = "DECLARE @parameterTable INVOKE_PARAMETER_INSERT_TABLE\n";
		if (empty() == false)
		{
			sql += "INSERT INTO @parameterTable VALUES\n";
			for (size_t i = 0; i < size(); i++)
				sql += "\t" + at(i)->toSQL() + ((i == size() - 1) ? ";\n\n" : ",\n");
		}
		sql += "EXEC goInsertInvokeHistory ?, ?, @parameterTable, ?"; //SERVICE, MEMBER_ID
		return move(sql);
	};
};