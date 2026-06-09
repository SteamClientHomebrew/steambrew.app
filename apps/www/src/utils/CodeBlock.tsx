import React, { useEffect, useRef } from 'react';

import hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css';

interface CodeBlockProps {
	language: string;
	value: string;
}

export const CodeBlock = ({ language, value }: CodeBlockProps) => {
	const codeRef = useRef<HTMLElement>(null);
	useEffect(() => {
		if (codeRef.current) {
			hljs.highlightElement(codeRef.current);
		}
	}, [value]);

	return (
		<pre>
			<code ref={codeRef} className={language}>
				{value}
			</code>
		</pre>
	);
};
