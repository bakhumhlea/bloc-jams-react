import React, {Component} from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug;
    });
    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      setVolume: "80",
      isPlaying: false,
      autoplay: true
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioUrl;
    this.audioElement.volume = 0.8;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('ended', (e) => {
      if (this.state.autoplay) {
        this.handleNextClick();
      } else
        return;
    });
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioUrl;
    this.setState({ currentSong: song });
  }

  enableAutoPlay() {
    var value = this.state.autoplay? false : true;
    this.setState({ autoplay: value});
    console.log(this.state.autoplay);
  }

  handleShuffle() {
    var albumCopy = this.state.album;
    var shuffledAlbum = [];
    for (var i = albumCopy.length; i > 0 ; i--) {
      const RandomIndex = Math.floor(Math.random() * (albumCopy.length + 1));
      albumCopy.slice(albumCopy[RandomIndex]);
      shuffledAlbum.push(albumCopy[RandomIndex]);
    }
    console.log(shuffledAlbum);
    this.setState({album : shuffledAlbum});
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }
  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const songNum = this.state.album.songs.length - 1;
    var lastSong = currentIndex === songNum? true:false;
    var playLoopStatus = this.state.autoplay;
    const newIndex = function() {
      if( lastSong && playLoopStatus ) {
        return 0;
      } else {
        return Math.min(songNum, currentIndex + 1);
      }
    };
    const newSong = this.state.album.songs[newIndex()];
    console.log("stopped song index "+currentIndex+" and play "+newIndex());
    this.setSong(newSong);
    this.play(newSong);
  }

  handleTimeChange(e) {
    const newTime = Math.floor(this.audioElement.duration * e.target.value);
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  formatTime(timeInSecond) {
    var second = Math.floor(timeInSecond);
    var M = Math.floor( second / 60 );
    var s = second%60;
    var SS = s<10 ? "0"+s : s ;
    return M +":"+ SS;
  }

  handleVolChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume * 0.01;
    this.setState({ setVolume: newVolume});
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            {this.state.album.songs.map( (song ,index) =>
              <tr className="song" key={index} onClick={() => this.handleSongClick(song)}>
                <td id="song-number-column">
                  <button>
                    <span className="song-number">{index+1}</span>
                    <span key={index+1} className={this.state.isPlaying ? 'ion-pause' : 'ion-play'}></span>
                  </button>
                </td>
                <td id="song-title-column">
                  {song.title}
                </td>
                <td id="song-duration-column">
                  {this.formatTime(song.duration)}
                </td>
              </tr>
          )}
          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.state.currentTime}
          currentTimeDisplay={this.formatTime(this.state.currentTime)}
          duration={this.state.duration}
          durationDisplay={this.formatTime(this.state.duration)}
          setVolume={this.state.setVolume}
          playLoop={() => this.enableAutoPlay()}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolChange={(e) => this.handleVolChange(e)}
        />
      </section>
    );
  }
}

export default Album;
