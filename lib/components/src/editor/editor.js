import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
    };
  }

  onMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    editor.focus();
  };

  onChange = (newValue, e) => {
    console.log('onChange', newValue, e);
  };

  render() {
    const { code } = this.state;
    const options = {
      selectOnLineNumbers: true,
    };
    return (
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}
