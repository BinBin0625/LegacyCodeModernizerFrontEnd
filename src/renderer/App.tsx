import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CodeEditor from "./CodeEditor";
import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Hello() {
  const [python2Code, setPython2Code] = useState("");
  const [python3Code, setPython3Code] = useState("");
  const [codeChanges, setCodeChanges] = useState("Line 82: Change rawInput -> Input()");
  
  return (
    <div>
      <h1 style={{textAlign: "center"}}>Python 2 to 3 Modernizer</h1>
      <Container fluid>
        <Row>
          <Col xs={12} md={6} lg={4} style={{marginBottom: "1rem"}}>
          <CodeEditor
            label="Python 2"
            id="python2Input"
            value={python2Code}
            onChange={setPython2Code}
            placeholder="Paste or upload your Python 2 code here"
          />
          <br/>
          <Button type="submit">Modernize</Button>
          </Col>
      
          <Col xs={12} md={6} lg={4} style={{marginBottom: "1rem"}}>
            <Container fluid>
              <Row>
                <CodeEditor
                  label="Python 3"
                  id="python3Input"
                  value={python3Code}
                  onChange={setPython3Code}
                  placeholder=""
                />
              </Row>
              <br/>
              <Button type="button" onClick={() => {setPython2Code(""); setPython3Code("");}}>Clear</Button>  
            </Container>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Container fluid>
              <Row>
                <Form>
                  <Form.Label htmlFor="codeChangesInput">Code Changes</Form.Label>
                  <Form.Control id="codeChangesInput" value={codeChanges} onChange={(e) => setCodeChanges("")} as="textarea" readOnly></Form.Control>
                  <br/>
                </Form>
              </Row>
            </Container>
          </Col>                           
        </Row>
      </Container> 
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
