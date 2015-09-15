#pragma once

#include <string>
#include <memory>
#include <samchon/ByteArray.hpp>

namespace samchon
{
	namespace library
	{
		class XML;
	};
	namespace protocol
	{
		class Invoke;

		/**
		 *
		 * @author Jeongho Nam
		 */
		class  InvokeParameter
		{
			friend class Invoke;

		protected:
			/**
			 * @brief A name of the parameter
			 */
			std::string name;

			/**
			 * @brief Type of the parameter
			 *
			 * @details
			 * <p> List of types </p>
			 *	\li number
			 *	\li string
			 *	\li XML
			 *	\li ByteArray
			 *	\li Pre-ByteArray
			 */
			std::string type;

			/**
			 * @brief Dynamic pointer of the value
			 *
			 * @details
			 * <p> List of pointer types </p>
			 *	\li double*
			 *	\li std::string*
			 *	\li std::shared_ptr<library::XML>*
			 *	\li ByteArray*
			 *
			 * @note
			 * <p> Since C++11, method of void pointer (Declare a variable as void pointer whose type can
			 * not specified. And convert the pointer type to specified one for each case) is recommended 
			 * to avoid. </p>
			 * <p> As that reason, the <i>void *value</i> is a candidate to be depreciated. 
			 * May be replaced to <i>boost::any</i> in next generation of Samchon Framework. </p>
			 *
			 *	\li In Flex and TypeScript(JavaScript), the value is replaced to any's type since v1.0.
			 */
			void *value;

		public:
			/* ----------------------------------------------------------
				CONSTRUCTORS
			---------------------------------------------------------- */
			/**
			 * @brief Construct from the name and a number
			 */
			InvokeParameter(const std::string &, const double &);

			/**
			 * @brief Construct from the name and a string
			 */
			InvokeParameter(const std::string &, const std::string &);

			/**
			 * @brief Construct from the name and a XML object
			 */
			InvokeParameter(const std::string &, const std::shared_ptr<library::XML> &);

			/**
			 * @brief Construct from the name and a ByteArray
			 */
			InvokeParameter(const std::string &, const ByteArray &);

			/**
			 * @brief Construct from the name and a moved string
			 */
			InvokeParameter(const std::string &, std::string &&);

			/**
			 * @brief Construct from name and a moved ByteArray
			 */
			InvokeParameter(const std::string &, ByteArray &&);

			~InvokeParameter();

		public:
			/* ----------------------------------------------------------
				GETTERS
			---------------------------------------------------------- */
			/**
			 * @brief Get name
			 */
			auto getName() const -> std::string;

			/**
			 * @brief Get type
			 */
			auto getType() const -> std::string;

			/**
			 * @brief Get value as a number
			 *
			 * @throw invalid argument; invalid type specification
			 */
			auto getValueAsNumber() const -> double;

			/**
			 * @brief Get value as a string
			 *
			 * @throw invalid argument; invalid type specification
			 */
			auto getValueAsString() const -> std::string;

			/**
			 * @brief Get value as a XML object
			 *
			 * @throw invalid argument; invalid type specification
			 */
			auto getValueAsXML() const -> std::shared_ptr<library::XML>;

			/**
			 * @brief Get value as a ByteArray instance
			 *
			 * @throw invalid argument; invalid type specification
			 */
			auto getValueAsByteArray() const -> ByteArray;

			/**
			 * @brief Move value as a string
			 *
			 * @note 
			 * This method calls move constructor(operator). 
			 * Thus, value in the InvokeParameter will be <i>nullptr</i> and you can't get the value no more.
			 */
			auto moveValueAsString() -> std::string;

			/**
			 * @brief Move value as ByteArray instance
			 *
			 * @note 
			 * This method calls move constructor(operator). 
			 * Thus, value in the InvokeParameter will be <i>nullptr</i> and you can't get the value no more.
			 */
			auto moveValueAsByteArray() -> ByteArray;

		private:
			/* ----------------------------------------------------------
				HIDDEN METHODS
			---------------------------------------------------------- */
			/**
			 * @brief Construct from XML
			 */
			InvokeParameter(std::shared_ptr<library::XML>);

			auto reservedByteArraySize() const -> size_t;
			void setByteArray(ByteArray &&);
			
		public:
			/* ----------------------------------------------------------
				EXPORTERS
			---------------------------------------------------------- */
			auto toXML() const -> std::shared_ptr<library::XML>;
			auto toSQL() const -> std::string;
		};
	};
};