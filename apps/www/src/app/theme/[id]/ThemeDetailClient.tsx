'use client';

import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import RenderFooter from '@/components/FooterComponent';
import RenderHeader from '@/components/HeaderComponent';
import { DateToString, FormatNumber } from '@/utils/Util';
import '@/css/index.css';
import 'react-toastify/dist/ReactToastify.css';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { HiOutlineClipboardCopy } from 'react-icons/hi';
import { SiKofi } from 'react-icons/si';

interface MdOverride {
	type: string;
	message: string;
}

interface ThemeDetailClientProps {
	json: any;
	markdown: string;
	isSteamClient: boolean;
	mdOverrides: MdOverride[];
	apiError: boolean;
}

export default function ThemeDetailClient({ json, markdown, isSteamClient, mdOverrides, apiError }: ThemeDetailClientProps) {
	useEffect(() => {
		mdOverrides.forEach((override) => {
			(toast as any)[override.type](override.message, {
				position: 'bottom-left',
				hideProgressBar: true,
				autoClose: Number.MAX_SAFE_INTEGER,
				closeOnClick: false,
			});
		});

		Fancybox.bind('[data-fancybox]', {
			Images: { Panzoom: { maxScale: 2 } },
			Thumbs: { type: 'classic' },
			animated: true,
		});
	}, []);

	if (apiError) {
		return (
			<div>
				<RenderHeader />
				<section id="main-page-content">
					<div className="page-section-inner theme-view-panel api-error">
						<div className="api-error-container">
							<h1>Whoops!</h1>
							<p>We're having issues contacting our servers, check back later!</p>
						</div>
					</div>
				</section>
				<RenderFooter />
			</div>
		);
	}

	function copyThemeId() {
		navigator.clipboard
			.writeText(json?.data?.id)
			.then(() => toast.success('Successfully copied to clipboard!'))
			.catch(() => toast.error('Failed to copy theme ID'));
	}

	return (
		<div>
			<div className="os-resize-observer-host observed">
				<div className="os-resize-observer"></div>
			</div>
			<div className="os-padding">
				<div className="os-content">
					<div className="vm-placement" data-id="60f82387ffc37172cbbc0201"></div>
					<div className="vm-placement" id="vm-av" data-format="isvideo"></div>
					{!isSteamClient && <RenderHeader />}
					<section id="main-page-content">
						<section id="addon-details" className="page-section">
							<ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
							<div className="page-section-inner theme-view-panel">
								<img loading="lazy" src={json?.splash_image} className="addon-backdrop" />
								<div className="flex-container align-center justify-between" id="addon-details-title">
									<div className="disabled sign-in-gate"></div>
								</div>
								<div className="flex-container" id="addon-splitview-container">
									<div className="addon-details-column" id="addon-details-right-column">
										<div className="sticky-container">
											<div className="addon-details-segment" id="addon-details-column-actions">
												<a className="link_link__hbWKh link_secondary__F1rqx" href="/themes">
													<small>← Back to Themes</small>
												</a>
												<a target="_blank" href={`https://github.com/${json?.data?.github?.owner}`} className="addon-author-container">
													<img loading="lazy" src={`https://github.com/${json?.data?.github?.owner}.png`} />
													<h5>{json?.data?.github?.owner}</h5>
												</a>
												<h1 className="title">{json?.name ?? json?.data?.github?.repo}</h1>
												<div className="title-description theme-desc">{json?.description}</div>
												<section id="addon-actions">
													<div className="btn-container direction-column">
														<a onClick={copyThemeId} className="btn btn-primary" id="download-btn">
															<HiOutlineClipboardCopy style={{ marginRight: '10px', height: '20px', width: '20px' }} />
															<span draggable>Copy Theme ID</span>
														</a>
														<div className="wrap-buttons">
															<a rel="noreferrer noopener" target="_blank" href={`https://github.com/${json?.data?.github?.owner}/${json?.data?.github?.repo}/`} className="btn btn-secondary" id="view-source">
																<svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
																	<path fillRule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path>
																</svg>
																<span>View Source</span>
															</a>
															{json?.skin_data?.funding?.kofi && (
																<a href={`https://ko-fi.com/${json?.skin_data?.funding?.kofi}`} className="btn btn-primary" id="kofi-btn">
																	<SiKofi style={{ height: '16px', width: '16px', marginRight: '10px' }} />
																	<span draggable>Donate</span>
																</a>
															)}
														</div>
													</div>
												</section>

												<section id="about-addon">
													<span className="addon-metadata-row">
														<strong>Version: </strong> {json?.version}{' '}
													</span>
													<span className="addon-metadata-row">
														<strong>Downloads: </strong> {FormatNumber(json?.data?.download)}{' '}
													</span>
													<span className="addon-metadata-row">
														<strong>Added: </strong>
														{json?.data?.create_time && DateToString(json?.data?.create_time)}{' '}
													</span>
													<span className="addon-metadata-row">
														<strong>Last Updated: </strong>
														{json?.commit_data?.committedDate && DateToString(json?.commit_data?.committedDate)}{' '}
													</span>
												</section>
											</div>

											{json?.discord && (
												<div className="addon-details-segment" id="addon-details-column-server">
													<section id="addon-server">
														<div className="flex-container align-center">
															<img loading="lazy" src={json?.discord?.icon} />
															<div className="flex-container justify-center direction-column">
																<h5>{json?.discord?.name}</h5>
																<p>Support Server</p>
															</div>
														</div>
														<a rel="noreferrer noopener" target="_blank" className="btn btn-primary btn-join-server" href={json?.discord?.link ?? '#'}>
															<span>Join Server</span>
														</a>
													</section>
												</div>
											)}

											{json?.tags?.length > 0 && (
												<div className="addon-details-segment" id="addon-details-column-tags">
													<h3 className="addon-details-section-header">Tags</h3>
													<section>
														<div className="addon-tags">
															{json?.tags?.map((tag: string, index: number) => (
																<span key={index} className="addon-tag">
																	{tag}
																</span>
															))}
														</div>
													</section>
												</div>
											)}
										</div>
									</div>
									<div className="addon-details-column" id="addon-details-left-column">
										<article className="addon-details-segment markdown-readme-content">
											<div className="markdown-body">
												<div dangerouslySetInnerHTML={{ __html: markdown }} suppressHydrationWarning />
											</div>
										</article>
									</div>
								</div>
							</div>
						</section>
					</section>
					{!isSteamClient && <RenderFooter />}
				</div>
			</div>
		</div>
	);
}
