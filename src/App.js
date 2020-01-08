import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { renderRoutes, matchRoutes } from 'react-router-config';
import Header from './components/header';
import CustomModal from './components/modal';
import { getToken, checkAuth } from './actions';
import { toastmessage } from './utils';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount(){
    let { route } = this.props;
    let currentPath = matchRoutes(route.routes, window.location.pathname);
    if(!this.props.token){
       this.props.getToken();
    }else if(currentPath && currentPath.length && currentPath[0].match.path === '/login'){
      this.props.checkAuth({token: this.props.token});
    }
  }

  isInviteLink(lobj={}){
   return lobj.route && lobj.route.path === '/invite-link/:token';
  }


  render() {
    let { route, isLogin } = this.props;
    let currentPath = matchRoutes(route.routes, window.location.pathname);
    
    return (
      <React.Fragment>
        {isLogin && !this.isInviteLink(currentPath[0]) && <Header />}
        <div className="main-body">
          {renderRoutes(route.routes, {
            toastmessage: toastmessage
          })}
        </div>
        <CustomModal {...currentPath[0]} toastmessage={toastmessage} />
      </React.Fragment>
    );
  }
}

function mapStateToProps({auth: { isLogin=false, token='' }}){
   return { isLogin, token }
}
export default connect(mapStateToProps, { getToken, checkAuth })(withRouter(App));
