/**
 * Mock document data for development
 */
const mockDocuments = [
  {
    id: "doc1",
    title: "Improving Experimentation Techniques",
    uploadDate: "2025-05-25",
    fileType: "pdf",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.",
    thumbnail: null,
    sourceType: "upload",
  },
  {
    id: "doc2",
    title: "Evolutionary Database Design Practices",
    uploadDate: "2025-05-25",
    fileType: "docx",
    content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    thumbnail: null,
    sourceType: "upload",
  },
  {
    id: "doc3",
    title: "Machine Learning Fundamentals",
    uploadDate: "2025-05-24",
    fileType: "pdf",
    content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    thumbnail: null,
    sourceType: "upload",
  },
  {
    id: "doc4",
    title: "Introduction to React Hooks",
    uploadDate: "2025-05-23",
    fileType: "md",
    content: "# React Hooks\n\nHooks are a new addition in React 16.8. They let you use state and other React features without writing a class. This document provides an overview of the most common hooks.\n\n## useState\n\nThe useState hook lets you add React state to function components.\n\n```jsx\nimport React, { useState } from 'react';\n\nfunction Example() {\n  // Declare a new state variable, which we'll call \"count\"\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```",
    thumbnail: null,
    sourceType: "upload",
  },
  {
    id: "doc5",
    title: "Advanced CSS Techniques",
    uploadDate: "2025-05-22",
    fileType: "txt",
    content: "CSS Grid Layout\n\nCSS Grid Layout is a two-dimensional layout system for the web. It lets you lay content out in rows and columns, and has many features that make building complex layouts straightforward.\n\nFlexbox\n\nThe Flexbox Layout module aims at providing a more efficient way to lay out, align and distribute space among items in a container, even when their size is unknown and/or dynamic.",
    thumbnail: null,
    sourceType: "upload",
  },
  {
    id: "doc6",
    title: "JavaScript Design Patterns",
    uploadDate: "2025-05-21",
    fileType: "pdf",
    content: "Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices evolved over time by experienced software developers. This document covers the most common JavaScript design patterns including Module, Singleton, Observer, and Factory patterns.",
    thumbnail: null,
    sourceType: "upload",
  }
];

export default mockDocuments;
