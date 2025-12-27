# FlagScape UML Diagrams

This document contains comprehensive UML diagrams for the FlagScape project, demonstrating the system design and architecture.

---

## 1. Use Case Diagram

The use case diagram shows the interactions between users and the FlagScape system.

```mermaid
graph TB
    User((Student/<br/>End User))
    
    subgraph FlagScape_System["FlagScape System"]
        UC1[Browse World Map]
        UC2[Browse Continent Map]
        UC3[View Country Details]
        UC4[Play Guess The Flag]
        UC5[Play Capital Challenge]
        UC6[Play Speed Quiz]
        UC7[Submit Contact Form]
        UC8[Search Country]
        UC9[Select Game Mode]
    end
    
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    
    UC1 --> UC3
    UC2 --> UC3
    UC4 --> UC9
    
    style User fill:#3498db,stroke:#2980b9,color:#fff
    style FlagScape_System fill:#ecf0f1,stroke:#95a5a6
```

### Use Case Descriptions

**UC1: Browse World Map**
- **Actor**: Student/End User
- **Description**: User views interactive world map and can click on countries
- **Precondition**: Application loaded
- **Postcondition**: Map displayed with clickable countries

**UC2: Browse Continent Map**
- **Actor**: Student/End User
- **Description**: User selects a specific continent to view
- **Precondition**: Navigation menu accessible
- **Postcondition**: Continent-specific map displayed

**UC3: View Country Details**
- **Actor**: Student/End User
- **Description**: User clicks on a country to see detailed information
- **Precondition**: Map loaded, country clickable
- **Postcondition**: Modal or details page shows country information

**UC4: Play Guess The Flag**
- **Actor**: Student/End User
- **Description**: User plays flag identification game
- **Precondition**: Game page loaded
- **Postcondition**: User sees final score and results

**UC5: Play Capital Challenge**
- **Actor**: Student/End User
- **Description**: User matches capitals to countries
- **Precondition**: Game page loaded
- **Postcondition**: User completes quiz and sees results

**UC6: Play Speed Quiz**
- **Actor**: Student/End User
- **Description**: User answers mixed geography questions rapidly
- **Precondition**: Game page loaded
- **Postcondition**: User sees performance statistics

**UC7: Submit Contact Form**
- **Actor**: Student/End User
- **Description**: User fills out and submits contact information
- **Precondition**: Contact page loaded
- **Postcondition**: Form validated and submitted, confirmation displayed

**UC8: Search Country**
- **Actor**: Student/End User
- **Description**: User searches for specific country information
- **Precondition**: Search functionality available
- **Postcondition**: Matching countries displayed

**UC9: Select Game Mode**
- **Actor**: Student/End User
- **Description**: User chooses difficulty/type of game
- **Precondition**: Game loaded
- **Postcondition**: Selected mode starts

---

## 2. Class Diagram

The class diagram represents the JavaScript module structure and data models.

