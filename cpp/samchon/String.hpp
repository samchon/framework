#pragma once
#include <samchon\API.hpp>

#include <string>

#ifdef _UNICODE
#	ifndef _T
		typedef wchar_t TCHAR;
#		define _T(X) L##X
#	endif
#else
#	ifndef _T
		typedef char TCHAR;
#		define _T(X)
#	endif
#endif

namespace samchon
{
	typedef std::basic_string<TCHAR> String;

	SAMCHON_FRAMEWORK_API String toString(int);
	SAMCHON_FRAMEWORK_API String toString(long);
	SAMCHON_FRAMEWORK_API String toString(long long);
	SAMCHON_FRAMEWORK_API String toString(float);
	SAMCHON_FRAMEWORK_API String toString(double);
	
	SAMCHON_FRAMEWORK_API String toString(unsigned int);
	SAMCHON_FRAMEWORK_API String toString(unsigned long);
	SAMCHON_FRAMEWORK_API String toString(unsigned long long);
	SAMCHON_FRAMEWORK_API String toString(long double);
};