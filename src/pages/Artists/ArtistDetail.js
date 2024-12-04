import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getAllSongByArtistId, getArtistById } from "../../redux/artistReducer";
import { renderArtist } from "../../utils/UtilsFunction";
import MoreIcon from "../../resource/images/svg/more.svg";
import { getSecondsToMinutesAndSeconds } from "../../utils/FormatDateTime";
import PlayIcon from "../../resource/images/svg/play.svg";
import PlayAllIcon from "../../resource/images/svg/play_all.svg";
import PauseAll from "../../resource/images/svg/pause_all.svg";
import QueueImage from "../../resource/images/svg/add_q.svg";
import { getPlayList, playSingleSong } from "../../redux/playReducer";
import $ from "jquery";
import { updateTotalListen } from "../../redux/songReducer";
import {Link} from 'react-router-dom'
import {playSingleSongActionFunc} from '../../utils/UtilsFunction'
const ListSong = (props) => {
  const dispatch = useDispatch();
  const items = props.items;
  const showMoreItem = (e) => {
    let target = $(e.target).parent().parent().parent();
    if (target.find("ul.more_option").hasClass("open_option")) {
      target.find("ul.more_option").removeClass("open_option");
    } else {
      $("ul.more_option.open_option").removeClass("open_option");
      target.find("ul.more_option").addClass("open_option");
    }
  };
  if (items != null) {
    return (
      <>
        {props.items.map((item, i) => {
          console.log(item)
          return (
            <div
              key={item.songs.id}
              className="col-lg-12 col-md-12 padding_right40"
            >
              <div className="ms_weekly_box">
                <div className="weekly_left">
                  <span className="w_top_no">{i < 10 ? `0${i + 1}` : i}</span>
                  <div className="w_top_song">
                    <div className="w_tp_song_img">
                      <img
                        src={item.songs.image}
                        alt=""
                        className="img-fluid"
                      />
                      <div className="ms_song_overlay"></div>
                      <div
                        onClick={() => playSingleSongActionFunc(item,props.artistSongs,dispatch,playSingleSong)}
                        className="ms_play_icon"
                      >
                        <img src={PlayIcon} alt="" />
                      </div>
                    </div>
                    <div className="w_tp_song_name">
                      <h3>
                        <a href="#">{item.songs.title}</a>
                      </h3>
                      <p>
                        <Link to={`/artist/${item.id}`}>
                          {item.artists.fullName}
                        </Link>
                      </p>
                      <p>
                        Lượt nghe:{" "}
                        {item.songs.countListen != null
                          ? item.songs.countListen
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="weekly_right">
                  <span className="w_song_time">
                    {getSecondsToMinutesAndSeconds(
                      Math.floor(item.songs.timePlay)
                    )}
                  </span>
                  <span
                    onClick={showMoreItem}
                    className="ms_more_icon"
                    data-other={1}
                  >
                    <img src={MoreIcon} alt="" />
                  </span>
                </div>
                <ul className="more_option">
                  <li>
                    <a href="#">
                      <span className="opt_icon">
                        <span className="icon icon_fav" />
                      </span>
                      Add To Favourites
                    </a>
                  </li>
                  <li>
                    <a href={`#`}>
                      <span className="opt_icon">
                        <span className="icon icon_queue" />
                      </span>
                      Add To Queue
                    </a>
                  </li>
                  <li>
                    <a href={item.songs.mediaUrl}>
                      <span className="opt_icon">
                        <span className="icon icon_dwn" />
                      </span>
                      Download Now
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="opt_icon">
                        <span className="icon icon_playlst" />
                      </span>
                      Add To Playlist
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return "";
};
const ArtistDetail = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    dispatch(getArtistById(params.id));
    // dispatch(getAllSongByArtistId(params.id));
  }, [dispatch, params.id]);
  const artistReducer = useSelector((e) => {
    return e.artistReducer;
  });
  useEffect(() => {
    let currentArtist = artistReducer.currentArtist;
    setArtist(currentArtist);
    if (currentArtist !== undefined) {
      setSongs(currentArtist.artistSongs);
    }
  }, [artistReducer, params.id]);
  const parseListSong = (data) => {
    let result = [];
    if (data != undefined) {
      data.forEach((e) => {
        if (e.songs != null) {
          result.push(e.songs);
        }
      });
    }
    return result;
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const playAllArtist = () => {
    dispatch(updateTotalListen({ target: "artist", id: params.id }));
    dispatch(playSingleSong(songs));
  };
  return (
    <>
      <div className="album_single_data">
        <div className="album_single_img">
          <img
            src={artist != null ? artist.image : ""}
            alt=""
            className="img-fluid"
          />
        </div>
        <div className="album_single_text">
          <h2> {`Nghệ sĩ: ${artist != null ? artist.fullName : ""}`}</h2>
          {/* <p className="singer_name">By - Ava Cornish, Brian Hill</p> */}
          <div className="album_feature">
            <a className="album_date">
              {artist != null ? songs.length : "0"} bài hát{" "}
            </a>
            <br />
            <a className="album_date">{`Hoạt động tại: ${
              artist != null ? artist.countryActive : ""
            }`}</a>
            <br />
            <a className="album_date">{`Lượt nghe: ${
              artist != null
                ? artist.countListen != null
                  ? artist.countListen
                  : 0
                : ""
            }`}</a>
          </div>
          <div
            style={{ color: "white", fontWeight: "700" }}
            className="album_btn"
          >
            <a
              style={{ cursor: "pointer" }}
              onClick={() => playAllArtist()}
              className="ms_btn play_btn"
            >
              <span className="play_all">
                <img src={PlayAllIcon} alt="" />
                Play All
              </span>
              <span className="pause_all">
                <img src={PauseAll} alt="" />
                Pause
              </span>
            </a>
            <a style={{ cursor: "pointer" }} className="ms_btn">
              <span className="play_all">
                <img src={QueueImage} alt="" />
                Add To Queue
              </span>
            </a>
          </div>
        </div>
        <div className="album_more_optn ms_more_icon">
          <span>
            <img src={MoreIcon} alt="" />
          </span>
        </div>
        <ul className="more_option">
          <li>
            <a>
              <span className="opt_icon">
                <span className="icon icon_fav" />
              </span>
              Add To Favourites
            </a>
          </li>
          <li>
            <a>
              <span className="opt_icon">
                <span className="icon icon_queue" />
              </span>
              Add To Queue
            </a>
          </li>
          <li>
            <a>
              <span className="opt_icon">
                <span className="icon icon_dwn" />
              </span>
              Download Now
            </a>
          </li>
          <li>
            <a>
              <span className="opt_icon">
                <span className="icon icon_playlst" />
              </span>
              Add To Playlist
            </a>
          </li>
        </ul>
      </div>
      <div class="ms_weekly_wrapper">
        <div class="ms_weekly_inner">
          <div class="row">
            <ListSong artistSongs={songs} items={songs} />
          </div>
        </div>
      </div>
    </>
  );
};
export default ArtistDetail;
