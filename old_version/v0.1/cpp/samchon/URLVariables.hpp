#pragma once

#include <string>
#include <memory>

#include <samchon/Map.hpp>
#include <samchon/StringUtil.hpp>

namespace samchon
{
	class URLVariables : public Map<std::string, std::string> {
	public:
		URLVariables(const std::string &flashVars)
			: Map<std::string, std::string>()
		{
			std::vector<std::string> &units = StringUtil::split(flashVars, "&");

			for (size_t i = 0; i < units.size(); i++)
			{
				std::vector<std::string> &piece = StringUtil::split(units.at(i), "=");
				set(piece.at(0), StringUtil::decodeURIComponent(piece.at(1)));
			}
		};
		//URLVariables() : Map<std::string, std::string>() {};
		//using Map<std::string, std::string>::Map;
		
		explicit URLVariables(const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type()) : Map<std::string, std::string>(comp, alloc) {};
		explicit URLVariables(const allocator_type& alloc) : Map<std::string, std::string>(alloc) {};

		template <class InputIterator>
		URLVariables(InputIterator first, InputIterator last, const key_compare& comp = key_compare(), const allocator_type &alloc = allocator_type())
			: Map<std::string, std::string>(last, comp, alloc) {};

		URLVariables(const URLVariables& x) : Map<std::string, std::string>(x) {}
		URLVariables(const URLVariables& x, const allocator_type& alloc) : Map<std::string, std::string>(x, alloc) {}
		URLVariables(URLVariables&& x) : Map<std::string, std::string>(x) {}
		URLVariables(URLVariables&& x, const allocator_type& alloc) : Map<std::string, std::string>(x, alloc) {}

		URLVariables(std::initializer_list<value_type> il, const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type())
			: Map<std::string, std::string>(il, comp, alloc) {};
		virtual ~URLVariables() {};

		//URLVariables iconv(int from, int to);
		URLVariables toUTF8() const
		{
			URLVariables formData;
			for (auto it = begin(); it != end(); it++)
			{
				formData.set(it->first, Charset::toUTF8(it->second));
			}
			return move(formData);
		};
		URLVariables toMultibyte() const
		{
			//C++의 기본 charset이 CP949이니 별도로 CP949로의 변환이 필요없다
			//따라서 이 함수는 크게 쓰일 일이 없다.
			URLVariables formData;
			for (auto it = begin(); it != end(); it++)
				formData.set
				(
					it->first,
					Charset::toMultibyte(it->second)
				);
			return move(formData);
		};
		std::string to_string() const
		{
			std::string flashVars = "";
			std::string value;
			size_t x;

			for (auto it = begin(); it != end(); it++) {
				static std::string noise = "%00";

				value = StringUtil::encodeURIComponent(it->second);
				x = value.rfind(noise);

				if (x == value.size() - noise.size())
					value = value.substr(0, x);

				if (it != this->begin())
					flashVars += "&";

				flashVars += it->first + "=" + value;
			}
			return move(flashVars);
		}
	};
};