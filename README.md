# Chulbuli Jewels - E-commerce Platform

A modern, secure e-commerce platform for jewelry built with Next.js 14, TypeScript, Drizzle ORM, and PostgreSQL.

## 🚀 Features

- **Secure Authentication** - JWT-based auth with httpOnly cookies
- **Product Management** - Full CRUD operations for products with image upload
- **Order Management** - Complete order flow with inventory tracking
- **Review System** - Customer reviews with admin approval
- **Admin Dashboard** - Comprehensive admin panel for managing products, orders, and reviews
- **Security** - Rate limiting, CSRF protection, input sanitization, and XSS prevention
- **Responsive Design** - Mobile-first design with Tailwind CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **PostgreSQL** database (local or cloud like Supabase/Neon)
- **Cloudinary** account for image storage

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd CHULBULI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory. Use `.env.example` as a template:

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT Secret (MUST BE AT LEAST 32 CHARACTERS)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your-64-character-hex-string-here"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Node Environment
NODE_ENV="development"
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. **Set up the database**

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product endpoints
│   │   ├── orders/       # Order endpoints
│   │   └── admin/        # Admin-only endpoints
│   ├── admin/            # Admin dashboard pages
│   ├── products/         # Product listing & details
│   └── ...
├── components/            # Reusable React components
├── lib/                   # Utilities and configurations
│   ├── db/               # Database schema and client
│   ├── auth.ts           # Authentication utilities
│   ├── validation.ts     # Input validation
│   └── ...
└── store/                # Zustand state management
```

## 🔒 Security Features

- **JWT Authentication** with httpOnly cookies
- **Password Hashing** using bcrypt (12 rounds)
- **Rate Limiting** on authentication and API endpoints
- **Input Sanitization** to prevent XSS attacks
- **CSRF Protection** for state-changing requests
- **SQL Injection Prevention** via Drizzle ORM parameterized queries
- **Security Headers** configured in Next.js and middleware
- **Audit Logging** for security-relevant events

## 🗄️ Database Schema

- **Users** - Customer and admin accounts
- **Products** - Jewelry items with categories, pricing, images
- **Orders** - Customer orders with status tracking
- **OrderItems** - Individual items in each order
- **Reviews** - Product reviews with approval system

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

## 🚀 Deployment

### Environment Setup

1. Set all environment variables in your hosting platform
2. Ensure `NODE_ENV=production`
3. Use a strong, unique `JWT_SECRET` for production
4. Configure database connection with SSL if required

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm run start
```

## 📝 Admin Access

After seeding the database, an admin account is created with:
- **Email**: admin@chulbulijewels.com
- **Password**: (check your seed file)

You can create additional admin users by updating the role in the database.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if PostgreSQL is running
- Ensure database exists and is accessible

### Authentication Issues
- Verify `JWT_SECRET` is at least 32 characters
- Clear browser cookies and local storage
- Check if cookies are enabled in browser

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check Node.js version (should be 18+)

## 🔄 Recent Bug Fixes

✅ Fixed Zod version incompatibility (4.3.5 → 3.22.4)
✅ Fixed Drizzle config deprecation warnings
✅ Added proper crypto import in middleware
✅ Added Error Boundary for better error handling
✅ Fixed database connection pooling for serverless environments

## 📄 License

This project is private and proprietary.

## 👥 Support

For issues or questions, please contact the development team.
