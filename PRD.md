# FluentAI Product Requirements Document

## 1. Introduction

This Product Requirements Document (PRD) outlines the comprehensive specifications for FluentAI, an assistive application designed to help children with stuttering disorders. The document serves as a definitive reference for all stakeholders involved in the development, testing, and deployment of the application. It details the functional and technical requirements, user stories, acceptance criteria, and design considerations necessary to create an effective solution that meets the needs of its target users.

The PRD aims to provide clear direction to the development team while ensuring alignment with the product vision and user needs. It will be updated as necessary throughout the development lifecycle to reflect changes in requirements or priorities.

## 2. Product Overview

FluentAI is a specialized speech therapy application that utilizes Delayed Auditory Feedback (DAF) technology to assist children with stuttering disorders. The application provides real-time feedback during speech exercises and offers customized practice plans based on performance data analysis.

The application consists of two primary interfaces:

-   A DAF interface that provides real-time speech assistance through audio processing and immediate feedback
-   An exercise interface that offers personalized practice plans and structured activities based on the user's speech patterns and progress

FluentAI aims to serve as a supplementary tool to traditional speech therapy, providing children with the opportunity to practice consistently and receive immediate feedback in a supportive, engaging environment.

## 3. Goals and Objectives

### 3.1 Primary Goals

-   Reduce the frequency and severity of stuttering in children through consistent practice with DAF technology
-   Provide accessible speech therapy tools that can be used outside of formal therapy sessions
-   Create an engaging, child-friendly experience that encourages regular practice
-   Collect and analyze speech data to create personalized improvement plans

### 3.2 Success Metrics

-   Reduction in stuttering frequency by at least 20% after three months of regular use
-   User retention rate of at least 70% after one month
-   Completion of at least 5 exercise sessions per week per active user
-   Positive user satisfaction ratings (4+ out of 5 stars) from both children and parents/guardians
-   Demonstrable improvement in speaking confidence as reported by users and caregivers

### 3.3 Release Objectives

-   **MVP release** to include core DAF functionality and basic exercise options
-   **Beta release** to include expanded exercise library and initial analytics capabilities
-   **Full release** to include comprehensive analytics, personalized practice plans, and enhanced user experience

## 4. Target Audience

### 4.1 Primary Users

-   Children aged 6-14 with diagnosed stuttering disorders
-   Speech-language pathologists who work with children who stutter
-   Parents and caregivers of children with stuttering disorders

### 4.2 User Characteristics

**Children:**

-   May have varying levels of stuttering severity
-   Could have different types of stuttering (blocks, repetitions, prolongations)
-   Varying levels of digital literacy depending on age
-   May have shorter attention spans requiring engaging interfaces
-   Potential co-occurring conditions like anxiety or ADHD

**Speech-language pathologists:**

-   Professional interest in progress tracking and analytical tools
-   Need to assign specific exercises and monitor patient progress
-   Require evidence-based approaches and measurable outcomes

**Parents/caregivers:**

-   Varying levels of technical proficiency
-   Need for simple, intuitive interfaces
-   Interest in tracking child's progress
-   May need to assist younger children with using the application

### 4.3 User Needs

**Children need:**

-   Engaging, non-intimidating interfaces
-   Clear, immediate feedback on performance
-   Positive reinforcement and encouragement
-   Age-appropriate content and interactions

**Speech-language pathologists need:**

-   Detailed analytics on patient performance
-   Ability to customize exercises and practice plans
-   Integration with existing therapy approaches
-   Evidence-based methodology

**Parents/caregivers need:**

-   Easy-to-understand progress reports
-   Guidance on how to support practice sessions
-   Clear indications of improvement over time
-   Simple setup and operation

## 5. Features and Requirements

### 5.1 DAF Interface

#### 5.1.1 Audio Control

-   Prominent start/stop listening buttons positioned centrally in the interface
-   Visual indicators showing when recording is active
-   DAF modal that activates only when listening is initiated
-   Volume controls for DAF playback
-   Ability to adjust DAF delay settings (advanced option, potentially gated for therapist access)

#### 5.1.2 Real-time Visualization

-   Waveform visualization that responds dynamically to the speaker's voice
-   Real-time speech-to-text display with clear typography
-   Highlighted words where stuttering is detected
-   Visual differentiation between different types of stuttering (blocks, repetitions, prolongations)
-   Timeline view showing speech patterns over the duration of the session

#### 5.1.3 Performance Feedback

-   Speaking score displayed as either a circular progress indicator or horizontal bar
-   Real-time score updates during active listening
-   Final score calculation when listening is stopped
-   Qualitative feedback messages based on performance tiers
-   Option to save and review past performance

### 5.2 Exercise Interface

