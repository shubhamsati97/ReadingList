# 📚 Shubham's Personal Library

A beautiful, modern reading list web application built with Vite and Vanilla JavaScript. Track your reading journey with a premium design featuring custom book covers and an elegant Hindu-inspired aesthetic.

![Reading List Preview](https://shubhamsati97.github.io/ReadingList/)

## ✨ Features

- **📖 Reading Tracker**: Organize books by status (Currently Reading, To Read, Completed)
- **🎨 Premium Design**: Modern UI with glassmorphism effects and smooth animations
- **🖼️ Custom Book Covers**: AI-generated cover images for each book
- **🕉️ Hindu Aesthetic**: Beautiful background with mandala patterns and saffron/gold tones
- **📱 Responsive**: Works seamlessly on desktop and mobile devices
- **⚡ Fast**: Built with Vite for optimal performance
- **🔍 Filtering**: Easy filtering by reading status
- **📊 Statistics Dashboard**: Track your reading progress at a glance

## 🚀 Live Demo

Visit the live site: [https://shubhamsati97.github.io/ReadingList/](https://shubhamsati97.github.io/ReadingList/)

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Vite
- **Fonts**: Google Fonts (Outfit)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
ReadingList/
├── public/
│   ├── covers/              # Book cover images
│   └── data/
│       ├── books/           # Individual book JSON files
│       ├── library.json     # Library index
│       └── status.json      # Reading status tracker
├── src/
│   ├── main.js             # Application logic
│   ├── style.css           # Styles and design system
│   └── bg-pattern.png      # Background pattern
├── index.html              # Main HTML file
└── vite.config.js          # Vite configuration
```

## 🎯 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shubhamsati97/ReadingList.git
cd ReadingList
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📚 Adding Books

### 1. Create a Book JSON File

Create a new file in `public/data/books/` (e.g., `your-book.json`):

```json
{
  "id": "your-book",
  "title": "Your Book Title",
  "author": "Author Name",
  "category": "Category",
  "tags": ["tag1", "tag2", "tag3"],
  "notes": "Your notes about the book",
  "summaryAvailable": false,
  "coverColor": "blue",
  "thumbnail": "/covers/your-book.png"
}
```

### 2. Add Book Cover

Place your book cover image in `public/covers/` with the same name as your book ID.

### 3. Update Library Index

Add your book ID to `public/data/library.json`:

```json
[
  "existing-book",
  "your-book"
]
```

### 4. Update Reading Status

Add the book status to `public/data/status.json`:

```json
{
  "your-book": {
    "status": "toread",
    "startedAt": null,
    "finishedAt": null
  }
}
```

**Status Options:**
- `reading`: Currently reading
- `completed`: Finished reading
- `toread`: Want to read

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `src/style.css`:

```css
:root {
  --primary-red: #D32F2F;
  --primary-blue: #304FFE;
  --primary-purple: #7C4DFF;
  /* ... */
}
```

### Updating Personal Information

Change the title in `index.html`:

```html
<h1>Your Name's Personal Library</h1>
```

## 🚢 Deployment

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup

1. Go to your repository **Settings** → **Pages**
2. Under **Build and deployment**, select **GitHub Actions** as the source
3. Push to the `main` branch to trigger deployment

The site will be available at `https://[your-username].github.io/ReadingList/`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspired by modern web aesthetics and Hindu spiritual themes
- Book cover images generated using AI
- Built with ❤️ by Shubham

## 📧 Contact

For questions or suggestions, feel free to open an issue or reach out!

---

**Happy Reading! 📖✨**
