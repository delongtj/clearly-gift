export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  const lastUpdated = new Date('2024-01-01').toLocaleDateString();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing and using the clearly.gift website and service, you accept and agree to be bound by and abide by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
            <p className="text-gray-700 mb-3">
              Permission is granted to temporarily download one copy of the materials (information or software) on clearly.gift for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>Attempt to decompile or reverse engineer any software contained on clearly.gift</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Use the Service to develop, market, sell, distribute, or offer any competing service or product</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Disclaimer</h2>
            <p className="text-gray-700">
              The materials on clearly.gift are provided on an 'as is' basis. clearly.gift makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Limitations</h2>
            <p className="text-gray-700">
              In no event shall clearly.gift or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on clearly.gift, even if clearly.gift or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Accuracy of Materials</h2>
            <p className="text-gray-700">
              The materials appearing on clearly.gift could include technical, typographical, or photographic errors. clearly.gift does not warrant that any of the materials on its Website are accurate, complete, or current. clearly.gift may make changes to the materials contained on its Website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Links</h2>
            <p className="text-gray-700">
              clearly.gift has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by clearly.gift of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Modifications</h2>
            <p className="text-gray-700">
              clearly.gift may revise these terms of service for its Website at any time without notice. By using this Website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Governing Law</h2>
            <p className="text-gray-700">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which clearly.gift operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:contact@clearly.gift" className="text-blue-600 hover:text-blue-800">
                contact@clearly.gift
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
