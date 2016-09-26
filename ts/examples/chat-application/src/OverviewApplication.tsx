// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="API.ts" />

namespace example.chat {
	export class OverviewApplication extends Application {

		// try OverviewApplication 

		/* ---------------------------------------------------------
			VISUALIZER
		--------------------------------------------------------- */
		public render(): JSX.Element {

			return <div>

				<div id="wrapper">
					<div id="sidebar-wrapper">
						<ul className="sidebar-nav">
							<li className="sidebar-brand">
								<div className="talk-title">
									<h2> SamchonTalk </h2>
								</div>
							</li>
							<br/><br/>
							<li>
								<a href="list.html">Dashboard</a>
							</li>
							<li>
								<a href="video.html">Video</a>
							</li>
							<li>
								<a href="overview.html">Overview</a>
							</li>
							<li>
								<a href="aboutus.html">About</a>
							</li>
							<li>
								<a href="services.html">Services</a>
							</li>
							<li>
								<a href="contact.html">Contact</a>
							</li>
						</ul>

						<div className="user-info">
							<h3> INFORMATION </h3>
							<h5>Account ID: {this.id}</h5>
							<h5>Name: {this.name}</h5>
						</div>
					</div>

					<div id="page-content-wrapper">
						<div className="container-fluid">
							<p>
								<h2>Samchon Framework is</h2>

								Samchon framework is an <strong>OON1</strong> framework; who can build network system within framework of <strong>OOD2</strong>, like cloud system and distributed & parallel processing systems, even how the system is enormously complicate.

								Samchon Framework supports two languages; C++and TypeScript/NodeJs.Not only connecting to an external server, but also opening a server is also possible both in <strong>C++</strong>and <strong>TypeScript/NodeJS.</strong>In my case, I prefer to build a cloud server with TypeScript & NodeJS quickly.When the cloud server grows up and lots of traffic occurs, I let the cloud server to deliver heavy processes to Distributed systems built via C++.
							</p>
							<img src="https://camo.githubusercontent.com/4cec4c0dde09984806b7a4353cba82e69dcd9bde/687474703a2f2f73616d63686f6e2e6769746875622e696f2f6672616d65776f726b2f696d616765732f6163636573736f72792f6c616e67756167655f6469616772616d2e706e67"/>
							<img src="https://camo.githubusercontent.com/404a0fedbcd61c760016968e9dbd578cd415b7cd/687474703a2f2f73616d63686f6e2e6769746875622e696f2f6672616d65776f726b2f696d616765732f6578616d706c652f696e746572616374696f6e2f64656d6f2e676966"/>

						</div>
					</div>

				</div>
			</div>;

		}

		public static main(): void {
			ReactDOM.render(<OverviewApplication />, document.body);
		}

		// protected refresh(): void {
		// 	super.refresh();

		// 	document.getElementById("messages_div").innerHTML = this.messages;
		// }

		// public static main(): void {
		// 	let url_variables: library.URLVariables = new library.URLVariables(location.href);
		// 	let uid: number = Number(url_variables.get("uid"));

		// 	let application: ChatApplication = new ChatApplication(uid);
		// 	ReactDOM.render(application.render(), document.body);
		// }
	}
}