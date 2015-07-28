#pragma once
#include <samchon/String.hpp>
#include <vector>

namespace samchon
{
	namespace library
	{
		template <typename _Elem> class SAMCHON_FRAMEWORK_API BasicWeakString;
		typedef BasicWeakString<char> WeakStringA;
		typedef BasicWeakString<wchar_t> WeakStringW;

		typedef BasicWeakString<TCHAR> WeakString;

		template <typename _Elem>
		class SAMCHON_FRAMEWORK_API BasicWeakString
		{
		private:
			const _Elem *data_;
			size_t size_;

			static const std::vector<std::basic_string<_Elem>> SPACE_ARRAY;

		public:
			BasicWeakString(const std::basic_string<_Elem> &);
			BasicWeakString(const _Elem*, size_t);

			//ACCESSOR
			auto size() const->size_t;
			auto empty() const -> bool;

			auto at(size_t) const -> const _Elem&;
			auto operator[](size_t) const -> const _Elem&;

			//FINDER
			auto find(_Elem, size_t = 0) const->size_t;
			auto find(const std::basic_string<_Elem> &, size_t = 0) const->size_t;
			auto find(const BasicWeakString &, size_t = 0) const->size_t;

			auto rfind(_Elem, size_t = SIZE_MAX) const->size_t;
			auto rfind(const std::basic_string<_Elem> &, size_t = SIZE_MAX) const->size_t;
			auto rfind(const BasicWeakString &, size_t = SIZE_MAX) const->size_t;

			//ABSTRACTOR
			auto substr(size_t, size_t = SIZE_MAX) const -> BasicWeakString;
			auto substring(size_t, size_t = SIZE_MAX) const -> BasicWeakString;
			auto between(const std::basic_string<_Elem> & = _T(""), const std::basic_string<_Elem> & = _T("")) const -> BasicWeakString;

			auto split(const std::basic_string<_Elem> &) const->std::vector < BasicWeakString > ;
			auto betweens(const std::basic_string<_Elem> &, const std::basic_string<_Elem> & = _T("")) const -> std::vector<BasicWeakString>;

			//TRIM
			auto trim() const -> BasicWeakString;
			auto trim(const std::basic_string<_Elem> &) const -> BasicWeakString;
			auto trim(const std::vector<std::basic_string<_Elem>> &) const -> BasicWeakString;
			
			auto ltrim() const -> BasicWeakString;
			auto ltrim(const std::basic_string<_Elem> &) const -> BasicWeakString;
			auto ltrim(const std::vector<std::basic_string<_Elem>> &) const -> BasicWeakString;
			
			auto rtrim() const -> BasicWeakString;
			auto rtrim(const std::basic_string<_Elem> &) const -> BasicWeakString;
			auto rtrim(const std::vector<std::basic_string<_Elem>> &) const -> BasicWeakString;

			//REPLACER
			auto replace(const std::basic_string<_Elem> &, const std::basic_string<_Elem> &) const -> std::basic_string<_Elem>;
			auto replaceAll(const std::basic_string<_Elem> &, const std::basic_string<_Elem> &) const -> std::basic_string<_Elem>;
			auto replaceAll(const std::vector<std::basic_string<_Elem>> &, const std::basic_string<_Elem> &) const -> std::basic_string<_Elem>;
			auto replaceAll(const std::vector<std::pair<std::basic_string<_Elem>, std::basic_string<_Elem>>> &) const -> std::basic_string<_Elem>;
			
			//COMPARISON & CONVERT
			auto operator==(const std::basic_string<_Elem> &) const -> bool;
			auto operator==(const BasicWeakString&) const -> bool;
			auto operator!=(const std::basic_string<_Elem> &) const -> bool;
			auto operator!=(const BasicWeakString &) const -> bool;

			auto str() const -> std::basic_string<_Elem>;
		};
	};
};
