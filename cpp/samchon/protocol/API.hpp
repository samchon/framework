#pragma once

#ifdef SAMCHON_PROTOCOL_EXPORT
#	define SAMCHON_PROTOCOL_API __declspec(dllexport)
#	define SAMCHON_PROTOCOL_EXTERN
#else
#	define SAMCHON_PROTOCOL_API __declspec(dllimport)
#	define SAMCHON_PROTOCOL_EXTERN extern
#endif

#pragma warning(disable : 4251)