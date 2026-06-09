'use client';

import RenderFooter from '@/components/FooterComponent';
import RenderHeader from '@/components/HeaderComponent';
import '@/css/index.css';
import { useState, useEffect } from 'react';
import CreateCard from '@/components/PluginCard';
import ShowThemeSkeletonCards from '@/components/SkeletonCard';

import { API_URL } from '@/utils/globals';

interface PluginLibraryProps {
	isSteamClient: boolean;
}

function PluginLibrary({ isSteamClient }: PluginLibraryProps) {
	const [cards, setCards] = useState<React.ReactNode[]>([]);
	const [sortBy, setSortBy] = useState(1);
	const [selectedTags, setSelectedTags] = useState<{ label: string }>({ label: 'All' });
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(API_URL + '/api/v1/plugins/');
				let result = await response.json();

				if (searchQuery) {
					const query = searchQuery.toLowerCase();
					result = result.filter((item: any) => item.pluginJson?.common_name?.toLowerCase().includes(query) || item.pluginJson?.description?.toLowerCase().includes(query) || item.repoOwner?.toLowerCase().includes(query));
				}

				let filteredData: any[] = [];

				if (selectedTags.label != 'All') {
					filteredData = result.filter((item: any) => item.tags.includes(selectedTags.label));
				} else {
					filteredData = result;
				}

				let sorted = [...filteredData];

				switch (sortBy) {
					case 1:
						sorted = filteredData.sort((a: any, b: any) => (b?.downloadCount ?? 0) - (a?.downloadCount ?? 0));
						break;
					case 2:
						sorted = filteredData.sort((a: any, b: any) => (a?.downloadCount ?? 0) - (b?.downloadCount ?? 0));
						break;
					case 3:
						sorted = filteredData.sort((a: any, b: any) => new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime());
						break;
					case 4:
						sorted = filteredData.sort((a: any, b: any) => new Date(a.commitDate).getTime() - new Date(b.commitDate).getTime());
						break;
					case 5:
						sorted = filteredData.sort((a: any, b: any) => (a?.pluginJson?.common_name ?? a?.repoName).localeCompare(b?.pluginJson?.common_name ?? b?.repoName));
						break;
				}
				setCards(sorted.map((item: any) => <CreateCard key={item.id} data={item} />));
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [sortBy, selectedTags, searchQuery]);

	const [options, setOptions] = useState([
		{ value: 1, label: 'Most Downloaded', checked: true },
		{ value: 2, label: 'Least Downloaded', checked: false },
		{ value: 3, label: 'Recently Updated', checked: false },
		{ value: 4, label: 'Least Recently Updated', checked: false },
		{ value: 5, label: 'Alphabetically', checked: false },
	]);

	const toggleCheckbox = (index: number) => {
		setOptions(
			options.map((option) => {
				if (option.value === index) {
					setSortBy(option.value);
					return { ...option, checked: !option.checked };
				}
				return { ...option, checked: false };
			}),
		);
	};

	return (
		<div>
			<div className="vm-placement" data-id="60f82387ffc37172cbbc0201"></div>
			<div className="vm-placement" id="vm-av" data-format="isvideo"></div>
			{!isSteamClient ? RenderHeader() : <></>}
			<main id="main-page-content">
				<section id="addons-header" className="page-section content-header">
					<div className="page-section-inner flex-container justify-between align-center" id="theme-header">
						<div className="header-left">
							<h1 className="title">Let's Get Plugging!</h1>
							<p className="title-tooltip">Browse the community's custom made plugins. We might have exactly what you're looking for!</p>
						</div>
					</div>
				</section>
				<div className="ad leaderboard_ros_atf" id="ad-container-1"></div>
				<div className="themes-panel">
					<div className="themes-left-side">
						<div className="filter-header">Filter Plugins</div>
						<form className="header-right search-container" onSubmit={(e) => e.preventDefault()} onReset={() => setSearchQuery('')}>
							<svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
								<path fillRule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"></path>
							</svg>
							<input className="search" id="addon-search" type="text" name="search" placeholder="Type here to search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
							<button className="search-clear-btn" type="reset">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
									<path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
								</svg>
							</button>
						</form>
						<div className="filter-header">Sort By</div>
						{options.map((tag, index) => (
							<div key={index} className="theme-tag" onClick={() => toggleCheckbox(tag.value)}>
								<span className="checkbox_check__5FdyV">
									<input className="geist-sr-only checkbox_input__ydSbd" id={`checkbox-sort-${tag.value}`} type="checkbox" checked={tag.checked} onChange={() => toggleCheckbox(tag.value)} />
									<span aria-hidden="true" className="checkbox_icon__6T6ug">
										<svg fill="none" height="16" viewBox="0 0 20 20" width="16">
											<path d="M14 7L8.5 12.5L6 10" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
											<line stroke="var(--checkbox-color)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="5" x2="15" y1="10" y2="10" />
										</svg>
									</span>
								</span>
								{tag.label}
							</div>
						))}
					</div>
					<div className="themes-right-side">
						<section id="addons-content" className="page-section">
							<div className="theme-listings">
								<div className="information">
									<div className="icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
											<circle cx="12" cy="12" r="10" />
											<line x1="12" y1="8" x2="12" y2="12" />
											<line x1="12" y1="16" x2="12.01" y2="16" />
										</svg>
									</div>
									<div className="content">
										Looking for <b>Augmented Steam</b> or <b>SteamDB</b>? They've both been superseded by{' '}
										<a href="/plugin/788ed8554492" style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}>
											Extendium
										</a>{' '}
										on April 4th, 2026. Extendium offers the same features and more!
									</div>
								</div>
								{loading ? (
									<div className="card-container">
										<ShowThemeSkeletonCards cardHeight={153} />
									</div>
								) : !cards.length ? (
									<div className="no-results">
										<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
											<circle cx="11" cy="11" r="8" />
											<line x1="21" y1="21" x2="16.65" y2="16.65" />
											<line x1="8" y1="11" x2="14" y2="11" />
										</svg>
										<span className="no-results-title">No plugins found</span>
										<span className="no-results-description">Try adjusting your search or filters</span>
									</div>
								) : (
									<div className="card-container plugin-card-container">
										{cards.map((card, index) => (
											<div key={index}>{card}</div>
										))}
									</div>
								)}
							</div>
						</section>
					</div>
				</div>
			</main>
			{!isSteamClient ? RenderFooter() : <></>}
		</div>
	);
}

export default PluginLibrary;
