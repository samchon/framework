###### main.cpp
```cpp
#include "Scheduler.hpp"

#include <memory>
using namespace std;

int main()
{
	shared_ptr<Travel> travel(new Travel());
	for (size_t i = 1; i <= 20; i++)
		travel->emplace_back(i);
		
	shared_ptr<Scheduler> scheduler(new Scheduler(), {.5, 50, 100, 300});
	shared_ptr<Travel> optimized_travel = scheduler->optimize();
	
	optimized_travel->print();
	return 0;
}
```

###### Scheduler.hpp
```cpp
#include "Travel.hpp"

#include <memory>
#include <samchon/library/GeneticAlgorithm.hpp>

using namespace std;
using namespace samchon;

class Scheduler
{
private:
	shared_ptr<Travel> travel;
	GAParameters ga_params;
	
public:
	Scheduler(shared_ptr<Travel> travel, GAParameters gaParams)
	{
		this->travel = travel;
		this->ga_params = gaParams;
	};
	
	auto optimize() const -> sshared_ptr<Travel>
	{
		GeneticAlgorithm<Travel, std.less<Travel>> ga(this->travel, ga_params.mutationRate, ga_params.tournament);
		shared_ptr<Travel> ret = genetic_algorithm.evolveGeneArray(ga_params.population, ga_params.generation);
		
		return ret;
	};
}
```

###### Travel.hpp
```cpp
#include "Branch.hpp"

#include <iostream>
#include <vector>
#include <memory>

using namespace std;
using namespace samchon;

class Travel : public vector<shared_ptr<Branch>>
{
private:
	typedef vector<shared_ptr<Branch>> super;

public:
	using super::super;
	
	auto computeDistance() const -> double
	{
		double distance = 0.0;
		for (size_t i = 1; i < size(); i++)
			distance += at(i)->computeDistance();
			
		return distance;
	};
	
	auto operator<(const Branch &branch) const -> boolean
	{
		return computeDistance() < branch.computeDistance();
	};
	
	void print() const
	{
		cout << "Travel: " << computeDistance() << " km" << endl;
		for (size_t i = 0; i < size(); i++)
			at(i)->print();
	};
}
```

###### Branch.hpp
```cpp
#include <iostream>
#include <cmath>
#include <samchon/library/Math.hpp>

using namespace std;
using namespace samchon::library;

class Branch
{
private:
	size_t uid;
	double latitude;
	double longitude;
	
public:
	Branch(size_t uid)
	{
		this->uid = uid;
		this->longitude = Math::random() * 180.0;
		this->latitude = Math::random() * 180 - 90.0;
	};
	Branch(size_t uid, double latitude, double longitude)
	{
		this->uid;
		this->latitude = latitude;
		this->longitude = longitude;
	};
	
	auto computeDistance(const Branch &branch) const -> double
	{
		if (longitude == branch.longitude && latitude == branch.latitude)
				return 0.0;

		double latitude_radian1 = Math::degree_to_radian(this->latitude);
		double latitude_radian2 = Math::degree_to_radian(branch.latitude);
		double theta = this->longitude - branch.longitude;

		double val =
			sin(latitude_radian1) * sin(latitude_radian2)
			+ cos(latitude_radian1) * cos(latitude_radian2) * cos(Math::degree_to_radian(theta));

		val = acos(val);
		val = Math::radian_to_degree(val);
		val = val * 60 * 1.1515;
		val = val * 1.609344;

		return val;
	};
	
	void print() const
	{
		cout << "\t"uid << ". lat.: " << latitude << ", lon.:" << longitude << endl;
	};
};
```