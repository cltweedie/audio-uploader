import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import FadeIn from 'react-fade-in';
import { IoIosRecording } from 'react-icons/io';
import { FaStopCircle } from 'react-icons/fa';
import { ReactMic } from '@cleandersonlobo/react-mic';
import { PropagateLoader } from 'react-spinners';
import styles from '../styles';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      record: false,
      step: 1,
    };
  }

  onStop = (blob) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content

    const file = new File([blob], `audio-${(new Date).toISOString().replace(/:|\./g, '-')}.wav`, {
      type: 'audio/wav'
    });

    var formData = new FormData();
    formData.append('audio_filename', file.name);
    formData.append('audio_blob', file);
    formData.append('authenticity_token', csrfToken);

    axios
      .post('/submissions', formData)
      .then((res) => {
        console.log(res);
        this.setState({
          step: 4,
        });
      });
  }

  startRecording = () => {
    this.setState({
      record: true,
      step: 2,
    })
  }

  stopRecording = () => {
    this.setState({
      record: false,
      step: 3,
    });
  }

  step1 = () => (
    <a
      onClick={this.startRecording}
      className="f3 grow no-underline br-pill ph5 pv3 mb2 dib white bg-dark-gray b"
      style={styles.link}
    >
      <IoIosRecording style={styles.buttonIcon}/>
      {' '}
      Start recording
    </a>
  )

  step2 = () => (
    <a
      onClick={this.stopRecording}
      className="f3 grow no-underline br-pill ph5 pv3 mb2 dib white bg-dark-gray b"
      style={styles.link}
    >
      <FaStopCircle style={styles.buttonIcon}/>
      {' '}
      Stop recording
    </a>
  )

  step3 = () => (
    <FadeIn transitionDuration={1000}>
      <div style={styles.centeredDiv}>
        <div style={styles.loaderWrapper}>
          <PropagateLoader />
        </div>
        <br />
        <p className="dark-gray b f3">Processing...</p>
      </div>
    </FadeIn>
  )

  step4 = () => (
    <FadeIn transitionDuration={2000}>
      <div style={styles.centeredDiv}>
        <p className="dark-gray b f2">Result step will go here</p>
      </div>
    </FadeIn>
  )

  introHeading = () => (
    <h1 className="f6 f2-m f-subheadline-l fw6 tc dark-gray tc">Record something.</h1>
  )

  reactMic = () => {
    const { record } = this.state;

    return (
      <ReactMic
        record={record}
        className="sound-wave"
        onStop={this.onStop}
        strokeColor={record ? '#000000' : '#FFF'}
        backgroundColor="#FFF"
      />
    );
  }

  render() {
    const { step } = this.state;

    return (
      <article className="vh-100 dt w-100 bg-white">
        <div className="dtc v-mid tc ph3 ph4-l">
          <FadeIn transitionDuration={1000}>
            {step === 1 ? this.introHeading() : this.reactMic() }
          </FadeIn>

          <div>
            {this[`step${step}`]()}
          </div>

          {/* empty div to push vertically-aligned content up */}
          <div style={{ height: '200px' }} />
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
