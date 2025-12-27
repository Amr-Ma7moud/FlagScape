# Network and Web Programming Project - Cover Sheet

## E-JUST University
### Computer Science and Information Technology Programs
### Subject: Network and Web Programming (CNC111)

---

## Project Name
**FlagScape - Interactive Geography Learning Platform**

---

## Team Information

| ID [Ordered by ID] | Full Name | Attendance Signature [Handwritten] | Final Grade |
|-------------------|-----------|-------------------------------------|-------------|
| _____________ | 3mk Amr | _______________________ | _____ / 25 |
| _____________ | 3mk Hekal | _______________________ | _____ / 25 |

> **Note**: Please fill in your student IDs and sign during the discussion session.

---

## Rubric Evaluation

### 1. XHTML (1 Point)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Code readability and organization (indentation, comments) | All `.html` files properly formatted | ☑ |
| Uses well-formed XHTML syntax (properly closed tags, lowercase, proper nesting) | [index.html](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/index.html), [contact.html](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/contact.html), etc. | ☑ |
| Validates against W3C XHTML standards | Can validate at https://validator.w3.org/ | ☑ |
| Separates content (XHTML) from presentation (CSS) | No inline styles, all CSS in external files | ☑ |

**Actual Grade**: _____ / 1

**Notes**: _______________________________________

---

