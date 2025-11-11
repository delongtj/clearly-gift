export const metadata = {
  title: 'About clearly.gift',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">About clearly.gift</h1>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="text-gray-700">
              At clearly.gift, we believe that gift-giving should be joyful, stress-free, and thoughtful. We've created a simple platform that helps you share your wishlist with friends and family while keeping the surprise alive.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Why We Built This</h2>
            <p className="text-gray-700 mb-3">
              Traditional wishlists often come with unnecessary complexity. You need to sign up, navigate confusing interfaces, and share cumbersome links. Meanwhile, your loved ones just want to know what you actually want.
            </p>
            <p className="text-gray-700">
              clearly.gift solves this. Create a beautiful, clutter-free wishlist in minutes and share it with a simple link. Your friends and family can view your items, claim gifts to coordinate, and you keep the surprise of how much they care.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Create your wishlist – no sign-up required to start</li>
              <li>Add items you want – include links, prices, or just descriptions</li>
              <li>Share your list – copy the link and send it to friends and family</li>
              <li>They view and claim – recipients can see what you want and claim items to coordinate</li>
              <li>Keep the surprise – you don't see who bought what until it arrives</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li><strong>Simplicity:</strong> The easiest way to create and share a wishlist</li>
              <li><strong>Privacy:</strong> Your list is only shared with people you choose</li>
              <li><strong>Joy:</strong> Making gift-giving a delightful experience for everyone</li>
              <li><strong>Thoughtfulness:</strong> Helping people understand what matters to you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Get Started</h2>
            <p className="text-gray-700">
              Ready to create your wishlist? Get started today and share it with the people you care about.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
