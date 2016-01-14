/// <reference path="../../API.ts" />

/// <reference path="../IProtocol.ts" />

/// <reference path="Movie.ts" />
/// <reference path="../ServerConnector.ts" />

namespace samchon.protocol.service
{
    /**
     * <p> An application, the top class in JS-UI. </p>
     * 
     * <p> The Application is separated to three part, TopMenu, Movie and ServerConnector. </p>
     * <ul>
     * 	<li> <code>TopMenu</code>: Menu on the top. It's not an essential component. </li>
     * 	<li> <code>Movie</code>: Correspond with Service in Server. Movie has domain UI components(Movie) for the matched Service. </li>
     * 	<li> <code>ServerConnector</code>: The socket connecting to the Server. </li>
     * </ul>
     * 
     * <p> The Application and its UI-layout is not fixed, essential component for Samchon Framework in Flex, 
     * so it's okay to do not use the provided Application and make your custom Application.
     * But the custom Application, your own, has to contain the Movie and keep the construction routine. </p>
     * 
     * <p> <img src="movie.png" /> </p>
     * 
     * <h4> THE CONSTRUCTION ROUTINE </h4>
     * <ul>
     * 	<li>Socket Connection</li>
     * 	<ul>
     * 		<li>Connect to the CPP-Server</li>
     * 	</ul>
     * 	<li>Fetch authority</li>
     * 	<ul>
     * 		<li>Send a request to fetching authority</li>
     * 		<li>The window can be navigated to other page by the authority</li>
     * 	</ul>
     * 	<li>Construct Movie</li>
     * 	<ul>
     * 		<li>Determine a Movie by URLVariables::movie and construct it</li>
     * 	</ul>
     * 	<li>All the routines are done</li>
     * </ul>
     * 
     * @author Jeongho Nam
     */
    export class Application
	    implements IProtocol
    {
        /**
         * <p> Invoke Socket. </p>
         */
	    protected socket: ServerConnector;

        /**
         * <p> A movie. </p>
         */
	    protected movie: Movie;

        /**
         * <p> Construct from arguments. </p>
         *
         * @param movie A movie represents a service.
         * @param ip An ip address of cloud server to connect.
         * @param port A port number of cloud server to connect.
         */
	    constructor(movie:Movie, ip: string, port: number)
	    {
		    this.movie = movie;
		    this.socket = new ServerConnector(this);
		    this.socket.onopen = this.handleConnect;

		    this.socket.connect(ip, port);
	    }
    
	    private handleConnect(event: Event): void
	    {
	    }

        /**
         * <p> Handle replied message or shift the responsibility. </p>
         */
	    public replyData(invoke: Invoke): void 
        {
		    if (invoke.apply(this) == false)
			    this.movie.sendData(invoke);
	    }

        /**
         * <p> Send a data to server. </p>
         */
	    public sendData(invoke: Invoke): void 
        {
		    this.socket.sendData(invoke);
	    }
    }
}