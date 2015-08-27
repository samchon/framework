#include <samchon/library/Datetime.hpp>

#include <chrono>
#include <samchon/WeakString.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

typedef chrono::system_clock::time_point TimePoint;

/* ----------------------------------------------------------
	CONSTRUCTORS
---------------------------------------------------------- */
//CONSTRUCTORS
Datetime::Datetime()
	: super()
{
}
Datetime::Datetime(const Date &date)
	: super(date)
{
}
Datetime::Datetime(Date &&date)
	: super(move(date))
{
}
Datetime::Datetime(int year, int month, int date, int hour, int min, int sec)
	: Datetime()
{
	set(year, month, date, hour, min, sec);
}
Datetime::Datetime(const WeakString &wStr)
	: Datetime()
{
	set(wStr);
}
Datetime::Datetime(long long linuxTime)
	: Datetime()
{
	set(linuxTime);
}

//SEMI-CONSTRUCTORS
void Datetime::set(const WeakString &wStr)
{
	super::set(wStr);
	if (wStr.find(_T(" ")) == String::npos)
		return;

	vector<WeakString> &vec = wStr.between(_T(" ")).split(_T(":"));
	int hour = stoi(vec[0].str());
	int min = stoi(vec[1].str());
	int sec = stoi(vec[2].str());

	set(getYear(), getMinute(), getSecond(), hour, min, sec);
}
void Datetime::set(int year, int month, int date, int hour, int minutes, int seconds)
{
	super::set(year, month, date);
	addSecond( hour*60*60 + minutes*60 + seconds );
}
void Datetime::set(long long linuxTime)
{
	super::set(linuxTime);
}

/* ----------------------------------------------------------
	GET-SETTERS
---------------------------------------------------------- */
//SETTERS
void Datetime::setYear(int val)
{
	int hour = getHour();
	int minutes = getMinute();
	int sec = getSecond();

	super::setYear(val);
	set(getYear(), getMonth(), getDate(), hour, minutes, sec);
}
void Datetime::setMonth(int val)
{
	int hour = getHour();
	int minutes = getMinute();
	int sec = getSecond();

	super::setMonth(val);
	set(getYear(), getMonth(), getDate(), hour, minutes, sec);
}
void Datetime::setDate(int val)
{
	int hour = getHour();
	int minutes = getMinute();
	int sec = getSecond();

	super::setDate(val);
	set(getYear(), getMonth(), getDate(), hour, minutes, sec);
}
void Datetime::setHour(int val)
{
	set(getYear(), getMonth(), getDate(), val, getMinute(), getSecond());
}
void Datetime::setMinute(int val)
{
	set(getYear(), getMonth(), getDate(), getHour(), val, getSecond());
}
void Datetime::setSecond(int val)
{
	set(getYear(), getMonth(), getDate(), getHour(), getMinute(), val);
}

//ADDERS
void Datetime::addYear(int val)
{
	int hour = getHour();
	int minutes = getMinute();
	int sec = getSecond();

	super::addYear(val);
	set(getYear(), getMonth(), getDate(), hour, minutes, sec);
}
void Datetime::addMonth(int val)
{
	int hour = getHour();
	int minutes = getMinute();
	int sec = getSecond();

	super::addMonth(val);
	set(getYear(), getMonth(), getDate(), hour, minutes, sec);
}
void Datetime::addWeek(int val)
{
	int hour = getHour();
	int minutes = getMinute();
	int sec = getSecond();

	super::addWeek(val);
	set(getYear(), getMonth(), getDate(), hour, minutes, sec);
}
void Datetime::addDate(int val)
{
	int hour = getHour();
	int minutes = getMinute();
	int sec = getSecond();

	super::addDate(val);
	set(getYear(), getMonth(), getDate(), hour, minutes, sec);
}
void Datetime::addHour(int val)
{
	operator+=(chrono::hours(val));
}
void Datetime::addMinute(int val)
{
	operator+=(chrono::minutes(val));
}
void Datetime::addSecond(int val)
{
	operator+=(chrono::seconds(val));
}

//GETTERS
int Datetime::getHour() const
{
	struct tm &tm = toTM();
	return tm.tm_hour;
}
int Datetime::getMinute() const
{
	struct tm &tm = toTM();
	return tm.tm_min;
}
int Datetime::getSecond() const
{
	struct tm &tm = toTM();
	return tm.tm_sec;
}

//TO_STRING
auto Datetime::toString() const -> String
{
	return super::toString() +
		StringUtil::substitute
		(
			_T(" {1}:{2}:{3}"),
			getHour(), getMinute(), getSecond()
		);
}