# RepBox CRM

A modern, multi-tenant CRM system built specifically for manufacturer representatives. Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

### Core CRM
- **Contacts Management** - Manage contacts with company relationships
- **Companies** - Track companies and their relationships
- **Opportunities** - Sales pipeline management with stages
- **Quotes** - Generate and manage quotes with PDF export

### Product Management
- **Manufacturers** - Manage manufacturer relationships
- **Products** - Product catalog with SKU management
- **Line Cards** - Track manufacturer line card agreements
- **Territories** - Define sales territories with states and zip codes

### Rep-Specific Features
- **Commissions** - Track commissions with automatic calculations
- **Aliases** - Manage name aliases for manufacturers, products, and companies
- **Activities** - Log calls, emails, meetings, notes, and tasks
- **Activity Timeline** - Chronological view of all activities

### Advanced Features
- **CSV Import** - Import contacts, companies, products, manufacturers, and commissions
- **Import History** - Track all imports with success/error reporting
- **Reports** - Create and save custom reports
- **Dashboard** - KPI dashboard with pipeline metrics
- **File Attachments** - Attach files to any entity (S3 integration)
- **PDF Generation** - Generate professional quote PDFs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 16 (via Neon)
- **ORM**: Prisma 7
- **Authentication**: NextAuth.js v5
- **UI Components**: Catalyst UI Kit
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand
- **File Storage**: AWS S3
- **PDF Generation**: @react-pdf/renderer
- **CSV Parsing**: PapaParse

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- AWS S3 bucket (for file storage)
- AWS SES (for email notifications)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd repbox
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="your-bucket-name"

# AWS SES (optional)
AWS_SES_REGION="us-east-1"
AWS_SES_ACCESS_KEY_ID="your-access-key"
AWS_SES_SECRET_ACCESS_KEY="your-secret-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
repbox/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── (app)/        # Authenticated app pages
│   │   ├── (auth)/       # Authentication pages
│   │   └── api/          # API routes
│   ├── actions/          # Server actions
│   ├── components/       # React components
│   │   ├── features/     # Feature components
│   │   ├── layouts/      # Layout components
│   │   └── ui/           # UI components (Catalyst)
│   ├── lib/              # Utility libraries
│   │   ├── validations/  # Zod schemas
│   │   ├── import/       # CSV import utilities
│   │   └── pdf/          # PDF generation
│   └── styles/           # Global styles
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Multi-Tenancy

RepBox uses subdomain-based multi-tenancy. Each tenant has a unique subdomain, and all data is automatically isolated by `tenantId`. The middleware handles subdomain resolution and sets the tenant context.

## Database Schema

The database schema includes:
- **Tenant** - Multi-tenant isolation
- **User** - User accounts
- **Contact** - Contact management
- **Company** - Company management
- **Manufacturer** - Manufacturer relationships
- **Product** - Product catalog
- **Opportunity** - Sales opportunities
- **Quote** - Quotes and proposals
- **Commission** - Commission tracking
- **LineCard** - Line card agreements
- **Territory** - Sales territories
- **Activity** - Activity logging
- **Alias** - Name aliases
- **FileAttachment** - File attachments
- **Report** - Saved reports
- **ImportLog** - Import history

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration-name

# Apply migrations in production
npx prisma migrate deploy
```

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:
- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- AWS credentials
- S3 bucket name

## Security

- All database queries are tenant-isolated
- SQL injection prevention via Prisma
- XSS prevention via React's built-in escaping
- CSRF protection via NextAuth.js
- Rate limiting via Vercel (if deployed there)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Support

For support, email support@repbox.com or open an issue in the repository.
