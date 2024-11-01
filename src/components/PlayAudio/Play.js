import React, { useEffect, useRef, useState } from "react";
import CloseImage from "../../resource/images/svg/close.svg";
import MoreImage from "../../resource/images/svg/more.svg";
import { useSelector, useDispatch } from "react-redux";
import { getSecondsToMinutesAndSeconds } from "../../utils/FormatDateTime";
import { renderArtist } from "../../utils/UtilsFunction";
import { updateTotalListen } from "../../redux/songReducer";
import { Link } from "react-router-dom";
let audio;

const PlayAudio = (props) => {
  const dispatch = useDispatch();
  const [currentPlay, setCurrentPlay] = useState({});
  const [indexPlay, setIndexPlay] = useState(0);
  const [currentTrackDuration, setCurrentTrackDuration] = useState(0);
  const [currentTrackMoment, setCurrentTrackMoment] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState("0");
  const [timeDrag, setTimeDrag] = useState(false);
  const progressBarRef = useRef(null);
  const progressContainerRef = useRef(null);
  const audioCurrentTime = useRef(null);
  const data = useSelector((states) => {
    return states.playReducer;
  });
  const [state, setState] = useState({
    isRandom: false,
    isRepeat: false,
    openBarPlay: false,
    playList: [],
    isPlay: false,
    isPaused: false,
  });
  const initData = () => {
    let playList = data.playList;
    let isRepeat = data.isRepeat;
    let isOpenBarPlay = data.openBarPlay;
    let isPause = data.isPause;
    setState({
      ...data,
      playList: playList,
      isRepeat: isRepeat,
      openBarPlay: isOpenBarPlay,
      isPause: isPause,
    });
  };

  useEffect(() => {
    initData();
  }, [data.isPlay, indexPlay, data.playList]);
  useEffect(() => {
    if (state.isPlay != undefined) {
      PlayEventListener(state.isPlay);
    }
  }, [state.isPlay, indexPlay, data.playList]);
  const initAudioPlayer = () => {
    audio = document.getElementById("jp_audio_0");
  };
  useEffect(() => {
    initAudioPlayer();
  });
  useEffect(() => {
    if (audio.ended) {
      let index = indexPlay;
      if (index < state.playList.length) {
        index++;
        setIndexPlay(index);
      }
    }
  });

  const createdAudio = (currentSong) => {
    if (currentSong != currentPlay) {
      if (currentSong != undefined) {
        var image = document.getElementById("avartarSong");
        if (audioCurrentTime.current != undefined) {
          console.log(audioCurrentTime.current);
          if (currentSong.mediaUrl && currentSong.title) {
            audioCurrentTime.current.src = currentSong.mediaUrl;
            audioCurrentTime.current.title = currentSong.title;
            image.src = currentSong.image;
          } else {
            audioCurrentTime.current.src = currentSong.songs.mediaUrl;
            audioCurrentTime.current.title = currentSong.songs.title;
            image.src = currentSong.songs.image;
          }
        }
        dispatch(updateTotalListen({ target: "song", id: currentSong.id?currentSong.id:currentSong.songs.id }));
      } else {
        let playList = state.playList;
        setCurrentPlay(playList[0]);
        setIndexPlay(0);
      }
    }
  };

  const handleMetadata = () => {
    const duration = Math.floor(audio.duration);
    setCurrentTrackDuration(getSecondsToMinutesAndSeconds(duration));
  };
  const PlayEventListener = (_isPlay) => {
    const playList = data.playList;
    const currentSong = playList[playList.length > 1 ? indexPlay : 0];
    console.log(currentSong, playList);

    setCurrentPlay(currentSong);
    createdAudio(currentSong);
    var controlAudio = document.querySelector("#jp_container_1jp_container_1");
    if (audio != undefined) {
      if (_isPlay && (audio.pause || audio.ended)) {
        console.log(audioCurrentTime.current);

        audioCurrentTime.current.play();
        if (controlAudio != null) {
          controlAudio.setAttribute("class", "jp-state-playing");
        }
        // controlAudio.classList.add("jp-state-playing");
      } else if (!_isPlay) {
        let track = currentTrackMoment;
        let progress = progressBarWidth;
        setCurrentTrackMoment(track);
        setProgressBarWidth(progress);
        audioCurrentTime.current.pause();
        // controlAudio.classList.remove("jp-state-playing");
        if (controlAudio != null) {
          controlAudio.removeAttribute("class");
        }
      }
    }
  };

  const PlayOrPauseEvent = () => {
    let play = !state.isPlay;
    let pause = !state.isPaused;
    setState({ ...state, isPlay: play, isPaused: pause });
  };
  const handleTimeupdate = (e) => {
    setCurrentTrackMoment(Math.floor(e.target.currentTime));
    setProgressBarWidth((e.target.currentTime / e.target.duration) * 100 + "%");
  };
  const handleNextSong = () => {
    let index = indexPlay;
    index++;
    if (audio.play) {
      audio.pause();
    }
    let arr = state.playList;
    if (indexPlay > arr.length) {
      index = arr.length;
    }

    setIndexPlay(index);
  };
  const handlePrevSong = () => {
    let index = indexPlay;
    if (indexPlay != 0) {
      if (audio.play) {
        audio.pause();
      }
      index--;
      setIndexPlay(index);
    }
  };
  useEffect(() => {
    window.addEventListener("touchstart", () => {
      if (currentPlay && currentPlay.id == undefined && state.isPaused) {
        audio.muted = false;
        audio.play();
      }
    });
  });
  const handleRandom = () => {
    let length = state.playList.length;
    let randomValue = Math.round(Math.random() * length);
    if (audio.play && indexPlay != randomValue) {
      audio.pause();
      setIndexPlay(randomValue);
    }
    return;
  };
  const handleMouseUp = (event) => {
    setTimeDrag(false);
    updatebar(event.pageX);
  };
  const handleOnMouseDown = (e) => {
    setTimeDrag(true);
    updatebar(e.pageX);
  };
  const handleOnMouseUp = (e) => {
    if (timeDrag) {
      setTimeDrag(false);
      updatebar(e.pageX);
    }
  };
  const onTouch = (e) => {
    if (e.changedTouches) {
      var timeDragMobile = true;
      setTimeDrag(timeDragMobile);
      updatebar(e.changedTouches[0].pageX);
    }
  };
  const createPlayList = (item) => {
    return (
      <li
        key={item.index}
        style={{ cursor: "pointer" }}
        onClick={() => {
          setIndexPlay(item.index);
        }}
      >
        <div>
          <a className="jp-playlist-item-remove" style={{ display: "none" }}>
            ×
          </a>
          <a className="jp-playlist-item" tabIndex={0}>
            <span className="que_img">
              <img style={{ width: "100%" }} src={item.image} />
            </span>
            <div className="que_data">
              {item.title}

              <span className="jp-artist">
                {renderArtist(item.artistSongs)}
              </span>
            </div>
          </a>
          <div className="action">
            <span className="que_more">
              <img src={MoreImage} />
            </span>
            <span className="que_close">
              <img src={CloseImage} />
            </span>
          </div>
        </div>
        <ul className="more_option">
          <li className="jp-playlist-current">
            <a>
              <span className="opt_icon" title="Add To Favourites">
                <span className="icon icon_fav" />
              </span>
            </a>
          </li>
          <li>
            <a>
              <span className="opt_icon" title="Add To Queue">
                <span className="icon icon_queue" />
              </span>
            </a>
          </li>
          <li>
            <a>
              <span className="opt_icon" title="Download Now">
                <span className="icon icon_dwn" />
              </span>
            </a>
          </li>
          <li>
            <a>
              <span className="opt_icon" title="Add To Playlist">
                <span className="icon icon_playlst" />
              </span>
            </a>
          </li>
        </ul>
      </li>
    );
  };
  const renderQueuePlayList = () => {
    let result = [];
    if (state.playList != undefined) {
      state.playList.map((value, index) => {
        if (index != indexPlay) {
          var obj = { ...value, index: index };
          result.push(createPlayList(obj));
        }
      });
    }
    return result;
  };
  const updatebar = (x) => {
    const { width, left } =
      progressContainerRef.current.getBoundingClientRect();
    // const clickPosition = pageX - left;
    var position = x - left;

    var percentage = (100 * position) / width;
    if (percentage > 100) {
      percentage = 100;
    }
    if (percentage < 0) {
      percentage = 0;
    }
    let currentTimeAudio = (audio.duration * percentage) / 100;
    if (audioCurrentTime.current) {
      audioCurrentTime.current.currentTime = parseFloat(currentTimeAudio);
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${percentage}%`;
    }
    // $('.jp-play-bar').css('width', percentage + '%');
  };

  const repeatPlay = () => {
    audio.currentTime = 0;
    updatebar(0);
  };
  const renderRightQueue = () => {
    return (
      <div className="jp_queue_wrapper">
        <span className="que_text" id="myPlaylistQueue">
          <i className="fa fa-angle-up" aria-hidden="true" /> Danh sách phát
        </span>
        <div id="playlist-wrap" className="jp-playlist">
          <div className="jp_queue_cls">
            <i className="fa fa-times" aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: "15px", fontWeight: "500" }}>
            Danh sách phát
          </h2>
          <div className="jp_queue_list_inner">
            <ul>
              <li className="jp-playlist-current">
                <div>
                  <a
                    className="jp-playlist-item-remove"
                    style={{ display: "none" }}
                  >
                    ×
                  </a>
                  <a
                    className="jp-playlist-item jp-playlist-current"
                    tabIndex={0}
                  >
                    <span className="que_img">
                      <img
                        style={{ width: "100%" }}
                        src={currentPlay != undefined ? currentPlay.image : ""}
                      />
                    </span>
                    <div className="que_data">
                      {currentPlay != undefined ? currentPlay.title : ""}
                      <span className="jp-artist"> </span>
                    </div>
                  </a>
                  <div className="action">
                    <span className="que_more">
                      <img src={MoreImage} />
                    </span>
                    <span className="que_close">
                      <img src={CloseImage} />
                    </span>
                  </div>
                </div>
                <ul className="more_option">
                  <li className="jp-playlist-current">
                    <a>
                      <span className="opt_icon" title="Add To Favourites">
                        <span className="icon icon_fav" />
                      </span>
                    </a>
                  </li>
                  <li>
                    <a>
                      <span className="opt_icon" title="Add To Queue">
                        <span className="icon icon_queue" />
                      </span>
                    </a>
                  </li>
                  <li>
                    <a>
                      <span className="opt_icon" title="Download Now">
                        <span className="icon icon_dwn" />
                      </span>
                    </a>
                  </li>
                  <li>
                    <a>
                      <span className="opt_icon" title="Add To Playlist">
                        <span className="icon icon_playlst" />
                      </span>
                    </a>
                  </li>
                </ul>
              </li>
              {renderQueuePlayList()}
            </ul>
          </div>
          <div className="jp_queue_btn"></div>
        </div>
      </div>
    );
  };
  const returnArtist = (artist) => {
    if (artist == undefined) {
      return "N/A";
    }
    var artists = [];
    if (artist != null || artist != undefined) {
      if (artist.length > 0) {
        for (let i = 0; i < artist.length; i++) {
          artists.push(
            <Link to={`/artist/${artist[i].artists.id}`}>
              {artist[i].artists.fullName}
            </Link>
          );
          if (artist.length > 1 && i < artist.length - 1) {
            artists.push(<span>&</span>);
          }
        }
      }
    }
    return artists;
  };

  return (
    <>
      <div
        style={state.openBarPlay ? { display: "" } : { display: "none" }}
        className="ms_player_wrapper"
      >
        <div className="ms_player_close">
          <i className="fa fa-angle-up" aria-hidden="true" />
        </div>
        <div className="player_mid">
          <div className="audio-player">
            <div
              id="jquery_jplayer_1"
              className="jp-jplayer"
              style={{ width: "0px", height: "0px" }}
            >
              <img
                id="jp_poster_0"
                style={{ width: "0px", height: "0px", display: "none" }}
              />
              <audio
                ref={audioCurrentTime}
                onTimeUpdate={(e) => {
                  handleTimeupdate(e);
                }}
                onLoadedMetadata={handleMetadata}
                id="jp_audio_0"
                preload="none"
                src=""
                title="Cro Magnon Man"
              >
                <p>Your user agent does not support the HTML5 Audio element.</p>
              </audio>
            </div>
            <div
              id="jp_container_1"
              className="jp-audio jp-state-playing"
              role="application"
              aria-label="media player"
            >
              <div className="player_left">
                <div className="ms_play_song">
                  <div className="play_song_name">
                    <a id="playlist-text">
                      <div className="jp-now-playing flex-item">
                        <div className="jp-track-name">
                          <span className="que_img">
                            <img
                              id="avartarSong"
                              style={{ maxWidth: "100%" }}
                            />
                          </span>
                          <div className="que_data">
                            <h3>
                              <a style={{ color: "white" }}>
                                {currentPlay != undefined
                                  ? currentPlay.title
                                  : ""}
                              </a>
                            </h3>
                            {currentPlay != null ? (
                              <div className="jp-artist-name">
                                {returnArtist(currentPlay.artistSongs)}
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div
                  style={{ color: "white", fontWeight: "400" }}
                  className="play_song_options"
                >
                  <ul>
                    <li>
                      <a>
                        <span className="song_optn_icon">
                          <i className="ms_icon icon_download" />
                        </span>
                        download now
                      </a>
                    </li>
                    {/* <li style={{display:'none'}}>
                      <a ><span className="song_optn_icon"><i className="ms_icon icon_fav" /></span>Add To Favourites</a>
                    </li>
                    <li style={{display:'none'}}>
                      <a ><span className="song_optn_icon"><i className="ms_icon icon_playlist" /></span>Add To Playlist</a>
                    </li> */}
                  </ul>
                </div>
                <span className="play-left-arrow">
                  <i className="fa fa-angle-right" aria-hidden="true" />
                </span>
              </div>
              {renderRightQueue()}
              <div className="jp-type-playlist">
                <div className="jp-gui jp-interface flex-wrap">
                  <div className="jp-controls flex-item">
                    <button
                      className="jp-previous"
                      onClick={handlePrevSong}
                      tabIndex={0}
                    >
                      <i className="ms_play_control" />
                    </button>
                    <button
                      onClick={PlayOrPauseEvent}
                      className="jp-play"
                      tabIndex={0}
                    >
                      <i className="ms_play_control" />
                    </button>
                    <button
                      className="jp-next"
                      onClick={handleNextSong}
                      tabIndex={0}
                    >
                      <i className="ms_play_control" />
                    </button>
                  </div>
                  <div
                    ref={progressContainerRef}
                    className="jp-progress-container flex-item"
                  >
                    <div className="jp-time-holder">
                      <span
                        className="jp-current-time"
                        id="playingTime"
                        role="timer"
                        aria-label="time"
                      >
                        {getSecondsToMinutesAndSeconds(currentTrackMoment)}
                      </span>
                      <span
                        className="jp-duration"
                        id="durationTime"
                        role="timer"
                        aria-label="duration"
                      >
                        {currentTrackDuration}
                      </span>
                    </div>
                    <div className="jp-progress">
                      <div
                        className="jp-seek-bar"
                        onMouseLeave={handleOnMouseDown}
                        onMouseDown={handleOnMouseDown}
                        onMouseMove={handleOnMouseDown}
                        onMouseUp={handleMouseUp}
                        onTouchStart={onTouch}
                        onTouchMove={onTouch}
                        onTouchEnd={onTouch}
                        style={{ width: "100%" }}
                      >
                        <div
                          ref={progressBarRef}
                          className="jp-play-bar"
                          onMouseLeave={handleOnMouseDown}
                          onMouseDown={handleOnMouseDown}
                          onMouseMove={handleOnMouseDown}
                          onMouseUp={handleMouseUp}
                          onTouchStart={onTouch}
                          onTouchMove={onTouch}
                          onTouchEnd={onTouch}
                          style={{ width: `${parseInt(progressBarWidth)}%` }}
                        >
                          <div className="bullet" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="jp-toggles flex-item">
                    <button
                      className="jp-shuffle"
                      onClick={handleRandom}
                      tabIndex={0}
                      title="Shuffle"
                    >
                      <i className="ms_play_control" />
                    </button>
                    <button className="jp-repeat" tabIndex={0} title="Repeat">
                      <i
                        className="ms_play_control"
                        onClick={() => repeatPlay()}
                      />
                    </button>
                  </div>
                  <div className="jp_quality_optn custom_select">
                    <select style={{ display: "none" }}>
                      <option>quality</option>
                      <option value={1}>HD</option>
                      <option value={2}>High</option>
                      <option value={3}>medium</option>
                      <option value={4}>low</option>
                    </select>
                    <div className="nice-select" tabIndex={0}>
                      <span className="current">quality</span>
                      <ul className="list">
                        <li data-value="quality" className="option selected">
                          quality
                        </li>
                        <li data-value={1} className="option">
                          HD
                        </li>
                        <li data-value={2} className="option">
                          High
                        </li>
                        <li data-value={3} className="option">
                          medium
                        </li>
                        <li data-value={4} className="option">
                          low
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*main div*/}
      </div>
    </>
  );
};
export default PlayAudio;
