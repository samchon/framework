#pragma once
#include <samchon/Map.hpp>
#include <samchon/String.hpp>

namespace samchon
{
	namespace library
	{
		template <typename _Elem> class BasicWeakString;

		template <typename _Elem>
		class SAMCHON_FRAMEWORK_API BasicURLVariables
			: public Map<std::basic_string<_Elem>, std::basic_string<_Elem>>
		{
		private:
			typedef Map<std::basic_string<_Elem>, std::basic_string<_Elem>> super;

		public:
			//using super::super;
			BasicURLVariables();
			BasicURLVariables(const BasicWeakString<_Elem> &flashVars);

			static auto encode(const BasicWeakString<_Elem> &) -> std::basic_string<_Elem>;
			static auto decode(const BasicWeakString<_Elem> &) -> std::basic_string<_Elem>;

			auto toString() const -> std::basic_string<_Elem>;
		};

		typedef BasicURLVariables<TCHAR> URLVariables;
		typedef BasicURLVariables<char> URLVariablesA;
		typedef BasicURLVariables<wchar_t> URLVariablesW;
	};
};