```mermaid
classDiagram
    class CountryData {
        +String name
        +String capital
        +String flag
        +String region
        +Number population
        +Array languages
        +Object currencies
        +getCommonName()
        +getOfficialName()
    }
    
    class MapController {
        -Element mapContainer
        -Array countries
        +loadMap(mapType)
        +renderCountries()
        +attachClickHandlers()
        +highlightCountry(countryCode)
    }
    
    class CountryModal {
        -Element modalElement
        -CountryData currentCountry
        +open(countryName)
        +close()
        +loadCountryData(name)
        +render()
    }
    
    class GameBase {
        <<abstract>>
        #Number score
        #Number currentQuestion
        #Array countries
        #Timer timer
        +startGame()
        +endGame()
        +updateScore(points)
        +renderQuestion()
        +checkAnswer(answer)
    }
    
    class GuessTheFlagGame {
        -String mode
        -Number streak
        -Number reserve
        +selectMode(mode)
        +setupTyping()
        +startTimer()
        +stopTimer()
        +renderQuestion()
        +checkAnswer(answer)
    }
    
    class CapitalChallengeGame {
        -Number level
        -Number timeBonus
        +calculateBonus()
        +levelUp()
        +renderQuestion()
        +checkAnswer(answer)
    }
    
    class SpeedQuizGame {
        -Number combo
        -Array questionTypes
        +generateQuestion()
        +updateCombo()
        +renderQuestion()
        +checkAnswer(answer)
    }
    
    class ValidationHandler {
        -Object patterns
        -Object errorMessages
        +validateField(fieldId, pattern)
        +validateEmail(email)
        +validatePhone(phone)
        +validatePassword(password)
        +showError(field, message)
        +clearError(field)
    }
    
    class ContactForm {
        -Element formElement
        -ValidationHandler validator
        +initialize()
        +attachEventListeners()
        +handleSubmit(event)
        +loadCountries()
        +resetForm()
        +showSuccess()
    }
    
    class APIClient {
        -String baseURL
        +fetchAllCountries(fields)
        +fetchCountryByName(name)
        +submitContact(data)
        +handleResponse(response)
        +handleError(error)
    }
    
    class Utils {
        +embedHTML(elementId, file)
        +formatNumber(num)
        +debounce(func, delay)
    }
    
    GameBase <|-- GuessTheFlagGame : extends
    GameBase <|-- CapitalChallengeGame : extends
    GameBase <|-- SpeedQuizGame : extends
    
    MapController --> CountryData : uses
    MapController --> CountryModal : creates
    CountryModal --> APIClient : uses
    CountryModal --> CountryData : displays
    
    GameBase --> APIClient : uses
    GameBase --> CountryData : uses
    
    ContactForm --> ValidationHandler : uses
    ContactForm --> APIClient : uses
    
    MapController ..> Utils : depends
    GameBase ..> Utils : depends
    ContactForm ..> Utils : depends
```

### Class Descriptions

**CountryData**: Represents a country with all its attributes (flag, name, capital, etc.)

**MapController**: Manages SVG map rendering and user interactions

**CountryModal**: Handles popup display of country information

**GameBase**: Abstract base for all game types with common functionality

**GuessTheFlagGame**: Flag identification game with multiple modes

**CapitalChallengeGame**: Capital city matching game

**SpeedQuizGame**: Rapid mixed geography questions

**ValidationHandler**: Client-side form validation using regex

**ContactForm**: Manages contact form submission with jQuery

**APIClient**: Handles all API communications to Flask backend

**Utils**: Utility functions shared across modules

---

## 3. Sequence Diagram - View Country Details

This sequence diagram shows the flow when a user clicks on a country to view its details.

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend UI
    participant MapCtrl as MapController
    participant Modal as CountryModal
    participant API as APIClient
    participant Flask as Flask Backend
    participant JSON as countries.json
    
    User->>UI: Click on country (e.g., "Egypt")
    UI->>MapCtrl: onClick event
    MapCtrl->>Modal: open("Egypt")
    Modal->>Modal: Show loading state
    Modal->>API: fetchCountryByName("Egypt")
    API->>Flask: GET /v3.1/name/Egypt?fullText=true
    Flask->>JSON: Read country data
    JSON-->>Flask: Country data
    Flask-->>API: JSON response
    API-->>Modal: CountryData object
    Modal->>Modal: render(countryData)
    Modal->>UI: Display modal with info
    UI-->>User: Shows country details
    
    Note over User,JSON: User sees flag, capital,<br/>population, etc.
```

---

## 4. Sequence Diagram - Contact Form Submission

This sequence diagram illustrates the form submission process with validation.

```mermaid
sequenceDiagram
    actor User
    participant Form as Contact Form (jQuery)
    participant Validator as ValidationHandler
    participant API as APIClient
    participant Flask as Flask Backend
    participant Storage as contacts.json
    
    User->>Form: Fill form fields
    User->>Form: Click Submit
    Form->>Validator: validateField("email", pattern)
    Validator->>Validator: Test regex pattern
    alt Invalid
        Validator-->>Form: Return error
        Form->>User: Display error message
    else Valid
        Validator-->>Form: Return success
        Form->>Validator: Validate all other fields
        Validator-->>Form: All valid
        Form->>Form: Collect form data
        Form->>API: submitContact(formData)
        API->>Flask: POST /api/contact
        Flask->>Flask: Server-side regex validation
        alt Server validation fails
            Flask-->>API: 400 Bad Request + errors
            API-->>Form: Validation errors
            Form->>User: Display server errors
        else Server validation passes
            Flask->>Storage: Save contact data
            Storage-->>Flask: Success
            Flask-->>API: 200 OK + contactId
            API-->>Form: Success response
            Form->>Form: Hide form, show success
            Form->>User: Display success message
        end
    end
