'use client';

import '@/css/index.css';
import '@/css/home.css';
import { useLayoutEffect, useState, useRef, useEffect, useCallback } from 'react';

import RenderFooter from '../components/FooterComponent';
import RenderHeader from '../components/HeaderComponent';
import { GetStatisticsSync, StatisticProps } from '../utils/Util';
import CountUp from 'react-countup';
import { CodeBlock } from '../utils/CodeBlock';
import { RenderBackdropAnimation } from '../components/RenderAnimation';
import { useScrollNavigation } from '../components/SmoothScroll';
import { PlatformIcon } from '@/components/Platform';

function RenderHome() {
	const [stat, setStat] = useState<StatisticProps>();
	const [scrolled, setIsFloating] = useState(false);

	useEffect(() => {
		GetStatisticsSync().then((stats) => setStat(stats));
	}, []);

	const mainContentRef = useRef(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const feature1Ref = useRef(null);
	const feature2Ref = useRef(null);
	const contributorsRef = useRef(null);
	const footerRef = useRef(null);

	const handleScroll = () => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;

		if (!videoRef.current) return;

		if (scrollTop === 0) {
			videoRef.current.currentTime = 0;
			videoRef?.current?.pause();
		} else {
			videoRef.current.play();
		}

		setIsFloating((window.scrollY || document.documentElement.scrollTop) > 0);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const refsArray = [mainContentRef, videoRef, feature1Ref, feature2Ref, contributorsRef, footerRef];
	const { navigatorIndex, jumpTo } = useScrollNavigation(refsArray);

	return (
		<>
			<div itemScope itemType="https://schema.org/WebSite">
				<meta itemProp="url" content="https://steambrew.app/" />
				<meta itemProp="name" content="Steam Homebrew" />
			</div>

			<RenderHeader />
			<div ref={mainContentRef} />

			<main id="main-page-content" className="home-main-page-content">
				<section id="home-hero-section" className="page-section">
					<RenderBackdropAnimation />

					<div className="page-section-inner">
						<div id="hero-top-container" className="flex-container align-center justify-center direction-column">
							<h1 className="text-center title">Millennium</h1>
							<p className="text-center title-description">An open source gateway to a better Steam® client experience.</p>
							<div className="btn-container">
								<a href="https://docs.steambrew.app/users/getting-started/installation" target="_blank" rel="noreferrer">
									<button className="btn btn-primary" id="hero-download-button">
										<PlatformIcon />
										<span>Install Now</span>
									</button>
								</a>
								<a href="/discord">
									<button className="btn btn-secondary" id="hero-community-button">
										<svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
											<path
												fillRule="evenodd"
												d="M1.5 2.75a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-3.5a.75.75 0 00-.53.22L3.5 11.44V9.25a.75.75 0 00-.75-.75h-1a.25.25 0 01-.25-.25v-5.5zM1.75 1A1.75 1.75 0 000 2.75v5.5C0 9.216.784 10 1.75 10H2v1.543a1.457 1.457 0 002.487 1.03L7.061 10h3.189A1.75 1.75 0 0012 8.25v-5.5A1.75 1.75 0 0010.25 1h-8.5zM14.5 4.75a.25.25 0 00-.25-.25h-.5a.75.75 0 110-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0114.25 12H14v1.543a1.457 1.457 0 01-2.487 1.03L9.22 12.28a.75.75 0 111.06-1.06l2.22 2.22v-2.19a.75.75 0 01.75-.75h1a.25.25 0 00.25-.25v-5.5z"
											></path>
										</svg>
										<span>Community</span>
									</button>
								</a>
							</div>
							{/*<div className="information-container">
								<div className="information-container-header">INFO</div>
								<div className="information-container-body">
									On December 19th, 2025, Valve updated the architecture of the Steam Client from 32bit to 64bit. As a result, some older versions of Millennium will no longer work, and won't be able to auto update. If Millennium is
									not loading, a manual re-install is required. The latest fixed version is 2.31.0. If this is your first time installing, or Millennium is working as intended, you can ignore this message.
									<br />
									<br />
									Thanks for your understanding, and thanks for using Millennium ❤️
								</div>
							</div>*/}

							<div className="downloads-container">
								<strong id="downloads-count">
									<CountUp start={0} end={Number(stat?.download_count ?? 0)} />
								</strong>
								<span> Downloads</span>
								<strong id="downloads-count">
									<CountUp start={0} end={Number(stat?.server_members ?? 0)} />
								</strong>
								<span> Discord Members</span>
							</div>
						</div>
						<div id="mouse-icon" className={scrolled ? 'mouse-hidden' : 'mouse-shown'}>
							<div id="scroll-wheel"></div>
						</div>
					</div>
				</section>
				<section id="home-additional-features" className="page-section">
					<div className="page-section-inner intro-section">
						<div className="showCaseContainer">
							<video ref={videoRef} autoPlay muted loop playsInline>
								<source src="https://github.com/user-attachments/assets/ea9028d1-ecfd-4d95-b199-33bb6b657bff" type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						</div>

						<div className="features-view">
							<div className="feature" id="feature-1" ref={feature1Ref}>
								<div className="theme-showcase hide-mobile">
									<div className="theme-showcase-inner">
										<div className="crossfade-image" />
										<div className="crossfade-image" />
										<div className="crossfade-image" />
										<div className="crossfade-image" />
										<div className="crossfade-image" />
										<div className="crossfade-image" />
										<div className="crossfade-image" />
										<div className="crossfade-image" />
										<div className="crossfade-image" />
										<div className="crossfade-image" />
										<div className="guilds-column" />
										<div className="sidebar-column">
											<div className="sidebar-header" />
											<div className="user-container" />
										</div>
										<div className="base">
											<div className="toolbar" />
											<div className="chat">
												<div className="chat-content" />
												<div className="sidebar-column game-info" />
											</div>
										</div>
									</div>
									<div className="bottom-bar"></div>
								</div>
								<div className="feature-info">
									<h1 className="title">Themes</h1>
									<p className="title-description" style={{ fontSize: '16px' }}>
										Themes allow you to completely customize your client with CSS. You can either make your own theme, or download the wide variety of themes from our community.
									</p>
									<a className="btn btn-secondary" href="/themes">
										<span>Browse Themes</span>
									</a>
								</div>
							</div>
							<div className="feature" id="feature-2" ref={feature2Ref}>
								<div className="feature-info">
									<h1 className="title">Plugins</h1>
									<p className="title-description" style={{ fontSize: '16px' }}>
										Millennium comes with a builtin plugin loader and plugin API. Plugins can increase the functionality and user experience of the app through JavaScript. Write your own or download plugins made by the community.
									</p>
									<a className="btn btn-secondary" href="/plugins">
										<span>Browse Plugins</span>
									</a>
								</div>
								<div className="plugin-showcase hide-mobile">
									<div className="plugin-showcase-inner">
										<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 65 65" fill="#fff" height="60px" width="60px">
											<use xlinkHref="#B" x=".5" y=".5" />
											<defs>
												<linearGradient id="A" x2="50%" x1="50%" y2="100%" y1="0%">
													<stop stopColor="#111d2e" offset="0%" />
													<stop stopColor="#051839" offset="21.2%" />
													<stop stopColor="#0a1b48" offset="40.7%" />
													<stop stopColor="#132e62" offset="58.1%" />
													<stop stopColor="#144b7e" offset="73.8%" />
													<stop stopColor="#136497" offset="87.3%" />
													<stop stopColor="#1387b8" offset="100%" />
												</linearGradient>
											</defs>
											<symbol id="B">
												<g>
													<path d="M1.305 41.202C5.259 54.386 17.488 64 31.959 64c17.673 0 32-14.327 32-32s-14.327-32-32-32C15.001 0 1.124 13.193.028 29.874c2.074 3.477 2.879 5.628 1.275 11.328z" fill="url(#A)" />
													<path d="M30.31 23.985l.003.158-7.83 11.375c-1.268-.058-2.54.165-3.748.662a8.14 8.14 0 0 0-1.498.8L.042 29.893s-.398 6.546 1.26 11.424l12.156 5.016c.6 2.728 2.48 5.12 5.242 6.27a8.88 8.88 0 0 0 11.603-4.782 8.89 8.89 0 0 0 .684-3.656L42.18 36.16l.275.005c6.705 0 12.155-5.466 12.155-12.18s-5.44-12.16-12.155-12.174c-6.702 0-12.155 5.46-12.155 12.174zm-1.88 23.05c-1.454 3.5-5.466 5.147-8.953 3.694a6.84 6.84 0 0 1-3.524-3.362l3.957 1.64a5.04 5.04 0 0 0 6.591-2.719 5.05 5.05 0 0 0-2.715-6.601l-4.1-1.695c1.578-.6 3.372-.62 5.05.077 1.7.703 3 2.027 3.696 3.72s.692 3.56-.01 5.246M42.466 32.1a8.12 8.12 0 0 1-8.098-8.113 8.12 8.12 0 0 1 8.098-8.111 8.12 8.12 0 0 1 8.1 8.111 8.12 8.12 0 0 1-8.1 8.113m-6.068-8.126a6.09 6.09 0 0 1 6.08-6.095c3.355 0 6.084 2.73 6.084 6.095a6.09 6.09 0 0 1-6.084 6.093 6.09 6.09 0 0 1-6.081-6.093z" />
												</g>
											</symbol>
										</svg>

										<svg className="plugin-showcase-logo plugin-showcase-plus" xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="currentColor" viewBox="0 0 24 24">
											<path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
										</svg>
										<svg version="1.1" x="0px" y="0px" width="60px" height="60px" viewBox="0.21 -0.077 110 110" enableBackground="new 0.21 -0.077 110 110" xmlSpace="preserve">
											<linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="63.8159" y1="56.6829" x2="118.4934" y2="1.8225" gradientTransform="matrix(1 0 0 -1 -53.2974 66.4321)">
												{' '}
												<stop offset={0} style={{ stopColor: '#387EB8' }} /> <stop offset={1} style={{ stopColor: '#366994' }} />
											</linearGradient>
											<path
												fill="url(#SVGID_1_)"
												d="M55.023-0.077c-25.971,0-26.25,10.081-26.25,12.156c0,3.148,0,12.594,0,12.594h26.75v3.781 c0,0-27.852,0-37.375,0c-7.949,0-17.938,4.833-17.938,26.25c0,19.673,7.792,27.281,15.656,27.281c2.335,0,9.344,0,9.344,0 s0-9.765,0-13.125c0-5.491,2.721-15.656,15.406-15.656c15.91,0,19.971,0,26.531,0c3.902,0,14.906-1.696,14.906-14.406 c0-13.452,0-17.89,0-24.219C82.054,11.426,81.515-0.077,55.023-0.077z M40.273,8.392c2.662,0,4.813,2.15,4.813,4.813 c0,2.661-2.151,4.813-4.813,4.813s-4.813-2.151-4.813-4.813C35.46,10.542,37.611,8.392,40.273,8.392z"
											/>
											<linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="97.0444" y1="21.6321" x2="155.6665" y2="-34.5308" gradientTransform="matrix(1 0 0 -1 -53.2974 66.4321)">
												{' '}
												<stop offset={0} style={{ stopColor: '#FFE052' }} /> <stop offset={1} style={{ stopColor: '#FFC331' }} />
											</linearGradient>
											<path
												fill="url(#SVGID_2_)"
												d="M55.397,109.923c25.959,0,26.282-10.271,26.282-12.156c0-3.148,0-12.594,0-12.594H54.897v-3.781 c0,0,28.032,0,37.375,0c8.009,0,17.938-4.954,17.938-26.25c0-23.322-10.538-27.281-15.656-27.281c-2.336,0-9.344,0-9.344,0 s0,10.216,0,13.125c0,5.491-2.631,15.656-15.406,15.656c-15.91,0-19.476,0-26.532,0c-3.892,0-14.906,1.896-14.906,14.406 c0,14.475,0,18.265,0,24.219C28.366,100.497,31.562,109.923,55.397,109.923z M70.148,101.454c-2.662,0-4.813-2.151-4.813-4.813 s2.15-4.813,4.813-4.813c2.661,0,4.813,2.151,4.813,4.813S72.809,101.454,70.148,101.454z"
											/>
										</svg>

										<svg className="plugin-showcase-logo plugin-showcase-plus" xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="currentColor" viewBox="0 0 24 24">
											<path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
										</svg>
										<svg xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="-11.5 -10.23174 23 20.46348">
											<title>React Logo</title>
											<circle cx={0} cy={0} r="2.05" fill="#61dafb" />
											<g stroke="#61dafb" strokeWidth={1} fill="none">
												<ellipse rx={11} ry="4.2" />
												<ellipse rx={11} ry="4.2" transform="rotate(60)" />
												<ellipse rx={11} ry="4.2" transform="rotate(120)" />
											</g>
										</svg>
									</div>

									<CodeBlock
										language="javascript"
										value={`(Object.values(findModule((m) => {if (typeof m !== 'object')return false;for (let prop in m) {if (m[prop]?.m_mapModalManager && Object.values(m)?.find((x) => x?.type)) {return true;}}return false;}) || {})?.find((x) => x?.type?.toString()?.includes('((function(){')) ||Object.values(findModule((m) => {if (typeof m !== 'object')return false;for (let prop in m) {if (m[prop]?.toString()?.includes('"ModalManager","DialogWrapper"')) {return true;}}return false;}) || {})?.find((x) => x?.type?.toString()?.includes('((function(){')) ||findModuleChild((m) => {if (typeof m !== 'object')return undefined;for (let prop in m) {if (m[prop]?.prototype?.OK && m[prop]?.prototype?.Cancel && m[prop]?.prototype?.render) {return m[prop];}}}));const ModalModule = findModule((mod) => {if (typeof mod !== 'object')return false;for (let prop in mod) {if (Object.keys(mod).length > 4 && mod[prop]?.toString().includes('.ModalPosition,fallback:'))return true;}return false; }); const wnd = GetMainSteamWindow()`}
									/>
								</div>
							</div>
						</div>
						<div className="open-source-section" ref={contributorsRef}>
							<h1 className="title text-center">Open Source ❤️</h1>
							<p className="title-description text-center">Community driven, made by beautiful people just like you.</p>

							{stat?.contributors && (
								<div className="contributors-container">
									<div className="contributors-list">
										{stat.contributors.map((contributor, index) => (
											<a key={index} href={contributor.html_url} target="_blank" rel="noreferrer">
												<div key={index} className="contributor">
													<img src={contributor.avatar_url} alt={contributor.login} />
												</div>
											</a>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</section>
			</main>
			<RenderFooter />
			<div ref={footerRef} />

			<div className="navigatorSidebar">
				{refsArray.map((ref, index) => (
					<div key={index} className={`navigatorItem ${index == navigatorIndex ? 'selected' : ''}`} onClick={() => jumpTo(ref)}></div>
				))}
			</div>
		</>
	);
}

export default RenderHome;
