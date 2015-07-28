#pragma once
#include <samchon/protocol/Entity.hpp>

#include <samchon/library/XML.hpp>

namespace samchon
{
	namespace protocol
	{
		template <typename _Container, typename _Ty = _Container::value_type>
		class IEntityGroup
			: public virtual Entity,
			public _Container
		{
		protected:
			virtual auto TAG() const -> String = NULL;
			virtual auto CHILD_TAG() const -> String = NULL;

		public:
			IEntityGroup()
				: Entity(),
				_Container()
			{};
			virtual ~IEntityGroup() = default;
			
			auto has(const String &key) const -> bool
			{
				for (auto it = begin(); it != end(); it++)
					if ((*it)->key() == key)
						return true;

				return false;
			};
			auto get(const String &key) -> _Ty&
			{
				for (auto it = begin(); it != end(); it++)
				if ((*it)->key() == key)
					return *it;

				throw "out of range";
			};
			auto get(const String &key) const -> const _Ty&
			{
				for (auto it = begin(); it != end(); it++)
					if ((*it)->key() == key)
						return *it;

				throw "out of range";
			};

			virtual void construct(std::shared_ptr<library::XML> xml)
			{
				clear();
				if (xml->has(CHILD_TAG()) == false)
					return;

				std::shared_ptr<library::XMLList> &xmlList = xml->get(CHILD_TAG());
				_Container::iterator it = begin();

				if (std::is_same<_Container, std::vector<_Container::value_type, _Container::allocator_type>>::value == true)
				{
					//FOR RESERVE
					assign(xmlList->size(), nullptr);
					clear();
				}

				for (size_t i = 0; i < xmlList->size(); i++)
				{
					std::shared_ptr<library::XML> &xmlElement = xmlList->at(i);

					Entity *entity = createChild(xmlElement);
					if (entity != nullptr)
					{
						entity->construct(xmlList->at(i));
						push_back(entity);	
					}
 				}
			};
			virtual auto toXML() const -> std::shared_ptr<library::XML>
			{
				std::shared_ptr<library::XML> xml(new library::XML());
				xml->setKey(TAG());
				
				std::shared_ptr<library::XMLList> xmlList(new library::XMLList());
				//xmlList->reserve(size());

				for (auto it = begin(); it != end(); it++)
					xmlList->push_back( (*it)->toXML() );

				xml->set(CHILD_TAG(), xmlList);
 				return xml;
			};

		protected:
			virtual auto createChild(std::shared_ptr<library::XML>) -> Entity*
			{
				return nullptr;
			};
			virtual auto capsuleChild(Entity*)->_Ty = NULL;

		public:
			void push_back(Entity *entity)
			{
				_Container::push_back(capsuleChild(entity));
			};
		};
	};
}