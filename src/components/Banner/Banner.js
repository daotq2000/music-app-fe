import React from "react";
import BannerImage from "../../resource/images/banner.png";

const Banner = () => {
  return (
    <>
      <div
        style={{ fontSize: "15px", fontWeight: "500" }}
        className="ms-banner"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="ms_banner_img">
                <img src={BannerImage} alt="" className="img-fluid" />
              </div>
              <div className="ms_banner_text">
                <h1>Âm nhạc</h1>
                <h1 className="ms_color">Nơi xoa dịu tâm hồn!</h1>
                <p>Chữa lành những tổn thương...</p>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Banner;
