import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { hot } from 'react-hot-loader'
import screenfull from 'screenfull'

import './reset.css'
import './defaults.css'
import './range.css'
import './App.css'

import { version } from '../../package.json'
import ReactPlayer from '../ReactPlayer'
import Duration from './Duration'

class App extends Component {
  state = {
    url: null,
    urls: [],
    totalItems: 0,
    currItem: 0,
    pip: false,
    playing: true,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false
  }

  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false
    })
  }

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing })
  }

  handleStop = () => {
    this.setState({ url: null, playing: false })
  }

  handleToggleControls = () => {
    const url = this.state.url
    this.setState({
      controls: !this.state.controls,
      url: null
    }, () => this.load(url))
  }

  handleToggleLight = () => {
    this.setState({ light: !this.state.light })
  }

  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop })
  }

  handleVolumeChange = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  }

  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted })
  }

  handleSetPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) })
  }

  handleTogglePIP = () => {
    this.setState({ pip: !this.state.pip })
  }

  handlePlay = () => {
    console.log('onPlay')
    this.setState({ playing: true })
  }

  handleEnablePIP = () => {
    console.log('onEnablePIP')
    this.setState({ pip: true })
  }

  handleDisablePIP = () => {
    console.log('onDisablePIP')
    this.setState({ pip: false })
  }

  handlePause = () => {
    console.log('onPause')
    this.setState({ playing: false })
  }

  handleSeekMouseDown = e => {
    this.setState({ seeking: true })
  }

  handleSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }

  handleSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }

  handleProgress = state => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }

  handleEnded = () => {
    console.log('onEnded')

    if(this.state.urls.length > this.state.currItem) {
      this.setState({
        url: this.state.urls[this.state.currItem],
        currItem: this.state.currItem+1
      })
      this.setState({ playing: true })
    } else {
      this.setState({ playing: this.state.loop })
    }
  }

  handleDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration })
  }

  handleClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player))
  }

  renderLoadButton = (url, label) => {
    return (
      <button onClick={() => this.load(url)}>
        {label}
      </button>
    )
  }

  addToUrls = () => {
    if(this.state.currItem > 0) {
      this.state.urls.push(this.urlInput.value) 
    } else {
      this.state.urls.push(this.urlInput.value) 
      this.setState({ 
        url: this.urlInput.value,
        currItem: 1
      });
    }

    this.setState({ totalItems: this.state.totalItems+1 });
    var input = document.getElementById("url_input");
    input.value = '';

    var table_class = document.getElementById("table_class");
    table_class.innerHTML += '<tr> <td> '+ this.state.urls[this.state.totalItems] +' </td> <td></td> </tr> ';

  }

  ref = player => {
    this.player = player
  }

  render () {
    const { url, playing, controls, light, volume, muted, loop, played, loaded, duration, playbackRate, pip } = this.state
    const SEPARATOR = ' · '

    return (
      <div className='app'>
        <section className='section'>
          <h1>Youtube App Demo</h1>
          <div className='player-wrapper'>
            <ReactPlayer
              ref={this.ref}
              className='react-player'
              width='100%'
              height='100%'
              url={url}
              pip={pip}
              playing={playing}
              controls={controls}
              light={light}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={this.handlePlay}
              onEnablePIP={this.handleEnablePIP}
              onDisablePIP={this.handleDisablePIP}
              onPause={this.handlePause}
              onBuffer={() => console.log('onBuffer')}
              onSeek={e => console.log('onSeek', e)}
              onEnded={this.handleEnded}
              onError={e => console.log('onError', e)}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}
            />
          </div>
        </section>
        <section className='section'>
          <table>
            <tbody>
              <tr>
                <th>Load URL</th>
                <td>
                  <input ref={input => { this.urlInput = input }} type='text' placeholder='Enter URL' id="url_input"/>
                  <button onClick={this.addToUrls}>Load</button>
                </td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody id="table_class">
              <tr>
                <td>
                  Playlist
                </td>
              </tr>

              {/* <tr>
                <td>
                  Sample URL
                </td>
                <td></td>
              </tr> */}
            </tbody>
          </table>
        </section>
        <footer className='footer'>
        </footer>
      </div>
    )
  }
}

export default hot(module)(App)
