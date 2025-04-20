# AI-Powered Resume Tailoring Application

This project is a full-stack application for tailoring resumes using AI. It consists of a Next.js frontend and a Spring Boot backend.

## Architecture

The application follows a client-server architecture:

- **Frontend**: Next.js application with React components
- **Backend**: Spring Boot REST API with an agent-based architecture

### Agent-Based Architecture

The backend implements an agent-based architecture inspired by frameworks like AutoGen, LangGraph, and CrewAI. This approach breaks down complex AI tasks into modular components:

1. **Prompting Agent**: Constructs effective prompts from user inputs (resume + job description)
2. **AI Completion Agent**: Makes calls to the OpenAI API with provided API keys
3. **Formatting Agent**: Cleans and structures the output from the AI
4. **PDF Agent**: Compiles LaTeX into downloadable format

These agents are orchestrated by an `AgentOrchestrator` that manages the flow between them. This architecture provides several benefits:

- **Modularity**: Each agent has a specific responsibility, making the code more maintainable
- **Extensibility**: New agents can be added to handle additional tasks
- **Testability**: Agents can be tested in isolation
- **Reusability**: Agents can be reused across different workflows

## Project Flow

### 1. User Flow

1. **Initial Setup**:
   - User visits the application and navigates to the Settings page
   - User enters their OpenAI API key (required for AI features)
   - Settings are saved in the browser's localStorage

2. **Resume Creation/Import**:
   - User navigates to the Resume Editor
   - User either creates a new resume using the LaTeX editor or loads a template
   - The resume is previewed in real-time and can be downloaded as PDF

3. **AI Resume Tailoring**:
   - User navigates to the AI Tailor page
   - User inputs their resume content and a job description
   - The system analyzes the resume against the job description
   - The system provides suggestions to improve the resume
   - User can apply suggestions to update their resume

4. **Cover Letter Generation**:
   - User navigates to the Cover Letter Generator
   - User inputs their resume, job description, and additional information
   - The system generates a customized cover letter
   - User can download, copy, or save the cover letter as a template

5. **GitHub Integration**:
   - User navigates to the GitHub Integration page
   - User enters their GitHub username
   - The system fetches and displays repositories
   - User selects relevant repositories to include in their resume
   - Selected repositories are added to the resume in a formatted way

### 2. Data Flow

1. **Frontend to Backend**:
   - Frontend components make API calls to the backend services
   - API calls include necessary data (resume, job description, API keys)
   - Requests are handled by the corresponding controllers

2. **Backend Processing**:
   - Backend controllers receive requests and delegate to services
   - Services use the agent-based architecture to process the requests
   - The agent orchestrator coordinates the flow between agents

3. **Agent Flow**:
   - **Prompting Agent**: Creates an effective prompt based on user inputs
   - **AI Completion Agent**: Sends the prompt to the OpenAI API
   - **Formatting Agent**: Structures and cleans the AI response
   - **PDF Agent**: (Optional) Compiles LaTeX content to PDF

4. **Response Handling**:
   - Backend sends structured responses back to the frontend
   - Frontend processes responses and updates the UI
   - User can interact with the results

5. **Local Storage**:
   - API keys are stored in localStorage
   - Resume templates are saved locally
   - GitHub projects can be stored temporarily

### 3. Technical Flow

1. **Initial Load**:
   - Next.js server renders initial HTML
   - Client-side JavaScript takes over for interactivity
   - Components load any saved data from localStorage

2. **API Requests**:
   - Frontend sends requests using fetch API
   - Requests are authenticated with API keys
   - Backend controllers handle the requests

3. **Error Handling**:
   - Frontend catches errors and displays appropriate messages
   - Backend uses global exception handling
   - Fallback to mock data when backend is unavailable

4. **Real-time Updates**:
   - LaTeX editor updates preview in real-time
   - Loading states show spinners during processing
   - Success/error messages guide the user

5. **Integration**:
   - GitHub projects are integrated into resume templates
   - AI suggestions can be applied to update resume content
   - Cover letters can be generated based on resume and job description

## Backend (Spring Boot)

The backend provides REST APIs for the following functionalities:

1. **AI Resume Tailoring**
  - Endpoint: `POST /api/ai/tailor`
  - Accepts resume content and job description
  - Returns tailored resume suggestions using OpenAI API

2. **Cover Letter Generator**
  - Endpoint: `POST /api/ai/cover-letter`
  - Generates a cover letter based on resume and job description

3. **GitHub Projects Fetcher**
  - Endpoint: `GET /api/github/projects?username={username}`
  - Fetches GitHub repositories and ranks them by relevance to job description

4. **PDF Generator for LaTeX**
  - Endpoint: `POST /api/resume/compile`
  - Compiles LaTeX content into a downloadable PDF

### Backend Technologies

- Spring Boot 3.2.3
- Java 17
- WebClient for API calls
- Apache PDFBox for PDF generation
- OpenAI Java Client

## Frontend (Next.js)

The frontend handles the following functionalities:

1. **LaTeX Resume Editor**
  - UI for editing LaTeX resumes
  - Live preview of the resume
  - Sends LaTeX content to backend for PDF compilation

2. **AI Resume Tailoring UI**
  - Form for inputting resume and job description
  - Displays tailored suggestions from the backend
  - Allows applying suggestions to the resume

3. **Cover Letter Generator UI**
  - Form for inputting resume, job description, and additional info
  - Displays generated cover letter from the backend

4. **GitHub Integration UI**
  - Form for entering GitHub username
  - Displays fetched repositories with relevance scores
  - Allows selecting repositories to include in resume

5. **API Key Management**
  - UI for managing OpenAI API keys
  - Securely sends API keys with requests to the backend

### Frontend Technologies

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript/JavaScript

## Getting Started

### Backend Setup

1. Clone the repository
2. Navigate to the backend directory
3. Build the project: `./mvnw clean install`
4. Run the application: `./mvnw spring-boot:run`
5. The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. The frontend will be available at `http://localhost:3000`

## API Documentation

### Resume Tailoring

\`\`\`
POST /api/ai/tailor
Content-Type: application/json

{
  "resumeContent": "Your resume content here",
  "jobDescription": "Job description here",
  "apiKey": "Your OpenAI API key"
}
\`\`\`

### Cover Letter Generation

\`\`\`
POST /api/ai/cover-letter
Content-Type: application/json

{
  "resumeContent": "Your resume content here",
  "jobDescription": "Job description here",
  "additionalInfo": "Additional information (optional)",
  "apiKey": "Your OpenAI API key"
}
\`\`\`

### GitHub Projects

\`\`\`
GET /api/github/projects?username=yourusername&jobDescription=Optional job description
\`\`\`

### PDF Compilation

\`\`\`
POST /api/resume/compile
Content-Type: application/json

{
  "latexContent": "Your LaTeX content here"
}
\`\`\`

## Future Enhancements

- Add authentication and user management
- Implement database storage for resumes and cover letters
- Add more AI models and options
- Enhance PDF generation with more formatting options
- Expand the agent-based architecture with more specialized agents
