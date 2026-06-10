function RenderFooter() {
	return (
		<div className="footer-container">
			<footer id="section-footer" className="page-section">
				<div className="page-section-inner">
					<section id="footer-top" className="flex-container hide-mobile">
						<div className="footer-column">
							<a className="footer-logo-wrap" href="/">
								<img className="footer-logo" loading="lazy" src="https://i.imgur.com/9qYPFSA.png" />
							</a>
						</div>
						<div className="footer-column">
							<h3 className="footer-column-header">Community</h3>
							<a rel="noreferrer noopener" target="_blank" href="/discord" className="footer-column-item">
								<span>Discord</span>
							</a>
							<a rel="noreferrer noopener" target="_blank" href="https://github.com/SteamClientHomebrew/Millennium/" className="footer-column-item">
								<span>GitHub</span>
							</a>
						</div>
						<div className="footer-column">
							<h3 className="footer-column-header">Content</h3>
							<a href="/themes" className="footer-column-item">
								<span>Themes</span>
							</a>
							<a href="https://docs.steambrew.app/developers/" className="footer-column-item">
								<span>Developers</span>
							</a>
						</div>
						<div className="footer-column">
							<h3 className="footer-column-header">Help</h3>
							<a href="https://docs.steambrew.app/users/" target="_blank" className="footer-column-item">
								Documentation
							</a>
						</div>
					</section>
					<section id="footer-bottom" className="flex-container wrap align-center justify-between">
						<div className="hide-desktop flex-container wrap" id="footer-privacy-container">
							<div className="footer-privacy text-center">
								<a href="https://github.com/SteamClientHomebrew/Millennium/" className="footer-privacy-item">
									GitHub
								</a>
								<a href="/discord" className="footer-privacy-item">
									Discord
								</a>
								<a href="https://docs.steambrew.app/" className="footer-privacy-item">
									Documentation
								</a>
							</div>
						</div>
						<div className="flex-container wrap" id="footer-copyright-container">
							<div className="footer-copyright text-center"> © {new Date().getFullYear()} Steam Client Homebrew</div>
							<div className="footer-disclaimer">Steam Homebrew is not affiliated with nor endorsed by Valve Corporation.</div>
						</div>
						<div id="footer-social-icons" className="flex-container justify-center wrap">
							<a rel="noreferrer noopener" target="_blank" href="/discord" className="social-icon discord">
								<svg className="social-icon-inner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="20" height="20">
									<path
										fill="currentColor"
										fillRule="evenodd"
										d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475V24l-2.677-2.273l-1.47-1.338l-1.604-1.398l.67 2.205H3.71c-1.402 0-2.54-1.065-2.54-2.476V2.48C1.17 1.142 2.31.003 3.715.003h16.5L20.222 0zm-6.118 5.683h-.03l-.202.2c2.073.6 3.076 1.537 3.076 1.537c-1.336-.668-2.54-1.002-3.744-1.137c-.87-.135-1.74-.064-2.475 0h-.2c-.47 0-1.47.2-2.81.735c-.467.203-.735.336-.735.336s1.002-1.002 3.21-1.537l-.135-.135s-1.672-.064-3.477 1.27c0 0-1.805 3.144-1.805 7.02c0 0 1 1.74 3.743 1.806c0 0 .4-.533.805-1.002c-1.54-.468-2.14-1.404-2.14-1.404s.134.066.335.2h.06c.03 0 .044.015.06.03v.006c.016.016.03.03.06.03c.33.136.66.27.93.4a8.18 8.18 0 0 0 1.8.536c.93.135 1.996.2 3.21 0c.6-.135 1.2-.267 1.8-.535c.39-.2.87-.4 1.397-.737c0 0-.6.936-2.205 1.404c.33.466.795 1 .795 1c2.744-.06 3.81-1.8 3.87-1.726c0-3.87-1.815-7.02-1.815-7.02c-1.635-1.214-3.165-1.26-3.435-1.26l.056-.02zm.168 4.413c.703 0 1.27.6 1.27 1.335c0 .74-.57 1.34-1.27 1.34c-.7 0-1.27-.6-1.27-1.334c.002-.74.573-1.338 1.27-1.338zm-4.543 0c.7 0 1.266.6 1.266 1.335c0 .74-.57 1.34-1.27 1.34c-.7 0-1.27-.6-1.27-1.334c0-.74.57-1.338 1.27-1.338z"
									></path>
								</svg>
							</a>
							<a rel="noreferrer noopener" target="_blank" href="https://github.com/SteamClientHomebrew/Millennium/" className="social-icon github">
								<svg className="social-icon-inner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20">
									<path
										fill="currentColor"
										fillRule="evenodd"
										d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
									></path>
								</svg>
							</a>
						</div>
					</section>
				</div>
			</footer>
		</div>
	);
}

export default RenderFooter;
