```cpp
#include <exception>
#include <string>

#include <samchon/library/RWMutex.hpp>
#include <samchon/library/Semaphore.hpp>

using namespace std;
using namespace samchon::library;

class Member
{
private:
	string id;
	string name;
	int age;
	
	RWMutex mtx;
	Semaphore semaphore;
	
public:
	auto getID() const -> string
	{
		mtx.readLock();
		const string &id = this->id;
		mtx.readUnlock();
		
		return id;
	};
	
	void setID(const string &val)
	{
		mtx.writeLock();
		this->id = val;
		mtx.writeUnlock();
	}

	auto getName() const -> string
	{
		UniqueReadLock uk(mtx);
		return name;
	};
	
	void setName(const string &val)
	{
		UniqueWriteLock uk(mtx);
		this->name = val;
	};
	
	void invite()
	{
		UniqueAcquire ua(semaphore);
		
		// DO SOMETHING
		throw exception("dummy exception");
	};
};
```