import React, { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import rehyperaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
interface MarkdownProps {
  children?: string
}

function flatten(text: string, child: string | ReactNode): string {
  return typeof child === 'string'
    ? text + child
    : //@ts-ignore
      React.Children.toArray(child.props.children).reduce(flatten, text)
}

function HeadingRenderer(props: Record<any, any>) {
  const children = React.Children.toArray(props.children)
  const text = children.reduce(flatten, '').toString()
  const slug = text.toLowerCase().replace(/\W/g, '-')
  return React.createElement(props.node.tagName, { id: slug }, props.children)
}

function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehyperaw]}
      components={{ h1: HeadingRenderer, h2: HeadingRenderer }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
