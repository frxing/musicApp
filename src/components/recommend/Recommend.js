import React, { Component } from "react";
import {Route} from "react-router-dom";
import Swiper from "swiper";
import { getCarousel, getNewAlbum } from "../../api/recommend";
import { CODE_SUCCESS } from "../../api/config";
import * as AlbumModel from "../../model/album";
import Scroll from "../../common/scroll/Scroll";
import Loading from "../../common/loading/Loading";
import LazyLoad, { forceCheck } from "react-lazyload";
import Album from "../../containers/Album";

import "./Recommend.less";
import "swiper/dist/css/swiper.css";

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            sliderList: [],
            newAlbums: [],
            refreshScroll: false
        };
    }
    componentDidMount() {
        getCarousel().then(res => {
            if (!res) return;
            if (res.code === CODE_SUCCESS) {
                this.setState({ sliderList: res.data.slider }, () => {
                    if (!this.sliderSwiper) {
                        this.sliderSwiper = new Swiper(".slider-container", {
                            loop: true,
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            pagination: ".swiper-pagination"
                        });
                    }
                });
            }
        });
        getNewAlbum().then(res => {
            console.log("获取新专辑");
            if (!res) return;
            if (res.code === CODE_SUCCESS) {
                let albumList = res.albumlib.data.list;
                albumList.sort((a, b) => {
                    return (
                        new Date(b.piblic_time).getTime() -
                        new Date(a.public_time).getTime()
                    );
                });
                this.setState(
                    {
                        loading: false,
                        newAlbums: albumList
                    },
                    () => {
                        this.setState({ refreshScroll: true });
                    }
                );
            }
        });
    }
    toLink(linkUrl) {
        return () => {
            window.location.href = linkUrl;
        };
    }
    toAlbumDetail(url) {
        return () => {
            this.props.history.push({
                pathname: url
            })
        }
    }
    render() {
        let {match} = this.props;
        let albums = this.state.newAlbums.map(item => {
            let album = AlbumModel.createAlbumByList(item);
            return (
                <div className="album-wrapper" key={album.mId} onClick={this.toAlbumDetail(`${match.url+'/'+album.mId}`)}>
                    <div className="left">
                        <LazyLoad>
                            <img src={album.img} width="100%" height="100%" alt={album.name} />
                        </LazyLoad>
                    </div>
                    <div className="right">
                        <div className="album-name">{album.name}</div>
                        <div className="singer-name">{album.singer}</div>
                        <div className="public-time">{album.publicTime}</div>
                    </div>
                </div>
            );
        });
        return (
            <div className="recommend-box">
                <Scroll refresh={this.state.refreshScroll} onScroll={(e) => {
                    forceCheck();
                }}>
                    <div>
                        <div className="slider-container">
                            <div className="swiper-wrapper">
                                {this.state.sliderList.map(item => {
                                    return (
                                        <div
                                            className="swiper-slide"
                                            key={item.id}
                                        >
                                            <a
                                                className="slider-nav"
                                                onClick={this.toLink(
                                                    item.linkUrl
                                                )}
                                            >
                                                <img
                                                    src={item.picUrl}
                                                    width="100%"
                                                    height="100%"
                                                    alt="推荐"
                                                />
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="swiper-pagination" />
                        </div>
                        <div className="album-container">
                            <h1 className="title">最新专辑</h1>
                            <div className="album-list">{albums}</div>
                        </div>
                    </div>
                </Scroll>
                <Loading title="正在加载" show={this.state.loading} />
                <Route path={`${match.url+'/:id'}`} component={Album} />
            </div>
        );
    }
}
export default Recommend;
