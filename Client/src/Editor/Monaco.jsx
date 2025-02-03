/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import monokai from 'monaco-themes/themes/Monokai.json';
import nightOwl from 'monaco-themes/themes/Night Owl.json';
import chromeDevTools from 'monaco-themes/themes/Chrome DevTools.json';
import active4D from 'monaco-themes/themes/Active4D.json';


const Monaco = ({ file, language, onCodeChange, fontSize, theme }) => {
  const [code, setCode] = useState(file);
  const [suggestion, setSuggestion] = useState('');
  const [completion, setCompletion] = useState('');
  const monaco = useMonaco();
  const editorRef = useRef(null);

  useEffect(() => {
    if (monaco) {
      // Define themes
      monaco.editor.defineTheme('monokai', monokai);
      monaco.editor.defineTheme('night-owl', nightOwl);
      monaco.editor.defineTheme('chrome-devtools', chromeDevTools);
      monaco.editor.defineTheme('active4d', active4D);

      monaco.editor.setTheme(theme);

      // Add keyboard shortcut for code completion
      const editor = monaco.editor.getEditors()[0];
      if (editor) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, handleCodeCompletion);
      }
    }
  }, [monaco, theme]);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== file) {
        const currentPosition = editorRef.current.getPosition();
        model.pushEditOperations(
          [],
          [{ range: model.getFullModelRange(), text: file }],
          () => null
        );
        editorRef.current.setPosition(currentPosition);
        editorRef.current.focus();
      }
    }
  }, [file]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value);
    onCodeChange(value);
  };

  const handleCodeSuggestions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/suggestion/quickfix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ codeSnippet: code }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestion(data.data.generated_text?.toString() || 'No suggestion available');
      
      if (data.data.generated_text && monaco) {
        const editor = monaco.editor.getEditors()[0];
        if (!editor) return;

        const model = editor.getModel();
        const fullRange = model.getFullModelRange();
        
        editor.executeEdits('quickfix', [{
          range: fullRange,
          text: data.data.generated_text.toString(),
        }]);
      }
    } catch (error) {
      console.error('Error getting code suggestions:', error);
      setSuggestion('Error getting suggestions');
    }
  };

  const handleCodeCompletion = async () => {
    try {
      const editor = monaco.editor.getEditors()[0];
      if (!editor) return;

      // Get cursor position
      const position = editor.getPosition();
      const model = editor.getModel();
      
      // Get text until cursor position
      const textUntilCursor = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/suggestion/autocomplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ codeSnippet: textUntilCursor }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch completions');
      }

      const data = await response.json();
      console.log(data.data.generatedCode.generated_text);
      setCompletion(data.data.generatedCode.generated_text?.toString() || 'No completion available');
    } catch (error) {
      console.error('Error getting code completions:', error);
      setCompletion('Error getting completions');
    }
  };

  const applyCompletion = () => {
    if (completion && monaco) {
      const editor = monaco.editor.getEditors()[0];
      if (!editor) return;

      const position = editor.getPosition();
      
      editor.executeEdits('autocomplete', [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: completion,
      }]);
      setCompletion('');
    }
  };
  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'undo');
    }
  };
  
  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'redo');
    }
  };

  return (
    <div className="h-[97vh] w-full flex flex-col relative">
{suggestion && (
  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 bg-white border border-gray-200 p-4 rounded shadow-lg max-w-md">
    <h3 className="font-bold mb-2">Suggestion:</h3>
    <p className="text-sm">{suggestion}</p>
    <button 
      onClick={() => setSuggestion('')}
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
    >
      ×
    </button>
  </div>
)}

{completion && (
  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 bg-white border border-gray-200 p-4 rounded shadow-lg max-w-md">
    <h3 className="font-bold mb-2">Auto Completion:</h3>
    <p className="text-sm">{completion}</p>
    <div className="flex justify-end mt-2 gap-2">
      <button 
        onClick={applyCompletion}
        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
      >
        Apply
      </button>
      <button 
        onClick={() => setCompletion('')}
        className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
      >
        Cancel
      </button>
    </div>
  </div>
)}
<div className="flex flex-row gap-2">
<button onClick={handleUndo} className="bg-blue-700 w-16 text-white px-3 py-1 rounded">
  Undo
</button>
<button onClick={handleRedo} className="bg-blue-700 w-16 text-white px-3 py-1 rounded">
  Redo
</button>
</div>

<div className="flex-grow">
        <Editor
          height="100%"
          width="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{ fontSize: fontSize, 

            automaticLayout: true,
    undoRedo: true, // Explicitly enable undo/redo
          }}
        />
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        <button 
          onClick={handleCodeSuggestions}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Quick Fixes
        </button>
        <button 
          onClick={handleCodeCompletion}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Get Completion
        </button>
      </div>
</div>
    
  );
};

export default Monaco;