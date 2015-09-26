#pragma once

namespace samchon
{
	/**
	 * @brief Package of network protocol and libraries.
	 * 
	 * <ul>
	 *	<li><h3> Entity - data classes with utility methods </h3></li>
	 *		<p> In Samchon Framework, with entity, boundary and control, entity is the main. 
	 *		And the entity package provides I/O interface to/from XML, Invoke and DBMS. If you
	 *		need some additional function (role of boundary or control) for an entity, use
	 *		chain of responsibility pattern starting from the entity. </p>
	 *
	 *		<p> When data-set has a "hierarchical relationship", do not have the children objects
	 *		by having a container member variable. Directly inherits container set. Composes the data 
	 *		class (entity) having children by inheriting EntityGroup and terminate the leaf node by 
	 *		inheriting Entity (single object).
	 *
	 *		@image html cpp/protocol_entity.png
	 *		@image latex cpp/protocol_entity.png width=12cm
	 *
	 *	<li><h3> Invoke - standard network I/O message </h3></li>
	 *		<p> Invoke is a standard message structure using network I/O in Samchon Framework. </p>
	 *		<p> Group invoke not only provides parsing and converting from/to invoke mssage, but also
	 *		history classes can be used to archiving log or estimating performance of a system. The
	 *		purpose of estimating performance a system, especially, used in module of distributed
	 *		processing and parallel processing systems. </p>
	 *
	 *		@image html cpp/protocol_invoke.png
	 *		@image latex cpp/protocol_invoke.png width=12cm
	 *
	 *	<li><h3> Intefaces </h3></li>
	 *		<p> You can make any type of network system with only three interfaces;
	 *		IProtocol, IServer an IClent which are called basic 3 components. </p>
	 *
	 *		<p> When you see protocol libraries from a different view, out of framework,
	 *		all the modules in protocol are examples combinationing and utilizing those
	 *		three basic components (interaces). </p>
	 *
	 *		<p> @image html cpp/protocol_interface.png
	 *		@image latex cpp/protocol_interface.png width=12cm </p>
	 *
	 *		<p> @image html sequence/send_invoke.png
	 *		@image latex sequence/send_invoke.png width=12cm </p>
	 *
	 *	<li><h3> External System </h3></li>
	 *		<p> Module <i>external_system</i> provides interfaces for interaction with external network system. 
	 *		Although, the module <i>external_system</i> acts boundary as main role, what you've to concentrate
	 *		on is the entity. Samchon Framework takes responsibility of network communication and you only
	 *		consider about relationship and role of each <i>external network systems</i>. </p>
	 *		
	 *		<p> ExternalSystem objects are managed by ExternalSystemArray and the ExternalSystemArray can
	 *		access to a role belongs to a system directly. When you send an Invoke message to 
	 *		ExternalSystemArray, the ExternalSystemArray finds matched ExternalSystemRole and the 
	 *		ExternalSystemRole shifts the network I/O responsibility to belonged ExternalSystem. 
	 *		This relationship called "Proxy Pattern". By the pattern, "Proxy", you can concentrate 
	 *		on roles irrespective of where each role is belonged to. </p>
	 *
	 *		<ul>
	 *			<li> ExternalSystemArray::sendData() -> ExternalSystemRole(Proxy)::sendData() -> ExternalSystem::sendData() </li>
	 *			<li> ExternalSystem::replyData() -> ExternalSystemRole(Proxy)::replyData() </li>
	 *		</ul>
	 *
	 *		<p> Whether using the "Proxy pattern" is on your mind in <i>external_system module</i> level.
	 *		"Proxy pattern" is recommend to use in <i>external_system</i> module, but not forced. 
	 *		However, since <i>parallel_processing_system</i> module, you've to follow the pattern.
	 *
	 *		@image html cpp/protocol_entity.png
	 *		@image latex cpp/protocol_entity.png width=12cm
	 *
	 *	<li><h3> Packages in protocol </h3></li>
	 *	<ul>
	 *		<li><h4> Cloud service </h4></li>
	 *
	 *			<p> @image html cpp/protocol_service.png
	 *			@image latex cpp/protocol_service.png width=12cm </p>
	 *
	 *			<p> @image html sequence/service_connection.png
	 *			@image latex sequence/service_connection.png width=12cm </p>
	 *
	 *			<p> @image html sequence/service_communication.png
	 *			@image latex sequence/service_communication.png width=12cm </p>
	 *
	 *		<li><h4> Master system </h4></li>
	 *
	 *			<p> @image html conception/distributed_and_parallel_processing_system.png
	 *			@image latex conception/distributed_and_parallel_processing_system.png width=12cm </p>
	 *
	 *			<p> @image html cpp/protocol_master_distributed_system.png
	 *			@image latex cpp/protocol_master_distributed_system.png width=12cm </p>
	 *
	 *			<p> @image html cpp/protocol_master_parallel_system.png
	 *			@image latex cpp/protocol_master_parallel_system.png width=12cm </p>
	 *
	 *		<li><h4> Slave system </h4></li>
	 *
	 *			@image html cpp/protocol_slave.png
	 *			@image latex cpp/protocol_slave.png width=12cm
	 *
	 *	</ul>
	 * </ul>
	 *
	 * @author Jeongho Nam
	 */
	namespace protocol
	{
		//THIS HEADER FILE IS ONLY FOR DOCUMENTATION
	};
};