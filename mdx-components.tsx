import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 -mx-8 md:-mx-12 px-8 md:px-12 py-8 mt-16 mb-8 rounded-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {children}
        </h2>
      </div>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-emerald-700 mt-12 mb-6 flex items-center">
        <span className="w-2 h-8 bg-emerald-600 rounded-full mr-4"></span>
        {children}
      </h3>
    ),
    p: ({ children }) => {
      // Check if this paragraph contains pricing info
      const childrenString = children?.toString() || ''
      if (childrenString.includes('Price Range:') || childrenString.includes('Perfect For:')) {
        return (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 leading-relaxed mb-0 font-medium">
              {children}
            </p>
          </div>
        )
      }
      
      if (childrenString.includes('Why it\'s perfect:')) {
        return (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg p-4 mb-6">
            <p className="text-emerald-800 leading-relaxed mb-0">
              {children}
            </p>
          </div>
        )
      }
      
      return (
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          {children}
        </p>
      )
    },
    a: ({ href, children }) => {
      // Style Amazon links differently
      if (href?.includes('amazon.com') && children?.toString().includes('View on Amazon')) {
        return (
          <div className="my-6">
            <a 
              href={href}
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.83 14.09c1.38 0 2.5-1.11 2.5-2.48s-1.12-2.48-2.5-2.48-2.5 1.11-2.5 2.48 1.12 2.48 2.5 2.48zm4.48-8.38c-.73-.83-2.24-1.39-3.9-1.39-1.98 0-3.64.77-4.41 1.94-.77-1.17-2.43-1.94-4.41-1.94-1.66 0-3.17.56-3.9 1.39C4.32 6.26 4 7.1 4 8.01v7.98c0 .69.56 1.25 1.25 1.25S6.5 16.68 6.5 16V9.51c0-.41.34-.75.75-.75h.25c1.09 0 1.98.89 1.98 1.98v5.51c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25v-5.51c0-1.09.89-1.98 1.98-1.98h.08c1.09 0 1.98.89 1.98 1.98v5.51c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25v-5.51c0-1.09.89-1.98 1.98-1.98h.25c.41 0 .75.34.75.75v6.49c0 .69.56 1.25 1.25 1.25S20 16.68 20 16V8.01c0-.91-.32-1.75-.69-2.3z"/>
              </svg>
              {children}
            </a>
          </div>
        )
      }
      
      return (
        <a 
          href={href} 
          className="text-emerald-600 font-medium hover:text-emerald-700 underline decoration-2 underline-offset-2"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
    ul: ({ children }) => (
      <ul className="space-y-3 mb-8">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="space-y-3 mb-8">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="flex items-start text-gray-700 text-lg">
        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-3 mr-4 flex-shrink-0"></span>
        <span className="leading-relaxed">{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 bg-yellow-100 px-1 rounded">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-emerald-700 font-medium">
        {children}
      </em>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-emerald-500 pl-6 py-4 my-8 bg-gradient-to-r from-emerald-50 to-transparent rounded-r-lg">
        <div className="text-emerald-800 text-lg italic font-medium">
          {children}
        </div>
      </blockquote>
    ),
    hr: () => (
      <div className="my-16 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
          <div className="w-3 h-3 bg-emerald-300 rounded-full"></div>
        </div>
      </div>
    ),
    ...components,
  }
}