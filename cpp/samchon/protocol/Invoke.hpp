#pragma once


#include <vector>
#include <memory>
#include <samchon/protocol/InvokeParameter.hpp>

namespace samchon
{
	namespace library
	{
		class XML;
	};
	namespace protocol
	{
		class  Invoke
			: public std::vector<std::shared_ptr<InvokeParameter>>
		{
		private:
			typedef std::vector<std::shared_ptr<InvokeParameter>> super;

		protected:
			/**
			 * @brief A symbol who listens
			 */
			std::string listener;

		public:
			/**
			 * @brief Construct from listener
			 *
			 * @param listener Represents who listens the Invoke message. Almost same with Function name
			 */
			Invoke(const std::string &listener);

			/**
			 * @brief Construct from XML
			 */
			Invoke(std::shared_ptr<library::XML> xml);

			/**
			 * @brief Construct from arguments
			 *
			 * @param listener A string represents who listens the Invoke message. Almost same with name of a function.
			 * @param val A value to be a parameter of Invoke
			 * @param args Left arguments to be parameters of Invoke
			 *
			 * @tparam _Ty Type of an argument which represents a parameter
			 * @tparam _Args Left varadic template arguments' types
			 */
			template <typename _Ty, typename ... _Args>
			Invoke(const std::string &listener, const _Ty &val, const _Args &...args)
				: Invoke(listener)
			{
				construct(val);
				construct(args...);
			};

			template <typename _Ty>
			Invoke(const std::string &listener, const _Ty &val)
				: Invoke(listener)
			{
				construct(val);
			};

		private:
			template <typename _Ty, typename ... _Args>
			void construct(const _Ty &val, const _Args &...args)
			{
				construct(val);
				construct(args...);
			};

			template <typename _Ty>
			void construct(const _Ty &val)
			{
				emplace_back("", val);
			};

		public:
			/* -----------------------------------------------------------------------
				GETTERS
			----------------------------------------------------------------------- */
			/**
			 * @brief Get listener
			 */
			auto getListener() const -> std::string;

			/**
			 * @brief Whether have the item or not
			 *
			 * @param key Key value of the element whose mapped value is accessed.
			 * @return Whether the map has an item having the specified identifier
			 */
			auto has(const std::string &) const -> bool;

			/**
			 * @brief Get element by key
			 * @details Returns a reference to the mapped value of the element identified with key.
			 *
			 * @param key Key value of the element whose mapped value is accessed.
			 * @throw exception out of range.
			 *
			 * @return A reference object of the mapped value (_Ty)
			 */
			auto get(const std::string &) const -> std::shared_ptr<InvokeParameter>;

			/* -----------------------------------------------------------------------
				EXPORTERS
			----------------------------------------------------------------------- */
			auto toXML() const -> std::shared_ptr<library::XML>;
			auto toSQL() const -> std::string;
		};
	};
};