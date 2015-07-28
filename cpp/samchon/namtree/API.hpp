#pragma once

#ifdef NAM_TREE_EXPORT
#	define NAM_TREE_API __declspec(dllexport)
#	define NAM_TREE_EXTERN
#else
#	define NAM_TREE_API __declspec(dllimport)
#	define NAM_TREE_EXTERN extern
#endif

#pragma warning(disable : 4251)