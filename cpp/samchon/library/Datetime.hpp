#pragma once
#include <samchon/library/Date.hpp>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API Datetime
			: public Date
		{
		private:
			typedef Date super;

		public:
			/* ------------------------------------------------
				CONSTRUCTORS
			------------------------------------------------ */
			Datetime();
			Datetime(const Date&);
			Datetime(Date&&);
			Datetime(int year, int month, int date, int hour = 0, int min = 0, int sec = 0);
			Datetime(const String &);
			Datetime(const WeakString &);
			Datetime(long long linuxTime);
			virtual ~Datetime() = default;
			
			virtual void set(const WeakString &);
			void set(int year, int month, int date, int hours = 0, int minutes = 0, int seconds = 0);
			void set(long long linuxTime);

			/* ------------------------------------------------
				GET-SETTERS
			------------------------------------------------ */
			//SETTERS
			virtual void setYear(int);
			virtual void setMonth(int);
			virtual void setDate(int);
			void setHour(int);
			void setMinute(int);
			void setSecond(int);

			//ADDERS
			virtual void addYear(int);
			virtual void addMonth(int);
			virtual void addWeek(int);
			virtual void addDate(int);
			void addHour(int);
			void addMinute(int);
			void addSecond(int);

			//GETTERS
			auto getHour() const -> int;
			auto getMinute() const -> int;
			auto getSecond() const -> int;

			//TO-STRING
			virtual auto toString() const -> String;
		};
	};
};