import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchSuggestions, resetPageStore } from '../../actions/page';

import '../../style/chips.scss';

class Chips extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chips: [],
      autoChips: [],
      search: [],
      showSugessions: false,
      selectOnFocus: false,
      KEY: {
        backspace: 8,
        tab: 9,
        enter: 13
      },
      INVALID_CHARS: /[^a-zA-Z0-9 ]/g,
      isLoaded: false,
      inputVal: ''
    };
  }
  componentDidMount() {
    let { autocomplete, service } = this.props;
    if (autocomplete && service) {
      this.fetchSuggestions(service);
    }
    document.addEventListener('click', this.handleOutsideClick);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      (!prevState.isLoaded && nextProps.chips !== prevState.chips) ||
      (nextProps.livesearch && nextProps.searchList !== prevState.search)
    ) {
      let { searchList, livesearch } = nextProps;
      var so = { flag: !prevState.flag };
      if (livesearch) {
        so.search = searchList && searchList.length ? searchList : [];
        so.showSugessions = searchList && searchList.length ? true : false;
      }
      return so;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    let { chips, autocomplete, searchList,isSingle, isReset, isFlag } = this.props;
    if(isReset != prevProps.isReset && isReset){
      this.setState({chips: []});
      return;
    }
    if (
      !autocomplete &&
      !prevState.isLoaded &&
      chips &&
      chips.length &&
      chips !== prevState.chips
    ) {
      let c = this.buildChip(this.props);
      this.setState({ chips: c.length ? c : [], isLoaded: true });
    }
    if (
      autocomplete &&
      !prevState.isLoaded &&
      chips &&
      chips.length &&
      prevState.chips &&
      !prevState.chips.length &&
      searchList.length
    ) {
      let c = this.buildChip(this.props);
      this.setState({ chips: c.length ? c : [], isLoaded: true });
    }
    if(isSingle && chips !== prevState.chips && Array.isArray(chips)){
      this.setState({chips})
    }
  }

  componentWillUnmount() {
    this.props.resetPageStore(this.props.namespace);
    document.removeEventListener('click', this.handleOutsideClick);
  }

  fetchSuggestions = (service, collection) => {
    this.props.fetchSuggestions({ url: service });
  };

  handleOutsideClick = e => {
    // e.preventDefault();
    if (!e.target.closest('._' + this.props.name)) {
      let { namespace, livesearch } = this.props;
      if (livesearch) {
        this.props.resetPageStore(namespace);
      }
      this.setState({ search: [], showSugessions: false });
    }
  };

  buildChip = props => {
    let { chips, autocomplete, searchList, vk } = this.props;
    chips = chips ? chips : [];
    if (typeof chips === 'string') {
      chips = chips.trim().split(',');
    }
    if (autocomplete && chips.length) {
      if (searchList && searchList.length) {
        return searchList.filter(item => {
          return chips.indexOf(item[vk]) > -1;
        });
      } else {
        return [];
      }
    } else {
      return chips;
    }
  };

  setChips = chips => {
    if (chips && chips.length) this.setState({ chips });
  };
  onKeyDown = event => {
    let { autocomplete, isSingle } = this.props;
    let keyPressed = event.which;

    if (
      (keyPressed === this.state.KEY.enter ||
      keyPressed === this.state.KEY.tab) && event.target.value
    ) {
      event.preventDefault();
      if (!autocomplete && !isSingle) this.updateChips(event);
    } else if (keyPressed === this.state.KEY.backspace) {
      let chips = this.state.chips;

      if (!event.target.value && chips.length) {
        this.deleteChip(chips[chips.length - 1]);
      }
    }
  };

  clearInvalidChars = event => {
    let value = event.target.value;

    if (this.state.INVALID_CHARS.test(value)) {
      event.target.value = value.replace(this.state.INVALID_CHARS, '');
    } else if (value.length > this.props.maxlength) {
      event.target.value = value.substr(0, this.props.maxlength);
    }
  };
  setUpdatedChips = (value, item = {}) => {
    if (
      (value && !this.props.max) ||
      this.state.chips.length < this.props.max
    ) {
      let chip = value.trim().toLowerCase();

      if (chip && this.state.chips.indexOf(chip) < 0) {
        this.setState(
          {
            chips: [...this.state.chips, chip]
          },
          () => {
            if (this.props.setChips)
              this.props.setChips(this.state.chips.join(','), this.props.name, item);
          }
        );
      }
    }
  };
  updateChips = event => {
    let value = event.target.value;
    this.setUpdatedChips(value);
    event.target.value = '';
  };

  deleteChip = chip => {
    let { autocomplete, livesearch, disabled } = this.props;
    if(disabled)return;
    let index = (autocomplete || livesearch)
      ? this.getAutoChipIndex(chip)
      : this.state.chips.indexOf(chip);

    if (index >= 0) {
      this.setState(
        {
          chips: this.state.chips.filter((c, i) => {
            return i !== index;
          })
        },
        () => {
          if (this.props.setChips)
            this.props.setChips(
              (autocomplete) ? this.state.chips : this.state.chips.join(','),
              this.props.name
            );
        }
      );
    }
  };

  focusInput = event => {
    let children = event.target.children;
    let { autocomplete, searchList, selectOnFocus = false } = this.props;
    if (autocomplete && selectOnFocus && searchList.length) {
      this.setState({
        selectOnFocus,
        search: searchList,
        showSugessions: true
      });
    }
    if (children.length) children[children.length - 1].focus();
  };

  renderChips = () => {
    let { autocomplete, sk, isSingle = false, livesearch, singlechipstyle={} } = this.props;
    return  this.state.chips && this.state.chips.map((chip, index) => {
      return (
        <React.Fragment key={index + '_' + this.props.name}>
          {isSingle &&
            <span className="chip w100per search-input single" style={singlechipstyle}>
              <span className="chip-value" style={{ backgroundColor: 'none', background: 'none', padding: '2px' }}>{autocomplete || livesearch ? chip[sk] : chip}</span>
              <button
                type="button"
                style={{ background: '#e6e6e6', 'borderRadius': 0 }}
                className="chip-delete-button"
                onClick={e => this.deleteChip(chip)}
              >
                x
              </button>
            </span>
          }
          {!isSingle &&
            <span className="chip w100per search-input single" style={singlechipstyle}>
              <span className="chip-value">{autocomplete || livesearch ? chip[sk] : chip}</span>
              <button
                type="button"
                className="chip-delete-button"
                onClick={e => this.deleteChip(chip)}
              >
                x
              </button>
            </span>
          }
        </React.Fragment>
      );
    });
  };
  livesearch = value => {
    this.props.fetchSuggestions({
      url: this.props.service,
      params: {
        keyword: value
      }

    });
  };
  searchList = event => {
    let { autocomplete, searchList, sk, livesearch, onInputChage } = this.props;
    let value = event.target.value,
      search = [];
    this.setState({inputVal: value}, ()=>{
      if(onInputChage){
        this.props.onInputChage(value);
      }
    })
    if (livesearch) {
      this.livesearch(value);
    } else if (
      !livesearch &&
      autocomplete &&
      searchList &&
      searchList.length &&
      value
    ) {
      search = searchList.filter((item, i) => {
        return (
          item[sk] &&
          item[sk].toLowerCase().includes(value.toLowerCase().trim())
        );
      });
      this.setState({ search, showSugessions: search.length > 0 });
    }
  };

  getAutoChipIndex = item => {
    let { vk } = this.props;
    return this.state.chips.findIndex((chip, i) => {
      return chip[vk] === item[vk];
    });
  };
  setAutoChips = (e, item) => {
    let { name, livesearch, autocomplete, namespace, vk, maxCount } = this.props;
    if (maxCount && this.state.chips.length >= maxCount) {
      this.setState({ showSugessions: false });
      return;
    }
    if (livesearch && !autocomplete) {
      this.props.resetPageStore(namespace);
      //this.setUpdatedChips(item[vk]);
      // document.getElementById(name).value = '';
      // this.setState({ search: [], showSugessions: false });
      // return;
    }
    let chip = this.getAutoChipIndex(item);
    document.getElementById(name).focus();
    if (chip === -1) {
      document.getElementById(name).value = '';
      this.setState(
        {
          search: [],
          showSugessions: false,
          chips: [...this.state.chips, item]
        },
        () => {
          if (this.props.isSingle || (maxCount && this.state.chips.length >= maxCount)) {
            this.setState({ showSugessions: false });
          }
          if (this.props.setChips)
            this.props.setChips(this.state.chips, this.props.name, item);
        }
      );
    }
  };

  hideSearchList = e => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    } else {
      window.event.cancelBubble = true;
    }
    this.setState({ showSugessions: false });
  };

  highlight = (text) =>{
    var re = new RegExp(this.state.inputVal,"ig");
    return text.replace(re, `${this.state.inputVal}`)
  }

  render() {
    let { chips, search, showSugessions } = this.state;
    let {
      placeholder,
      className,
      name,
      autocomplete,
      sk,
      livesearch,
      disabled = false,
      inputClassName = "input-style",
      cstyle = {},
      image = '',
      isHighlight = false,
      stamp=''
    } = this.props;
    placeholder =
      !this.props.max || chips.length < this.props.max ? placeholder : '';

    return (
      <div className={className}>
        {/* <label>{label}</label> */}
        <div style={cstyle}
          className={`chips _${name} ${disabled ? 'disabledbtn' : ''}`}
          onClick={this.focusInput}
        >
          {this.renderChips()}
          <input type="hidden" value="something" />
          {!(this.props.maxCount === 1 && this.state.chips.length === 1) && <form>
            <input
              autoComplete="off"
              type="text"
              id={name}
              name={name}
              disabled={disabled}
              className={inputClassName}
              placeholder={placeholder}
              onKeyDown={this.onKeyDown}
              onKeyUp={this.clearInvalidChars}
              onChange={this.searchList}
            /></form>
          }
          <div className={`auto-suggest ${(autocomplete || livesearch) && showSugessions ? 'show' : 'hide'}`}>
            <ul>
              {search.map((item, i) => {
                return (
                  <li key={'auto_' + i} onClick={e => this.setAutoChips(e, item)} >
                  {image &&
                    <div className="image-style" style={{ backgroundImage: `url(${item[image]})` }} >
                      <img src={"/images/imagesize2_3.png"} alt={item[sk]} className="w100per" />
                    </div>}
                    <div className='d-flex justify-content-between flex-grow-1'>
                    <span className='user-name'>{isHighlight ? this.highlight(item[sk]) : item[sk]}</span>
                    {stamp &&<span className='user-name'>{item[stamp]}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = function (state, ownProps) {
  let { page } = state;
  return {
    searchList: ownProps.namespace ? page[ownProps.namespace] : []
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    fetchSuggestions: myParam =>
      dispatch(fetchSuggestions(myParam, ownProps.namespace)),
    resetPageStore: myParam => dispatch(resetPageStore(myParam))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chips);
