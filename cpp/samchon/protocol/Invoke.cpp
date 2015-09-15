#include <samchon/protocol/Invoke.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/library/StringUtil.hpp>

#include <samchon/library/SQLStatement.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

Invoke::Invoke(const std::string &listener)
		: super()
	{
		this->listener = listener;
	}
	Invoke::Invoke(shared_ptr<XML> xml)
		: Invoke(xml->getProperty("listener"))
	{
		if (xml->has("parameter") == false)
			return;

		std::shared_ptr<XMLList> xmlList = xml->get("parameter");
		for (size_t i = 0; i < xmlList->size(); i++)
			emplace_back(new InvokeParameter( xmlList->at(i) ));
	}

	auto Invoke::getListener() const -> std::string
	{
		return listener;
	}

	/* -----------------------------------------------------------------------
		EXPORTERS
	----------------------------------------------------------------------- */
	auto Invoke::toXML() const -> shared_ptr<XML>
	{
		std::shared_ptr<XML> xml(new XML());
		xml->setTag("invoke");
		xml->setProperty("listener", listener);

		std::shared_ptr<XMLList> xmlList(new XMLList());
		xmlList->reserve(size());

		for (auto it = begin(); it != end(); it++)
			xmlList->push_back((*it)->toXML());

		xml->set("parameter", xmlList);
		return xml;
	}
	auto Invoke::toSQL() const -> std::string
	{
		std::string sql = "DECLARE @parameterTable INVOKE_PARAMETER_INSERT_TABLE\n";
		if (empty() == false)
		{
			sql += "INSERT INTO @parameterTable VALUES\n";
			for (size_t i = 0; i < size(); i++)
				sql += "\t" + at(i)->toSQL() + ((i == size() - 1) ? ";\n\n" : ",\n");
		}
		sql += "EXEC goInsertInvokeHistory ?, ?, @parameterTable, ?"; //SERVICE, MEMBER_ID
		return move(sql);
	}