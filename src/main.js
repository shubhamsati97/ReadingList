import './style.css'

// State
const state = {
  books: {}, // Map of bookId -> bookDetails
  status: {}, // Map of bookId -> statusDetails
  filter: 'all'
};

// DOM Elements
const elements = {
  grid: document.getElementById('books-grid'),
  totalCount: document.getElementById('total-books'),
  readingCount: document.getElementById('reading-books'),
  completedCount: document.getElementById('completed-books'),
  toreadCount: document.getElementById('toread-books'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  filterCounts: {
    all: document.getElementById('filter-all-count'),
    reading: document.getElementById('filter-reading-count'),
    completed: document.getElementById('filter-completed-count'),
    toread: document.getElementById('filter-toread-count')
  },
  modal: {
    overlay: document.getElementById('book-modal'),
    closeBtn: document.getElementById('modal-close'),
    closeBtnSecondary: document.getElementById('modal-close-btn'),
    header: document.getElementById('modal-header'),
    tags: document.getElementById('modal-tags'),
    notes: document.getElementById('modal-notes')
  }
};

// Initialize
async function init() {
  try {
    await fetchData();
    renderStats();
    renderBooks();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    elements.grid.innerHTML = '<p class="error">Failed to load library data. Please try again later.</p>';
  }
}

// Fetch Data
async function fetchData() {
  const baseUrl = import.meta.env.BASE_URL;

  // 1. Fetch Status
  const statusRes = await fetch(`${baseUrl}data/status.json`);
  state.status = await statusRes.json();

  // 2. Fetch Library Index
  const libraryRes = await fetch(`${baseUrl}data/library.json`);
  const libraryIds = await libraryRes.json();

  // 3. Fetch Book Details in parallel
  const bookPromises = libraryIds.map(async (id) => {
    try {
      const res = await fetch(`${baseUrl}data/books/${id}.json`);
      const book = await res.json();
      return { id, ...book };
    } catch (e) {
      console.warn(`Failed to load book ${id}`, e);
      return null;
    }
  });

  const books = await Promise.all(bookPromises);

  // Populate state.books
  books.forEach(book => {
    if (book) {
      state.books[book.id] = book;
    }
  });
}

// Render Stats
function renderStats() {
  const total = Object.keys(state.books).length;
  const reading = Object.values(state.status).filter(s => s.status === 'reading').length;
  const completed = Object.values(state.status).filter(s => s.status === 'completed').length;
  const toread = Object.values(state.status).filter(s => s.status === 'toread').length;

  elements.totalCount.textContent = total;
  elements.readingCount.textContent = reading;
  elements.completedCount.textContent = completed;
  elements.toreadCount.textContent = toread;

  // Update filter counts
  elements.filterCounts.all.textContent = total;
  elements.filterCounts.reading.textContent = reading;
  elements.filterCounts.completed.textContent = completed;
  elements.filterCounts.toread.textContent = toread;
}

// Render Books
function renderBooks() {
  elements.grid.innerHTML = '';

  const bookIds = Object.keys(state.books);

  const filteredIds = bookIds.filter(id => {
    if (state.filter === 'all') return true;
    const bookStatus = state.status[id]?.status;
    return bookStatus === state.filter;
  });

  filteredIds.forEach(id => {
    const book = state.books[id];
    const status = state.status[id];
    const card = createBookCard(book, status);
    elements.grid.appendChild(card);
  });
}

function createBookCard(book, statusInfo) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.onclick = () => openModal(book.id);

  const status = statusInfo?.status || 'unknown';
  const statusLabel = status === 'toread' ? 'To Read' : status;

  // Determine cover color class based on data or random/hash
  const coverColor = book.coverColor || 'blue';

  const baseUrl = import.meta.env.BASE_URL;

  // Use thumbnail if available, otherwise use colored background
  const bookCoverHTML = book.thumbnail
    ? `<div class="book-cover with-image">
         <img src="${baseUrl}${book.thumbnail.startsWith('/') ? book.thumbnail.slice(1) : book.thumbnail}" alt="${book.title}" class="book-thumbnail" />
         <span class="book-status-badge">${statusLabel}</span>
         <div class="book-info-overlay">
           <h3 class="book-title">${book.title}</h3>
           <p class="book-author">${book.author}</p>
         </div>
       </div>`
    : `<div class="book-cover ${coverColor}">
         <span class="book-status-badge">${statusLabel}</span>
         <div class="book-info-overlay">
           <h3 class="book-title">${book.title}</h3>
           <p class="book-author">${book.author}</p>
         </div>
       </div>`;

  card.innerHTML = `
    ${bookCoverHTML}
    <div class="book-details">
      <div class="book-meta">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        ${book.category}
      </div>
      <div class="tags-container">
        ${book.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
        ${book.tags.length > 2 ? `<span class="tag">+${book.tags.length - 2}</span>` : ''}
      </div>
      <p class="book-note-preview">${book.notes}</p>
      ${book.summaryAvailable ? `
        <div class="summary-indicator">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Summary available
        </div>
      ` : ''}
      ${status === 'reading' && statusInfo?.pagesRead !== undefined && book.totalPages ? `
        <div class="progress-container">
          <div class="progress-label">
            <span>Reading Progress</span>
            <span>${statusInfo.pagesRead} / ${book.totalPages} pages (${Math.round((statusInfo.pagesRead / book.totalPages) * 100)}%)</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width: ${Math.min((statusInfo.pagesRead / book.totalPages) * 100, 100)}%"></div>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  return card;
}

