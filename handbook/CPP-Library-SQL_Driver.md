```sql
CREATE TABLE Member
(
	email NVARCHAR(100) PRIMARY KEY,
	name NVARCHAR(100),
	age INT
);
```

```cpp
#include <iostream>
#include <samchon/library/TSQLi.hpp> // MS-SQL

using namespace std;
using namespace samchon::library;

//--------
// SQL DRIVER, IT NEEDS DLL OR SO
//--------
#ifdef _DEBUG
#	pragma comment(lib, "x64/Debug/SamchonFramework.lib")
#else
#	pragma comment(lib, "x64/Release/SamchonFramework.lib")
#endif

void insert_record(shared_ptr<SQLStatement> stmt, int index, int size)
{
	string email;
	string name;
	int age;

	cout << "Input a record to insert: " << index << " of " << size << endl;
	cout << "	E-Mail Address: ";  cin >> email;
	cout << "	Name: ";            cin >> name;
	cout << "	Age: ";             cin >> age;
	cout << endl;

	stmt->prepare
	( // BIND PARAMETERS
		"INSERT INTO Member VALUES (?, ?, ?)", 
		email, name, age // TO THE MATCHED QUESTION MARKS
	);
	stmt->execute(); // EXECUTE THE PREPARED
}

void fetch_records_with_age_range(shared_ptr<SQLStaement> stmt)
{
	int first;
	int last;
	
	stmt->prepare
	(
		"SELECT * FROM Member WHERE age BETWEEN ? AND ?", 
		first, last
	);
	stmt->execute();
	
	cout << "Records have fetched: " << endl;
	cout << "    E-Mail    |    Name    |    Age    " << endl;
	cout << "---------------------------------------" << endl;
	
	while (stmt->fetch() == true)
	{
		const string &email = stmt->at<string>(0);
		const string &name = stmt->at<string>(1);
		int age = stmt->at<int>(2);
		
		cout << email << " | " << name << " | " << age << endl;
	}
}

int main()
{
	//--------
	// CONSTRUCT SQL-DRIVER OBJECTS
	//--------
	// CREATE SQLI AND CONNECT
	shared_ptr<SQLi> sqli(new TSQLi());
	sqli->connect("127.0.0.1", "MyDB", "sa", "1231");
	
	// CREATE STATEMENT FROM SQLI
	shared_ptr<SQLStatement> stmt = sqli->createStatement();
	
	//--------
	// SQL QUERY
	//--------
	// INSERT RECORDS
	for (int i = 1; i <= 5; i++)
		insert_record(stmt);
	
	// FETCH RECORDS
	fetch_records_by_age_range(stmt);
	
	return 0;
}

```