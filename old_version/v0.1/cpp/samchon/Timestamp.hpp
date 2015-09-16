#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <chrono>
#include <string>
#include <iostream>
#include <exception>
#include <array>

namespace samchon
{
	using namespace std;

	class SAMCHON_LIBRARY_API Timestamp
	{
	private:
		//1970-01-01 09:00:00 -> 0 in Linux-Time
		static chrono::system_clock::time_point TP_1970;
		static long long SECONDS_1970;

		//시간 변수
		chrono::system_clock::time_point timePoint;
		struct tm tm; //-> 시간 변경시마다 갱신이 필요함

	public:
		Timestamp();
		Timestamp(long year, long month, long date, long hour = 0, long min = 0, long sec = 0);
		Timestamp(const string &);
		Timestamp(const wstring &);
		Timestamp(long long linuxTime);
		~Timestamp();

		//SET METHODS -> SEMI-CONSTRUCTORS
		void setTimestamp(long year, long month, long date, long hours = 0, long minutes = 0, long seconds = 0);
		void setLinuxTime(long long val);

	private:
		static void init();
		static array<int, 12> getLastDateArray(int year);

		void refreshTM();

		//총 초 구하기 -> 기원전 불가능
		static long long calcSeconds(long year, long month, long date, long hours = 0, long minutes = 0, long seconds = 0);

	public:
		//GET METHODS
		inline chrono::system_clock::time_point getTimePoint() const
		{
			return timePoint;
		}
		inline struct tm getTM() const
		{
			return tm;
		}

		long long getLinuxTime() const
		{
			chrono::system_clock::duration duration = timePoint - TP_1970;
			chrono::seconds seconds = chrono::duration_cast<chrono::seconds>(duration);

			return seconds.count();
		};

		//현재의 날짜, 시간을 개개별별로 받아옴
		inline int getYear() const		{	return tm.tm_year + 1900;	};
		inline int getMonth() const		{	return tm.tm_mon + 1;		};
		inline int getDay() const		{	return tm.tm_wday;			};
		inline int getDate() const		{	return tm.tm_mday;			};
		inline int getHour() const		{	return tm.tm_hour;			};
		inline int getMinute() const	{	return tm.tm_min;			};
		inline int getSecond() const	{	return tm.tm_sec;			};

		//SET METHODS
		void setYear(int year);
		void setMonth(int month);
		void setDate(int val)	{	setTimestamp(	getYear(),	getMonth(),	val,		getHour(),	getMinute(),	getSecond()	);	};
		void setHour(int val)	{	setTimestamp(	getYear(),	getMonth(),	getDate(),	val,		getMinute(),	getSecond()	);	};
		void setMinute(int val)	{	setTimestamp(	getYear(),	getMonth(),	getDate(),	getHour(),	val,			getSecond()	);	};
		void setSecond(int val)	{	setTimestamp(	getYear(),	getMonth(),	getDate(),	getHour(),	getMinute(),	val			);	};

		//ADD METHODS	
		void addYear(int val) 
		{
			//현재가 2012년 2월 29일(윤달)인데 1년을 추가하면 2013년 2월 28일로 변함
			setYear(getYear() + val);
		};
		void addMonth(int val) 
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
			array<int, 12> &monthArray = getLastDateArray(newYear);

			//해당 월의 마지막 일을 초과할 때, 조정한다
			//EX-> 4월인데 31일이면 4월 30일로 조정
			if (newDate > monthArray[newMonth - 1])
				newDate = monthArray[newMonth - 1];

			setTimestamp(newYear, newMonth, newDate, getHour(), getMinute(), getSecond());
		};
		
		inline void addWeek(int val)
		{
			addDate(7 * val);
		};
		inline void addDate(int val)
		{
			addHour(24 * val);
		};
		void addHour(int val)
		{
			timePoint += chrono::hours(val);
			refreshTM();
		};
		void addMinute(int val)
		{
			timePoint += chrono::minutes(val);
			refreshTM();
		};
		void addSecond(int val)
		{
			timePoint += chrono::seconds(val);
			refreshTM();
		};
	};

	//OPERATORS
	/*bool operator==(const Timestamp &left, const Timestamp &right)
	{
		return left.getLinuxTime() == right.getLinuxTime();
	};
	long long operator-(const Timestamp &left, const Timestamp &right)
	{
		return left.getLinuxTime() - right.getLinuxTime();
	};*/
};