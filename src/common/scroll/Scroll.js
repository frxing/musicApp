import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import BScroll from "better-scroll";
import "./scroll.less";

class Scroll extends Component {
    componentDidUpdate() {
        /**
         * 在组件更新后都要重新获取组件的高度
         */
        if (this.bScroll && this.props.refresh) {
            this.bScroll.refresh();
        }
    }
    componentDidMount() {
        this.scrollView = ReactDOM.findDOMNode(this.refs.scrollView);
        if (!this.bScroll) {
            this.bScroll = new BScroll(this.scrollView, {
                probeType: 3,
                click: this.props.click   // 可点击
            });
            if (this.props.onScroll) {
                this.bScroll.on("scroll", (scroll) => {
                    this.props.onScroll(scroll);
                });
            }
        }
    }
    componentWillUnmount() {
        this.bScroll.off("scroll");
        this.bScroll = null;
    }
    refresh() {
        if (this.bScroll) {
            this.bScroll.refresh();
        }
    }
    render() {
        return (
            <div className="scroll-view" ref="scrollView">
                {this.props.children}
            </div>
        );
    }
}
Scroll.defaultProps = {
    click: true,
    refresh: false,
    onScroll: null
};
Scroll.propTypes = {
    click: PropTypes.bool,
    refresh: PropTypes.bool,
    onScroll: PropTypes.func
};

export default Scroll;
