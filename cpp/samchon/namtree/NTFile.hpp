#pragma once
#include <samchon/namtree/FTFile.hpp>
#include <samchon/namtree/INTExplore.hpp>

namespace std
{
	template<class _Fty> class function;
};
namespace samchon
{
	template <typename _Kty, typename _Ty, typename _Pr = std::less<_Kty>, typename _Alloc = std::allocator<std::pair<const _Kty, _Ty>>> class Map;

	namespace namtree
	{
		class NTFactory;
		class NTParameterArray;
		class NTIterator;

		class SAMCHON_FRAMEWORK_API NTFile
			: public FTFile,
			public INTExplore
		{
		private:
			typedef FTFile super;

		protected:
			NTFactory *factory; //TO FIND OTHERSIDE AND FUNCTION POINTER
			NTParameterArray *parameterArray;
			NTFile *otherside;

			double (*function)(NTIterator&, Map<String, double>&);
			//std::function<double(NTIterator&, Map<String, double>&)> *function;

		public:
			NTFile(NTFactory*, FTFolder*);
			virtual ~NTFile() = default;

			virtual void construct(std::shared_ptr<library::XML>);

			auto getParameterArray() const -> const NTParameterArray*;
			auto getOtherside() const -> NTFile*;
			auto getFunction() const -> double(*)(NTIterator&, Map<String, double>&);

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};