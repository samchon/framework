#pragma once
#include <samchon\API.hpp>

#include <samchon/String.hpp>

struct tm;
/*
	I DON'T KNOW HOW TO PRE-DEFINE THE std::chrono::system_clock::time_point
	IF YOU KNOW THE WAY, PLEASE WRITE THE SOLUTION ON GITHUB OR MY HOMEPAGE

		http://samchon.org/framework
*/
/*
namespace std
{
	namespace chrono
	{
		template<class _Rep, class _Period> class duration;
		template<class _Clock, class _Duration> class time_point;

		struct system_clock;
	};

	template<intmax_t _Nx, intmax_t _Dx> struct ratio;
	template<intmax_t _Ax, intmax_t _Bx> struct _Gcd;
	template<intmax_t _Ax, intmax_t _Bx> struct _Safe_mult;

	template<class _R1, class _R2> struct _Ratio_multiply
	{
		static const intmax_t _N1 = _R1::num;
		static const intmax_t _D1 = _R1::den;
		static const intmax_t _N2 = _R2::num;
		static const intmax_t _D2 = _R2::den;

		static const intmax_t _Gx = _Gcd<_N1, _D2>::value;
		static const intmax_t _Gy = _Gcd<_N2, _D1>::value;

		// typename ratio<>::type is unnecessary here
		typedef ratio<
			_Safe_mult<_N1 / _Gx, _N2 / _Gy>::value,
			_Safe_mult<_D1 / _Gy, _D2 / _Gx>::value
		> type;
	};
	
	template<class _R1, class _R2> using ratio_multiply = typename _Ratio_multiply<_R1, _R2>::type;
};
*/
namespace samchon
{
	namespace library
	{
		template <typename _Elem> class BasicWeakString;
		typedef BasicWeakString<TCHAR> WeakString;

		class SAMCHON_FRAMEWORK_API Date
		{
		protected:
			//1970-01-01 09:00:00 -> 0 in Linux-Time
			/*static std::chrono::time_point < std::chrono::system_clock,
				std::chrono::duration < long long,
				std::ratio_multiply < std::ratio<100, 1>, std::ratio<1, 1000000000> >
				>
			> *TP_1970;*/
			static void *TP_1970; //1970-01-01 09:00:00
			static long long SECONDS_1970;

			//TIME VARIABLES
			/*std::chrono::time_point < std::chrono::system_clock,
				std::chrono::duration < long long,
				std::ratio_multiply < std::ratio<100, 1>, std::ratio<1, 1000000000> >
				>
			> *timePoint;*/
			void *timePoint;
			struct tm *tm; //-> 시간 변경시마다 갱신이 필요함

		public:
			Date();
			Date(const Date&);
			Date(Date&&);

			Date(int year, int month, int date);
			Date(const String &);
			Date(const WeakString &);
			Date(long long linuxTime);
			
			virtual ~Date();
			
			//SET METHODS -> SEMI-CONSTRUCTORS
			void set(const String &);
			virtual void set(const WeakString &);
			void set(int year, int month, int date);
			void set(long long linuxTime);

		protected:
			auto fetchLastDates(int year) const -> std::array<int, 12>;
			
			void refreshTM();
			auto calcSeconds(int year, int month, int date) -> long long;

		public:
			//SET METHODS
			virtual void setYear(int);
			virtual void setMonth(int);
			virtual void setDate(int);

			//ADD METHODS
			virtual void addYear(int);
			virtual void addMonth(int);
			virtual void addWeek(int);
			virtual void addDate(int);

			//GET METHODS
			auto getLinuxTime() const -> long long;
			auto getYear() const -> int;
			auto getMonth() const -> int;
			auto getDay() const -> int;
			auto getDate() const -> int;
			
			virtual auto toString() const -> String;
		};
	};
};