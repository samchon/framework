#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	template <typename _Kty, typename _Ty, typename _Pr = std::less<_Kty>, typename _Alloc = std::allocator<std::pair<const _Kty, _Ty>>> class Map;

	namespace namtree
	{
		class NTFactory;
		class NTFile;
		class NTIterator;

		/**
		 * @brief A side of a conditional expresson
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API NTSide
			: public virtual protocol::Entity
		{
		private:
			typedef protocol::Entity super;

		protected:
			virtual auto TAG() const -> String;
			
			NTFactory *factory;
			NTFile *file;
			Map<String, double> *parameterMap;

		public:
			NTSide(NTFactory*);
			virtual ~NTSide();

			virtual void construct(std::shared_ptr<library::XML>);

			virtual void initRetrieve();
			auto calcRetrieved(NTIterator&) const -> double;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};