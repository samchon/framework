#pragma once
#include <samchon/API.hpp>

#define OPERATOR_METHODS_INLINE(_Ty) \
auto operator!=(const _Ty &obj) const -> bool \
{ \
	return !operator==(obj); \
}; \
auto operator<=(const _Ty &obj) const -> bool \
{ \
	return operator<(obj) || operator==(obj); \
}; \
auto operator>(const _Ty &obj) const -> bool \
{ \
	return !operator<=(obj); \
}; \
auto operator>=(const _Ty &obj) const -> bool \
{ \
	return !operator<(obj); \
};

#define OPERATOR_METHODS_HEADER(_Ty) \
auto operator!=(const _Ty &obj) const -> bool; \
auto operator<=(const _Ty &obj) const -> bool; \
auto operator>(const _Ty &obj) const -> bool; \
auto operator>=(const _Ty &obj) const -> bool;

#define OPERATOR_METHODS_BODY(_Class, _Ty) \
auto _Class::operator!=(const _Ty &obj) const -> bool \
{ \
	return !operator==(obj); \
} \
auto _Class::operator<=(const _Ty &obj) const -> bool \
{ \
	return operator<(obj) || operator==(obj); \
} \
auto _Class::operator>(const _Ty &obj) const -> bool \
{ \
	return !operator<=(obj); \
} \
auto _Class::operator>=(const _Ty &obj) const -> bool \
{ \
	return !operator<(obj); \
}

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Interface for comparision operator
		 *
		 * @details
		 * \par
		 * IOperator is an interface realizing all compare operators 
		 * by only overriding operator< and operator== methods.
		 *	\li [!=] -> [NOT ==]
		 *	\li [<=] -> [< OR ==]
		 *	\li [>] -> [NOT < AND NOT ==]
		 *	\li [>=] -> [NOT <]
		 *
		 * \par 
		 * Methods operator< and operator== are abstract.\n
		 * Overrides them.
		 *
		 * @note 
		 *	\li OPERATOR_METHODS_INLINE(_Ty)
		 *	\li OPERATOR_METHODS_HEADER(_Ty)
		 *	\li OPERATOR_METHODS_BODY(_Class, _Ty)
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API IOperator
		{
		public:
			/** 
			 * @brief Default Constructor
			 */
			IOperator();
			virtual ~IOperator() = default;
			
			/**
			 * @brief Less
			 * @details Overrides method less.
			 *
			 * @param obj The object to compare.
			 * @return The object is less than this.
			 */
			virtual auto operator<(const IOperator&) const -> bool = NULL;

			/**
			 * @brief Equal
			 * @details Overrides methods equal.
			 *
			 * @param obj The object to compare.
			 * @return The object is equal with this.
			 */
			virtual auto operator==(const IOperator&) const -> bool = NULL;

			auto operator!=(const IOperator&) const -> bool;
			auto operator<=(const IOperator&) const -> bool;
			auto operator>(const IOperator&) const -> bool;
			auto operator>=(const IOperator&) const -> bool;
		};
	}
};