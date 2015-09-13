#pragma once

#ifdef SAMCHON_LIBRARY_EXPORT
	#define SAMCHON_LIBRARY_API __declspec(dllexport)
	#define SAMCHON_LIBRARY_EXTERN
#else
	#define SAMCHON_LIBRARY_API __declspec(dllimport)
	#define SAMCHON_LIBRARY_EXTERN extern
#endif

#include <string>

//SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API std::basic_string<char>;
//SAMCHON_LIBRARY_EXTERN template class SAMCHON_LIBRARY_API std::basic_string<wchar_t>;