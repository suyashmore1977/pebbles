# Requirements Document: Pebbles Voice-Based AI Form Assistant

## Introduction

Pebbles is a voice-powered AI assistant designed to democratize digital form filling for users across India and beyond. By enabling natural speech-based interaction, Pebbles eliminates barriers faced by users with disabilities, low digital literacy, language constraints, or those who simply prefer voice input over typing. Built for the AI for Bharat hackathon, this system leverages Google Gemini 2.0 Flash for intelligent natural language processing and field extraction, making form completion accessible, inclusive, and efficient.

The system supports multiple form types including job applications, event registrations, medical appointments, and feedback forms. Users speak naturally, and Pebbles intelligently extracts information to fill form fields automatically, providing real-time visual feedback and conversational guidance throughout the process.

## Glossary

- **Pebbles**: The voice-based AI assistant system that helps users fill forms through natural speech
- **Voice_Recognition_Engine**: The Web Speech API component that converts spoken audio to text transcripts
- **Gemini_AI_Service**: Google Gemini 2.0 Flash model used for natural language understanding and field extraction
- **Form_Field**: An individual input element in a form (text, email, phone, date, textarea, etc.)
- **Transcript**: The text representation of user's spoken input captured by the Voice_Recognition_Engine
- **Field_Extraction**: The process of identifying and mapping spoken information to specific Form_Fields
- **Conversation_State**: The current phase of interaction (IDLE, INTRO, LISTENING, PROCESSING, DONE)
- **Audio_Visualizer**: Real-time waveform display showing audio input during recording
- **Fallback_Extractor**: Regex-based extraction system used when Gemini_AI_Service fails or is unavailable
- **Missing_Fields**: Form_Fields that have not been filled after processing a Transcript
- **API_Key_Rotation**: System for switching between multiple API keys to handle rate limiting
- **Speech_Synthesis**: Text-to-speech system that enables Pebbles to speak responses to users
- **Progress_Tracker**: Visual indicator showing how many Form_Fields have been completed
- **Multi_Form_Support**: Capability to handle different form types with varying field structures

## Requirements

### Requirement 1: Voice Input Capture

**User Story:** As a user, I want to speak my information naturally into the system, so that I can provide form data without typing.

#### Acceptance Criteria

1. WHEN a user grants microphone permission, THE Voice_Recognition_Engine SHALL initialize and prepare for audio capture
2. WHEN a user taps the microphone button, THE Voice_Recognition_Engine SHALL start recording audio and display visual feedback
3. WHILE recording is active, THE Audio_Visualizer SHALL display real-time waveform visualization of the audio input
4. WHEN the user stops speaking for 2.5 seconds, THE Voice_Recognition_Engine SHALL automatically stop recording and process the Transcript
5. WHEN a user taps the microphone button during recording, THE Voice_Recognition_Engine SHALL stop recording immediately and process the captured Transcript
6. WHEN audio is captured, THE Voice_Recognition_Engine SHALL convert speech to text and generate a Transcript
7. IF microphone permission is denied, THEN THE Pebbles SHALL display an error message indicating microphone access is required
8. IF no speech is detected during recording, THEN THE Pebbles SHALL notify the user and return to IDLE state

### Requirement 2: AI-Powered Field Extraction

**User Story:** As a user, I want the AI to understand my natural speech and automatically fill the correct form fields, so that I don't have to specify which field each piece of information belongs to.

#### Acceptance Criteria

1. WHEN a Transcript is received, THE Gemini_AI_Service SHALL analyze the text and extract all relevant information
2. WHEN extracting information, THE Gemini_AI_Service SHALL map extracted data to the appropriate Form_Fields based on field labels and types
3. WHEN multiple pieces of information are present in a single Transcript, THE Gemini_AI_Service SHALL extract all applicable values
4. WHEN a name is mentioned, THE Gemini_AI_Service SHALL extract full names and map to name-related Form_Fields
5. WHEN an email address is mentioned, THE Gemini_AI_Service SHALL extract the email and map to email Form_Fields
6. WHEN a phone number is mentioned, THE Gemini_AI_Service SHALL extract the number and map to phone-related Form_Fields
7. WHEN dates are mentioned, THE Gemini_AI_Service SHALL extract and format dates appropriately for date Form_Fields
8. WHEN company or organization names are mentioned, THE Gemini_AI_Service SHALL extract and map to organization-related Form_Fields
9. WHEN URLs or LinkedIn profiles are mentioned, THE Gemini_AI_Service SHALL extract and format them for URL Form_Fields
10. WHEN descriptive text is provided, THE Gemini_AI_Service SHALL map it to textarea Form_Fields like reasons, symptoms, or comments
11. WHEN ratings or numbers are mentioned, THE Gemini_AI_Service SHALL extract numeric values for number-type Form_Fields
12. WHEN extraction is complete, THE Gemini_AI_Service SHALL return extracted values, Missing_Fields list, and completion status

