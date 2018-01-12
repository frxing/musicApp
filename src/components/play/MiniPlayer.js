import React from "react";
import Progress from "./Progress";
import "./miniPlayer.less";
import songImg from '../../assets/images/music.png';
class MiniPlayer extends React.Component {
    handlePlayOrPause = e => {
        e.stopPropagation();
        if (this.props.song.url) {
            //调用父组件的播放或暂停方法
            this.props.playOrPause();
        }
    };
    handleNext = e => {
        e.stopPropagation();

        if (this.props.song.url) {
            //调用父组件播放下一首方法
            this.props.next();
        }
    };
    handleShow = () => {
        if (this.props.song.url) {
            console.log("miniplayer");
            this.props.showMiniPlayer();
        }
    };
    render() {
        let song = this.props.song;

        let playerStyle = {};
        if (this.props.showStatus === true) {
            playerStyle = { display: "none" };
        }
        if (!song.img) {
            song.img = songImg;
        }

        let imgStyle = {};
        if (song.playStatus === true) {
            imgStyle["WebkitAnimationPlayState"] = "running";
            imgStyle["animationPlayState"] = "running";
        } else {
            imgStyle["WebkitAnimationPlayState"] = "paused";
            imgStyle["animationPlayState"] = "paused";
        }

        let playButtonClass =
            song.playStatus === true ? "iconfont icon-zanting" : "iconfont icon-bofang";
        return (
            <div
                className="mini-player"
                style={playerStyle}
                onClick={this.handleShow}
            >
                <div className="player-img rotate" style={imgStyle}>
                    <img src={song.img} alt={song.name} />
                </div>
                <div className="player-center">
                    <div className="progress-wrapper">
                        <Progress
                            disableButton={true}
                            progress={this.props.progress}
                        />
                    </div>
                    <span className="song">{song.name}</span>
                    <span className="singer">{song.singer}</span>
                </div>
                <div className="player-right">
                    <i
                        className={playButtonClass}
                        onClick={this.handlePlayOrPause}
                    />
                    <i className="iconfont icon-shangyishou1 ml-10" onClick={this.handleNext} />
                </div>
                <div className="filter" />
            </div>
        );
    }
}

export default MiniPlayer;
