'use client'
import { cn } from '@/lib/utils'
import {
	type BundledLanguage,
	CodeBlock,
	CodeBlockBody,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockFilename,
	CodeBlockFiles,
	CodeBlockHeader,
	CodeBlockItem,
	type CodeBlockProps,
	CodeBlockSelect,
	CodeBlockSelectContent,
	CodeBlockSelectItem,
	CodeBlockSelectTrigger,
	CodeBlockSelectValue,
} from '@/components/ui/code-block'
import type { HTMLAttributes } from 'react'
import ReactMarkdown, { type Options } from 'react-markdown'
import remarkGfm from 'remark-gfm'
export type AIResponseProps = HTMLAttributes<HTMLDivElement> & {
	options?: Options
	children: Options['children']
}
const components: Options['components'] = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	ol: ({ node, children, className, ...props }) => (
		<ol className={cn('ml-4 list-outside list-decimal', className)} {...props}>
			{children}
		</ol>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	li: ({ node, children, className, ...props }) => (
		<li className={cn('py-1 text-base', className)} {...props}>
			{children}
		</li>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	ul: ({ node, children, className, ...props }) => (
		<ul className={cn('ml-4 list-outside list-decimal', className)} {...props}>
			{children}
		</ul>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	strong: ({ node, children, className, ...props }) => (
		<span className={cn('font-semibold', className)} {...props}>
			{children}
		</span>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	a: ({ node, children, className, ...props }) => (
		<a
			className={cn('font-medium text-primary underline', className)}
			target="_blank"
			rel="noreferrer"
			{...props}
		>
			{children}
		</a>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	h1: ({ node, children, className, ...props }) => (
		<h1
			className={cn('mt-6 mb-2 font-semibold text-3xl', className)}
			{...props}
		>
			{children}
		</h1>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	h2: ({ node, children, className, ...props }) => (
		<h2
			className={cn('mt-6 mb-2 font-semibold text-2xl', className)}
			{...props}
		>
			{children}
		</h2>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	h3: ({ node, children, className, ...props }) => (
		<h3 className={cn('mt-6 mb-2 font-semibold text-xl', className)} {...props}>
			{children}
		</h3>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	h4: ({ node, children, className, ...props }) => (
		<h4 className={cn('mt-6 mb-2 font-semibold text-lg', className)} {...props}>
			{children}
		</h4>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	h5: ({ node, children, className, ...props }) => (
		<h5 className={cn('mt-6 mb-2 font-semibold text-xl', className)} {...props}>
			{children}
		</h5>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	h6: ({ node, children, className, ...props }) => (
		<h6 className={cn('mt-6 mb-2 font-semibold text-xl', className)} {...props}>
			{children}
		</h6>
	),
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	pre: ({ node, className, children }) => {
		let language = 'javascript'
		
		// Try to extract language from className prop
		if (typeof className === 'string') {
			const match = className.match(/language-(\w+)/)
			if (match) {
				language = match[1]
			}
		}
		
		// Fallback: try to extract from code element's className
		if (language === 'javascript' && 
			typeof children === 'object' && 
			children !== null && 
			'props' in children && 
			typeof children.props === 'object' && 
			children.props !== null && 
			'className' in children.props && 
			typeof children.props.className === 'string') {
			const match = children.props.className.match(/language-(\w+)/)
			if (match) {
				language = match[1]
			}
		}
		const childrenIsCode =
			typeof children === 'object' &&
			children !== null &&
			'type' in children &&
			children.type === 'code'
		if (!childrenIsCode) {
			return <pre>{children}</pre>
		}
		// Generate appropriate filename based on language
		const getFilename = (lang: string): string => {
			const extensions: Record<string, string> = {
				javascript: 'index.js',
				typescript: 'index.ts',
				python: 'main.py',
				java: 'Main.java',
				cpp: 'main.cpp',
				c: 'main.c',
				rust: 'main.rs',
				go: 'main.go',
				php: 'index.php',
				ruby: 'main.rb',
				swift: 'main.swift',
				kotlin: 'Main.kt',
				dart: 'main.dart',
				scala: 'Main.scala',
				shell: 'script.sh',
				bash: 'script.sh',
				powershell: 'script.ps1',
				sql: 'query.sql',
				html: 'index.html',
				css: 'styles.css',
				scss: 'styles.scss',
				sass: 'styles.sass',
				less: 'styles.less',
				json: 'data.json',
				xml: 'data.xml',
				yaml: 'config.yaml',
				yml: 'config.yml',
				toml: 'config.toml',
				dockerfile: 'Dockerfile',
				makefile: 'Makefile',
				r: 'script.R',
				matlab: 'script.m',
				lua: 'script.lua',
				perl: 'script.pl',
				haskell: 'main.hs',
				clojure: 'main.clj',
				elixir: 'main.ex',
				erlang: 'main.erl',
				fsharp: 'main.fs',
				ocaml: 'main.ml',
				scheme: 'main.scm',
				lisp: 'main.lisp',
				jsx: 'component.jsx',
				tsx: 'component.tsx',
				vue: 'component.vue',
				svelte: 'component.svelte'
			}
			return extensions[lang.toLowerCase()] || `code.${lang}`
		}

		const data: CodeBlockProps['data'] = [
			{
				language,
				filename: getFilename(language),
				code: (children.props as { children: string }).children,
			},
		]
		return (
			<CodeBlock
				className={cn('my-4 h-auto', className)}
				data={data}
				defaultValue={data[0].language}
			>
				<CodeBlockHeader>
					<CodeBlockFiles>
						{(item) => (
							<CodeBlockFilename key={item.language} value={item.language}>
								{item.filename}
							</CodeBlockFilename>
						)}
					</CodeBlockFiles>
					<CodeBlockSelect>
						<CodeBlockSelectTrigger>
							<CodeBlockSelectValue />
						</CodeBlockSelectTrigger>
						<CodeBlockSelectContent>
							{(item) => (
								<CodeBlockSelectItem key={item.language} value={item.language}>
									{item.language}
								</CodeBlockSelectItem>
							)}
						</CodeBlockSelectContent>
					</CodeBlockSelect>
					<CodeBlockCopyButton
						onCopy={() => console.log('Copied code to clipboard')}
						onError={() => console.error('Failed to copy code to clipboard')}
					/>
				</CodeBlockHeader>
				<CodeBlockBody>
					{(item) => (
						<CodeBlockItem key={item.language} value={item.language}>
							<CodeBlockContent language={item.language as BundledLanguage}>
								{item.code}
							</CodeBlockContent>
						</CodeBlockItem>
					)}
				</CodeBlockBody>
			</CodeBlock>
		)
	},
}
// eslint-disable-next-line react/display-name
export const AIResponse = ({
	className,
	options,
	children,
	...props
}: AIResponseProps) => (
	<div
		className={cn(
			'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
			className
		)}
		{...props}
	>
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={components}
			{...options}
		>
			{children}
		</ReactMarkdown>
	</div>
)
