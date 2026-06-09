'use client';

import { useEffect } from 'react';

export const RenderBackdropAnimation = () => {
	useEffect(() => {
		if (typeof window === 'undefined' || (window as any).HAS_ANIMATED || !document.getElementById('terrainCanvas')) return;

		(window as any).HAS_ANIMATED = true;

		const terrain = document.getElementById('terrainCanvas') as HTMLCanvasElement;
		const background = document.getElementById('bgCanvas') as HTMLCanvasElement;
		const terrainContext = terrain.getContext('2d')!;
		const backgroundContext = background.getContext('2d')!;

		const width = window.innerWidth;
		const height = Math.min(document.body.offsetHeight, 400);

		terrain.width = background.width = width;
		terrain.height = background.height = height;

		window.requestAnimationFrame =
			window.requestAnimationFrame ||
			(window as any).mozRequestAnimationFrame ||
			(window as any).webkitRequestAnimationFrame ||
			(window as any).msRequestAnimationFrame ||
			((callback: FrameRequestCallback) => window.setTimeout(callback, 1000 / 60));

		const generateTerrain = (): void => {
			const points: number[] = [];
			let displacement = 0;
			const power = 2 ** Math.ceil(Math.log2(width));

			points[0] = height - (Math.random() * height) / 2 - displacement;
			points[power] = height - (Math.random() * height) / 2 - displacement;

			for (let i = 1; i < power; i *= 2) {
				const step = power / i / 2;
				for (let j = step; j < power; j += power / i) {
					points[j] = (points[j - step] + points[j + step]) / 2 + Math.floor(Math.random() * (-displacement * 2) + displacement);
				}
				displacement *= 0.6;
			}

			terrainContext.beginPath();
			for (let i = 0; i <= width; i++) {
				if (i === 0) terrainContext.moveTo(0, points[0]);
				else if (points[i] !== undefined) terrainContext.lineTo(i, points[i]);
			}

			terrainContext.lineTo(width, terrain.height);
			terrainContext.lineTo(0, terrain.height);
			terrainContext.lineTo(0, points[0]);
		};

		class Star {
			x: number;
			y: number;
			size: number;
			speed: number;

			constructor(options: { x?: number; y?: number } = {}) {
				this.reset(options);
			}

			reset(options: { x?: number; y?: number } = {}): void {
				this.size = Math.random() * 2;
				this.speed = Math.random() * 0.1;
				this.x = options.x || width;
				this.y = options.y || Math.random() * height;
			}

			update(): void {
				this.x -= this.speed;
				if (this.x < 0) this.reset();
				else backgroundContext.fillRect(this.x, this.y, this.size, this.size);
			}
		}

		class ShootingStar {
			x: number;
			y: number;
			len: number;
			speed: number;
			size: number;
			waitTime: number;
			active: boolean;

			constructor() {
				this.reset();
			}

			reset(): void {
				this.x = Math.random() * width;
				this.y = 0;
				this.len = Math.random() * 80 + 10;
				this.speed = Math.random() * 10 + 6;
				this.size = Math.random() * 1 - 0.1;
				this.waitTime = Date.now() + Math.random() * 3000 + 500;
				this.active = false;
			}

			update(): void {
				if (this.active) {
					this.size -= 0.15;
					this.x -= this.speed;
					this.y += this.speed;

					if (this.x < 0 || this.y >= height) this.reset();
					else {
						backgroundContext.lineWidth = this.size;
						backgroundContext.beginPath();
						backgroundContext.moveTo(this.x, this.y);
						backgroundContext.lineTo(this.x + this.len, this.y - this.len);
						backgroundContext.stroke();
					}
				} else if (this.waitTime < Date.now()) {
					this.active = true;
				}
			}
		}

		const entities: (Star | ShootingStar)[] = [...Array.from({ length: Math.floor(height / 10) }, () => new Star({ x: Math.random() * width, y: Math.random() * height })), new ShootingStar(), new ShootingStar()];

		const animate = (): void => {
			backgroundContext.fillStyle = '#000';
			backgroundContext.fillRect(0, 0, width, height);
			backgroundContext.fillStyle = '#fff';
			backgroundContext.strokeStyle = '#fff';

			entities.forEach((entity) => entity.update());
			requestAnimationFrame(animate);
		};

		generateTerrain();
		backgroundContext.fillRect(0, 0, width, height);

		Array.from(document.getElementsByClassName('landscapeItem')).forEach((mountain) => mountain.classList.add('animateIn'));

		animate();

		setTimeout(() => {
			document.body.style.overflow = 'auto';
			document.documentElement.style.overflow = 'auto';
			document.body.style.paddingRight = '0px';
			document.documentElement.style.paddingRight = '0px';
		}, 2500);
	});

	return (
		<>
			<canvas id="bgCanvas"></canvas>
			<canvas id="terrainCanvas"></canvas>
			<div className="landscape">
				<div className="landscapeItem mountains background"></div>
				<div className="landscapeItem mountains midground"></div>
				<div className="landscapeItem mountains foreground"></div>
				<div className="landscapeItem trees background"></div>
				<div className="landscapeItem trees midground"></div>
				<div className="landscapeItem trees foreground"></div>
			</div>
		</>
	);
};
