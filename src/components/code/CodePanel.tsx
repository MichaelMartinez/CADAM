import Editor, { Monaco } from '@monaco-editor/react';
import { useCallback, useRef, useEffect, useState } from 'react';
import { useSourceMapping } from '@/contexts/SourceMappingContext';
import { useCurrentMessage } from '@/contexts/CurrentMessageContext';
import { registerOpenSCADLanguage } from './OpenSCADLanguage';
import type { editor } from 'monaco-editor';
import { Code2, ChevronDown, ChevronUp } from 'lucide-react';

export function CodePanel() {
  const { currentMessage } = useCurrentMessage();
  const { highlight, highlightFromCode, clearHighlight, parseCode } =
    useSourceMapping();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const code = currentMessage?.content.artifact?.code || '';

  // Parse code when it changes
  useEffect(() => {
    if (code) {
      parseCode(code);
    }
  }, [code, parseCode]);

  // Update decorations when highlight changes
  useEffect(() => {
    if (!editorRef.current) return;

    const newDecorations: editor.IModelDeltaDecoration[] = [];

    if (highlight.highlightedPrimitive) {
      const { startLine, endLine } = highlight.highlightedPrimitive.location;
      newDecorations.push({
        range: {
          startLineNumber: startLine,
          startColumn: 1,
          endLineNumber: endLine,
          endColumn: 1000,
        },
        options: {
          isWholeLine: true,
          className: 'source-mapping-highlighted-line',
          glyphMarginClassName: 'source-mapping-highlighted-glyph',
          overviewRuler: {
            color: '#FFD700',
            position: 4, // Right
          },
        },
      });

      // Scroll to the highlighted line if it came from the viewer
      if (highlight.fromViewer) {
        editorRef.current.revealLineInCenter(startLine);
      }
    }

    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      newDecorations,
    );
  }, [highlight]);

  const handleEditorMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;

      // Register OpenSCAD language
      registerOpenSCADLanguage(monaco);

      // Set up cursor position listener for code-to-visual
      editor.onDidChangeCursorPosition((e) => {
        highlightFromCode(e.position.lineNumber);
      });

      // Clear highlight when leaving editor
      editor.onDidBlurEditorWidget(() => {
        clearHighlight();
      });
    },
    [highlightFromCode, clearHighlight],
  );

  if (!code) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#1E1E1E]">
      {/* Header */}
      <div
        className="flex h-10 cursor-pointer items-center justify-between border-b border-adam-neutral-700 px-4 hover:bg-adam-neutral-800"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-adam-text-secondary" />
          <span className="text-sm font-medium text-adam-text-primary">
            OpenSCAD Code
          </span>
        </div>
        <button className="text-adam-text-secondary hover:text-adam-text-primary">
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Editor */}
      {!isCollapsed && (
        <div className="flex-1">
          <Editor
            height="100%"
            language="openscad"
            theme="openscad-dark"
            value={code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              fontSize: 13,
              fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
              glyphMargin: true,
              folding: true,
              lineDecorationsWidth: 10,
              renderLineHighlight: 'line',
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              contextmenu: false,
            }}
            onMount={handleEditorMount}
          />
        </div>
      )}
    </div>
  );
}
