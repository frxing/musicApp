import React,{Component} from "react";
import loadingImg from './loading.gif';
import "./loading.less";

class Loading extends Component {
    render() {
        let isShow = this.props.show ? {display: ''} : {display: 'none'};
        return (
            <div className="loading-container" style={isShow} >
                <div className="loading-wrapper" >
                    <img src={loadingImg} width="18px" height="18px" alt="loading"/>
                    <p className="loading-title" >{this.props.title}</p>
                </div>
            </div>
        )
    }
}

export default Loading;