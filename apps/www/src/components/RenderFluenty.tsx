'use client';

const fluenty = {
	description: 'A theme based off of Windows 11 design principles',
	version: '1.0.2',
	// yes I manually have to update this as patreon doesn't have an api for it
	downloads: '24.3K',
};

import React, { useRef, useState, useEffect } from 'react';

const GLOBAL_CONTEXT_MENU_EVENT = '__STEAMBREW_CONTEXT_MENU__';

function DisplayFluentyAd() {
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
	const cardRef = useRef(null);
	const [instanceId] = useState(() => Math.random().toString(36).slice(2));

	const openInNewTab = (e) => {
		window.open('/fluenty-steam', '_blank');
		setContextMenu({ ...contextMenu, visible: false });
	};

	const buyFluenty = (e) => {
		window.open('https://www.patreon.com/c/FluentyforSteam', '_blank');
		setContextMenu({ ...contextMenu, visible: false });
	};

	const handleContextMenu = (e) => {
		e.preventDefault();
		e.stopPropagation();
		window.dispatchEvent(new CustomEvent(GLOBAL_CONTEXT_MENU_EVENT, { detail: { instanceId } }));
		setTimeout(() => {
			setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
		}, 0);
	};

	const handleClick = () => {
		if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
	};

	useEffect(() => {
		const onGlobalContextMenu = (e) => {
			if (e.detail && e.detail.instanceId !== instanceId) {
				setContextMenu((ctx) => (ctx.visible ? { ...ctx, visible: false } : ctx));
			}
		};
		window.addEventListener(GLOBAL_CONTEXT_MENU_EVENT, onGlobalContextMenu);

		if (contextMenu.visible) {
			document.addEventListener('click', handleClick);
		} else {
			document.removeEventListener('click', handleClick);
		}
		return () => {
			window.removeEventListener(GLOBAL_CONTEXT_MENU_EVENT, onGlobalContextMenu);
			document.removeEventListener('click', handleClick);
		};
	}, [contextMenu.visible, instanceId]);

	return (
		<>
			<a className="card-wrap" href="/fluenty-steam" ref={cardRef} tabIndex={0} style={{ position: 'relative', userSelect: 'none' }}>
				<div className="card" onContextMenu={handleContextMenu} style={{ width: '100%', height: '100%' }}>
					<img loading="lazy" className="card-image" src="https://i.imgur.com/2aAaAES.gif" data-holder-rendered="true" />
					<div className="card-body">
						<h3 className="card-title">Fluenty</h3>
						<p className="card-description package-description">{fluenty.description}</p>
						<div className="card-footer">
							<div className="card-stats">
								<div className="card-stat" id="addon-likes">
									<div className="pfp-name">
										<p className="card-subtext package-author">by Steam Homebrew</p>
										<span className="addon-author-container">
											<img loading="lazy" src={`https://raw.githubusercontent.com/SteamClientHomebrew/SteamBrew/refs/heads/main/static/steambrew-logo.png`} />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="downloadTag">
						<svg className="package-stat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
							<path
								fillRule="evenodd"
								d="M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75zM3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z"
							></path>
						</svg>
						<span className="downloadTagText">{fluenty.downloads}</span>
					</div>
				</div>
				{contextMenu.visible && (
					<ul
						className="custom-context-menu"
						style={{
							top: contextMenu.y,
							left: contextMenu.x,
						}}
						onClick={(e) => e.stopPropagation()}
						onMouseDown={(e) => e.stopPropagation()}
					>
						<li
							className="custom-context-menu-option"
							onClick={(e) => {
								e.stopPropagation();
								buyFluenty(e);
							}}
						>
							Purchase
						</li>
						<li
							className="custom-context-menu-option"
							onClick={(e) => {
								e.stopPropagation();
								openInNewTab(e);
							}}
						>
							Open in new tab
						</li>
					</ul>
				)}
			</a>
		</>
	);
}

export { DisplayFluentyAd, fluenty };
