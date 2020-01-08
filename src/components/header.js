import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { ToastContainer } from 'react-toastify';

import { Endpoint } from '../utils/constants';
import { historyPushstate } from '../utils/history';
import { fetchSuggestions, updatePageData } from '../actions/page';
import { logout } from '../actions';
import '../style/header.scss';

class Header extends Component {

  constructor(props) {
    super(props);
    this.interval = null;
    this.state = {
      isOpen: false,
      clubName: ''
    }
  }

  componentDidMount() {
    this.props.fetchSuggestions({ url: `${Endpoint.CLUB_MANAGE}?token=${this.props.token}` });
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.clubList != this.props.clubList) || (prevProps.authData.clubId != this.props.authData.clubId)) {
      this.setState({ clubName: this.getClubName() })
    }
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  selectClub = (e, item) => {
    e.preventDefault();
    this.props.updatePageData({
      params: { token: this.props.token },
      url: `${Endpoint.CLUB_MANAGE}/${item.id}`,
      method: 'GET'
    }, (response) => {
      if (response.status) {
        window.location.reload();
      } else {
        this.setState({ error: response.message })
      }
    });
  }

  getClubName = () => {
    let { clubList, authData } = this.props;
    if (clubList && clubList.length) {
      let club = clubList.filter((club) => {
        return parseInt(authData.clubId) === parseInt(club.id);
      })
      return club && club.length ? club[0].clubName : '';
    }
    return ''
  }
  logout = (e) => {
    e.preventDefault();
    this.props.logout({ url: `${Endpoint.LOGOUT}?token=${this.props.token}`, token: this.props.token},(response) => {
      if ( response.response && response.response.status) {
        //this.props.setAuthData({token: ''});
        historyPushstate('/login');
      }
    });
  }
  render() {
    let { clubList } = this.props;
    return (
      <nav className="">
        {/* <ToastContainer /> */}
        <div style={{ minHeight: '60px' }}>
          <div className="fixedheight">
            <div className="_header  ">
              <div className="strip_black d-flex align-items-center">
                <div className="container-fluid">
                  <div className="row no-gutters d-flex align-items-center pr20">
                    <div className='col-6 col'>
                      <div className='d-flex align-items-center'>
                        <Link className="logo-quorum" to="/"></Link>
                        <div className="logo_txt pr d-flex align-items-center cursor-default">
                          <Link to="/" title="Select Casting Dir" className="logo_txt">CLUB MANAGEMENT SYSTEM</Link>
                        </div>
                      </div>
                    </div>
                    {/* <div className='col-lg-3 col'>
                      <div className='_time'>
                        <div>{dateToStr(null, "dddd, Do[,] MMMM YYYY")}</div>
                        <div>current time : {this.state.time}</div>
                      </div>
                    </div>
                    <div className='col text-right'>
                      <a href='#' className='userName'>{this.props.authData.name || "--"}</a>
                    </div>*/}
                    <div className='col-6 text-right'>
                      <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                        <DropdownToggle caret tag="p" className="logo_txt cursor-pointer">
                          {this.state.clubName}
                        </DropdownToggle>
                        <DropdownMenu className="notificationLst club-list" right>
                          {clubList && clubList.length && clubList.map((item, i) => {
                            return <DropdownItem key={i} tag="li" onClick={(e) => this.selectClub(e, item)}>{item.clubName}</DropdownItem>;
                          })}
                          <DropdownItem tag="li" onClick={this.logout}>LOGOUT</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
function mapStateToProps({ auth: { authData, token }, page: { clubList = [] } }) {
  return { authData, clubList, token };
}

const mapDispatchToProps = function (dispatch) {
  return {
    fetchSuggestions: myParam => dispatch(fetchSuggestions(myParam, 'clubList')),
    updatePageData: (myParam, cb) => dispatch(updatePageData(myParam, cb)),
    logout: (myParams, cb) => dispatch(logout(myParams, cb))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header)
