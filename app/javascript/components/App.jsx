import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { CSSTransition } from 'react-transition-group';
import FadeIn from 'react-fade-in';
import { IoIosRecording } from 'react-icons/io';
import { ReactMic } from '@cleandersonlobo/react-mic';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      record: false,
      step: 1,
    };

    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
  }

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
  }

  startRecording() {
    this.setState({
      record: true,
      step: 2,
    })
  }

  stopRecording() {
    this.setState({
      step: 3,
      record: false,
    })
  }

  render() {
    const { record, step } = this.state;

    console.log('record: ', record);

    return (
      <article className="vh-100 dt w-100 bg-white">
        <div className="dtc v-mid tc ph3 ph4-l">
          <FadeIn transitionDuration={1000}>
          {step === 1 ? (
            <h1 className="f6 f2-m f-subheadline-l fw6 tc dark-gray tc">Record something.</h1>
          ) : (
            <ReactMic
              record={record}
              className="sound-wave"
              onStop={this.onStop}
              onData={this.onData}
              strokeColor={record ? '#000000' : '#FFF'}
              backgroundColor="#FFF"
            />
          )
          }
          </FadeIn>

          <div>
            <a
              onClick={step === 1 ? this.startRecording : this.stopRecording}
              className="f3 grow no-underline br-pill ph5 pv3 mb2 dib white bg-dark-gray b"
              style={{ cursor: 'pointer' }}
            >
              <IoIosRecording style={{ fontSize: '25px', paddingRight: '5px', marginBottom: '-5px' }}/>
              {' '}
              {record ? 'Stop' : 'Start'}
              {' '}
              recording
            </a>
          </div>
        </div>
      </article>
    );
  }
};

window.addEventListener('DOMContentLoaded', (event) => {
  ReactDOM.render(
    <App />,
    document.getElementById('home'),
  );
});
