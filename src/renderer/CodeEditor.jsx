import { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./CodeEditor.css"; 

export default function CodeEditor({ label, id, value, onChange, rows = 10, placeholder = ""}) {
  const gutterRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  function handleUpload(e){
    const chosenFile = e.target.files?.[0];
    if (!chosenFile) return;
      setFile(chosenFile);
      console.log(
        chosenFile.name,
        chosenFile.type,
        `${(chosenFile.size / 1024).toFixed(1)} KB`
      );
      const reader = new FileReader();
      reader.onload = evt =>{
        const text = evt.target?.result;
        if(typeof text === "string") onChange(text);
      };
      reader.onerror = () =>
        console.error("Could not read file:", reader.error);
        reader.readAsText(chosenFile);
  }
  const syncScroll = (e) => {
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
    </div>
    {/* Upload controls only rendered for “Python 2” editor*/}
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
    </Form.Group>
  );
}