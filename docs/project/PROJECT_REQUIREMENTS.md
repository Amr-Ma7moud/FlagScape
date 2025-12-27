# FlagScape Project Requirements Specification

## 1. Project Overview

### 1.1 Problem Statement
Geography education often lacks engagement and interactivity. Students find it challenging to learn about world countries, their flags, capitals, and geographical locations through traditional methods. There is a need for an interactive, gamified platform that makes learning about world geography fun and accessible.

### 1.2 Project Objectives
- Create an interactive web-based geography learning platform
- Provide multiple engaging game modes for different learning styles
- Enable exploration of world countries through interactive maps
- Demonstrate proficiency in modern web development technologies
- Implement both client-side and server-side programming

### 1.3 Scope
**In Scope:**
- Interactive SVG maps (world and continents)
- Three educational games with multiple modes
- Country information display and search
- User contact form with validation
- Responsive design for mobile and desktop
- Local backend API for data management

**Out of Scope:**
- User authentication and persistent user accounts
- Score leaderboards and global competitions
- Social media integration
- Offline mobile application
- Database-driven content management system

---

## 2. Functional Requirements

### 2.1 Interactive Maps (FR-001 to FR-005)

**FR-001: World Map Display**
- The system shall display an interactive world map using SVG
- Users shall be able to click on any country to view details
- Map shall highlight countries on hover

**FR-002: Continent Maps**
- The system shall provide separate maps for each continent:
  - North America
  - South America
  - Europe
  - Asia
  - Africa
  - Australia/Oceania

**FR-003: Country Details Modal**
- Clicking a country shall display a modal with:
  - Country flag
  - Official and common names
  - Capital city
  - Population
  - Region/Continent
  - Link to detailed country page

**FR-004: Country Details Page**
- Dedicated page shall show comprehensive information:
  - Flag, coat of arms
  - Geographic data (area, borders, languages)
  - Economic data (currencies, GDP)
  - Cultural information (timezone, calling codes)

**FR-005: Navigation**
- Sidebar navigation shall allow switching between:
  - World map
  - Individual continent maps
  - Games
  - Contact page

### 2.2 Game Features (FR-006 to FR-011)

**FR-006: Guess The Flag Game**
- Six game modes shall be available:
  1. **Hybrid Timer**: 12s per question + reserve pool with bonuses
  2. **Speed Run**: 120s total for 10 questions
  3. **Sudden Death**: One incorrect answer ends the game
  4. **Typing Mode**: Type country name with autocomplete
  5. **Blitz Mode**: 7s per question, no reserve
  6. **Marathon**: 20 questions with relaxed 15s timer
- Display flag and multiple-choice country options
- Track score, streak, and time
- Show final results with statistics

**FR-007: Capital Challenge Game**
- 30-second timer per question with time bonuses/penalties
- Progressive level system (Level 1-10)
- Score multipliers for consecutive correct answers
- Match capitals to countries

**FR-008: Speed Quiz**
- 60-second mixed geography quiz
- Multiple question types:
  - Flag identification
  - Capital cities
  - Regions
  - Population comparisons
  - Languages
- Combo system for consecutive correct answers
- Bonus time for maintaining combos

**FR-009: Game Statistics**
- Display current score
- Show answer streak
- Display time remaining/used
- Show question progress (e.g., "5/10")

**FR-010: Game Results**
- Show final score
- Display correct answer count
- Show time statistics
- Provide "Play Again" and "Change Mode" options

**FR-011: Mode Selection**
- Interactive mode selection screen
- Display mode description and difficulty
- Visual mode indicators

### 2.3 Contact Form (FR-012 to FR-016)

**FR-012: Contact Form Display**
- Form shall collect:
  - First Name and Last Name
  - Email address
  - Phone number
  - Username
  - Password (with confirmation)
  - Favorite country (dropdown)
  - Message (optional)
  - Newsletter subscription (checkbox)
  - Terms and conditions agreement (required checkbox)

**FR-013: Client-Side Validation**
- Validate all required fields in real-time
- Use regular expressions for pattern matching:
  - Names: 2-50 letters only
  - Email: standard email format
  - Phone: international format with country code
  - Username: 3-20 alphanumeric characters
  - Password: minimum 8 chars with uppercase, lowercase, number, special character
- Display user-friendly error messages
- Highlight valid/invalid fields visually

**FR-014: Server-Side Validation**
- Backend shall validate all submissions using regex
- Return detailed error messages for invalid data
- Prevent submission if validation fails

**FR-015: Form Submission**
- Submit form data using AJAX (jQuery)
- Store submissions in JSON file
- Display success message upon successful submission
- Clear form after successful submission option

**FR-016: Data Persistence**
- Save contact submissions to `backend/data/contacts.json`
- Include timestamp for each submission
- Provide endpoint to retrieve all contacts (admin view)

### 2.4 Data Management (FR-017 to FR-019)

**FR-017: Country Data API**
- Backend shall provide RESTful endpoints:
  - `GET /v3.1/all` - Retrieve all countries
  - `GET /v3.1/all?fields=name,capital` - Filter fields
  - `GET /v3.1/name/{name}` - Search by country name
  - `GET /v3.1/name/{name}?fullText=true` - Exact match search

**FR-018: Local Data Store**
- Maintain local JSON database of 250+ countries
- Seed data from REST Countries API (one-time operation)
- Store complete country information for offline use

**FR-019: Contact Data API**
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Retrieve all submissions

---

## 3. Non-Functional Requirements

### 3.1 Performance (NFR-001 to NFR-003)

**NFR-001: Load Time**
- Initial page load shall complete within 3 seconds on standard broadband
- Game transitions shall be instantaneous (<100ms)

