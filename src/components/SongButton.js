import React, { Component } from 'react';

class SongButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOver:false
    };
  }
  handleMouseEnter(e) {
    this.setState({isOver:true});
  }
  handleMouseLeave(e) {
    this.setState({isOver:false});
  }
  render() {
    let className = 'song-index';
    let isPlayingSong = this.props.currentSong;
    let songIsPlaying = this.props.isPlaying;
    let buttonOf = this.props.buttonOf;
    let mouseOver = this.state.isOver;
    let isCurrentSong = isPlayingSong===buttonOf;
    if(!songIsPlaying && !isCurrentSong && !mouseOver) {
      return (
        <button
          onMouseEnter={(e)=>this.handleMouseEnter(e)}
          onMouseLeave={(e)=>this.handleMouseLeave(e)}
        >
          <span className={className}>{this.props.songIndex+1}</span>
        </button>
      );
    } else if (!isCurrentSong && mouseOver) {
      className = 'ion-play';
      return (
        <button
          onMouseEnter={()=>this.handleMouseEnter()}
          onMouseLeave={()=>this.handleMouseLeave()}
        >
          <span className={className}></span>
        </button>
      );
    } else if (songIsPlaying && isCurrentSong) {
      className = 'ion-pause';
      return (
        <button
          onMouseEnter={()=>this.handleMouseEnter()}
          onMouseLeave={()=>this.handleMouseLeave()}
        >
          <span className={className}></span>
        </button>
      );
    } else if (!songIsPlaying && isCurrentSong) {
      className = 'ion-play';
      return (
        <button
          onMouseEnter={()=>this.handleMouseEnter()}
          onMouseLeave={()=>this.handleMouseLeave()}
        >
          <span className={className}></span>
        </button>
      );
    } else {
      return (
        <button
          onMouseEnter={()=>this.handleMouseEnter()}
          onMouseLeave={()=>this.handleMouseLeave()}
        >
          <span className={className}>{this.props.songIndex+1}</span>
        </button>
      );
    }
  }
}

export default SongButton
