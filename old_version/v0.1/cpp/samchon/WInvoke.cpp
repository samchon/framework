#include <samchon/Invoke.hpp>

#include <samchon/XML.hpp>
#include <samchon/StringUtil.hpp>

namespace samchon
{
	WInvoke::BasicInvoke(const wstring &listener)
		: WVectorDict<WInvokeParameter>()
	{
		this->listener = listener;
	}
	WInvoke::BasicInvoke(shared_ptr<WXML> xml)
		: WInvoke(xml->getProperty(L"listener"))
	{
		if (xml->has(L"parameter") == false)
			return;

		std::shared_ptr<WXMLList> xmlList = xml->get(L"parameter");
		for (auto it = xmlList->begin(); it != xmlList->end(); it++)
			push_back(new WInvokeParameter(*it));
	}
	
	auto WInvoke::getListener() const -> wstring
	{
		return listener;
	}

	void WInvoke::add(const wstring &name, const wstring &type, const wstring &val)
	{
		if (dictionary.has(name) == true)
			return;

		push_back(new WInvokeParameter(name, type, val));
	}
	void WInvoke::add(const wstring &name, shared_ptr<WXML> xml)
	{
		if (dictionary.has(name) == true)
			return;

		push_back(new WInvokeParameter(name, xml));
	}

	auto WInvoke::toXML() const -> shared_ptr<WXML>
	{
		std::shared_ptr<WXML> xml(new WXML());
		xml->setKey(L"invoke");
		xml->setProperty(L"listener", listener);

		std::shared_ptr<WXMLList> xmlList(new WXMLList());
		xmlList->reserve(size());

		for (auto it = begin(); it != end(); it++)
			xmlList->push_back((*it)->toXML());

		xml->set(L"parameter", xmlList);
		return xml;
	}
	auto WInvoke::toSQL() const -> wstring
	{
		wstring sql = L"DECLARE @parameterTable INVOKE_PARAMETER_INSERT_TABLE\n";
		if (empty() == false)
		{
			sql += L"INSERT INTO @parameterTable VALUES\n";
			for (size_t i = 0; i < size(); i++)
				sql += L"\t" + at(i)->toSQL() + ((i == size() - 1) ? L";\n\n" : L",\n");
		}
		sql += L"EXEC goInsertInvokeHistory ?, ?, @parameterTable, ?"; //SERVICE, LISTENER(METHOD), MEMBER_ID
		return move(sql);
	};
};