**NFR-002: API Response Time**
- Local API responses shall return within 200ms
- Country search shall provide results within 500ms

**NFR-003: Scalability**
- System shall support 250+ countries without performance degradation
- Contact form shall handle concurrent submissions

### 3.2 Usability (NFR-004 to NFR-006)

**NFR-004: Responsive Design**
- Layout shall adapt to screen sizes: mobile (320px+), tablet (768px+), desktop (1024px+)
- Touch-friendly controls on mobile devices
- Hamburger menu for mobile navigation

**NFR-005: Accessibility**
- Semantic HTML for screen readers
- ARIA labels on interactive elements
- Keyboard navigation support
- Sufficient color contrast ratios

**NFR-006: User Feedback**
- Visual feedback for all user interactions
- Clear loading states
- Helpful error messages
- Success confirmations

### 3.3 Compatibility (NFR-007 to NFR-008)

**NFR-007: Browser Support**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**NFR-008: Standards Compliance**
- Valid HTML5 markup
- CSS3 standards compliance
- ES6+ JavaScript features
- RESTful API design principles

### 3.4 Security (NFR-009 to NFR-010)

**NFR-009: Input Validation**
- All user inputs shall be validated client and server-side
- Protection against common injection attacks
- Sanitize data before storage

**NFR-010: Data Privacy**
- No sensitive data stored in plain text (except for educational demo)
- CORS properly configured
- No exposure of internal server details

### 3.5 Maintainability (NFR-011 to NFR-012)

**NFR-011: Code Organization**
- Modular CSS architecture (separate files per component)
- ES6 modules for JavaScript
- Clear file structure and naming conventions
- Separation of concerns (HTML, CSS, JS)

**NFR-012: Documentation**
- Code comments for complex logic
- README with setup instructions
- API documentation
- Architecture diagrams

---

## 4. Technology Stack

### 4.1 Frontend Technologies
- **HTML5**: Semantic markup, proper document structure
- **CSS3**: 
  - Modular stylesheets (10 separate files)
  - Float-based layouts for specific components
  - Flexbox and Grid for modern layouts
  - Responsive design with media queries
  - Animations and transitions
- **JavaScript (ES6+)**:
  - Vanilla JS for core functionality
  - jQuery 3.7.1 for form handling and DOM manipulation
  - ES6 modules for code organization
  - Async/await for API calls
  - Fetch API for AJAX requests

### 4.2 Backend Technologies
- **Python Flask**: Lightweight web framework
- **Flask-CORS**: Cross-origin resource sharing
- **Python re module**: Regular expression validation
- **JSON**: Data storage format

### 4.3 External APIs and Libraries
- **jQuery 3.7.1**: DOM manipulation and AJAX
- **REST Countries API**: Initial data seeding
- **SVG Maps**: Interactive geographical visualizations

### 4.4 Development Tools
- **Git**: Version control
- **GitHub**: Repository hosting and GitHub Pages deployment
- **Python virtual environment**: Dependency isolation
- **Python http.server**: Frontend development server
- **Flask development server**: Backend API server

---

## 5. System Architecture

### 5.1 Architecture Pattern
- **Client-Server Architecture**
- **Three-Tier Architecture**:
  1. **Presentation Layer**: HTML/CSS/JavaScript frontend
  2. **Application Layer**: Flask REST API
  3. **Data Layer**: JSON file storage

### 5.2 Data Flow
1. User interacts with frontend (HTML/CSS/JS)
2. JavaScript makes API calls to Flask backend
3. Flask processes requests, validates data
4. Flask reads/writes to JSON files
5. Flask returns JSON responses
6. JavaScript updates DOM dynamically

---

## 6. User Roles and Permissions

### 6.1 End User (Student/Learner)
- Browse interactive maps
- Play geography games
- View country information
- Submit contact form
- No authentication required

### 6.2 Administrator (Implied)
- Access to server and file system
- Can view contact submissions
- Can modify country data
- Deploy and maintain application

---

## 7. Constraints and Assumptions

### 7.1 Constraints
- Must run on local machine (localhost)
- Requires Python 3.7+ for backend
- Requires modern web browser
- Must serve frontend with HTTP server (no file:// protocol due to ES6 modules)

### 7.2 Assumptions
- Users have stable internet connection for initial setup
- Users have basic geography knowledge
- Flask server runs on port 5000
- Frontend served on port 8000 (or similar)
- Users access from desktop or mobile devices

---

## 8. Future Enhancements

### 8.1 Potential Features
- User authentication and profiles
- Persistent score tracking
- Global leaderboards
- Social features (share scores)
- More game modes
- Achievements and badges
- Difficulty levels
- Custom quiz creation
- Multiplayer challenges
- Translation to multiple languages

### 8.2 Technical Improvements
- Migration to PostgreSQL/MySQL database
- REST API authentication (JWT)
- Progressive Web App (PWA) functionality
- Server-side rendering (SSR)
- Continuous Integration/Deployment (CI/CD)
- Automated testing suite
- Performance monitoring
- Analytics integration

---

## 9. Success Criteria

The project shall be considered successful when:
1. All functional requirements are implemented and working
2. All non-functional requirements are met
3. Application is accessible and usable on target platforms
4. Code meets quality standards (organized, commented, validated)
5. Documentation is complete and accurate
6. Application is deployable to GitHub Pages
7. All rubric requirements are satisfied (25/25 points)

---

**Document Version**: 1.0  
**Date**: December 27, 2025  
**Authors**: 3mk Amr, 3mk Hekal  
**Course**: Network and Web Programming (CNC111)  
**Institution**: E-JUST University
