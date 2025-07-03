import { useRef, useState } from "react";
import { Form, Button, Overlay } from "react-bootstrap";
import "./CodeEditor.css";
import copyIcon from "./copy-icon.svg";
import downloadIcon from "./download-icon.svg"
export default function CodeEditor({
  label,
  id,
  value,
  onChange,
  rows = 10,
  placeholder = "",
  onClear
}) {

  const gutterRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // alert("Copied!");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  function handleUpload(e) {
    const chosenFile = e.target.files?.[0];
    if (!chosenFile) return;
    setFile(chosenFile);
    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result;
      if (typeof text === "string") onChange(text);
    };
    reader.onerror = () => console.error("Could not read file:", reader.error);
    reader.readAsText(chosenFile);
  }

  const syncScroll = e => {
    if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop;
  };

  const lineCount = value.split("\n").length;
  const lineElems = Array.from({ length: lineCount }, (_, i) => (
    <div key={i}>{i + 1}</div>
  ));

  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Label>{label}</Form.Label>

      <div className="code-editor-wrapper">
        {/* Gutter */}
        <pre className="code-line-numbers" ref={gutterRef}>
          {lineElems}
        </pre>

        {/* Text Area */}
        <Form.Control
          as="textarea"
          rows={rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          onScroll={syncScroll}
          placeholder={placeholder}
          className="code-textarea"
          wrap="off"
        />
        {/* Copy control for “Python 3” */}
        {label === "Python 3" && (
        <>
          <Button
            type="button"
            className="icon-btn download-btn"
            onClick={handleCopy}
            style={{ backgroundImage: `url(${downloadIcon})` }}
          >
          <span className="sr-only">Copy</span>
          </Button>

          <Button
            type="button"
            className="icon-btn copy-btn"
            onClick={handleCopy}
            style={{ backgroundImage: `url(${copyIcon})` }}
          >
          <span className="sr-only">Copy</span>
          </Button>
        </>
        
        )}
      
      </div>

      {/* Upload controls for “Python 2” */}
      {label === "Python 2" && (
        <>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-2"
          >
            Upload File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            accept=".py"
            onChange={handleUpload}
          />
        </>
      )}
      {label === "Python 3" && (
        <Button type="button" onClick={() => onClear?.()}>Clear</Button>  
      )}
    </Form.Group>
  );
}