#### 5.2.1 Speech Analytics

Dashboard displaying key metrics:

-   Recently stuttered words (last 3-5 sessions)
-   Stuttering frequency with time-based analysis (per minute/10 minutes)
-   Current speaking score and historical trend
-   Most frequently stuttered words with occurrence counts
-   Progress charts showing improvement over time
-   Ability to filter statistics by time period (daily, weekly, monthly)
-   Export functionality for sharing data with speech therapists

#### 5.2.2 Personalized Practice Plans

-   AI-generated practice recommendations based on speech pattern analysis
-   Daily practice duration recommendations (typically 10-30 minutes)
-   Specific time allocations for different exercise types
-   Adjustable difficulty levels based on progress
-   Weekly goals and milestones
-   Calendar view for scheduling practice sessions

#### 5.2.3 Exercise Library

Categorized exercises targeting different aspects of fluent speech:

-   Breathing exercises
-   Slow speech practice
-   Rhythm-based activities
-   Reading exercises with increasing complexity
-   Conversation simulation exercises
-   Visual progress indicators for each exercise type
-   Favorites or bookmarking functionality for preferred exercises
-   Unlockable content based on progress to maintain engagement
-   Option for therapists to assign specific exercises

### 5.3 Application Structure

-   Two-page website design with intuitive navigation between interfaces
-   Persistent navigation bar/menu
-   User profile and settings accessible from both interfaces
-   Responsive design for different device types
-   Help and tutorial sections accessible from anywhere in the application

### 5.4 Technical Requirements

-   Audio processing with latency under 50ms for effective DAF
-   Configurable DAF delay settings (typically 50-200ms)
-   Speech recognition accuracy of at least 90% for clear speech
-   Stuttering detection algorithm with at least 85% accuracy
-   Secure data storage compliant with healthcare privacy standards
-   Analytics engine capable of processing speech patterns to generate meaningful insights
-   Cloud synchronization for accessing data across devices

### 5.5 User Experience

-   Child-friendly interface with age-appropriate visual design
-   Accessibility features for users with additional needs
-   Positive reinforcement mechanisms (achievements, rewards, encouraging messages)
-   Clear visual progress indicators
-   Gamification elements to maintain engagement
-   Parent/therapist controls for application settings

## 6. User Stories and Acceptance Criteria

### 6.1 DAF Interface User Stories

#### ST-101: Starting a DAF session

**As a child with a stuttering disorder,**  
**I want to easily start a speech practice session,**  
**So that I can begin using the DAF feature to help improve my fluency.**

**Acceptance criteria:**

-   A prominent "Start Listening" button is displayed on the DAF interface
-   When pressed, the button state changes to indicate active listening
-   The DAF modal/window appears and begins processing audio
-   A visual indicator confirms that the microphone is active
-   Audio capture begins immediately with no perceptible delay

#### ST-102: Stopping a DAF session

**As a child with a stuttering disorder,**  
**I want to stop my practice session when I'm finished,**  
**So that I can see my final score and feedback.**

**Acceptance criteria:**

-   A prominent "Stop Listening" button is displayed during active sessions
-   When pressed, audio capture ceases immediately
-   The final speaking score is calculated and displayed
-   A qualitative feedback message appears based on the score
-   The session results are saved to the user's history
-   The DAF modal/window closes or changes state to indicate session end

#### ST-103: Viewing real-time speech visualization

**As a child with a stuttering disorder,**  
**I want to see a visual representation of my speech as I talk,**  
**So that I can better understand my speech patterns.**

**Acceptance criteria:**

-   A waveform visualizer displays in real-time as the user speaks
-   The waveform accurately represents volume and speech patterns
-   The visualization has sufficient contrast and is visually engaging
-   The waveform scrolls horizontally as speech continues
-   The visualization performs smoothly without lagging or glitching

#### ST-104: Viewing real-time speech-to-text

**As a child with a stuttering disorder,**  
**I want to see the words I'm saying displayed as text,**  
**So that I can identify when and where I stutter.**

**Acceptance criteria:**

-   Speech is converted to text with no more than 1-second delay
-   Text appears in a clear, readable font
-   Words are displayed sequentially as they are spoken
-   The text area automatically scrolls to show the most recent words
-   Accuracy of speech-to-text is at least 90% for clear speech
-   Words with stuttering are visually highlighted

#### ST-105: Monitoring speaking score

**As a child with a stuttering disorder,**  
**I want to see my speaking score update as I practice,**  
**So that I can get immediate feedback on my fluency.**

**Acceptance criteria:**

