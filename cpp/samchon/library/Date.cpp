#include <samchon/library/Date.hpp>

#include <array>

#include <samchon/WeakString.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

chrono::system_clock::time_point Date::TP_1970 = chrono::system_clock::from_time_t(0);

/* --------------------------------------------------------------------------
	CONSTRUCTORS
-------------------------------------------------------------------------- */
//CONSTRUCTORS
Date::Date()
	: super(chrono::system_clock::now())
{
}
Date::Date(const Date &date)
	: super(date)
{
}
Date::Date(Date &&date)
	: super(move(date))
{
}

Date::Date(int year, int month, int date)
{
	set(year, month, date);
}
Date::Date(const WeakString &wStr)
{
	set(wStr);
}
Date::Date(long long linuxTime)
	: super(chrono::system_clock::from_time_t(linuxTime))
{
}

//SEMI-CONSTRUCTORS
void Date::set(const WeakString &wStr)
{
	WeakString val = wStr.trim();

	int year, month, date;

	//시분초까지 있을 때
	if (val.find(_T(" ")) != String::npos)
		val = val.between(String(), _T(" "));

	//년월일 설정
	vector<WeakString> &ymdVec = val.split(_T("-"));
	year = stoi(ymdVec[0].str());
	month = stoi(ymdVec[1].str());
	date = stoi(ymdVec[2].str());

	set(year, month, date);
}
void Date::set(int year, int month, int date) //날짜, 시간 설정
{
	array<int, 12> &monthArray = calcLastDates(year);

	if (month > 12)
		throw invalid_argument("month is over 12");
	if (date > monthArray[month - 1])
		throw invalid_argument("date is over expiration date");

	long long linuxTime = calcSeconds(year, month, date);
	set(linuxTime);
};
void Date::set(long long linuxTime)
{
	this->operator-=(chrono::seconds(toLinuxTime()));
	this->operator+=(chrono::seconds(linuxTime));
}

/* --------------------------------------------------------------------------
	HIDDEN METHODS
-------------------------------------------------------------------------- */
auto Date::calcLastDates(int year) -> array<int, 12>
{
	//Last dates of each month
	static array<int, 12> monthArray = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

	//When the year contains leaf month, then make expiration date of Feburary to 29
	if (year % 4 == 0)
		if (!(year % 100 == 0 && year % 400 != 0))
			monthArray[1] = 29;

	return move(monthArray);
}
long long Date::calcSeconds(int year, int month, int date)
{
	array<int, 12> &monthArray = calcLastDates(year);
	long long total;

	//연, 월, 일의 총 일수
	total = (year - 1) * 365 + ((year - 1) / 4) - ((year - 1) / 100) + ((year - 1) / 400);

	//달수만큼 날자를 더함
	for (int i = 0; i < month - 1; i++)
		total += monthArray[i];
	total += date;

	//일자에 3,600을 곱한다
	total = (total * 24 * 60 * 60);
	return total;
}

/* --------------------------------------------------------------------------
	SETTERS OF EACH COMPONENT
-------------------------------------------------------------------------- */
//SET METHODS
void Date::setYear(int year)
{
	int month = getMonth();
	int newDate = getDate();

	//윤달에 29일인데 addYear을 하려는 경우
	if
		(
			month == 2 && newDate == 29 //현재가 윤달 29일
			&&
			!(
				year == 4 &&
				!((year % 100 == 0 && year % 400 != 0))
			) //바꿀 연도의 2월은 윤달이 아님
		)
		newDate = 28;

	set(year, month, newDate);
}
void Date::setMonth(int month)
{
	if (month > 12)
		throw invalid_argument("month is over 12");

	//달력
	int year = getYear();
	int newDate = getDate();

	array<int, 12> &monthArray = calcLastDates(year);

	//해당 월의 마지막 일을 초과할 때, 조정한다
	//EX-> 4월인데 31일이면 4월 30일로 조정
	if (newDate > monthArray[month - 1])
		newDate = monthArray[month - 1];

	set(year, month, newDate);
}
void Date::setDate(int val)
{
	set(getYear(), getMonth(), val); 
}

//ADD METHODS
void Date::addYear(int val)
{
	//현재가 2012년 2월 29일(윤달)인데 1년을 추가하면 2013년 2월 28일로 변함
	setYear(getYear() + val);
}
void Date::addMonth(int val)
{
	//현재가 3월 31일인데 1월이 추가되면 날짜는 4월 30일로 변한다
	int newYear = getYear();
	int newMonth = getMonth() + val;
	int newDate = getDate();

	if (newMonth > 12)
	{
		newYear = newYear + (newMonth - 1) / 12;
		newMonth = newMonth % 12;
	}

	//달력
	std::array<int, 12> &monthArray = calcLastDates(newYear);

	//해당 월의 마지막 일을 초과할 때, 조정한다
	//EX-> 4월인데 31일이면 4월 30일로 조정
	if (newDate > monthArray[newMonth - 1])
		newDate = monthArray[newMonth - 1];

	set(newYear, newMonth, newDate);
}
void Date::addWeek(int val)
{
	addDate(7 * val);
}
void Date::addDate(int val)
{
	operator+=(chrono::hours(24 * val));
}

/* --------------------------------------------------------------------------
	GETTERS AND TO_STRING
-------------------------------------------------------------------------- */
auto Date::toLinuxTime() const -> long long
{
	std::chrono::system_clock::duration duration = *this - TP_1970;
	std::chrono::seconds seconds = std::chrono::duration_cast<std::chrono::seconds>(duration);

	return seconds.count();
}
int Date::getYear() const
{
	auto &tm = toTM();
	return tm.tm_year + 1900;
}
int Date::getMonth() const		
{
	auto &tm = toTM();
	return tm.tm_mon + 1; 
}
int Date::getDay() const		
{ 
	auto &tm = toTM();
	return tm.tm_wday; 
}
int Date::getDate() const		
{ 
	auto &tm = toTM();
	return tm.tm_mday; 
}

auto Date::toTM() const -> struct tm
{
	struct tm tm;
	time_t tt = chrono::system_clock::to_time_t(*this);
	localtime_s(&tm, &tt);

	return tm;
}
auto Date::toString() const -> String
{
	return StringUtil::substitute
		(
			_T("{1}-{2}-{3}"),
			getYear(), getMonth(), getDate()
		);
}