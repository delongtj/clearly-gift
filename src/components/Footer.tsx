import Link from 'next/link'

// Easy to add/remove footer links - just edit this array!
const FOOTER_LINKS = [
  { href: '/guides', label: 'Gift Guides' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        {/* Link Bucket */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright & Branding */}
        <div className="text-center mb-3">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} clearly.gift. Share your wishlist, keep the surprise.
          </p>
        </div>

        {/* Affiliate Disclaimer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            This site contains affiliate links. We may earn a commission when you purchase through these links at no additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  )
}
