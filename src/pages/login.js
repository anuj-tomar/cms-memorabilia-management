import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { validate } from '../utils/validation';
import { loginSubmit } from '../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.interval = 0;
    this.timer = 120;
    this.state = {
      phone: '',
      username: '',
      otp: '',
      password: '',
      isValid: {},
      errorMessages: {},
      error: '',
      isOtpSend: false,
      section: 'email'
    };
  }

  componentDidMount() {
    document.body.classList.add('bg-login');
  }
  componentWillUnmount() {
    document.body.classList.remove('bg-login');
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  secondsToTime = (secs) => {
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
    return `0${minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
  }
  startTimer = () => {
    this.interval = setInterval(() => {
      this.timer = this.timer - 1;
      let el = document.getElementById('_timer');
      el ? el.innerHTML = this.secondsToTime(this.timer) : clearInterval(this.interval);
      if (this.timer == 0) {
        clearInterval(this.interval);
        this.timer = 120;
        this.setState({ isOtpSend: false });
      }
    }, 1000);
  }

  validate = (name, value) => {
    let { isValid, errorMessages } = this.state;
    let error = validate(name, value, { type: 'text' });
    isValid[name] = error.isValid;
    error.isValid
      ? delete errorMessages[name]
      : (errorMessages[name] = error.errorMsg);
    this.setState({ isValid, errorMessages });
  };

  inputChange = e => {
    let {
      target: { name, value }
    } = e;
    if(name === 'phone' && this.state.isOtpSend){
      return;
    }
    this.setState({ [name]: value }, () => {
      this.validate(name, value);
    });
  };

  onSubmit = (e, type = '') => {
    if ((e.key === 'Enter' && !e.shiftKey) || type) {
      this.setState({ error: '' });
      e.preventDefault();
      let payload = {};
      let { target: { name, value } } = e;
      name = type ? type : name;
      if (name === 'username' || name == 'password') {
        this.validate('username', this.state.username);
        this.validate('password', this.state.password);
      } else {
        this.validate(name, this.state[name]);
      }
      if (name === 'phone' && this.state.isValid[name] && !this.state.otp) {
        payload.phone = this.state.phone;
        payload.type = 'phone';
      } else if (name === 'otp' && this.state.isValid[name]) {
        payload.otp = this.state.otp;
        payload.phone = this.state.phone;
        payload.type = 'otp';
      } else if ((name === 'username' || name == 'password') && this.state.isValid.username && this.state.isValid.password) {
        payload.username = this.state.username;
        payload.password = this.state.password;
        payload.type = 'username';
      }
      payload.token = this.props.token;
      this.props.loginSubmit({ payload, token: this.props.token }, (response) => {
        if (response.status) {
          this.setState({ error: '' });
          if (payload.type !== 'phone') {
            this.props.history.push('/home');
          } else {
            this.startTimer();
            this.setState({ isOtpSend: true });
          }
        } else {
          this.setState({ error: response.message });
        }
      })
    }
  }

  resendOtp = (e) => {
    e.preventDefault();
    let payload = { phone: this.state.phone, type: 'phone', token: this.props.token };
    this.props.loginSubmit({ payload, token: this.props.token }, (response) => {
      if (response.status) {
        this.setState({ error: '', isOtpSend: true });
      } else {
        this.setState({ error: response.message, isOtpSend: false });
      }
    })
  }

  setSection = (e, section) => {
    e.preventDefault();
    this.setState({ section, isOtpSend: false, error: '' });
  }

  render() {
    let { phone, username, otp, password, isValid, errorMessages, error, isOtpSend, section } = this.state;
    // if (this.props.isLogin) {
    //   return <Redirect to="/dashboard" />
    // }
    return (
      <div className=''>
        <div className='container'>
          <div className='home'>
            {/* <div className='logo'></div> */}
            <h3 className='title'>The Incred Merchant Management System</h3>
            <p className='title'>Incred Access</p>
            <div className='login-form'>
              <div>
                {section == 'phone' &&
                  <div>
                    <input className='form_control' type="number" name="phone" value={phone} disabled={isOtpSend} onChange={this.inputChange} placeholder='Phone No.' onKeyDown={this.onSubmit}></input>
                    {!isValid.phone && <div className="error_msg" >{errorMessages.phone}</div>}
                  </div>
                }
                {section == 'email' &&
                  <div>
                    <input className='form_control' placeholder='Username' name="username" value={username} onChange={this.inputChange} onKeyDown={this.onSubmit}></input>
                    {!isValid.username && <div className="error_msg" >{errorMessages.username}</div>}
                  </div>
                }
              </div>
              {/* <div className='text-center txt-or'>Or</div> */}
              <div>
                {section == 'phone' && isOtpSend &&
                  <div>
                    <input className='form_control mb5' placeholder='OTP' name="otp" value={otp} onChange={this.inputChange} onKeyDown={this.onSubmit}></input>
                    {!isValid.otp && <div className="error_msg" >{errorMessages.otp}</div>}
                    <a href='#' className='txt-common' type="number" >Resend OTP will be active in: <span id="_timer">02:00</span></a>
                  </div>
                }
                {section == 'email' &&
                  <div>
                    <input className='form_control mb5' placeholder='Password' type="password" name="password" value={password} onChange={this.inputChange} onKeyDown={this.onSubmit}></input>
                    {!isValid.password && <div className="error_msg" >{errorMessages.password}</div>}
                    {/* <a href='#' className='txt-common'>Forgot Password?</a> */}
                  </div>
                }
                {error && <p className='error_msg' style={{ color: 'red' }}>{error}</p>}
              </div>
              <div className='d-flex justify-content-center mt30'>
                {section == 'email' && <div className='btn-login text-center' onClick={(e) => this.onSubmit(e, 'username')}>Log In</div>}
                {section == 'phone' && <div className='btn-login text-center' onClick={(e) => this.onSubmit(e, isOtpSend ? 'otp' : 'phone')}>{!isOtpSend ? 'Request OTP' : 'Submit OTP'}</div>}
              </div>
              <div className='d-flex justify-content-center mt10'>
                {section == 'phone' && <div className='txt-common txt-underline' onClick={(e) => this.setSection(e, 'email')}>Log In With Username and Password</div>}
                {section == 'email' && <div className='txt-common txt-underline' onClick={(e) => this.setSection(e, 'phone')}>Log In  With Phone Number</div>}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
function mapStateToProps({ auth: { token = '', isLogin } }) {
  return { token, isLogin }
}
export default connect(mapStateToProps, { loginSubmit })(Login);