// Modal Logic
function openModal(bookId) {
  const book = state.books[bookId];
  const statusInfo = state.status[bookId];
  const coverColor = book.coverColor || 'blue';
  const status = statusInfo?.status || 'unknown';
  const statusLabel = status === 'toread' ? 'To Read' : status;

  // Populate Header
  elements.modal.header.className = `modal-header ${coverColor}`; // Use CSS class for background
  // We need to set the background style dynamically if we want the gradient, 
  // but since we have classes .book-cover.red etc, we can reuse them or add specific modal header classes.
  // Let's add inline style or reuse classes. 
  // Actually, let's just add the class to the header element and ensure CSS handles it.
  // In CSS I defined .book-cover.red, let's add .modal-header.red

  // Wait, I need to add those classes to CSS for modal-header too.
  // I'll update CSS or just use inline style for now to match the card.
  // Let's use the classes I defined: .book-cover.red
  // I'll add `modal-header` to the same CSS rules or just add `book-cover` class to it? No, structure is different.
  // I'll just set the class and ensure CSS has it. I checked CSS, I didn't add .modal-header.red.
  // I will assume I need to update CSS or just rely on the fact that I can add the style.
  // Let's just add the class `book-cover` to it? No.
  // I'll add a quick style update in JS or just let it be default for now?
  // No, premium design needs it.
  // I'll use `style` attribute for the gradient.

  const gradients = {
    red: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
    blue: 'linear-gradient(135deg, #304FFE 0%, #1A237E 100%)',
    purple: 'linear-gradient(135deg, #7C4DFF 0%, #6200EA 100%)',
    green: 'linear-gradient(135deg, #00C853 0%, #00695C 100%)'
  };
  elements.modal.header.style.background = gradients[coverColor] || gradients.blue;

  elements.modal.header.innerHTML = `
    <button class="modal-close" id="modal-close-dynamic">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    <div class="modal-header-content">
      <h2>${book.title}</h2>
      <p>${book.author}</p>
      <div class="modal-badges">
        <span class="modal-badge">${statusLabel}</span>
        <span class="modal-badge">${book.category}</span>
      </div>
      ${status === 'reading' && statusInfo?.pagesRead !== undefined && book.totalPages ? `
        <div class="modal-progress">
          <div class="progress-label" style="color: white; margin-top: 15px;">
            <span>Reading Progress</span>
            <span>${statusInfo.pagesRead} / ${book.totalPages} pages (${Math.round((statusInfo.pagesRead / book.totalPages) * 100)}%)</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width: ${Math.min((statusInfo.pagesRead / book.totalPages) * 100, 100)}%"></div>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Re-attach close listener to the new button
  document.getElementById('modal-close-dynamic').onclick = closeModal;

  // Populate Body
  elements.modal.tags.innerHTML = book.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  elements.modal.notes.textContent = book.notes;

  // Show
  elements.modal.overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  elements.modal.overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Event Listeners
function setupEventListeners() {
  // Filter Buttons
  elements.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update UI
      elements.filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update State
      state.filter = btn.dataset.filter;
      renderBooks();
    });
  });

  // Modal Close
  elements.modal.closeBtn.addEventListener('click', closeModal);
  elements.modal.closeBtnSecondary.addEventListener('click', closeModal);
  elements.modal.overlay.addEventListener('click', (e) => {
    if (e.target === elements.modal.overlay) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modal.overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

// Start
init();
