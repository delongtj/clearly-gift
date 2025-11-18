import PublicHeader from '@/components/PublicHeader'

export const metadata = {
  title: 'Contact Us',
};

export default function ContactPage() {
  return (
    <div className="bg-white flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center w-full">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        
        <p className="text-xl text-gray-600">
          We're working on a contact form. Coming soon!
        </p>
          </div>
          </main>
          </div>
   );
}
