import { Metadata } from 'next'
import GuidesHeader from '@/components/GuidesHeader'
import GuideSearch from '@/components/GuideSearch'

export const metadata: Metadata = {
title: 'Gift Guides',
description: 'Discover curated gift guides for every person and occasion. Find the perfect gifts for coffee lovers, tech enthusiasts, runners, toddlers, and more.',
keywords: ['gift guides', 'gift ideas', 'present ideas', 'holiday gifts', 'birthday gifts', 'coffee gifts', 'tech gifts', 'running gifts'],
openGraph: {
title: 'Gift Guides | clearly.gift',
description: 'Discover curated gift guides for every person and occasion. Find the perfect gifts for coffee lovers, tech enthusiasts, runners, toddlers, and more.',
url: '/guides',
  type: 'website',
},
twitter: {
title: 'Gift Guides | clearly.gift',
description: 'Discover curated gift guides for every person and occasion. Find the perfect gifts for coffee lovers, tech enthusiasts, runners, toddlers, and more.',
  card: 'summary_large_image',
   },
}

export default function GuidesPage() {
return (
<div className="bg-white">
<GuidesHeader />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gift Guides</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Curated collections of the best gifts for every person and occasion
          </p>
        </div>

        <GuideSearch />
      </main>
    </div>
  )
}
