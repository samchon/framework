#include <samchon/protocol/Invoke.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/library/StringUtil.hpp>

#include <samchon/library/SQLStatement.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

Invoke::Invoke(const String &listener)
		: VectorDictionary<InvokeParameter>()
	{
		this->listener = listener;
	}
	Invoke::Invoke(shared_ptr<XML> xml)
		: Invoke(xml->getProperty(_T("listener")))
	{
		if (xml->has(_T("parameter")) == false)
			return;

		std::shared_ptr<XMLList> xmlList = xml->get(_T("parameter"));
		for (auto it = xmlList->begin(); it != xmlList->end(); it++)
			push_back(new InvokeParameter(*it));
	}

	auto Invoke::getListener() const -> String
	{
		return listener;
	}

	void Invoke::archive(shared_ptr<SQLStatement> stmt)
	{
		//stmt->prepare(_T("archive"));
	}

	auto Invoke::toXML() const -> shared_ptr<XML>
	{
		std::shared_ptr<XML> xml(new XML());
		xml->setTag(_T("invoke"));
		xml->setProperty(_T("listener"), listener);

		std::shared_ptr<XMLList> xmlList(new XMLList());
		xmlList->reserve(size());

		for (auto it = begin(); it != end(); it++)
			xmlList->push_back((*it)->toXML());

		xml->set(_T("parameter"), xmlList);
		return xml;
	}
	auto Invoke::toSQL() const -> String
	{
		String sql = _T("DECLARE @parameterTable INVOKE_PARAMETER_INSERT_TABLE\n");
		if (empty() == false)
		{
			sql += _T("INSERT INTO @parameterTable VALUES\n");
			for (size_t i = 0; i < size(); i++)
				sql += _T("\t") + at(i)->toSQL() + ((i == size() - 1) ? _T(";\n\n") : _T(",\n"));
		}
		sql += _T("EXEC goInsertInvokeHistory ?, ?, @parameterTable, ?"); //SERVICE, MEMBER_ID
		return move(sql);
	}