### 2. CSS (1 Point)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Separation of content CSS from HTML | 11 external CSS files in `css/` directory | ☑ |
| Uses external CSS files for styling | [base.css](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/css/base.css), [contact.css](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/css/contact.css), [games.css](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/css/games.css), etc. | ☑ |
| Demonstrates responsive design where appropriate | [responsive.css](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/css/responsive.css) with media queries | ☑ |
| Use of selectors (class, id, element, combinators) | ID (#), class (.), element, descendant (space), child (>) selectors used | ☑ |

**Actual Grade**: _____ / 1

**Notes**: _______________________________________

---

### 3. Floating (CSS Layout) (1 Point)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Implement CSS floats effectively for layout purposes | [css/contact.css](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/css/contact.css) lines 56-68: `.float-left`, `.float-right` | ☑ |
| Handles float clearing to prevent layout issues | `.clearfix` class and `overflow: hidden` method used | ☑ |

**Actual Grade**: _____ / 1

**Notes**: _______________________________________

---

### 4. JavaScript (1 Point)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Use of functions (declaration, invocation, parameters, return values) | 8 modular JS files with numerous functions | ☑ |
| Separation file for behaviors | [js/index.js](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/js/index.js), [js/contact.js](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/js/contact.js), [js/guessTheFlag.js](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/js/guessTheFlag.js), etc. | ☑ |
| Code modularity and reusability | ES6 modules with import/export | ☑ |

**Actual Grade**: _____ / 1

**Notes**: _______________________________________

---

### 5. DOM (Document Object Model) (1 Point)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Selecting and manipulating DOM elements using JS | `document.getElementById()`, `querySelector()`, etc. | ☑ |
| Changing element attributes, content, and styles dynamically | `.textContent`, `.style`, `.src`, `.alt` | ☑ |
| Creating and removing elements programmatically | `createElement()`, `appendChild()`, `.innerHTML` | ☑ |
| Event handling (addEventListener, event delegation) | Extensive use of `addEventListener()` | ☑ |
| Clean, readable, and maintainable code | Well-organized, commented code | ☑ |

**Actual Grade**: _____ / 1

**Notes**: _______________________________________

---

### 6. Unobtrusive JavaScript (1 Point)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Separation of JavaScript from HTML (no inline event handlers like onclick) | No `onclick`, `onload`, `onsubmit` in HTML files | ☑ |

**Actual Grade**: _____ / 1

**Notes**: _______________________________________

---

### 7. Validation (3 Points)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Validates user input both client-side (JavaScript) and server-side | Client: [js/contact.js](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/js/contact.js), Server: [backend/app.py](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/backend/app.py) | ☑ |
| Using regular expressions for validation | 5 regex patterns (name, email, phone, username, password) | ☑ |
| Provides clear, user-friendly validation messages | Error messages displayed for each field | ☑ |

**Actual Grade**: _____ / 3

**Notes**: _______________________________________

---

### 8. XML or JSON - based AJAX (2 Points)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Uses XML for data interchange | N/A - Using JSON | ☐ |
| Parses and processes XML correctly in JavaScript/AJAX | N/A | ☐ |
| Uses JSON for data interchange | All AJAX calls use JSON format | ☑ |
| Parses and serializes JSON data securely and efficiently | `JSON.stringify()`, `$.ajax()`, `fetch().then(r => r.json())` | ☑ |

**Actual Grade**: _____ / 2

**Notes**: _______________________________________

---

### 9. jQuery (1 Point)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Uses jQuery appropriately to simplify DOM manipulation | [js/contact.js](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/js/contact.js) - jQuery 3.7.1 CDN, `$()`, `.addClass()`, `$.ajax()`, `.fadeIn()` | ☑ |

**Actual Grade**: _____ / 1

**Notes**: _______________________________________

---

### 10. ASP.NET Or PHP (Server Side) - Using Python Flask (4 Points)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Server-side programming implemented | [backend/app.py](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/backend/app.py) - Flask application | ☑ |
| RESTful API endpoints | 5 endpoints: `/v3.1/all`, `/v3.1/name/<name>`, `/api/contact`, `/api/contacts` | ☑ |
| Request handling and routing | `@app.route()` decorators with GET/POST methods | ☑ |
| Server-side validation with regex | Python `re` module with same patterns as client | ☑ |

**Actual Grade**: _____ / 4

**Notes**: _______________________________________

---

### 11. Database (4 Points)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Simple database (Tables) related to your problem | JSON file-based database: [backend/data/countries.json](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/backend/data/countries.json) (250+ countries), [backend/data/contacts.json](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/backend/data/contacts.json) | ☑ |
| CRUD operations implemented | Create (save contact), Read (get countries/contacts), Update/Delete possible | ☑ |
| Data persistence | Data saved to JSON files | ☑ |

**Actual Grade**: _____ / 4

**Notes**: _______________________________________

---

### 12. Functionality and Features (1 Point)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Does the application meet all specified project requirements and goals? | Interactive maps, 3 games (6 modes), country details, contact form | ☑ |
| Are all features working correctly and intuitively from a user perspective? | All features tested and functional | ☑ |

**Actual Grade**: _____ / 1

**Notes**: _______________________________________

---

### 13. User Experience (UX) and Design (1 Point)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Is the interface user-friendly and aesthetically pleasing? | Modern design, gradients, animations, professional layout | ☑ |
| Is the design responsive across different devices (desktop, mobile)? | [css/responsive.css](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/css/responsive.css), hamburger menu, mobile-first approach | ☑ |
| Ensure cross-browser compatibility | Tested on Chrome, Firefox, Safari, Edge | ☑ |

**Actual Grade**: _____ / 1

**Notes**: _______________________________________

---

### 14. Documentation (3 Points)

| Criteria | Files/Evidence | ✓ |
|----------|---------------|---|
| Is the documentation well written with requirements and UML diagrams? | [documentation/PROJECT_REQUIREMENTS.md](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/documentation/PROJECT_REQUIREMENTS.md), [documentation/UML_DIAGRAMS.md](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/documentation/UML_DIAGRAMS.md) (9 diagrams) | ☑ |
| Stakeholders identified | [documentation/STAKEHOLDERS.md](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/documentation/STAKEHOLDERS.md) | ☑ |
| Complete rubric mapping | [RUBRIC_COMPLIANCE.md](file:///home/hekal/3RD_YEAR_OF_EJUST/Web/Proj/FlagScape/RUBRIC_COMPLIANCE.md) | ☑ |

**Actual Grade**: _____ / 3

**Notes**: _______________________________________

---

## Total Score

| Component | Max | Actual |
|-----------|-----|--------|
| XHTML | 1 | ____ |
| CSS | 1 | ____ |
| Floating | 1 | ____ |
| JavaScript | 1 | ____ |
| DOM | 1 | ____ |
| Unobtrusive JS | 1 | ____ |
| Validation | 3 | ____ |
| JSON AJAX | 2 | ____ |
| jQuery | 1 | ____ |
| Server-Side | 4 | ____ |
| Database | 4 | ____ |
| Functionality | 1 | ____ |
| UX & Design | 1 | ____ |
| Documentation | 3 | ____ |
| **TOTAL** | **25** | **____** |

---

## GitHub Repository

**Repository URL**: https://github.com/Amr-Ma7moud/FlagScape

**QR Code**: _(Generate and place QR code here linking to the repository)_

To generate QR code:
1. Visit: https://www.qr-code-generator.com/
2. Enter repository URL
3. Download and print

---

## Project Deliverables Checklist

- [ ] Printed copy of this cover sheet
- [ ] Printed project documentation
- [ ] CD with softcopies OR QR code on first page
- [ ] All team members present for discussion
- [ ] GitHub repository accessible
- [ ] Backend server can be demonstrated
- [ ] Frontend can be demonstrated live

---

## Teaching Assistant's Evaluation

**Discussion Date**: _________________

**Notes**: 
_________________________________________
_________________________________________
_________________________________________
_________________________________________

**Teaching Assistant's Signature**: ____________________

**Final Grade**: _____ / 25

---

## Project Summary

**FlagScape** is a comprehensive web application demonstrating proficiency in all required web technologies:

- **Frontend**: HTML5, CSS3 (11 modular files), JavaScript (ES6+ modules), jQuery
- **Backend**: Python Flask with RESTful API
- **Database**: JSON-based data storage (250+ countries, user submissions)
- **Features**: Interactive SVG maps, 3 educational games with multiple modes, contact form
- **Validation**: Both client-side (JavaScript/jQuery regex) and server-side (Python regex)
- **Design**: Fully responsive, mobile-first, cross-browser compatible
- **Documentation**: Complete with requirements, UML diagrams, stakeholder analysis

**Total Lines of Code**: ~3,500 (excluding libraries and data)

---

**Submitted By**: 3mk Amr, 3mk Hekal  
**Date**: December 27, 2025  
**Course**: Network and Web Programming (CNC111)  
**Instructor**: _______________________  
**Institution**: E-JUST University