### Requirement 3: Fallback Extraction System

**User Story:** As a system administrator, I want a reliable fallback extraction mechanism, so that the system continues to function even when the AI service is unavailable or rate-limited.

#### Acceptance Criteria

1. IF the Gemini_AI_Service fails or returns an error, THEN THE Fallback_Extractor SHALL process the Transcript using regex patterns
2. WHEN using fallback extraction, THE Fallback_Extractor SHALL apply pattern matching for common field types (name, email, phone, date)
3. WHEN extracting names via fallback, THE Fallback_Extractor SHALL recognize patterns like "my name is [name]" or "I am [name]"
4. WHEN extracting emails via fallback, THE Fallback_Extractor SHALL recognize email patterns including variations with "at" and "dot"
5. WHEN extracting phone numbers via fallback, THE Fallback_Extractor SHALL recognize various phone number formats with spaces, dashes, or parentheses
6. WHEN extracting companies via fallback, THE Fallback_Extractor SHALL recognize patterns like "work at [company]" or "from [company]"
7. WHEN fallback extraction completes, THE Fallback_Extractor SHALL return extracted values in the same format as Gemini_AI_Service

### Requirement 4: API Rate Limiting and Key Rotation

**User Story:** As a system administrator, I want the system to handle API rate limits gracefully, so that users experience minimal disruption during high usage periods.

#### Acceptance Criteria

1. WHEN the system initializes, THE Pebbles SHALL load multiple API keys from environment configuration
2. WHEN a rate limit error occurs (429, RESOURCE_EXHAUSTED, or quota exceeded), THE Pebbles SHALL rotate to the next available API key
3. WHEN rotating API keys, THE Pebbles SHALL reinitialize the Gemini_AI_Service with the new key
4. WHEN all API keys are exhausted, THE Pebbles SHALL fall back to the Fallback_Extractor
5. WHEN retrying after rate limiting, THE Pebbles SHALL implement exponential backoff with a maximum of 3 retry attempts
6. WHEN an API key rotation occurs, THE Pebbles SHALL log the rotation event for monitoring purposes

### Requirement 5: Conversational State Management

**User Story:** As a user, I want the AI assistant to guide me through the form filling process with natural conversation, so that I understand what information is needed and when.

#### Acceptance Criteria

1. WHEN a form is selected, THE Pebbles SHALL transition to INTRO state and greet the user
2. WHEN in INTRO state, THE Pebbles SHALL use Speech_Synthesis to introduce the form and list required Form_Fields
3. WHEN the introduction is complete, THE Pebbles SHALL transition to LISTENING state and prompt the user to speak
4. WHILE in LISTENING state, THE Pebbles SHALL display "Listening..." status and show the live Transcript
5. WHEN a Transcript is received, THE Pebbles SHALL transition to PROCESSING state while analyzing the input
6. WHEN field extraction completes with Missing_Fields, THE Pebbles SHALL ask the user for the missing information and return to LISTENING state
7. WHEN all Form_Fields are filled, THE Pebbles SHALL transition to DONE state and notify the user
8. WHEN in DONE state, THE Pebbles SHALL allow the user to reset and start over
9. IF an error occurs during any state, THEN THE Pebbles SHALL return to IDLE state and display an appropriate error message

### Requirement 6: Multi-Form Support

**User Story:** As a user, I want to choose from different types of forms, so that I can use Pebbles for various purposes like job applications, event registrations, or medical appointments.

#### Acceptance Criteria

1. WHEN the application loads, THE Pebbles SHALL display a selection of available form types
2. WHEN a user selects a form, THE Pebbles SHALL load the form structure including all Form_Fields, labels, and types
3. WHEN processing a Transcript, THE Pebbles SHALL use the active form's field structure for extraction
4. WHEN a form is active, THE Pebbles SHALL display the form title and description
5. WHEN a user closes a form, THE Pebbles SHALL reset all state and return to the form selection screen
6. THE Pebbles SHALL support at least four form types: job applications, event registrations, medical appointments, and feedback forms

### Requirement 7: Real-Time Form Filling Animation

