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
		 * <p> Invoke is a class used in network I/O in protocol package of Samchon Framework.  </p>
		 *
		 * <p> The Invoke message has a XML structure like the result screen of provided example in below. 
		 * We can enjoy lots of benefits by the normalized and standardized message structure used in
		 * network I/O. </p>
		 *
		 * <p> The greatest advantage is that we can make any type of network system, even how the system 
		 * is enourmously complicated. As network communication message is standardized, we only need to
		 * concentrate on logical relationships between network systems. We can handle each network system 
		 * like a object (class) in OOD. And those relationships can be easily designed by using design
		 * pattern. </p>
		 *
		 * <p> In Samchon Framework, you can make any type of network system with basic 3 + 1 componenets
		 * (IProtocol, IServer and IClient + ServerConnector), by implemens or inherits them, like designing
		 * classes of S/W architecture. </p>
		 *
		 * @image html  cpp/protocol_invoke.png
		 * @image latex cpp/protocol_invoke.png
		 *
		 * \par Example source
		 * @includelineno invoke/main.cpp
		 *
		 * <h4> Result of the example </h4>
		 * @image html  cpp/result/protocol_invoke.png
		 * @image latex cpp/protocol_invoke.png
		 *
		 * @see protocol::IProtocol
		 * @see samchon::protocol
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API Invoke
			: public std::vector<std::shared_ptr<InvokeParameter>>
		{
		private:
			typedef std::vector<std::shared_ptr<InvokeParameter>> super;

		protected:
			/**
			 * @brief Represent who listens, often be a function name
			 */
			std::string listener;

		public:
			/**
			 * @brief Construct from a listener
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
			/**
			 * @brief Get a XML instance representing the Invoke message
			 */
			auto toXML() const -> std::shared_ptr<library::XML>;

			/**
			 * @brief Get a string of sql statement used to archive history log
			 */
			auto toSQL() const -> std::string;
		};
	};
};