-   A speaking score is displayed using either a circular or bar indicator
-   The score updates in real-time during active listening
-   The visual design is intuitive (e.g., filling up as score improves)
-   Color coding indicates performance levels (red, yellow, green)
-   The score calculation considers stuttering frequency, duration, and type
-   When listening stops, the final score is prominently displayed

#### ST-106: Receiving qualitative feedback

**As a child with a stuttering disorder,**  
**I want to receive encouraging feedback after my practice session,**  
**So that I feel motivated to continue practicing.**

**Acceptance criteria:**

-   After stopping a session, a qualitative feedback message appears
-   Feedback is tailored to the performance level achieved
-   Messages are always encouraging, even for lower scores
-   Feedback highlights specific strengths or improvements
-   The message uses age-appropriate, positive language
-   Feedback suggests specific areas to focus on in future sessions

### 6.2 Exercise Interface User Stories

#### ST-201: Viewing speech analytics

**As a child with a stuttering disorder (or parent/therapist),**  
**I want to see statistics about my stuttering patterns,**  
**So that I can understand my progress and areas needing improvement.**

**Acceptance criteria:**

-   Dashboard displays key metrics in an easy-to-understand format
-   Recently stuttered words are listed with frequency counts
-   Stuttering frequency is shown as a rate (e.g., per 10 minutes)
-   Current speaking score is displayed prominently
-   Most frequently stuttered words are highlighted
-   Visualizations use child-friendly graphics
-   Data can be filtered by different time periods
-   Progress over time is shown through trend charts

#### ST-202: Receiving personalized practice plans

**As a child with a stuttering disorder,**  
**I want to receive a customized practice plan,**  
**So that I know what exercises will help me improve most effectively.**

**Acceptance criteria:**

-   A personalized practice plan is generated based on speech analytics
-   Plan includes recommended daily practice duration
-   Specific time allocations for different exercise types are provided
-   Recommendations update based on recent performance
-   Plan is displayed in a visual, easy-to-understand format
-   Progress toward completing the plan is tracked
-   Plan difficulty adjusts automatically based on improvement

#### ST-203: Accessing exercise library

**As a child with a stuttering disorder,**  
**I want to access different types of speech exercises,**  
**So that I can practice various techniques to improve my fluency.**

**Acceptance criteria:**

-   Exercise library is organized into clear categories
-   Exercises are presented with engaging, age-appropriate visuals
-   Each exercise has clear instructions and demonstration options
-   Difficulty levels are indicated for each exercise
-   Related exercises are grouped logically
-   Favorite or frequently used exercises can be bookmarked
-   New exercises are highlighted or recommended based on the practice plan

#### ST-204: Completing a specific exercise

**As a child with a stuttering disorder,**  
**I want to complete a specific exercise from the library,**  
**So that I can practice a particular fluency technique.**

**Acceptance criteria:**

-   Exercise can be selected and launched with a single tap/click
-   Clear instructions are provided before beginning
-   Progress is tracked during the exercise
-   Feedback is provided during and after completion
-   Results are saved and contribute to overall analytics
-   Exercise difficulty adapts based on performance
-   Option to repeat or try a similar exercise is offered upon completion

#### ST-205: Tracking progress over time

**As a child with a stuttering disorder (or parent/therapist),**  
**I want to see how my speech has improved over time,**  
**So that I can stay motivated and understand the benefits of practice.**

**Acceptance criteria:**

-   Progress charts show performance trends over days, weeks, and months
-   Key metrics (stuttering frequency, speaking score) are tracked longitudinally
-   Milestones and achievements are highlighted
-   Progress visualization is engaging and motivational
-   Specific improvements are called out (e.g., "Your 'th' sounds have improved 30%")
-   Data can be exported or shared with speech therapists

### 6.3 General and System User Stories

#### ST-301: Navigating between interfaces

**As a user of FluentAI,**  
**I want to easily switch between the DAF and Exercise interfaces,**  
**So that I can access all features of the application without confusion.**

**Acceptance criteria:**

-   Clear navigation controls are present on both interfaces
-   Switching between interfaces requires only one action (tap/click)
-   Current interface is visually indicated in the navigation
-   Transitions between interfaces are smooth and animated
-   Navigation persists in a consistent location across the application
-   Navigation controls are accessible and meet WCAG standards

#### ST-302: User authentication and profile management

**As a user of FluentAI,**  
**I want to securely log in and manage my profile,**  
**So that my data is protected and personalized to my needs.**

**Acceptance criteria:**

-   Secure login process with age-appropriate options
-   Parent/guardian authentication for younger users
-   Profile creation with basic information collection
-   Option to set preferences (e.g., visual theme, audio settings)
-   Ability to log out from any screen in the application
-   Password reset functionality with appropriate security measures
-   Multi-profile support for families with multiple users
-   Data privacy controls compliant with COPPA and other relevant regulations

