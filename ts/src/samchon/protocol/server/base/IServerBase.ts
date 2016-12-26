namespace samchon.protocol
{
	/**
	 * An interface for substitute server classes.
	 * 
	 * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
	 * 
	 * The easiest way to defining a server class is to extending one of them below, who implemented the {@link IServer}. 
	 * However, it is impossible (that is, if the class is already extending another class), you can instead implement 
	 * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into 
	 * the aggregated {@link IServerBase}.
	 * 
	 * Protocol                | {@link IServer}               | {@link IServerBase}               | {@link IClientDriver}
	 * ------------------------|-------------------------------|-----------------------------------|-------------------------------------
	 * Samchon Framework's own | {@link Server}                | {@link ServerBase}                | {@link ClientDriver}
	 * Web-socket protocol     | {@link WebServer}             | {@link WebServerBase}             | {@link WebClientDriver}
	 * DedicatedWorker         | {@link DedicatedWorkerServer} | {@link DedicatedWorkerServerBase} | {@link DedicatedWorkerClientDriver}
	 * SharedWorker            | {@link SharedWorkerServer}    | {@link SharedWorkerServerBase}    | {@link SharedWorkerClientDriver}
	 * 
	 * After the hooking to aggregated {@link IServerBase} object, overrides {@link addClient addClient()} method who 
	 * accepts a newly connected client as an {@link IClientDriver} object. At last, call {@link open open()} method with 
	 * specified port number.
	 * 
	 * ```typescript
	 * class MyServer extends Something implements IServer
	 * {
	 * 	private server_base_: IServerBase = new WebServerBase(this);
	 *
	 * 	public addClient(driver: IClientDriver): void
	 * 	{
	 * 		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
	 * 	}
	 *
	 * 	public open(port: number): void
	 * 	{
	 * 		this.server_base_.open();
	 * 	}
	 * 	public close(): void
	 * 	{
	 * 		this.server_base_.close();
	 * 	}
	 * }
	 * ```
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link IServer}, {@link IClientDriver}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IServerBase extends IServer
	{
	}
}