```

---

## 5. Sequence Diagram - Game Flow (Guess The Flag)

This diagram shows the game initialization and question flow.

```mermaid
sequenceDiagram
    actor User
    participant UI as Game UI
    participant Game as GuessTheFlagGame
    participant API as APIClient
    participant Flask as Flask Backend
    
    User->>UI: Click "Start Game"
    UI->>Game: selectMode("hybrid")
    Game->>API: fetchAllCountries("name, flags")
    API->>Flask: GET /v3.1/all?fields=name,flags
    Flask-->>API: Country array
    API-->>Game: countries[]
    Game->>Game: Initialize state (score=0, question=1)
    Game->>Game: renderQuestion()
    Game->>Game: Pick random country + 3 decoys
    Game->>UI: Display flag + 4 options
    Game->>Game: startTimer()
    UI-->>User: Show question
    
    User->>UI: Select answer
    UI->>Game: checkAnswer(selectedCountry)
    Game->>Game: Compare with correct answer
    alt Correct Answer
        Game->>Game: updateScore(+points)
        Game->>Game: increment streak
        Game->>UI: Show "Correct!" feedback
    else Incorrect Answer
        Game->>Game: reset streak
        Game->>UI: Show "Wrong!" + correct answer
    end
    Game->>Game: stopTimer()
    
    alt More Questions
        Game->>Game: nextQuestion()
        Game->>Game: renderQuestion()
    else Game Complete
        Game->>Game: endGame()
        Game->>UI: Show final results
        UI-->>User: Display score, stats
    end
