#pragma once
#include <samchon\API.hpp>

#include <memory>
#include <vector>
#include <samchon/String.hpp>
#include <samchon/Map.hpp>

namespace std
{
	template<class _Ty, class _Alloc> class list;
};
namespace samchon
{
	namespace library
	{
		template<typename _Elem> class BasicWeakString;
		typedef BasicWeakString<TCHAR> WeakString;

		class SAMCHON_FRAMEWORK_API XML;
		typedef std::vector<std::shared_ptr<XML>> XMLList;
		typedef Map<String, std::shared_ptr<XMLList>> XMLListMap;
		
		class SAMCHON_FRAMEWORK_API XML :
			public XMLListMap
		{
		protected:
			XML *parent;
			String key; //AS A LABEL: <tag asdf=asfds /> -> tag
			long level; //XML TREE's DEPTH

			String value;
			Map<String, String> propertyMap;

		public:
			XML();
			XML(const String &str);
			XML(WeakString);
			virtual ~XML() = default;

		protected:
			//CONSTRUCTORS
			XML(XML *, WeakString &);

			void construct(WeakString &);
			void constructKey(WeakString &);
			void constructProperty(WeakString &);
			auto constructValue(WeakString &) -> bool;
			void constructChildren(WeakString &);

		public:
			void set(const String &, const std::shared_ptr<XMLList> &);
			void push_back(const String &);
			void push_back(const WeakString &);
			void push_back(const std::shared_ptr<XML>);

			void addAllProperty(const std::shared_ptr<XML>);

			/* -----------------------------------------------------------
				Set Methods
			----------------------------------------------------------- */
			virtual void setKey(const String &);
			template<class _Ty> void setValue(const _Ty &val);
			template<class _Ty> void setProperty(const String &, const _Ty &);

			/* -----------------------------------------------------------
				Get Methods
			----------------------------------------------------------- */
			auto getParent() const -> XML*;
			auto getKey() const -> String;
			auto getLevel()	const -> long;
			template<class _Ty = String> auto getValue() const -> _Ty;

			auto hasProperty(const String &) const -> bool;
			template<class _Ty = String> auto getProperty(const String &) const -> _Ty;
			virtual void eraseProperty(const String&);
			virtual void clearProperty();

			auto getPropertyMap() const -> const Map<String, String>&;
			auto propertySize() const -> size_t;

			/* -----------------------------------------------------------
				UTILITY
			----------------------------------------------------------- */
		protected:
			auto calcMinIndex(const std::vector<size_t>&) const -> size_t;
			
			auto encodeValue(const WeakString &) const -> String;
			auto decodeValue(const WeakString &) const -> String;
			auto encodeProperty(const WeakString &) const -> String;
			auto decodeProperty(const WeakString &) const -> String;

			void fetchString(std::list<String, std::allocator<String>> &, size_t) const;

		public:
			auto toString(size_t level = 0) const -> String;
		};
	};
};