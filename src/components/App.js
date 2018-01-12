import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    NavLink
} from "react-router-dom";
import logo from "../assets/images/logo.png";

import Recommend from "./recommend/Recommend";
import Ranking from "./ranking/Ranking";
import Search from "../containers/Search";
import MusicPlayer from "./play/MusicPlayer";
import Singer from "../containers/Singer";

import "../assets/reset.less";
import "../assets/font/iconfont.less";
import "./App.less";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="app">
                    <header className="app-header">
                        <img src={logo} className="app-logo" alt="logo" />
                        <h1 className="app-title">音悦</h1>
                    </header>
                    <div className="nav-box">
                        <div className="nav-item">
                            <NavLink to="/recommend" className="nav-link">
                                <span>推荐</span>
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/ranking" className="nav-link">
                                <span>排行榜</span>
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/search" className="nav-link">
                                <span>搜索</span>
                            </NavLink>
                        </div>
                    </div>
                    <div className="view-box">
                        <Switch>
                            <Route exact path="/" component={Recommend} />
                            <Route path="/recommend" component={Recommend} />
                            <Route path="/ranking" component={Ranking} />
                            <Route path="/search" component={Search} />
                            <Route path="/singer/:id" component={Singer} />
                        </Switch>
                    </div>
                    <MusicPlayer />
                </div>
            </Router>
        );
    }
}

export default App;
