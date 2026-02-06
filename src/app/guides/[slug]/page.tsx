import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import GuideDetailHeader from '@/components/GuideDetailHeader'
import {
  getGuide,
  getRelatedGuides,
  getEmojiForGuide,
  getGradientForCategory,
  categoryEmoji,
} from '@/lib/guides'

interface GuidePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)

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
      ...(guide.frontmatter.heroImage ? {
        images: [{
          url: guide.frontmatter.heroImage,
          width: 1200,
          height: 600,
          alt: guide.frontmatter.title,
        }],
      } : {}),
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

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuide(slug)

  if (!guide) {
    notFound()
  }

  const emoji = getEmojiForGuide(guide)
  const gradient = getGradientForCategory(guide.frontmatter.category)
  const relatedGuides = getRelatedGuides(slug, guide.frontmatter.category)

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
          em: ({children}) => <em className="italic text-gray-700">{children}</em>,
          img: ({src, alt}) => (
            <figure className="my-8">
              <img
                src={src}
                alt={alt || ''}
                className="w-full rounded-xl shadow-md"
                loading="lazy"
              />
              {alt && (
                <figcaption className="text-center text-sm text-gray-500 mt-3">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
        }}
      >
        {guide.content}
      </ReactMarkdown>
    )
  }

  return (
    <div className="bg-gray-50">
      <GuideDetailHeader />

      {/* Hero Section */}
      {guide.frontmatter.heroImage ? (
        <div className="relative h-[400px] overflow-hidden">
          <Image
            src={guide.frontmatter.heroImage}
            alt={guide.frontmatter.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative h-full max-w-4xl mx-auto px-4 flex flex-col justify-end pb-12">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/90 mb-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-medium">
                {emoji} {guide.frontmatter.category}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                {new Date(guide.frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                By {guide.frontmatter.author}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {guide.frontmatter.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
              {guide.frontmatter.description}
            </p>
          </div>
          {guide.frontmatter.heroImageCredit && (
            <div className="absolute bottom-2 right-4 text-xs text-white/60">
              Photo by{' '}
              <a
                href="https://unsplash.com?utm_source=clearly_gift&utm_medium=referral"
                className="underline hover:text-white/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                {guide.frontmatter.heroImageCredit}
              </a>
              {' '}on{' '}
              <a
                href="https://unsplash.com?utm_source=clearly_gift&utm_medium=referral"
                className="underline hover:text-white/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className={`relative bg-gradient-to-br ${gradient.from} ${gradient.to} py-16`}>
          <div className="absolute inset-0 opacity-40">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(gradient.accent)}' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6">{emoji}</div>
            <div className={`flex flex-wrap items-center justify-center gap-3 text-sm ${gradient.textColor} mb-4`}>
              <span className={`bg-white bg-opacity-80 ${gradient.textColor} px-4 py-2 rounded-full font-medium`}>
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
      )}

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
        {relatedGuides.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">More Gift Guides</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedGuides.map((relatedGuide) => (
                <a key={relatedGuide.slug} href={`/guides/${relatedGuide.slug}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 group block">
                  <div className="text-3xl mb-4">{getEmojiForGuide(relatedGuide)}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {relatedGuide.frontmatter.title}
                  </h3>
                  <span className="text-emerald-600 group-hover:text-emerald-700 font-medium inline-flex items-center">
                    Read Guide
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Create Your Own Gift List?</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Share your wishlist with friends and family using clearly.gift&apos;s simple, clutter-free platform.
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
              Share your wishlist. Keep the surprise
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
