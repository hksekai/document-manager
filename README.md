# NotebookLM - Document Manager

A full-stack web application for document management with AI-powered features.

## Features

- **Document Upload & Management**: Upload, view, and manage various document types
- **Text-to-Speech**: Listen to your documents with customizable voice and speed settings
- **AI Summaries**: Generate concise summaries of your documents
- **Study Guides**: Create study guides and notes from your documents

## Tech Stack

- **Frontend**: React, React Bootstrap, React Icons
- **Document Processing**: PDF.js, docx, react-file-viewer
- **Text-to-Speech**: react-speech
- **Styling**: CSS, Bootstrap

## Project Structure

```
src/
├── components/
│   ├── layout/         # Layout components (Header, Footer, Layout)
│   ├── documents/      # Document-related components
│   ├── tts/            # Text-to-speech components
│   └── ai/             # AI-related components
├── context/            # React Context for state management
├── hooks/              # Custom React hooks
├── mocks/              # Mock data and API services
├── utils/              # Utility functions
└── App.js              # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Mock API

During development, the application uses mock data and API services located in `src/mocks/`. In a production environment, these would be replaced with actual API calls to a backend server.

### Future Enhancements

- User authentication and authorization
- Document sharing and collaboration
- Advanced AI features (question answering, content extraction)
- Mobile application

## License

MIT
