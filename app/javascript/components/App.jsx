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
  static buildFormData(data) {
    const { csrfToken, file } = data;

    const formData = new FormData();
    formData.append('audio_filename', file.name);
    formData.append('file', file);
    formData.append('authenticity_token', csrfToken);

    return formData;
  }

  constructor(props) {
    super(props);

    this.state = {
      record: false,
      step: 1,
      classifications: null,
    };
  }

  postBlob = (audio) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content

    const file = new File(
      [audio.blob],
      `audio-${(new Date).toISOString().replace(/:|\./g, '-')}.wav`,
      { type: 'audio/wav' }
    );

    return axios.post(
      'https://audio-classifier-mf-ctweed.onrender.com/analyze',
      this.constructor.buildFormData({ csrfToken, file }),
    );
  }

  onStop = (audio) => {
    console.log('onStop');
    debugger;
    this.postBlob(audio).then((res) => {
      console.log(res);
      this.setState({
        step: 4,
        classifications: eval(res.data.classifications),
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

  step4 = () => {
    const { classifications } = this.state;
    const classificationsToRender = classifications.slice(0, 5);

    if (classifications.length < 1) {
      return (
        <FadeIn transitionDuration={2000}>
          <div style={styles.centeredDiv}>
            <p className="dark-gray b f2">Sorry, we couldn't identify that sound.</p>
          </div>
        </FadeIn>
      );
    } else {
      return (
        <FadeIn transitionDuration={2000}>
          <div style={styles.centeredDiv}>
            <h2 className="f2 lh-title">Result</h2>
            <table className="f3 lh-copy">
              <thead>
                <tr>
                  <th>Prediction</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {classificationsToRender.map((c) => {
                  console.log(c[0]);
                  return (
                    <tr key={c[0]}>
                      <td>{c[0].replace(/_/g, ' ')}</td>
                      <td style={{
                        color: this.confidenceToColor(parseInt(c[1])),
                        fontWeight: 'bold',
                      }}>{c[1]}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </FadeIn>
      );
    }
  }

  confidenceToColor(confidence) {
    if (confidence > 50) return 'rgb(0, 255, 0)';

    const conf = (confidence * 2) / 100;

    const percentColors = [
      { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
      { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
      { pct: 1, color: { r: 0x00, g: 0xff, b: 0 } } ];

    const getColorForPercentage = function(pct) {
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        const lower = percentColors[i - 1];
        const upper = percentColors[i];
        const range = upper.pct - lower.pct;
        const rangePct = (pct - lower.pct) / range;
        const pctLower = 1 - rangePct;
        const pctUpper = rangePct;
        const color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    }

    return getColorForPercentage(conf);
  }

  introHeading = () => (
    <h1 className="f6 f2-m f-subheadline-l fw6 tc dark-gray tc">
      Record something.
    </h1>
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