**User Story:** As a user, I want to see the form fields being filled in real-time as the AI processes my speech, so that I can verify the information is being entered correctly.

#### Acceptance Criteria

1. WHEN field values are extracted, THE Pebbles SHALL animate the typing of each value into its corresponding Form_Field
2. WHEN animating field filling, THE Pebbles SHALL type characters at approximately 15ms per character
3. WHEN filling a field, THE Pebbles SHALL scroll the field into view smoothly
4. WHEN filling a field, THE Pebbles SHALL display a status message indicating which field is being filled
5. WHEN a field is successfully filled, THE Pebbles SHALL mark it with a visual indicator (checkmark)
6. WHEN a field is identified as missing, THE Pebbles SHALL highlight it with a distinct visual style
7. WHEN all fields are filled, THE Pebbles SHALL display a completion indicator

### Requirement 8: Progress Tracking

**User Story:** As a user, I want to see my progress through the form, so that I know how much information I still need to provide.

#### Acceptance Criteria

1. WHEN a form is active, THE Progress_Tracker SHALL display the total number of Form_Fields
2. WHEN Form_Fields are filled, THE Progress_Tracker SHALL update the count of completed fields
3. WHEN progress changes, THE Progress_Tracker SHALL display a visual progress bar showing percentage completion
4. WHEN progress updates, THE Progress_Tracker SHALL animate the progress bar smoothly
5. THE Progress_Tracker SHALL calculate completion percentage as (filled fields / total fields) × 100

### Requirement 9: Audio Visualization

**User Story:** As a user, I want to see visual feedback while I'm speaking, so that I know the system is actively listening to me.

#### Acceptance Criteria

1. WHILE recording is active, THE Audio_Visualizer SHALL display a real-time frequency-based waveform
2. WHEN audio input is detected, THE Audio_Visualizer SHALL update the waveform visualization at least 30 times per second
3. WHEN recording stops, THE Audio_Visualizer SHALL hide the waveform display
4. THE Audio_Visualizer SHALL use the Web Audio API to analyze audio frequency data
5. THE Audio_Visualizer SHALL display waveform bars with gradient colors indicating audio intensity

### Requirement 10: Speech Synthesis Responses

**User Story:** As a user, I want the AI assistant to speak to me, so that I can interact with the system hands-free and receive audio confirmation of actions.

#### Acceptance Criteria

1. WHEN Pebbles needs to communicate with the user, THE Speech_Synthesis SHALL convert text responses to speech
2. WHEN speaking, THE Speech_Synthesis SHALL use a natural-sounding voice with appropriate rate and pitch
3. WHEN multiple voices are available, THE Speech_Synthesis SHALL prefer high-quality English voices
4. WHEN speaking, THE Pebbles SHALL indicate "AI Speaking..." status to the user
5. WHEN speech synthesis completes, THE Pebbles SHALL proceed to the next conversation state
6. IF speech synthesis fails, THEN THE Pebbles SHALL continue operation without audio output
7. WHEN the user closes a form, THE Speech_Synthesis SHALL cancel any ongoing speech

### Requirement 11: Missing Field Detection and Prompting

**User Story:** As a user, I want to be notified about which fields are still empty, so that I can provide the missing information efficiently.

#### Acceptance Criteria

1. WHEN field extraction completes, THE Pebbles SHALL identify all Missing_Fields
2. WHEN Missing_Fields exist, THE Pebbles SHALL generate a natural language prompt asking for the missing information
3. WHEN prompting for Missing_Fields, THE Pebbles SHALL list up to 4 field names in the prompt
4. WHEN Missing_Fields are identified, THE Pebbles SHALL highlight them visually in the form
5. WHEN the user provides additional information, THE Pebbles SHALL merge new values with existing Form_Field values
6. WHEN merging values, THE Pebbles SHALL preserve previously filled fields and only update empty or new fields

### Requirement 12: Error Handling and Recovery

**User Story:** As a user, I want the system to handle errors gracefully and provide clear feedback, so that I can recover from issues and complete my form.

#### Acceptance Criteria

1. IF the Voice_Recognition_Engine encounters an error, THEN THE Pebbles SHALL display a descriptive error message
2. IF no speech is detected, THEN THE Pebbles SHALL notify the user and allow them to retry
3. IF the Gemini_AI_Service fails, THEN THE Pebbles SHALL automatically use the Fallback_Extractor
4. IF both extraction methods fail, THEN THE Pebbles SHALL notify the user and return to IDLE state
5. IF the browser does not support speech recognition, THEN THE Pebbles SHALL display a message recommending Chrome browser
6. WHEN an error occurs, THE Pebbles SHALL log the error details for debugging purposes
7. WHEN recovering from an error, THE Pebbles SHALL preserve any previously filled Form_Field values

