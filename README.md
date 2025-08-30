# MEFTAHI IMMO - Real Estate Agency Platform

A complete real estate platform for **MEFTAHI IMMO** agency in **Bizerte, Tunisia**, featuring property management, booking system, and admin dashboard.

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Backend**: Next.js API Routes + Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## ✨ Features

### Public Website
- 🏠 **Property Catalog**: Browse apartments, villas, studios, and more
- 🔍 **Advanced Search**: Filter by type, purpose, price, location, etc.
- 📱 **Responsive Design**: Works perfectly on all devices
- 🖼️ **Media Gallery**: Photos and videos for each property
- 📅 **Booking System**: Reserve properties for rent
- 📞 **Visit Scheduling**: Request property viewings
- ⭐ **Favorites**: Save properties for later

### Admin Dashboard
- 📊 **Dashboard**: Overview of listings, reservations, and visits
- 🏢 **Property Management**: Full CRUD operations for listings
- 📋 **Reservation Management**: Handle booking requests
- 👥 **Visit Management**: Manage property viewing appointments
- 🖼️ **Media Upload**: Add photos and videos to properties
- 📈 **Analytics**: Track performance and statistics

### Technical Features
- 🔐 **Row Level Security**: Secure data access with Supabase RLS
- 🎯 **Type Safety**: Full TypeScript implementation
- 🚀 **Performance**: Optimized for speed and SEO
- 📱 **PWA Ready**: Progressive Web App capabilities
- 🌐 **Internationalization**: French language support
- 🔄 **Real-time Updates**: Live data synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/cuxi2/MEFTAHI_IMMO.git
cd MEFTAHI_IMMO
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Create a storage bucket named `listings-media` (public)
4. Copy your project URL and keys

### 4. Environment Configuration

Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
NEXT_PUBLIC_SITE_NAME=MEFTAHI IMMO
COMPANY_CITY=Bizerte
COMPANY_PHONE=+216XXXXXXXX
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 6. Create Admin User

1. Sign up for an account through Supabase Auth UI
2. In Supabase dashboard, go to Authentication > Users
3. Copy the user UUID
4. In SQL Editor, run:
```sql
INSERT INTO public.profiles (id, full_name, phone, role) 
VALUES ('your-user-uuid', 'Admin Name', '+216XXXXXXXX', 'admin');
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (admin)/           # Admin dashboard
│   ├── catalog/           # Property catalog
│   ├── listing/[slug]/    # Property details
│   └── contact/           # Contact page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Site header
│   ├── Footer.tsx        # Site footer
│   ├── ListingCard.tsx   # Property card
│   └── Gallery.tsx       # Media gallery
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript types
├── utils/                # Helper functions
└── styles/               # Global styles
```

## 🗄️ Database Schema

The database includes the following main tables:
- `profiles` - User profiles and roles
- `listings` - Property listings
- `listing_media` - Photos and videos
- `reservations` - Booking requests
- `visits` - Viewing appointments
- `favorites` - User favorites

See `supabase-schema.sql` for the complete schema.

## 🚀 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE=your-production-service-role
NEXT_PUBLIC_SITE_NAME=MEFTAHI IMMO
COMPANY_CITY=Bizerte
COMPANY_PHONE=+216XXXXXXXX
```

## 📱 Usage

### For Property Seekers
1. Browse properties in the catalog
2. Use filters to find specific properties
3. View detailed property information
4. Schedule visits or make reservations
5. Contact the agency directly

### For Admins
1. Login at `/login` with admin credentials
2. Manage properties from admin dashboard
3. Handle reservation and visit requests
4. Upload photos and update property details
5. Monitor analytics and performance

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Adding New Components
```bash
npx shadcn@latest add [component-name]
```

## 🔧 Configuration

### Supabase Setup
1. Database tables and RLS policies
2. Storage bucket for media files
3. Authentication configuration
4. Edge functions (if needed)

### Styling
- TailwindCSS for utility classes
- shadcn/ui for component library
- Custom CSS for specific styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions about MEFTAHI IMMO:
- 📧 Email: contact@meftahi-immo.tn
- 📞 Phone: +216 XX XXX XXX
- 📍 Address: Bizerte, Tunisia

## 🏆 Features Roadmap

- [ ] Advanced search with map integration
- [ ] Email notifications for bookings
- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Virtual tours
- [ ] AI-powered property recommendations

---

Built with ❤️ for the Tunisian real estate market by MEFTAHI IMMO team.