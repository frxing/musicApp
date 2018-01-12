import React,{Component} from 'react';
import './header.less';

class MusicHeader extends Component {
    handleClick() {
        window.history.back();
    }
    render() {
        return (
            <div className="music-header" >
                <span className="header-back" onClick={this.handleClick} >
                    <i className="iconfont icon-return" ></i>
                </span>
                <div className="header-title">
                    {this.props.title}
                </div>
            </div>
        )
    }
}

export default MusicHeader;