### Requirement 13: Browser Compatibility

**User Story:** As a user, I want to use Pebbles on modern web browsers, so that I can access the system from my preferred device.

#### Acceptance Criteria

1. THE Pebbles SHALL support Chrome browser with full functionality
2. THE Pebbles SHALL support browsers that implement the Web Speech API
3. THE Pebbles SHALL support browsers that implement the Web Audio API
4. THE Pebbles SHALL detect browser compatibility on load
5. IF a required API is not available, THEN THE Pebbles SHALL display a compatibility warning
6. THE Pebbles SHALL provide a responsive interface that works on desktop and mobile devices

### Requirement 14: Data Privacy and Security

**User Story:** As a user, I want my spoken information to be handled securely, so that my personal data remains private.

#### Acceptance Criteria

1. WHEN processing voice input, THE Pebbles SHALL only send Transcripts to the Gemini_AI_Service, not raw audio
2. WHEN a form is closed, THE Pebbles SHALL clear all Form_Field values from memory
3. WHEN a user resets the form, THE Pebbles SHALL clear all stored Transcript data
4. THE Pebbles SHALL not persist form data to local storage or cookies
5. THE Pebbles SHALL use HTTPS for all API communications with the Gemini_AI_Service
6. THE Pebbles SHALL not log or store personally identifiable information from Transcripts

### Requirement 15: Accessibility Features

**User Story:** As a user with disabilities, I want the interface to be accessible, so that I can use Pebbles regardless of my physical abilities.

#### Acceptance Criteria

1. THE Pebbles SHALL provide voice-first interaction as the primary input method
2. THE Pebbles SHALL provide visual feedback for all audio interactions
3. THE Pebbles SHALL use sufficient color contrast for all text and UI elements
4. THE Pebbles SHALL provide clear status messages for screen reader compatibility
5. THE Pebbles SHALL support keyboard navigation for form selection
6. THE Pebbles SHALL provide large, easily tappable buttons for mobile users
7. THE Pebbles SHALL display clear error messages in both visual and audio formats

### Requirement 16: Performance and Responsiveness

**User Story:** As a user, I want the system to respond quickly to my input, so that I can complete forms efficiently without delays.

#### Acceptance Criteria

1. WHEN a user speaks, THE Voice_Recognition_Engine SHALL display interim results within 500ms
2. WHEN a Transcript is sent for processing, THE Gemini_AI_Service SHALL respond within 3 seconds under normal conditions
3. WHEN animating field filling, THE Pebbles SHALL maintain smooth 60fps animation
4. WHEN updating the Audio_Visualizer, THE Pebbles SHALL maintain at least 30fps visualization
5. WHEN switching between forms, THE Pebbles SHALL load the new form within 200ms
6. THE Pebbles SHALL handle forms with up to 20 Form_Fields without performance degradation

### Requirement 17: Multi-Language Support Foundation

**User Story:** As a developer, I want the system architecture to support future multi-language capabilities, so that Pebbles can serve users across India who speak different languages.

#### Acceptance Criteria

1. THE Voice_Recognition_Engine SHALL be configurable to support different language codes
2. THE Gemini_AI_Service SHALL accept language parameters for future localization
3. THE Pebbles SHALL store language preference configuration separately from business logic
4. THE Speech_Synthesis SHALL support voice selection based on language preference
5. WHERE multi-language support is implemented, THE Pebbles SHALL allow users to select their preferred language
6. WHERE multi-language support is implemented, THE Pebbles SHALL use the selected language for all voice interactions

### Requirement 18: System Monitoring and Health Checks

**User Story:** As a system administrator, I want to monitor the health of the system, so that I can ensure reliable service for users.

#### Acceptance Criteria

1. THE Pebbles SHALL provide a health check endpoint that returns system status
2. WHEN the health check is called, THE Pebbles SHALL return the current model name, API key count, and timestamp
3. WHEN API key rotation occurs, THE Pebbles SHALL log the rotation event with timestamp
4. WHEN errors occur, THE Pebbles SHALL log error details including error type and context
5. THE Pebbles SHALL track the number of successful and failed extraction attempts
6. THE Pebbles SHALL provide metrics on fallback extraction usage versus AI extraction usage
