import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'

interface GuidePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuide(slug)
  
  if (!guide) {
    return {
      title: 'Guide Not Found - clearly.gift',
      description: 'The requested gift guide could not be found.'
    }
  }

  return {
    title: `${guide.frontmatter.title} - clearly.gift`,
    description: guide.frontmatter.description,
    openGraph: {
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      type: 'article',
      publishedTime: guide.frontmatter.date,
      authors: [guide.frontmatter.author],
      tags: [guide.frontmatter.category],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
    }
  }
}

export async function generateStaticParams() {
  const guidesDirectory = path.join(process.cwd(), 'content/guides')
  
  if (!fs.existsSync(guidesDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(guidesDirectory)
  
  return filenames
    .filter(name => name.endsWith('.mdx'))
    .map(name => ({
      slug: name.replace('.mdx', '')
    }))
}

async function getGuide(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'content/guides', `${slug}.mdx`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    // Extract frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
    const match = frontmatterRegex.exec(fileContent)
    
    if (!match) {
      return null
    }

    const frontmatterText = match[1]
    const content = fileContent.replace(frontmatterRegex, '')

    // Parse frontmatter
    const frontmatter: any = {}
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim()
        const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
        frontmatter[key] = value
      }
    })

    return {
      frontmatter,
      content
    }
  } catch (error) {
    console.error('Error reading guide:', error)
    return null
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = await getGuide(slug)
  
  if (!guide) {
    notFound()
  }

  // Create a component to render the processed content
  const MDXContent = () => {
    return (
      <ReactMarkdown
        components={{
          h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6">{children}</h1>,
          h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
          h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{children}</h3>,
          p: ({children}) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
          strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
          a: ({href, children}) => <a href={href} className="text-emerald-600 hover:text-emerald-700 font-medium" target="_blank" rel="noopener noreferrer">{children}</a>,
          ul: ({children}) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
          li: ({children}) => <li className="mb-2">{children}</li>,
          hr: () => <hr className="my-8 border-gray-200" />,
          em: ({children}) => <em className="italic text-gray-700">{children}</em>
        }}
      >
        {guide.content}
      </ReactMarkdown>
    )
  }

  const relatedGuides = [
    { title: "Top Gifts for Toddlers 2025", slug: "toddlers-2025", emoji: "🧸" },
    { title: "Best Tech Gifts Under $100", slug: "tech-under-100", emoji: "💻" },
    { title: "Top Gifts for Runners", slug: "runners", emoji: "🏃‍♀️" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">clearly.gift</span>
            </a>
            <div className="flex items-center space-x-4">
              <a href="/guides" className="text-gray-600 hover:text-gray-900 font-medium">
                All Guides
              </a>
              <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
              </a>
              <a href="/auth" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-16">
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">☕</div>
          <div className="flex items-center justify-center space-x-4 text-sm text-amber-800 mb-4">
            <span className="bg-white bg-opacity-80 text-amber-800 px-4 py-2 rounded-full font-medium">
              {guide.frontmatter.category}
            </span>
            <span className="bg-white bg-opacity-80 px-4 py-2 rounded-full">
              {new Date(guide.frontmatter.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="bg-white bg-opacity-80 px-4 py-2 rounded-full">
              By {guide.frontmatter.author}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {guide.frontmatter.title}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {guide.frontmatter.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <article className="prose prose-lg max-w-none">
            <div className="guide-content">
              <MDXContent />
            </div>
          </article>
        </div>

        {/* Related Guides */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">More Gift Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedGuides.map((relatedGuide, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 group">
                <div className="text-3xl mb-4">{relatedGuide.emoji}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {relatedGuide.title}
                </h3>
                <a 
                  href={`/guides/${relatedGuide.slug}`} 
                  className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center"
                >
                  Read Guide 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Create Your Own Gift List?</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Share your wishlist with friends and family using clearly.gift's simple, clutter-free platform.
          </p>
          <a 
            href="/auth" 
            className="inline-block bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
          >
            Get Started for Free
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 mt-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">clearly.gift</span>
            </div>
            <p className="text-gray-600 mb-6">
              Share your wishlist, keep the surprise.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <a href="/guides" className="hover:text-gray-900">All Guides</a>
              <a href="/" className="hover:text-gray-900">Home</a>
              <a href="/auth" className="hover:text-gray-900">Sign Up</a>
            </div>
          </div>
          
          {/* Affiliate Disclaimer */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-xs text-gray-500">
              This site contains affiliate links. We may earn a commission when you purchase through these links at no additional cost to you.
            </p>
            <p className="text-xs text-gray-400 mt-4">
              &copy; 2025 clearly.gift. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}