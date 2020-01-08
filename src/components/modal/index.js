import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { updateModalData } from '../../actions/page';
import Loader from '../customFields/loader';

class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = null;
    this.state = { modal: null, module: null, isLoaded: false, isOpen: false, body: '' };
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handleOnPopstate);
  }
  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleOnPopstate);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modal !== prevState.modal) {
      return { modal: nextProps.modal };
    } else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.modal !== this.props.modal) {
      let { modal } = this.props;
      this.setState({ isOpen: modal.showCustomModal });
      if (modal.path) {
        import(`../${modal.path}`)
          .then(module =>
            this.setState({ module: module.default, isLoaded: true, body: '' })
          )
          .catch(e => {
            console.log(e);
          });
      } else if (modal.body) {
        this.setState({ body: modal.body, module: '', isLoaded: true })
      }
    }
  }

  handleOnPopstate = event => {
    console.log('came');
    let {
      modal: { showCustomModal }
    } = this.props;
    if (showCustomModal) {
      this.closeModal();
    }
  };
  closeModal = (e) => {
    if (e) e.preventDefault();
    this.setState({
      modal: null,
      module: null,
      //isLoaded: false,
      isOpen: false
    });
    this.props.updateModalData({ showCustomModal: false });
  };

  scrollTo = (offsetTop = 0) => {
    let elem = document.getElementById('scrollRef');
    elem.scrollTop = elem.scrollTop + offsetTop;
  };

  render() {
    const { module: Component, modal, isLoaded, body } = this.state;
    const { modal: { footer, submitArg, onSubmit } } = this.props;

    return (
      <Modal
        isOpen={modal.showCustomModal}
        className={modal.className}
        backdrop="static"
      >
        <div>
          <a href="#" className="btn-close pa" onClick={this.closeModal}>
            <span className="pclose">+</span>
          </a>
        </div>
        <ModalBody id="scrollRef">
          {!isLoaded && <Loader />}
          {isLoaded && Component && (
            <Component
              {...modal}
              closeModal={this.closeModal}
              toastmessage={this.props.toastmessage}
              scrollTo={this.scrollTo}
            />
          )}
          {isLoaded && body && (
            body
          )}
        </ModalBody>
        {footer && <ModalFooter>
          <Button color="" onClick={this.closeModal}>
            Cancel
          </Button>
          {onSubmit &&
            <Button color="" onClick={(e) => {
              onSubmit(e, this.closeModal, submitArg)
            }}>
              OK
          </Button>
          }
        </ModalFooter>
        }
      </Modal>
    );
  }
}
function mapStateToProps({ page: { modal = { showCustomModal: false } } }) {
  return {
    modal
  };
}
export default connect(
  mapStateToProps,
  { updateModalData }
)(CustomModal);
