#pragma once
#include <samchon/API.hpp>

#include <vector>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Case generator
		 */
		class SAMCHON_FRAMEWORK_API CaseGenerator
		{
		protected:
			/**
			 * 
			 */
			size_t n;

			/**
			 * 
			 */
			size_t r;

			/**
			 * 
			 */
			size_t size_;

			/**
			 * 
			 */
			std::vector<size_t> dividerArray;

		public:
			/**
			 * @brief Construct from size of index and level
			 *
			 * @param n
			 * @param r
			 */
			CaseGenerator(size_t n, size_t r);
			virtual ~CaseGenerator() = default;

			//ACCESSORS
			/**
			 * @brief Get size of all cases
			 *
			 * @return The size of all cases
			 */
			auto size() const -> size_t;

			/**
			 * @brief Get x'th row
			 *
			 * @return The row of the x'th in combined permuation case
			 */
			virtual auto at(size_t x) const -> std::vector<size_t> = NULL;

			/**
			 * @copy CaseGenerator::at()
			 */
			auto operator[](size_t) const -> std::vector<size_t>;

			/** 
			 * @brief Get size of N
			 */
			auto getN() const -> size_t;

			/**
			 * @brief Get size of R
			 */
			auto getR() const -> size_t;

		public:
			/* ----------------------------------------------------
				TO_MATRIX
			---------------------------------------------------- */
			/**
			 * @return A matrix containing all cases
			 */
			auto toMatrix() const->std::vector<std::vector<size_t>>;
		};
	};
};