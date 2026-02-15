# OpenTask Frontend

Next.js 14 web interface for OpenTask - a task management system with AI agent integration.

## Quick Start

### Prerequisites
- Node.js 18+ (v22 recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

Or for production (Railway):
```env
NEXT_PUBLIC_POCKETBASE_URL=https://opentask.railway.app
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Features

### Pages

- **/** - Landing/Login page
- **/signup** - User registration
- **/dashboard** - Task list (protected)
- **/tasks/new** - Create task form (protected)

### Components

- **Header** - Navigation and user menu
- **AuthForm** - Login/signup forms with validation
- **TaskList** - Display tasks in table format
- **TaskRow** - Individual task row with expand
- **CreateTaskForm** - New task creation form

### Auth

- Email/password authentication via PocketBase
- Protected routes (redirect to login if not authenticated)
- Auto-login after signup
- Token stored in PocketBase authStore

### Tasks

- Create tasks with title and description
- View all tasks in a sortable table
- Filter by status (todo, in_progress, done)
- Expand rows to see full description
- Auto-refresh dashboard every 5 seconds

## Testing

### Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm test -- --watch
```

### Coverage Report

```bash
npm test -- --coverage
```

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
├── components/             # React components
├── lib/                    # Helper functions and utilities
├── __tests__/              # Test files
├── public/                 # Static assets
└── configuration files     # Next, TypeScript, Tailwind config
```

## API Integration

Frontend communicates with PocketBase backend at `https://opentask.railway.app/api/` (production) or `http://localhost:8090/api/` (local)

### Authentication

```typescript
import { login, logout } from '@/lib/auth'

// Login
await login('user@example.com', 'password')

// Logout
logout()
```

### Tasks

```typescript
import { getTasks, createTask } from '@/lib/tasks'

// Get all tasks
const tasks = await getTasks()

// Filter by status
const todoTasks = await getTasks('todo')

// Create task
const task = await createTask('Title', 'Description')
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo in Vercel dashboard: https://vercel.com/new
3. Set Root Directory: `frontend`
4. Add environment variable: `NEXT_PUBLIC_POCKETBASE_URL=https://opentask.railway.app`
5. Deploy (auto-deploys on main branch)

For detailed deployment steps, see [FLUJO_DEPLOYMENT_COMPLETO.md](../FLUJO_DEPLOYMENT_COMPLETO.md)

### Other Platforms

```bash
npm run build
npm start
```

Deploy the built `.next` directory to your platform.

## Development

### Add a New Component

1. Create file in `components/YourComponent.tsx`
2. Add tests in `__tests__/components/YourComponent.test.tsx`
3. Import and use in pages

### Add a New Helper

1. Create file in `lib/yourHelper.ts`
2. Export functions
3. Add tests in `__tests__/lib/yourHelper.test.ts`
4. Import in components

### Styling

Uses TailwindCSS. Update `tailwind.config.js` to customize:

```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors
    },
  },
},
```

## Troubleshooting

### npm install fails

```bash
# Try with legacy peer deps flag
npm install --legacy-peer-deps
```

### Port 3000 already in use

```bash
# Use different port
npm run dev -- -p 3001
```

### PocketBase URL not accessible

- Check `NEXT_PUBLIC_POCKETBASE_URL` in `.env.local`
- Verify PocketBase server is running
- Check network connectivity

### Authentication not working

- Clear browser cookies/storage
- Check browser console for errors
- Verify account exists in PocketBase
- Try creating a new account

## Performance Tips

- Dashboard auto-refreshes every 5 seconds (configurable)
- Images are optimized via Next.js Image component
- CSS is minified and tree-shaken in production
- JavaScript is code-split by route

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (desktop-first responsive design)

## License

MIT

## Support

For issues:

1. Check `IMPLEMENTATION.md` for detailed setup
2. Review error messages in browser console
3. Check PocketBase is running at configured URL
4. Verify environment variables are set correctly

---

**Frontend Version:** 1.0.0  
**Built with:** Next.js 14, React 18, TypeScript, TailwindCSS
