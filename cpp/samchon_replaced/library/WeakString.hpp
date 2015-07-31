#pragma once
#include <samchon/String.hpp>

#include <vector>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API WeakString
		{
		private:
			const TCHAR *data_;
			size_t size_;

			static const std::vector<String> SPACE_ARRAY;

		public:
			WeakString(const String &);
			WeakString(const TCHAR*, size_t);

			//ACCESSOR
			auto size() const->size_t;
			auto empty() const -> bool;

			auto at(size_t) const -> const TCHAR&;
			auto operator[](size_t) const -> const TCHAR&;

			//FINDER
			auto find(TCHAR, size_t = 0) const->size_t;
			auto find(const String &, size_t = 0) const->size_t;
			auto find(const WeakString &, size_t = 0) const->size_t;

			auto rfind(TCHAR, size_t = SIZE_MAX) const->size_t;
			auto rfind(const String &, size_t = SIZE_MAX) const->size_t;
			auto rfind(const WeakString &, size_t = SIZE_MAX) const->size_t;

			//ABSTRACTOR
			auto substr(size_t, size_t = SIZE_MAX) const -> WeakString;
			auto substring(size_t, size_t = SIZE_MAX) const -> WeakString;
			auto between(const String & = _T(""), const String & = _T("")) const -> WeakString;

			auto split(const String &) const->std::vector < WeakString > ;
			auto betweens(const String &, const String & = _T("")) const -> std::vector<WeakString>;

			//TRIM
			auto trim() const -> WeakString;
			auto trim(const String &) const -> WeakString;
			auto trim(const std::vector<String> &) const -> WeakString;
			
			auto ltrim() const -> WeakString;
			auto ltrim(const String &) const -> WeakString;
			auto ltrim(const std::vector<String> &) const -> WeakString;
			
			auto rtrim() const -> WeakString;
			auto rtrim(const String &) const -> WeakString;
			auto rtrim(const std::vector<String> &) const -> WeakString;

			//REPLACER
			auto replace(const String &, const String &) const -> String;
			auto replaceAll(const String &, const String &) const -> String;
			auto replaceAll(const std::vector<String> &, const String &) const -> String;
			auto replaceAll(const std::vector<std::pair<String, String>> &) const -> String;
			
			//COMPARISON & CONVERT
			auto operator==(const String &) const -> bool;
			auto operator==(const WeakString&) const -> bool;
			auto operator!=(const String &) const -> bool;
			auto operator!=(const WeakString &) const -> bool;

			auto str() const -> String;
		};
	};
};
