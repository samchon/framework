#pragma once
#include <samchon/library/FTFile.hpp>
#include <samchon/namtree/INTExplore.hpp>

#include <vector>
#include <functional>

namespace samchon
{
	template <typename _Kty, typename _Ty, typename _Pr = std::less<_Kty>, typename _Alloc = std::allocator<std::pair<const _Kty, _Ty>>> class Map;

	namespace namtree
	{
		class NTFactory;
		class NTParameterArray;
		class NTIterator;

		/**
		 * @brief File for medata of function used in NTSide
		 *
		 * @author Jeongho Nam
		 */
		class NTFile
			: public library::FTFile,
			public INTExplore
		{
		private:
			typedef library::FTFile super;

		protected:
			NTFactory *factory; //TO FIND OTHERSIDE AND FUNCTION POINTER
			NTParameterArray *parameterArray;
			NTFile *otherside;

			//double (*function)(NTIterator&, const std::vector<double> &);
			std::function<double(NTIterator&, const std::vector<double> &)> function;

		public:
			NTFile(NTFactory*, library::FTFolder*);
			virtual ~NTFile() = default;

			virtual void construct(std::shared_ptr<library::XML>) override;

			auto getParameterArray() const -> NTParameterArray*;
			auto getOtherside() const -> NTFile*;
			auto getFunction() const -> std::function<double(NTIterator&, const std::vector<double> &)>;

			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};