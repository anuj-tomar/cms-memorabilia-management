import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Endpoint, ROUTER_MAPPER } from '../utils/constants';
import { getPageData, resetPageStore } from '../actions/page';
import Loader from '../components/customFields/loader';
import { dateToStr } from '../utils/formatter';
import '../style/newStyle.scss';

class Home extends Component {
    constructor(props) {
        super(props);
        this.interval = null;
        this.state = {
            time: dateToStr(null, "HH:mm")
        }
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({ time: dateToStr(null, "HH:mm") })
        }, 1000)
        this.props.getPageData({
            params: { token: this.props.token },
            url: Endpoint.MODULE_MANAGE
        })
    }
    componentWillUnmount() {
        this.props.resetPageStore('pageData');
    }

    componentDidUpdate(prevProps) {
        let { isLoader, list } = this.props;
        if (!isLoader && list != prevProps.list && list.modules && list.modules.length) {

        }
    }
    getDateTime(type) {
        if (type === 'date') {
            return dateToStr(null, "dddd, Do[,] MMMM YYYY")
        } else {
            var date = new Date();
            return date.getHours() + ':' + date.getMinutes();
        }
    }

    render() {
        let { isLoader, list: { modules = [] } } = this.props;
        return (
            <div className='quorum_new'>
                {isLoader && <Loader />}
                {!isLoader &&
                    <div className='new_home'>
                        <div className='row no-gutters'>
                            <div className='col-md-4'>
                                <div className='tab-scroll'>
                                    {modules && modules.length && modules.map((item, i) => {
                                        if (item.slug === 'view_checked_in_member' || item.slug === 'view_reservations') {
                                            return <Link key={i} className='tabs' to={ROUTER_MAPPER[item.slug]}><p>{item.name}</p></Link>
                                        }
                                    })}
                                    <div className='d-flex flex-wrap'>
                                        {modules && modules.length && modules.map((item, i) => {
                                            if (item.slug !== 'view_checked_in_member' && item.slug !== 'view_reservations') {
                                                return <Link key={i} className={`tabs tab-square`} to={ROUTER_MAPPER[item.slug] || '/'} ><p>{item.name}</p></Link>
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className='col-md'>
                                <a href={'https://api.whatsapp.com/send?phone=+917703908030'} target="_blank" rel="noopener noreferrer">
                                    <div className='image-style upload-photo' style={{ backgroundImage: `url('./images/whatsAppIcon.png')`, backgroundSize: '45%' }}>
                                        <img src='./images/imagesize16_9.png' alt='b' className='w100per' />
                                    </div>
                                </a>
                                <div className='d-flex justify-content-between mt20'>
                                    <p className='current_time'>{this.state.time}</p>
                                    <div className='text-right'>
                                        <p className='current_time'>{dateToStr(null, "dddd")}</p>
                                        <p className='current_time'> {dateToStr(null, "MMM Do[] ")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
function mapStateToProps({ auth: { token }, page: { pageData: { data = {} }, isLoader = false } }) {
    return { token, isLoader, list: data }
}
export default connect(mapStateToProps, { getPageData, resetPageStore })(Home);
