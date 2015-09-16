#pragma once

#if defined (_WIN32) || defined (WIN32) || defined(_WIN64) || defined(WIN64)
#	ifdef SAMCHON_FRAMEWORK_EXPORT
#		define SAMCHON_FRAMEWORK_API __declspec(dllexport)
#		define SAMCHON_FRAMEWORK_EXTERN
#	else
#		define SAMCHON_FRAMEWORK_API __declspec(dllimport)
#		define SAMCHON_FRAMEWORK_EXTERN extern
#	endif
#else
#	define SAMCHON_FRAMEWORK_API
#	define SAMCHON_FRAMEWORK_EXTERN 
#endif