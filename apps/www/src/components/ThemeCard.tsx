'use client';

import React, { useRef, useState, useEffect } from 'react';

const GLOBAL_CONTEXT_MENU_EVENT = '__STEAMBREW_CONTEXT_MENU__';

function CreateCard(item) {
	const data = item.data;
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
	const cardRef = useRef(null);
	const [instanceId] = useState(() => Math.random().toString(36).slice(2));

	function formatNumber(number) {
		if (number >= 1000) {
			const formattedNumber = (number / 1000).toFixed(1);
			return `${formattedNumber}K`;
		} else {
			return number.toString();
		}
	}

	const openInNewTab = (e) => {
		window.open(`/theme/${data.data.id}`, '_blank');
		setContextMenu({ ...contextMenu, visible: false });
	};

	const copyId = async (e) => {
		try {
			await navigator.clipboard.writeText(data.data.id);
		} catch (err) {
			const textarea = document.createElement('textarea');
			textarea.value = data.data.id;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
		}
		setContextMenu({ ...contextMenu, visible: false });
	};

	const handleContextMenu = (e) => {
		e.preventDefault();
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
			<a className="card-wrap" href={`/theme/${data.data.id}`} onContextMenu={handleContextMenu} ref={cardRef} tabIndex={0} style={{ position: 'relative', userSelect: 'none' }}>
				<div className="card" style={{ width: '100%', height: '100%' }}>
					<img
						loading="lazy"
						className="card-image"
						onError={({ currentTarget }) => {
							currentTarget.onerror = null;
							currentTarget.src = 'https://i.imgur.com/Ritvk0y.png';
							currentTarget.className = 'card-image no-image';
						}}
						src={data?.header_image == '[NO-IMAGE]' ? 'https://i.imgur.com/Ritvk0y.png' : data?.header_image}
						data-holder-rendered="true"
					/>
					<div className="card-body">
						<h3 className="card-title">{data.name}</h3>
						<p className="card-description package-description">{data.description}</p>
						<div className="card-footer">
							<div className="card-stats">
								<div className="card-stat" id="addon-likes">
									<div className="pfp-name">
										<p className="card-subtext package-author">by {data.data.github.owner}</p>
										<span className="addon-author-container">
											<img loading="lazy" src={`https://github.com/${data?.data?.github?.owner}.png`} />
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
						<span className="downloadTagText">{(data?.data?.download && formatNumber(data?.data?.download)) ?? 'none'}</span>
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
								openInNewTab(e);
							}}
						>
							Open in new tab
						</li>
						<li
							className="custom-context-menu-option"
							onClick={(e) => {
								e.stopPropagation();
								window.open(`https://github.com/${data?.data?.github?.owner}/${data?.data?.github?.repo}`, '_blank');
								setContextMenu({ ...contextMenu, visible: false });
							}}
						>
							View source code
						</li>
						<li
							className="custom-context-menu-option"
							onClick={(e) => {
								e.stopPropagation();
								copyId(e);
							}}
						>
							Copy Theme ID
						</li>
						<li
							className="custom-context-menu-option"
							onClick={(e) => {
								e.stopPropagation();
								const themeUrl = `${window.location.origin}/theme/${data.data.id}`;
								try {
									navigator.clipboard.writeText(themeUrl);
								} catch (err) {
									const textarea = document.createElement('textarea');
									textarea.value = themeUrl;
									document.body.appendChild(textarea);
									textarea.select();
									document.execCommand('copy');
									document.body.removeChild(textarea);
								}
								setContextMenu({ ...contextMenu, visible: false });
							}}
						>
							Copy URL
						</li>
					</ul>
				)}
			</a>
		</>
	);
}

export default CreateCard;
