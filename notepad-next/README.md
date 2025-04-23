# Modern Notepad App

A sleek, modern notepad application built with Next.js and Material-UI, featuring a beautiful dark theme, smooth animations, and SQLite database integration.

![Modern Notepad App](screenshot.png)

## Features

- 🎨 Modern UI with dark theme and glassmorphism effects
- ✨ Smooth animations and transitions
- 📝 Create, read, update, and delete notes
- 💾 SQLite database for persistent storage
- 📱 Responsive design for all screen sizes
- 🎯 TypeScript for type safety
- 🚀 Next.js for optimal performance

## Tech Stack

- **Frontend**: Next.js, React, Material-UI
- **Backend**: Next.js API Routes
- **Database**: SQLite
- **Styling**: Material-UI, CSS-in-JS
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ylinux0/check.git
cd notepad-next
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
notepad-next/
├── app/
│   ├── api/           # API routes
│   ├── page.tsx       # Main page component
│   ├── layout.tsx     # Root layout
│   ├── providers.tsx  # Theme and context providers
│   └── globals.css    # Global styles
├── types/             # TypeScript type definitions
└── public/            # Static assets
```

## API Endpoints

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Material-UI](https://mui.com/)
- [SQLite](https://www.sqlite.org/)
