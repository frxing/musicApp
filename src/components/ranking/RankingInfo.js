import React from "react"
import ReactDOM from "react-dom"
import {CSSTransition} from "react-transition-group"
// import {getTransitionEndName} from "../../util/event"
import Header from "../../common/header/Header"
import Scroll from "../../common/scroll/Scroll"
import Loading from "../../common/loading/Loading"
import {getRankingInfo} from "../../api/ranking"
import {getSongVKey} from "../../api/song"
import {CODE_SUCCESS} from "../../api/config"
import * as RankingModel from "../../model/ranking"
import * as SongModel from "../../model/song"
import "./rankinginfo.less"

class RankingInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
            show: false,
			loading: true,
			ranking: {},
			songs: [],
			refreshScroll: false
		}
	}
	componentDidMount() {
        this.setState({
            show: true
        });
		// let rankingBgDOM = ReactDOM.findDOMNode(this.refs.rankingBg);
		// let rankingContainerDOM = ReactDOM.findDOMNode(this.refs.rankingContainer);
		this.rankingContainerDOM.style.top = this.rankingBgDOM.offsetHeight + "px";

		getRankingInfo(this.props.match.params.id).then((res) => {
			//console.log("获取排行榜详情：");
			if (res) {
				//console.log(res);
				if (res.code === CODE_SUCCESS) {
					let ranking = RankingModel.createRankingByDetail(res.topinfo);
					ranking.info = res.topinfo.info;
					let songList = [];
					res.songlist.forEach(item => {
						if (item.data.pay.payplay === 1) { return }
						let song = SongModel.createSong(item.data);
						//获取歌曲vkey
						this.getSongUrl(song, item.data.songmid);
						songList.push(song);
					});

					this.setState({
						loading: false,
						ranking: ranking,
						songs: songList
					}, () => {
						//刷新scroll
						this.setState({refreshScroll:true});
					});
				}
			}
		});
	}
	getSongUrl(song, mId) {
		getSongVKey(mId).then((res) => {
			if (res) {
				if(res.code === CODE_SUCCESS) {
					if(res.data.items) {
						let item = res.data.items[0];
						song.url =  `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
					}
				}
			}
		});
	}
	/**
	 * 选择歌曲
	 */
	selectSong(song) {
		return (e) => {
			this.props.setSongs([song]);
			this.props.changeCurrentSong(song);
		};
	}
	/**
	 * 播放全部
	 */
	playAll = () => {
		if (this.state.songs.length > 0) {
			//添加播放歌曲列表
			this.props.setSongs(this.state.songs);
			this.props.changeCurrentSong(this.state.songs[0]);
			this.props.showMusicPlayer(true);
		}
	}
	/**
	 * 监听scroll
	 */
	scroll = ({y}) => {
        let headerDOM = ReactDOM.findDOMNode(this.refs.header);
		
		if (y < 0) {
			if (Math.abs(y) + 55 > this.rankingBgDOM.offsetHeight) {
				this.rankingFixedBgDOM.style.display = "block";
			} else {
				this.rankingFixedBgDOM.style.display = "none";
            }
            let bgColor = `rgba(194,17,17,${0+1*(Math.abs(y)/(this.rankingBgDOM.offsetHeight-55))})`;
            headerDOM.style['backgroundColor'] = bgColor;
		} else {
			let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
			this.rankingBgDOM.style["webkitTransform"] = transform;
			this.rankingBgDOM.style["transform"] = transform;
			this.playButtonWrapperDOM.style.marginTop = `${y}px`;
		}
	}
	render() {
		let ranking = this.state.ranking;
		let songs = this.state.songs.map((song, index) => {
			return (
				<div className="song" key={song.id} onClick={this.selectSong(song)}>
					<div className="song-index">{index + 1}</div>
					<div className="song-name">{song.name}</div>
					<div className="song-singer">{song.singer}</div>
				</div>
			);
		});
		return (
			<CSSTransition in={this.state.show} timeout={300} classNames="translate">
			<div className="ranking-info">
				<Header ref="header" title={ranking.title}></Header>
				<div style={{position:"relative"}}>
					<div ref={(rankingBg) => {this.rankingBgDOM = rankingBg}} className="ranking-img" style={{backgroundImage: `url(${ranking.img})`}}>
						<div className="filter"></div>
					</div>
					<div ref={(rankingFixedBg) => {this.rankingFixedBgDOM = rankingFixedBg;}} className="ranking-img fixed" style={{backgroundImage: `url(${ranking.img})`}}>
						<div className="filter"></div>
					</div>
					<div className="play-wrapper" ref={(playButtonWrapper) => {this.playButtonWrapperDOM = playButtonWrapper;}}>
						<div className="play-button" onClick={this.playAll}>
							<i className="iconfont icon-bofang"></i>
							<span>播放全部</span>
						</div>
					</div>
				</div>
				<div ref={(rankingContainer) => {this.rankingContainerDOM = rankingContainer}} className="ranking-container">
					<div className="ranking-scroll" style={this.state.loading === true ? {display:"none"} : {}}>
						<Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
							<div className="ranking-wrapper">
								<div className="ranking-count">排行榜 共{songs.length}首</div>
								<div className="song-list">
									{songs}
								</div>
								<div className="info" style={ranking.info ? {} : {display:"none"}}>
									<h1 className="ranking-title">简介</h1>
									<div className="ranking-desc">
										{ranking.info}
									</div>
								</div>
							</div>
						</Scroll>
					</div>
					<Loading title="正在加载..." show={this.state.loading}/>
				</div>
			</div>
			</CSSTransition>
		);
	}
}

export default RankingInfo