import React, {Component} from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import SongButton from './SongButton';
import './Album.css';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug;
    });
    this.state = {
      album: album,
      currentSong: null,
      currentTime: 0,
      duration: null,
      setVolume: "80",
      isPlaying: false,
      playloop: true,
      shufflePlay: false,
      shuffledAlbum: []
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
      if (this.state.playloop) {
        this.handleNextClick();
      } else {
        return;
      }
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

  enablePlayloop() {
    let togglePlayloop = this.state.playLoop? false : true;
    this.setState({ playloop: togglePlayloop});
  }

  enableShuffle() {
    const toggleShuffle = this.state.shufflePlay? false : true;
    this.setState({ shufflePlay : toggleShuffle });

    const newShuffleAlbum = this.state.album.songs.slice();
    for (var i = newShuffleAlbum.length-1; i > 0 ; i--) {
      var r = Math.floor(Math.random() * (newShuffleAlbum.length - 1));
      let temp = newShuffleAlbum[r];
      newShuffleAlbum[r] = newShuffleAlbum[i];
      newShuffleAlbum[i] = temp;
    }
    console.log(newShuffleAlbum);
    this.setState({ shuffledAlbum : newShuffleAlbum });
  }

  handleSongClick(song,e) {
    const isSameSong = this.state.currentSong === song;
    let albumToPlay = this.state.shufflePlay? this.state.shuffledAlbum : this.state.album.songs;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song);
      } else if (this.state.currentSong === null) {
        this.setSong(albumToPlay[0]);
      }
      this.play();
    }
  }

  handlePrevClick() {
    let albumToFind = this.state.shufflePlay? this.state.shuffledAlbum : this.state.album.songs;
    const currentIndex = albumToFind.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = albumToFind[newIndex];

    this.setSong(newSong);
    this.play(newSong);
  }
  handleNextClick() {
    let albumToFind = this.state.shufflePlay? this.state.shuffledAlbum : this.state.album.songs;
    const currentIndex = albumToFind.findIndex(song => this.state.currentSong === song);
    const albumLength = albumToFind.length - 1;
    const lastSong = currentIndex === albumLength? true : false;
    let playloopStatus = this.state.playloop;
    const newIndex = function() {
      if( lastSong && playloopStatus ) {
        return 0;
      } else {
        return Math.min(albumLength, currentIndex + 1);
      }
    };
    const newSong = albumToFind[newIndex()];
    console.log("stopped song index "+currentIndex+" and play "+newIndex());
    console.log(this.state.playloop);
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
              <tr className="song" key={index} onClick={(e) => this.handleSongClick(song,e)}>
                <td id="song-number-column">
                  <SongButton
                    isPlaying={this.state.isPlaying}
                    currentSong={this.state.currentSong}
                    songIndex={index}
                    buttonOf={song}
                  />
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
          playloop={() => this.enablePlayloop()}
          playloopStatus={this.state.playloop}
          shuffle={() => this.enableShuffle()}
          shuffleStatus={this.state.shufflePlay}
          handleSongClick={(e) => this.handleSongClick(this.state.currentSong,e)}
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
