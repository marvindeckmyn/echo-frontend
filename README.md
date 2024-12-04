# Echo Frontend

Frontend application for Echo, a modern social media platform inspired by Twitter. This project is built with Next.js and demonstrates modern frontend development practices.

## 🚀 Features

- **Social Feed**: View and create posts
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Instant feed updates
- **User Profiles**: Personal profile pages
- **Authentication**: Secure user authentication

## 💻 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: Tanstack Query
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form with Zod validation

## 🛠 Installation

1. Clone the repository:
```bash
git clone https://github.com/marvindeckmyn/echo-frontend.git
cd echo-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Next.js pages and API routes
├── styles/        # Global styles
└── types/         # TypeScript types
```

## 🔗 Related Projects

- [Echo Backend](https://github.com/marvindeckmyn/echo-backend) - REST API for Echo platform

## 👤 Author

Marvin Deckmyn
- GitHub: [@marvindeckmyn](https://github.com/marvindeckmyn)