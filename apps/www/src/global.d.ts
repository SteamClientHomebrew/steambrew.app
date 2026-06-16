import type NodeCache from 'node-cache';

declare global {
	var requestCache: NodeCache;
}

export {};
