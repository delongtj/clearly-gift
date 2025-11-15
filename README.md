# clearly.gift

A simple, clean gift wish list sharing app built with Next.js and Supabase.

## Features

- 🎁 **Simple Wish Lists**: Create and share beautiful, clutter-free wish lists
- 🔗 **No Sign-up Required**: Friends and family can view and claim items without accounts
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔒 **Privacy-Focused**: List owners can't see what's been claimed by whom
- 📊 **Analytics**: Track views and clicks on your lists and items
- 🛍️ **Affiliate Ready**: Automatic URL processing and affiliate link insertion

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd clearly-gift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Follow the setup guide in `docs/supabase-setup.md`
   - Run the SQL schema in your Supabase SQL editor

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase credentials and other configuration.

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Import the project in Vercel
   - Add your environment variables in Vercel's dashboard

2. **Configure domains**
   - Set up your custom domain (clearly.gift)
   - Update `NEXT_PUBLIC_APP_URL` in your environment variables

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   ├── list/[token]/   # Public list viewing
│   └── guides/         # Gift guide pages
├── components/         # React components
├── lib/               # Utilities and configurations
│   ├── auth.ts        # Supabase auth helpers
│   ├── database.ts    # Database service class
│   └── supabase.ts    # Supabase client
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
│   └── url-processor.ts # URL cleaning and affiliate processing
└── middleware.ts      # Next.js middleware for auth

content/
└── guides/            # Static gift guide content (MDX files)

docs/
└── supabase-setup.md  # Database setup instructions
```

## Key Features Implementation

### URL Processing
- Automatically strips tracking parameters
- Adds affiliate IDs for supported retailers (Amazon, Target, Walmart, Etsy)
- Preserves original URLs while creating clean affiliate versions

### Privacy Protection
- List owners see a cheeky message instead of their public list
- Claimed items are visually diminished but don't reveal claimer identity to owner
- No authentication required for claiming items

### Analytics
- View counts for lists (visible to everyone)
- Click counts for individual items
- Built on Supabase's real-time capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For questions or support, please create an issue in the GitHub repository.
