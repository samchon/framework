// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="API.ts" />

namespace example.chat {
	export class VideoApplication extends Application {
		
		// try ContactApplication 

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
					
						   <div className="row">
            <div className="feature-content">
              <div className="col-lg-6">
                <iframe width="100%" height={315} src="https://www.youtube.com/embed/kanO9K8IbI0" frameBorder={0} allowFullScreen />
              </div>
              <div className="col-lg-5 col-lg-offset-1">
                <h6>Watch this</h6>
                <h2>Witness the power of Startup.logo in this acapella video</h2>
                <p className="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam quia aliquam, error doloribus?</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, excepturi. Officiis corporis facilis
                  ducimus assumenda modi, tenetur, dolorum quis similique, qui, ad dignissimos maiores hic. Explicabo
                  harum, provident autem. Ratione.</p>
              </div>
            </div>
          </div>

					</div>
				</div>

			</div>
		</div>;

		}

		public static main(): void {
			ReactDOM.render(<VideoApplication />, document.body);
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