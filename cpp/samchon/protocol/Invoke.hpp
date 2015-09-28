#pragma once
#include <samchon/API.hpp>

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
		/**
		 * @brief Standard message of network I/O
		 *
		 * @details
		 *
		 * @image html  cpp/protocol_invoke.png
		 * @image latex cpp/protocol_invoke.png
		 *
		 * @includelineno invoke/main.cpp
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API Invoke
			: public std::vector<std::shared_ptr<InvokeParameter>>
		{
		private:
			typedef std::vector<std::shared_ptr<InvokeParameter>> super;

		protected:
			/**
			 * @brief Represent who listens
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
			Invoke(const std::string &listener, const _Ty &val, const _Args& ... args)
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
			void construct(const _Ty &val, const _Args& ... args)
			{
				construct(val);
				construct(args...);
			};
			
			#define INVOKE_CONSTRUCT_INLINE($TYPE) \
			inline void construct($TYPE val) \
			{ \
				emplace_back(new InvokeParameter("", val)); \
			};

			//INVOKE_CONSTRUCT_INLINE(char)
			INVOKE_CONSTRUCT_INLINE(short)
			INVOKE_CONSTRUCT_INLINE(long)
			INVOKE_CONSTRUCT_INLINE(long long)
			INVOKE_CONSTRUCT_INLINE(int)
			INVOKE_CONSTRUCT_INLINE(float)
			INVOKE_CONSTRUCT_INLINE(double)

			//INVOKE_CONSTRUCT_INLINE(unsigned char)
			INVOKE_CONSTRUCT_INLINE(unsigned short)
			INVOKE_CONSTRUCT_INLINE(unsigned long)
			INVOKE_CONSTRUCT_INLINE(unsigned long long)
			INVOKE_CONSTRUCT_INLINE(unsigned int)
			INVOKE_CONSTRUCT_INLINE(long double)

			INVOKE_CONSTRUCT_INLINE(const char *)
			INVOKE_CONSTRUCT_INLINE(const std::string &)
			INVOKE_CONSTRUCT_INLINE(const ByteArray &)
			INVOKE_CONSTRUCT_INLINE(const std::shared_ptr<library::XML> &)

			/*void construct(bool);
			void construct(char);
			void construct(short);
			void construct(long);
			void construct(long long);
			void construct(int);
			void construct(float);
			void construct(double);

			void construct(unsigned char);
			void construct(unsigned short);
			void construct(unsigned long);
			void construct(unsigned long long);
			void construct(unsigned int);
			void construct(long double);

			void construct(const char*);
			void construct(const std::string &);
			void construct(const ByteArray &);
			void construct(const std::shared_ptr<library::XML> &);*/

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