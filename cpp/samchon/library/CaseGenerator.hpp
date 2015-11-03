#pragma once
#include <samchon/API.hpp>

#include <vector>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Case generator
		 *
		 * @details
		 * <p> An abstract case generator using like a matrix </p>
		 *	\li nTTr(n^r) -> CombinedPermutationGenerator
		 *	\li nPr -> PermutationGenerator
		 *	\li n! -> FactorialGenerator
		 *
		 * <h3>Example source</h3>
		 * <p> Packer - Find the best packaging solution </p>
		 *
		 * @image html cpp/example_packer.png
		 * @image latex cpp/example_packer.png
		 *
		 * \par example/packer/Packer.hpp
		 *		@includelineno example/packer/Packer.hpp
		 * \par example/packer/WrapperArray.hpp
		 *		@includelineno example/packer/WrapperArray.hpp
		 * \par example/packer/Wrapper.hpp
		 *		@includelineno example/packer/Wrapper.hpp
		 * \par example/packer/Product.hpp
		 *		@includelineno example/packer/Product.hpp
		 * \par example/packer/Instance.hpp
		 *		@includelineno example/packer/Instance.hpp
		 *
		 * \par example/packer/main.cpp
		 *		@includelineno example/packer/main.cpp
		 * \par example/packer/Packer.cpp
		 *		@includelineno example/packer/Packer.cpp
		 * \par example/packer/WrapperArray.cpp
		 *		@includelineno example/packer/WrapperArray.cpp
		 * \par example/packer/Wrapper.cpp
		 *		@includelineno example/packer/Wrapper.cpp
		 * \par example/packer/Product.cpp
		 *		@includelineno example/packer/Product.cpp
		 * \par example/packer/Instance.cpp
		 *		@includelineno example/packer/Instance.cpp
		 *
		 * <h4> Result of the example </h4>
		 * @image html  cpp/result/example_packer.png
		 * @image latex cpp/result/example_packer.png
		 *
		 * @see samchon::library
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API CaseGenerator
		{
		protected:
			/**
			 * @brief N, size of the candidates
			 */
			size_t n_;

			/**
			 * @brief R, size of elements of each case
			 */
			size_t r_;

			/**
			 * @brief Size, the number of all cases
			 */
			size_t size_;

			std::vector<size_t> dividerArray;

		public:
			/* ----------------------------------------------------
				CONSTRUCTORS
			---------------------------------------------------- */
			/**
			 * @brief Construct from size of N and R
			 *
			 * @param n Size of candidates
			 * @param r Size of elements of each case
			 */
			CaseGenerator(size_t n, size_t r);
			virtual ~CaseGenerator() = default;

			/* ----------------------------------------------------
				ELEMENT ACCESSORS
			---------------------------------------------------- */
			/**
			 * @brief Get size of all cases
			 *
			 * @return Get a number of the all cases
			 */
			auto size() const -> size_t;

			/**
			 * @brief Get x'th case
			 *
			 * @return The row of the x'th in combined permuation case
			 */
			virtual auto operator[](size_t) const -> std::vector<size_t> = 0;

			/**
			 * @copy CaseGenerator::operator[]()
			 */
			auto at(size_t) const -> std::vector<size_t>;

			/** 
			 * @brief Get size of the N
			 */
			auto n() const -> size_t;

			/**
			 * @brief Get size of the R
			 */
			auto r() const -> size_t;

		public:
			/* ----------------------------------------------------
				TO_MATRIX
			---------------------------------------------------- */
			/**
			 * @brief Create a matrix containing all cases.
			 * @warning Size of n or r is enourmouse, then stack overflow can be occured.
			 *
			 * @return A matrix containing all cases.
			 */
			auto toMatrix() const -> std::vector<std::vector<size_t>>;
		};
	};
};