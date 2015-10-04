#include <iostream>

#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/IHTMLEntity.hpp>
#include <samchon/protocol/SharedEntityArray.hpp>

#include <samchon/library/XML.hpp>

#ifdef _WIN64
#	ifdef _DEBUG
#		pragma comment(lib, "x64/Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "x64/Release/SamchonFramework.lib")
#	endif
#else
#	ifdef _DEBUG
#		pragma comment(lib, "Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "Release/SamchonFramework.lib")
#	endif
#endif

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

class Member 
	: public Entity, public virtual IHTMLEntity
{
protected:
	typedef Entity super;

	string id;
	string name;
	int age;
	int grade;

public:
	/* ---------------------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------------------- */
	Member() 
		: super(), IHTMLEntity()
	{
	};
	Member(const string &id, const string &name, int age, int grade)
		: super(), IHTMLEntity()
	{
		this->id = id;
		this->name = name;
		this->age = age;
		this->grade = grade;
	};
	virtual ~Member() = default;

	virtual void construct(shared_ptr<XML> xml) override
	{
		this->id = xml->getProperty("id");
		this->name = xml->getProperty("name");
		this->age = xml->getProperty<int>("age");
		this->grade = xml->getProperty<int>("grade");
	};

	/* ---------------------------------------------------------------------
		GETTERSs
	--------------------------------------------------------------------- */
	virtual auto key() const -> std::string override
	{
		return this->id;
	};

	/* ---------------------------------------------------------------------
		XML EXPORTERS
	--------------------------------------------------------------------- */
	virtual auto TAG() const -> string override
	{
		return "member";
	};
	virtual auto toXML() const -> shared_ptr<XML>
	{
		shared_ptr<XML> &xml = super::toXML();
		xml->setProperty("id", id);
		xml->setProperty("name", name);
		xml->setProperty("age", age);
		xml->setProperty("grade", grade);
		
		return move(xml);
	};
	virtual auto toHTML() const -> string
	{
		return toTR(id, name, age, grade);
	};
};

class MemberArray
	: public SharedEntityArray<Member>,
	public virtual IHTMLEntity
{
protected:
	typedef SharedEntityArray<Member> super;

	string application;
	int department;
	Member *chief;

public:
	/* ---------------------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------------------- */
	MemberArray()
		: super(), IHTMLEntity()
	{
		this->chief = nullptr;
	};
	virtual ~MemberArray() = default;

	// You don't need to consider children(Member) objects
	// Just concentrate on constructing MemberArray's own member variables
	virtual void construct(shared_ptr<XML> xml) override
	{
		super::construct(xml);

		this->application = xml->getProperty("application");
		this->department = xml->getProperty<int>("department");

		if(xml->hasProperty("chief") == true && this->has( xml->getProperty("chief") ) == true)
			this->chief = this->get( xml->getProperty("cheif") ).get();
	};

protected:
	//FACTORY METHOD FOR MEMBER
	virtual auto createChild(shared_ptr<XML> = nullptr) -> Member* override
	{
		return new Member();
	};

	/* ---------------------------------------------------------------------
		XML EXPORTERS
	--------------------------------------------------------------------- */
public:
	virtual auto TAG() const -> string override
	{
		return "memberArray";
	};
	virtual auto CHILD_TAG() const -> string override
	{
		return "member";
	};

	// You don't need to consider children(Member) objects
	// Just concentrate on expressing MemberArray's own member variables
	virtual auto toXML() const -> shared_ptr<XML>
	{
		shared_ptr<XML> &xml = super::toXML();
		xml->setProperty("application", application);
		xml->setProperty("department", department);
		
		if(chief != nullptr)
			xml->setProperty("cheif", chief->key());

		return move(xml);
	};
	virtual auto toHTML() const -> string
	{
		string html = "<table>\n";
		html += toTH("ID", "Name", "Age", "Grade") + "\n";

		for (size_t i = 0; i < 2; i++)
			html += at(i)->toHTML() + "\n";

		html += "</table>";
		return move(html);
	};
};

void main()
{
	string str = string("") +
		"<memberArray application='framework' department='7' cheif='samchon'>\n" +
		"	<member id='samchon' name='Jeongho Nam' age='27' grade='5' />" +
		"	<member id='submaster' name='No Name' age='100' grade='4' />" +
		"	<member id='john' name='John Doe' age='33' grade='2' />" +
		"	<member id='bad_man' name='Bad Man' age='44' grade='-1' />" +
		"	<member id='guest' name='Guest' age='0' grade='0' />" +
		"</memberArray>";
	shared_ptr<XML> xml(new XML(str));

	MemberArray memberArray;
	memberArray.construct(xml);

	memberArray.emplace_back(new Member("freshman", "A fresh man", 20, 2));
	memberArray.emplace_back(new Member("senior", "A senior", 70, 2));

	cout << memberArray.toXML()->toString() << endl << endl;
	cout << memberArray.toHTML() << endl;
	system("pause");
}