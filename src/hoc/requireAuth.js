import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { checkAuth } from '../actions';
import Loader from '../components/customFields/loader';

export default (ChildCompnent, isLoader = true) => {
  class RequireAuth extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLogin: null
      };
    }
    componentDidMount() {
      this.props.checkAuth({token: this.props.token});
    }
    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.isLogin !== prevState.isLogin) {
        return {
          isLogin: nextProps.isLogin
        };
      } else return null;
    }

    render() {
      switch (this.state.isLogin) {
        case false:
          return <Redirect to="/login" />;
        case null:
          return <Loader className={`${isLoader ? 'loader' : ''}`} />;
        default:
          return <ChildCompnent {...this.props} />;
      }
    }
  }

  function mapStateToProps({ auth: { isLogin = false, token= '' } }) {
    return { isLogin, token };
  }

  return connect(
    mapStateToProps,
    { checkAuth }
  )(RequireAuth);
};
