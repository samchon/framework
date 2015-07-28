#pragma once

#ifdef SAMCHON_FRAMEWORK_EXPORT
#	define SAMCHON_FRAMEWORK_API __declspec(dllexport)
#	define SAMCHON_FRAMEWORK_EXTERN
#else
#	define SAMCHON_FRAMEWORK_API __declspec(dllimport)
#	define SAMCHON_FRAMEWORK_EXTERN extern
#endif

#define NUM_NULL INT_MIN
#ifndef NULL
#	define NULL 0
#endif

#pragma warning(disable: 4251)