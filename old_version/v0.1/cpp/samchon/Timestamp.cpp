#include <samchon/Timestamp.hpp>

#include <string>
#include <samchon/StringUtil.hpp>
#include <samchon/Charset.hpp>

namespace samchon
{
	chrono::system_clock::time_point Timestamp::TP_1970;
	long long Timestamp::SECONDS_1970;

	Timestamp::Timestamp()
	{
		init();

		timePoint = chrono::system_clock::now();
		refreshTM();
	};
	Timestamp::Timestamp(long year, long month, long date, long hour, long min, long sec)
	{
		init();

		try
		{
			setTimestamp(year, month, date, hour, min, sec);
		}
		catch (invalid_argument &error)
		{
			throw error;
		}
	};
	Timestamp::Timestamp(const string &str)
	{
		init();
		string val = StringUtil::trim(str);

		int year, month, date;
		int hour = 0, min = 0, sec = 0;

		string ymd;

		//시분초까지 있을 때
		if (val.find(" ") != string::npos)
		{
			ymd = move(StringUtil::between(val, "", " "));
			string &hms = StringUtil::between(val, " ");

			vector<string> &hmsVec = StringUtil::split(hms, ":");

			hour = stoi(hmsVec.at(0));
			min = stoi(hmsVec.at(1));
			sec = stoi(hmsVec.at(2));
		}
		else
			ymd = move(val);

		//년월일 설정
		vector<string> &ymdVec = StringUtil::split(ymd, "-");
		year = stoi(ymdVec.at(0));
		month = stoi(ymdVec.at(1));
		date = stoi(ymdVec.at(2));

		try
		{
			setTimestamp(year, month, date, hour, min, sec);
		}
		catch (invalid_argument &error)
		{
			throw error;
		}
	};
	Timestamp::Timestamp(const wstring &wstr)
		: Timestamp(string(wstr.begin(), wstr.end())) {}
	Timestamp::Timestamp(const long long linuxTime)
	{
		init();

		setLinuxTime(linuxTime);
	};
	Timestamp::~Timestamp() {};

	//SET METHODS -> SEMI-CONSTRUCTORS
	void Timestamp::setTimestamp(long year, long month, long date, long hours, long minutes, long seconds) //날짜, 시간 설정
	{
		array<int, 12> &monthArray = getLastDateArray(year);

		if (month > 12)
			throw invalid_argument(StringUtil::substitute("month is over 12: {0}", month));
		if (date > monthArray[month - 1])
			throw invalid_argument(StringUtil::substitute("date is over {0}: {1}", monthArray[month - 1], date));

		long long totalSeconds = calcSeconds(year, month, date, hours, minutes, seconds);
		timePoint = chrono::system_clock::from_time_t(totalSeconds - SECONDS_1970);

		refreshTM();
	};
	void Timestamp::setLinuxTime(long long val) //1970-01-01 09:00:00으로부터 흐른 시간(초)를 기준으로 시간을 설정
	{
		timePoint = chrono::system_clock::from_time_t(val);

		refreshTM();
	}

	//INITS
	void Timestamp::init()
	{
		//초기화
		static bool initFlag = false;
		if (initFlag == true)
			return;

		TP_1970 = chrono::system_clock::from_time_t(0);
		SECONDS_1970 = calcSeconds(1970, 1, 1, 9);

		initFlag = true;
	};
	array<int, 12> Timestamp::getLastDateArray(int year)
	{
		//월 별 마지막 날짜
		array<int, 12> monthArray = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

		//윤달이면 2월을 29일로
		if (year % 4 == 0)
			if (!(year % 100 == 0 && year % 400 != 0))
				monthArray[1]++;

		return move(monthArray);
	}

	void Timestamp::refreshTM()
	{
		//TM 갱신
		time_t tt = chrono::system_clock::to_time_t(timePoint);
		localtime_s(&tm, &tt);
	};

	//총 초 구하기 -> 기원전 불가능
	long long Timestamp::calcSeconds(long year, long month, long date, long hours, long minutes, long seconds)
	{
		array<int, 12> &monthArray = getLastDateArray(year);
		long long total;

		//연, 월, 일의 총 일수
		total = (year - 1) * 365 + ((year - 1) / 4) - ((year - 1) / 100) + ((year - 1) / 400);

		//달수만큼 날자를 더함
		for (int i = 0; i < month - 1; i++)
			total += monthArray[i];
		total += date;

		//일자에 3,600을 곱하고 시간을 더함
		total = (total * 24 * 60 * 60) + (hours * 60 * 60 + minutes * 60 + seconds);
		return total;
	};

	//SET METHODS
	void Timestamp::setYear(int year)
	{
		int month = getMonth();
		int newDate = getDate();

		//윤달에 29일인데 addYear을 하려는 경우
		if
			(
			month == 2 && newDate == 29
			//현재가 윤달 29일

			&&
			!(
			year == 4 &&
			!((year % 100 == 0 && year % 400 != 0))
			) //바꿀 연도의 2월은 윤달이 아님
			)
			newDate = 28;

		setTimestamp(year, month, newDate, getHour(), getMinute(), getSecond());
	};
	void Timestamp::setMonth(int month)
	{
		if (month > 12)
			throw invalid_argument(StringUtil::substitute("month is over 12: {0}", month));

		//달력
		int year = getYear();
		int newDate = getDate();

		array<int, 12> &monthArray = getLastDateArray(year);

		//해당 월의 마지막 일을 초과할 때, 조정한다
		//EX-> 4월인데 31일이면 4월 30일로 조정
		if (newDate > monthArray[month - 1])
			newDate = monthArray[month - 1];

		setTimestamp(year, month, newDate, getHour(), getMinute(), getSecond());
	};
};