#### ST-303: Data synchronization and storage

**As a user of FluentAI,**  
**I want to have my data securely stored and synchronized across devices,**  
**So that I can access my profile and progress from anywhere.**

**Acceptance criteria:**

-   User data is securely stored in compliance with healthcare privacy standards
-   Data synchronizes automatically when connected to the internet
-   Offline mode allows basic functionality without internet connection
-   Data conflicts are resolved with appropriate priority rules
-   Backup and restore functionality is available
-   Data retention policies are clearly communicated
-   Option to export or delete personal data

#### ST-304: Database modeling and management

**As a system administrator,**  
**I want to ensure the database is properly structured and optimized,**  
**So that the application performs efficiently and data is organized logically.**

**Acceptance criteria:**

-   Database schema supports all required data types and relationships
-   User profiles, session data, and analytics are properly linked
-   Performance is optimized for quick retrieval of frequently accessed data
-   Data integrity constraints prevent corruption or inconsistent states
-   Scalability considerations for growing user base and data volume
-   Appropriate indexing for performance optimization
-   Backup and recovery procedures are established
-   Database meets security requirements for sensitive health data

## 7. Technical Requirements / Stack

### 7.1 Frontend Technology

-   **Framework:** React.js for component-based UI development
-   **State Management:** Redux for application state management
-   **Styling:** CSS with Styled Components or Tailwind CSS, AntDesign
-   **Animation:** Framer Motion for smooth transitions and animations
-   **Responsive Design:** Mobile-first approach with media queries

### 7.2 Backend Technology

-   **Server:** Node.js with Express.js framework
-   **API:** RESTful API design with appropriate endpoints
-   **Database:** MongoDB for flexible schema design or PostgreSQL for relational data
-   **Authentication:** JWT-based authentication with role-based access control
-   **Cloud Services:** Local machine or Google Cloud Platform for scalable infrastructure (This is only a demo app, therefore no need to be too complicated)
-   **Caching:** Redis for performance optimization

### 7.3 Audio Processing

-   Web Audio API for client-side audio processing
-   WebRTC for audio capture
-   Custom DAF implementation with configurable delay parameters
-   Speech recognition integration (Google Speech-to-Text or similar)
-   Audio filtering for noise reduction
-   Stuttering detection algorithm (custom or third-party integration)

### 7.4 Analytics and Machine Learning

-   Data processing pipeline for speech pattern analysis
-   Machine learning models for stuttering detection (TensorFlow.js)
-   Recommendation engine for personalized practice plans
-   Progress prediction algorithms
-   Performance metrics calculation and storage

## 8. Design and User Interface

### 8.1 Design Principles

-   Child-friendly aesthetics with appropriate color schemes
-   Clear visual hierarchy prioritizing important elements
-   Consistent design language across all interfaces
-   Simplified UI with minimal cognitive load
-   Large, easily tappable buttons for motor skills development
-   Engaging but not overstimulating visuals
-   Accessibility considerations for diverse users

### 8.2 DAF Interface Design

-   Clean, focused layout with minimal distractions
-   Prominent audio control buttons with clear states
-   Waveform visualizer with appropriate scale and responsiveness
-   Speech-to-text display with high readability
-   Speaking score indicator with intuitive visual design
-   Performance feedback area with encouraging visuals
-   Modal design that focuses attention during active sessions

### 8.3 Exercise Interface Design

-   Dashboard layout with card-based components
-   Data visualizations using child-appropriate charts and graphs
-   Practice plan presented in calendar or timeline format
-   Exercise library with engaging thumbnail images
-   Progress indicators using familiar concepts (filling containers, growing plants)
-   Achievement system with badges or similar rewards
-   Customizable elements to provide sense of ownership

### 8.4 Navigation and Information Architecture

-   Simple two-tab main navigation
-   Hierarchical information organization
-   Breadcrumb navigation for deeper content areas
-   Search functionality for exercise library
-   Help and settings accessible from persistent menu
-   Logical grouping of related functions
-   Clear labeling of all interactive elements

### 8.5 Responsive Design

-   Mobile-first approach ensuring usability on tablets and smartphones
-   Adaptive layouts for different screen sizes
-   Touch-optimized interaction patterns
-   Alternative interfaces for very small screens
-   Consideration for different device capabilities
-   Offline mode for limited connectivity situations

### 8.6 Accessibility Requirements

-   High color contrast for readability
-   Support for screen readers
-   Keyboard navigation support
-   Adjustable text sizes
-   Reduced motion option for animations
-   Multiple feedback mechanisms (visual, audio)
-   Compliance with WCAG 2.1 AA standards
