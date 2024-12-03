import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paginationSongs } from "../../redux/songReducer";
import PlayIcon from "../../resource/images/svg/play.svg";
import { Link } from "react-router-dom";
import { playSingleSong } from "../../redux/playReducer";
const ListSongs = () => {
  const [firstBlock, setFistBlock] = useState([]);
  const [secondBlock, setSecondBlock] = useState([]);
  const [thirdBlock, setThirdBlock] = useState([]);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 1,
    size: 30,
    field: 'countListen',
    order: 'asc',
    // search: search,
  })
  useEffect(() => {
    setPagination({ ...pagination })
  }, [])

  useEffect(() => {
    dispatch(paginationSongs(pagination))
  }, [dispatch, pagination.page, pagination.size, pagination.field, pagination.order])
  
  const state = useSelector((states) => {
    return states.songReducer;
  });
  const initialData = () => {
    const list = state.songs;
    let arr1 = [];
    let arr2 = [];
    let arr3 = [];
    let idx = 1;
    let audio = null;
    if (list != undefined && list != null) {
      if (list.length > 0) {
      }
      list.forEach((el, index) => {
        let obj = { ...el };
        obj.index = idx;
        if (index < 5) {
          arr1.push(obj);
        } else if (index < 10 && index > 4) {
          arr2.push(obj);
        } else if (index < 15 && index > 9) {
          arr3.push(obj);
        }
        idx++;
      });
      setFistBlock(arr1);
      setSecondBlock(arr2);
      setThirdBlock(arr3);
    }
  };
  useEffect(() => {
    initialData();
  }, [state]);
  const Songs = (props) => {
    const playSingleSongAction = (songObject) => {
      let result = state.songs;
      let rs = [];
      let index = songObject.id;
      result.forEach((item, idx) => {
        if (item.id != index) {
          let songObj = { songs: item };
          rs.push(songObj);
        }
      });
      let song = { songs: songObject };
      rs.splice(0, 0, song);
      dispatch(playSingleSong(rs));
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
        {props.items.map((item, index) => {
          return (
            <>
              <div key={`best-song-${item.id}`} className="ms_weekly_box">
                <div className="weekly_left">
                  <span className="w_top_no">
                    {" "}
                    {item.index < 10 ? `0${item.index}` : `${item.index}`}{" "}
                  </span>
                  <div className="w_top_song">
                    <div className="w_tp_song_img">
                      <img src={item.image} alt="" className="img-fluid" />
                      <div className="ms_song_overlay" />
                      <div className="ms_play_icon">
                        <img
                          onClick={() => playSingleSongAction(item)}
                          src={PlayIcon}
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="w_tp_song_name">
                      <h3>
                        <a>{item.title}</a>
                      </h3>
                      <p>
                        <Link to={`/artist/${item.id}`}>
                          {returnArtist(item.artistSongs)}
                        </Link>
                      </p>
                      <p>
                        Lượt nghe:{" "}
                        {item.countListen != null ? item.countListen : 0}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div  className="weekly_right">
                  <span className="w_song_time">{getSecondsToMinutesAndSeconds(Math.floor(item.timePlay))}</span>
                  <span onClick={(e) => showMoreItem(e)}  className="ms_more_icon" data-other={item.id}>
                    <img src={MoreIcon} alt="" />
                  </span>
                </div> */}
                {/* <ul className="more_option">
                  <li>
                    <a ><span className="opt_icon"><span className="icon icon_fav" /></span>Add To
                      Favourites</a>
                  </li>
                  <li>
                    <a ><span className="opt_icon"><span className="icon icon_queue" /></span>Add
                      To Queue</a>
                  </li>
                  <li>
                    <a href={item.mediaUrl} ><span className="opt_icon"><span className="icon icon_dwn" /></span>Download Now</a>
                  </li>
                  <li>
                    <a ><span className="opt_icon"><span className="icon icon_playlst" /></span>Add To Playlist</a>
                  </li>
                  
                </ul> */}
              </div>
              <div className="ms_divider"></div>
            </>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="ms_weekly_wrapper">
        <div className="ms_weekly_inner">
          <div className="row">
            <div className="col-lg-12">
              <div className="ms_heading">
                <h1>Bài hát mới nhất</h1>
                <span className="veiw_all">
                  <Link to={`chart`}>Xem thêm</Link>
                </span>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 padding_right40">
              <Songs items={firstBlock} />
            </div>
            <div className="col-lg-4 col-md-12 padding_right40">
              <Songs items={secondBlock} />
            </div>
            <div className="col-lg-4 col-md-12">
              <Songs items={thirdBlock} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ListSongs;
