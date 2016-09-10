// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="API.ts" />

namespace example.chat {
	export class CboutUsApplication extends Application {

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

					<div>
						<div>
							<div className="container bg-light-gray">
								<div className="row">
									<div className="col-lg-12 text-center">
										<h2 className="section-heading">About Us</h2>
										<h3 className="section-subheading text-muted">SamchonFramework Team</h3>
									</div>
								</div>

								<div className="row">
									<div className="col-sm-12">
										<div className="team-member">
											<img src="https://avatars2.githubusercontent.com/u/13158709?v=3&s=280" className="img-responsive img-circle" alt=""/>
											<h4>남정호</h4>
											<p className="text-muted">Team Reader</p>
											<ul className="list-inline social-buttons">
												<li><a href="#"><i className="fa fa-github"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-facebook"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-linkedin"></i></a>
												</li>
											</ul>
										</div>
									</div>
								</div>

								<div className="row">
									<div className="col-sm-6">
										<div className="team-member">
											<img src="https://avatars2.githubusercontent.com/u/13158709?v=3&s=200" className="img-responsive img-circle" alt=""/>
											<h4>이아름</h4>
											<p className="text-muted">Lead Designer</p>
											<ul className="list-inline social-buttons">
												<li><a href="#"><i className="fa fa-github"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-facebook"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-linkedin"></i></a>
												</li>
											</ul>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="team-member">
											<img src="https://avatars2.githubusercontent.com/u/13158709?v=3&s=200" className="img-responsive img-circle" alt=""/>
											<h4>이정훈</h4>
											<p className="text-muted">Lead Marketer</p>
											<ul className="list-inline social-buttons">
												<li><a href="#"><i className="fa fa-github"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-facebook"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-linkedin"></i></a>
												</li>
											</ul>
										</div>
									</div>

								</div>

								<div className="row">
									<div className="col-sm-6">
										<div className="team-member">
											<img src="https://avatars2.githubusercontent.com/u/13158709?v=3&s=200" className="img-responsive img-circle" alt=""/>
											<h4>이다빈</h4>
											<p className="text-muted">Lead Developer</p>
											<ul className="list-inline social-buttons">
												<li><a href="#"><i className="fa fa-github"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-facebook"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-linkedin"></i></a>
												</li>
											</ul>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="team-member">
											<img src="https://avatars2.githubusercontent.com/u/13158709?v=3&s=200" className="img-responsive img-circle" alt=""/>
											<h4>이두두</h4>
											<p className="text-muted">Lead Developer</p>
											<ul className="list-inline social-buttons">
												<li><a href="#"><i className="fa fa-github"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-facebook"></i></a>
												</li>
												<li><a href="#"><i className="fa fa-linkedin"></i></a>
												</li>
											</ul>
										</div>
									</div>

								</div>
								<div className="row">
									<div className="col-lg-8 col-lg-offset-2 text-center">
										<p className="large text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit.Aut eaque, laboriosam veritatis, quos non quis ad perspiciatis, totam corporis ea, alias ut unde.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>;

		}

		public static main(): void {
			ReactDOM.render(<CboutUsApplication />, document.body);
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