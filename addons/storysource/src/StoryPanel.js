import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {editor} from 'monaco-editor'
import { document } from 'global'

import { EVENT_ID } from './events';


const getLocationKeys = locationsMap =>
  locationsMap
    ? Array.from(Object.keys(locationsMap)).sort(
        (key1, key2) => locationsMap[key1].startLoc.line - locationsMap[key2].startLoc.line
      )
    : [];

export default class StoryPanel extends Component {
  state = { source: 'loading source...' };

  componentDidMount() {
    this.mounted = true;
    const { channel } = this.props;
    const { source } = this.state;

    editor.create(document.getElementById('storysource-addon-editor'), {
      value: source,
      language: 'javascript',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: 'vs-dark',
    });
    channel.on(EVENT_ID, this.listener);
  }

  componentDidUpdate() {
    if (this.selectedStoryRef) {
      this.selectedStoryRef.scrollIntoView();
    }
  }

  componentWillUnmount() {
    const { channel } = this.props;

    channel.removeListener(EVENT_ID, this.listener);
  }

  setSelectedStoryRef = ref => {
    this.selectedStoryRef = ref;
  };

  listener = params => {
    if (params.source) {
      this.changeFocus(params);
    } else if (params.newSource && params.location) {
      this.updateSource(params);
    }
  };

  updateSource = ({ newSource }) => {
    const {
      source,
      currentLocation: {
        startLoc: { line: startLocLine, col: startLocCol },
        endLoc: { line: endLocLine, col: endLocCol },
      },
    } = this.state;
    const sourceLines = source.split('\n');
    const newFileSource =
      sourceLines.slice(0, Math.max(0, startLocLine - 1)).join('\n') +
      (startLocLine === 0 ? '' : '\n') +
      sourceLines[startLocLine - 1].substring(0, startLocCol) +
      newSource.substring(startLocCol, newSource.lastIndexOf(')') + 1) +
      (newSource.endsWith('\n') ? '\n' : '') +
      sourceLines[endLocLine - 1].substring(endLocCol + 1) +
      sourceLines.slice(Math.min(sourceLines.length - 1, endLocLine)).join('\n');

    const newEndLocLine = startLocLine + newSource.split('\n').length - 1;
    const newEndLocCol = newSource.split('\n').slice(-1).length;

    this.setState({
      source: newFileSource,
      currentLocation: {
        startLoc: { col: startLocCol, line: startLocLine },
        endLoc: { col: newEndLocCol, line: newEndLocLine },
      },
    });
  };

  changeFocus = ({ source, currentLocation, locationsMap }) => {
    const locationsKeys = getLocationKeys(locationsMap);

    this.setState({
      source,
      currentLocation,
      locationsMap,
      locationsKeys,
    });
  };

  clickOnStory = (kind, story) => {
    const { api } = this.props;

    if (kind && story) {
      api.selectStory(kind, story);
    }
  };


  onEdit = (e, newSource, location) => {
    const { channel } = this.props;
    channel.emit(EVENT_ID, { newSource, location });
  };

  render() {
    const { active } = this.props;

    return active ? (<div id='storysource-addon-editor'/>) : null;
  }
}

StoryPanel.propTypes = {
  active: PropTypes.bool.isRequired,
  api: PropTypes.shape({
    selectStory: PropTypes.func.isRequired,
  }).isRequired,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
};