```

---

## 6. Activity Diagram - Form Validation Process

This activity diagram shows the validation workflow for the contact form.

```mermaid
graph TD
    Start([User Submits Form]) --> ValidateFirstName{First Name<br/>Valid?}
    ValidateFirstName -->|No| ShowError1[Show Error:<br/>2-50 letters only]
    ValidateFirstName -->|Yes| ValidateLastName{Last Name<br/>Valid?}
    ShowError1 --> End([Stop Submission])
    
    ValidateLastName -->|No| ShowError2[Show Error:<br/>2-50 letters only]
    ValidateLastName -->|Yes| ValidateEmail{Email Valid?<br/>Regex Pattern}
    ShowError2 --> End
    
    ValidateEmail -->|No| ShowError3[Show Error:<br/>Invalid email format]
    ValidateEmail -->|Yes| ValidatePhone{Phone Valid?<br/>Regex Pattern}
    ShowError3 --> End
    
    ValidatePhone -->|No| ShowError4[Show Error:<br/>Invalid phone]
    ValidatePhone -->|Yes| ValidatePassword{Password<br/>Strong?}
    ShowError4 --> End
    
    ValidatePassword -->|No| ShowError5[Show Error:<br/>Weak password]
    ValidatePassword -->|Yes| ValidateConfirm{Passwords<br/>Match?}
    ShowError5 --> End
    
    ValidateConfirm -->|No| ShowError6[Show Error:<br/>Passwords don't match]
    ValidateConfirm -->|Yes| ValidateTerms{Terms<br/>Agreed?}
    ShowError6 --> End
    
    ValidateTerms -->|No| ShowError7[Show Error:<br/>Must agree to terms]
    ValidateTerms -->|Yes| SendToServer[Submit via AJAX]
    ShowError7 --> End
    
    SendToServer --> ServerValidation{Server<br/>Validation?}
    ServerValidation -->|Fail| ShowServerErrors[Display Server Errors]
    ServerValidation -->|Pass| SaveData[Save to contacts.json]
    ShowServerErrors --> End
    
    SaveData --> ShowSuccess[Display Success Message]
    ShowSuccess --> Done([Submission Complete])
    
    style Start fill:#3498db,stroke:#2980b9,color:#fff
    style Done fill:#27ae60,stroke:#229954,color:#fff
    style End fill:#e74c3c,stroke:#c0392b,color:#fff
```

---

## 7. Component Diagram

The component diagram shows how different modules interact in the system.

```mermaid
graph TB
    subgraph Frontend["Frontend - Static Files"]
        HTML[HTML Pages<br/>index.html<br/>contact.html<br/>games.html]
        CSS[CSS Modules<br/>base.css<br/>contact.css<br/>games.css]
        JS[JavaScript Modules<br/>index.js<br/>contact.js<br/>games.js]
        Utils[Utility Modules<br/>utils.js<br/>validation.js]
        jQuery[jQuery 3.7.1<br/>CDN]
    end
    
    subgraph Backend["Backend - Flask Server"]
        Flask[Flask Application<br/>app.py]
        Validation[Regex Validation<br/>Server-side]
        Routes[API Routes<br/>/v3.1/all<br/>/api/contact]
    end
    
    subgraph Data["Data Layer"]
        CountriesDB[(countries.json<br/>250+ countries)]
        ContactsDB[(contacts.json<br/>Form submissions)]
    end
    
    HTML --> JS
    CSS --> HTML
    JS --> jQuery
    JS --> Utils
    
    JS -->|AJAX/Fetch| Routes
    Routes --> Flask
    Flask --> Validation
    Flask --> CountriesDB
    Flask --> ContactsDB
    
    style Frontend fill:#ecf0f1,stroke:#95a5a6
    style Backend fill:#d5e8d4,stroke:#82b366
    style Data fill:#fff2cc,stroke:#d6b656
```

---

## 8. Deployment Diagram

Shows how the application is deployed and accessed.

```mermaid
graph TB
    subgraph Client["Client Device (Browser)"]
        Browser[Web Browser<br/>Chrome/Firefox/Safari]
    end
    
    subgraph DevMachine["Developer Machine (localhost)"]
        FrontendServer[Frontend Server<br/>Python HTTP Server<br/>Port 8000]
        BackendServer[Flask Server<br/>Port 5000]
        FileSystem[File System<br/>Static Files + JSON]
    end
    
    subgraph GitHub["GitHub (Production)"]
        Repo[GitHub Repository]
        Pages[GitHub Pages<br/>Static Hosting]
    end
    
    Browser -->|HTTP GET| FrontendServer
    Browser -->|API Calls| BackendServer
    FrontendServer --> FileSystem
    BackendServer --> FileSystem
    
    FileSystem -.Push.-> Repo
    Repo -.Deploy.-> Pages
    Browser -.Production.-> Pages
    
    style Client fill:#3498db,stroke:#2980b9,color:#fff
    style DevMachine fill:#ecf0f1,stroke:#95a5a6
    style GitHub fill:#2ecc71,stroke:#27ae60,color:#fff
```

---

## 9. State Diagram - Game State Machine

Shows the different states in a game session.

```mermaid
stateDiagram-v2
    [*] --> ModeSelection: Load Game Page
    ModeSelection --> GameInitializing: Select Mode
    GameInitializing --> QuestionDisplay: Load Countries
    QuestionDisplay --> WaitingForAnswer: Display Question
    WaitingForAnswer --> CheckingAnswer: User Selects Answer
    WaitingForAnswer --> TimeExpired: Timer Runs Out
    CheckingAnswer --> ShowingCorrect: Answer Correct
    CheckingAnswer --> ShowingIncorrect: Answer Incorrect
    TimeExpired --> ShowingIncorrect: No Answer
    ShowingCorrect --> NextQuestion: More Questions
    ShowingIncorrect --> NextQuestion: More Questions
    NextQuestion --> QuestionDisplay: Continue
    ShowingCorrect --> GameComplete: Last Question
    ShowingIncorrect --> GameComplete: Last Question
    GameComplete --> ShowingResults: Calculate Score
    ShowingResults --> ModeSelection: Change Mode
    ShowingResults --> GameInitializing: Play Again
    ShowingResults --> [*]: Exit
```

---

**Document Version**: 1.0  
**Date**: December 27, 2025  
**Authors**: 3mk Amr, 3mk Hekal  
**Course**: Network and Web Programming (CNC111)  
**Institution**: E-JUST University  

**Note**: All diagrams use Mermaid syntax for rendering in Markdown viewers that support it.
