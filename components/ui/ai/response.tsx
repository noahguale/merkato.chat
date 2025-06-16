/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { cn } from '@/lib/utils'
import { memo } from 'react'
import type { HTMLAttributes } from 'react'
import ReactMarkdown, { type Options } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
	BundledLanguage,
	CodeBlock,
	CodeBlockBody,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockFilename,
	CodeBlockFiles,
	CodeBlockHeader,
	CodeBlockItem,
	CodeBlockProps,
	CodeBlockSelect,
	CodeBlockSelectContent,
	CodeBlockSelectItem,
	CodeBlockSelectTrigger,
	CodeBlockSelectValue,
} from '../code-block'

export type AIResponseProps = HTMLAttributes<HTMLDivElement> & {
	options?: Options
	children: Options['children']
}

const components: Options['components'] = {
	pre: ({ children }) => <div>{children}</div>,
	ol: ({ node, children, className, ...props }) => (
		<ol className={cn('ml-4 list-outside list-decimal', className)} {...props}>
			{children}
		</ol>
	),
	li: ({ node, children, className, ...props }) => (
		<li className={cn('py-1', className)} {...props}>
			{children}
		</li>
	),
	ul: ({ node, children, className, ...props }) => (
		<ul className={cn('ml-4 list-outside list-decimal', className)} {...props}>
			{children}
		</ul>
	),
	strong: ({ node, children, className, ...props }) => (
		<span className={cn('font-semibold', className)} {...props}>
			{children}
		</span>
	),
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
	h1: ({ node, children, className, ...props }) => (
		<h1
			className={cn('mt-6 mb-2 font-semibold text-3xl', className)}
			{...props}
		>
			{children}
		</h1>
	),
	h2: ({ node, children, className, ...props }) => (
		<h2
			className={cn('mt-6 mb-2 font-semibold text-2xl', className)}
			{...props}
		>
			{children}
		</h2>
	),
	h3: ({ node, children, className, ...props }) => (
		<h3 className={cn('mt-6 mb-2 font-semibold text-xl', className)} {...props}>
			{children}
		</h3>
	),
	h4: ({ node, children, className, ...props }) => (
		<h4 className={cn('mt-6 mb-2 font-semibold text-lg', className)} {...props}>
			{children}
		</h4>
	),
	h5: ({ node, children, className, ...props }) => (
		<h5
			className={cn('mt-6 mb-2 font-semibold text-base', className)}
			{...props}
		>
			{children}
		</h5>
	),
	h6: ({ node, children, className, ...props }) => (
		<h6 className={cn('mt-6 mb-2 font-semibold text-sm', className)} {...props}>
			{children}
		</h6>
	),
	code: ({ node, className, children }) => {
		// Check if this is a fenced code block (has language- className or is multi-line)
		const hasLanguageClass = (typeof node?.properties?.className === 'string' && 
			node.properties.className.startsWith('language-')) ||
			(typeof className === 'string' && className.startsWith('language-'))
		
		const isMultiLine = typeof children === 'string' && children.includes('\n')
		const isCodeBlock = hasLanguageClass || isMultiLine

		if (isCodeBlock) {
			// This is a fenced code block - render with full CodeBlock component
			let language = 'python'
			if (typeof node?.properties?.className === 'string') {
				language = node.properties.className.replace('language-', '')
			} else if (typeof className === 'string' && className.startsWith('language-')) {
				language = className.replace('language-', '')
			}

			// Dynamic filename based on language
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
					html: 'index.html',
					css: 'styles.css',
					scss: 'styles.scss',
					json: 'data.json',
					xml: 'data.xml',
					yaml: 'config.yaml',
					yml: 'config.yml',
					sql: 'query.sql',
					bash: 'script.sh',
					shell: 'script.sh',
					powershell: 'script.ps1',
					dockerfile: 'Dockerfile',
					markdown: 'README.md',
					txt: 'file.txt'
				}
				return extensions[lang.toLowerCase()] || `file.${lang}`
			}

			const data: CodeBlockProps['data'] = [
				{
					language,
					filename: getFilename(language),
					code: children as string,
				},
			]

			return (
				<CodeBlock
					className={cn('my-4', className)}
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
		} else {
			// This is inline code - just add simple highlighting
			return (
				<code className={cn('bg-muted px-1.5 py-0.5 rounded text-sm font-mono', className)}>
					{children}
				</code>
			)
		}
	},
}

// eslint-disable-next-line react/display-name
export const AIResponse = memo(
	({ className, options, children, ...props }: AIResponseProps) => (
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
	),
	(prevProps, nextProps) => prevProps.children === nextProps.children
)
