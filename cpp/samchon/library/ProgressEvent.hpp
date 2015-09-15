#pragma once
#include <samchon/library/Event.hpp>

namespace samchon
{
	namespace library
	{
		/** 
		 * @brief Event representing a progress
		 * @details
		 *
		 * @author Jeongho Nam
		 */
		class  ProgressEvent
			: public Event
		{
		public:
			enum TYPES : int
			{
				PROGRESS = 11
			};

		protected:
			/**
			 * @brief The number of current progress
			 */
			double numerator;

			/**
			 * @brief The number of total progress
			 * @warning denominator cannot be zero
			 */
			double denominator;

		public:
			/**
			 * @brief Construct from source and progress
			 *
			 * @param source Source of the event; who made the event
			 * @param numerator The number of current progress
			 * @param denominator The number of total progress
			 *
			 * @throw exception denominator is zero
			 */
			ProgressEvent(EventDispatcher *, double, double);
			virtual ~ProgressEvent() = default;

			/**
			 * @brief Get numerator, number of current progress
			 */
			auto getNumerator() const -> double;

			/**
			 * @brief Get denominator, number of total progress
			 */
			auto getDenominator() const -> double;

			/**
			 * @brief Get percentage of the progress
			 */
			auto getPercent() const -> double;
		};
	};
};