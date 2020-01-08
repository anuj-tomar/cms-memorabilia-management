import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input,  ButtonGroup, Button, CustomInput, FormGroup} from 'reactstrap';
import Dropzone from 'react-dropzone';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

import { uploadFile } from '../../actions/page';
import { Endpoint } from '../../utils/constants';
import 'rc-time-picker/assets/index.css';

import '../../style/react-datepicker.scss';

class InputField extends Component {
    handleDateChange = date => {
        const { name, inputChange, format='YYYY-MM-DD' } = this.props;
        let finalDate = date ? moment(date).format(format) : '';
        inputChange({ target: { name, value: finalDate } });
    };
    isValidDate(d) {
      return d instanceof Date && !isNaN(d);
    }

    handleTime = (time) => {
        const { name, inputChange } = this.props;
        let finalDate = time ? time.format('hh:mm a') : '';
        inputChange({ target: { name, value: finalDate } });
    }
    onDrop = (a, r) => {
        let { multiple, name, inputChange, section, token } = this.props;
        if (r.length > 0) {
            alert('File Not allowed');
            return;
        }
        if (a.length) {
            let payload = {
                token, image: a[0], type: 'file', section
            }
            this.props.uploadFile({
                payload,
                url: `${Endpoint.MEDIA_UPLOAD}`,
                method: 'POST',
            }, (response) => {
                if (response.status) {
                    inputChange({ target: { name, value: response.data.imageName, imageUrl: response.data.imageUrl } })
                }
            });
        }
    }
    render() {
        const {
            groupClass = '',
            dom = {},
            name,
            label,
            labelAttr = {},
            value,
            inputChange,
            isValid = true,
            errorMsg,
            options = {},
            children,
            multiple = false,
            accept = "image/jpeg, image/png"
        } = this.props;
        let style = dom.type === 'radio' ? { display: 'block' } : {};
        return (
            <React.Fragment>
                {(!dom || (dom.type !== 'file' && ['toggle','time', 'date', 'select','radio','checkbox'].indexOf(dom.type) === -1)) && (
                    <input className={`form_control ${groupClass}`} name={name} value={value}
                        min='1'
                        onChange={event => {
                            inputChange(event);
                        }}
                        {...dom} />
                )}
                {dom && dom.type === 'select' && (
                    <Input
                        className={`form_control ${groupClass}`}
                        type="select"
                        value={value}
                        onChange={event => {
                            inputChange(event);
                        }}
                        name={name}
                        {...dom}
                        invalid={!isValid}
                    >
                        {dom.placeholder && <option value="">{dom.placeholder}</option>}
                        {Object.keys(options).map((key, index) => {
                            return (
                                <option key={key} value={key} className='select-input'>
                                    {options[key]}
                                </option>
                            );
                        })}
                    </Input>
                )}
                {dom && dom.type === 'checkbox' && (
                    <CustomInput
                        type="checkbox"
                        label={label}
                        value={value}
                        onChange={event => {
                        inputChange(event);
                        }}
                        checked={value}
                        id={name}
                        name={name}
                        {...dom}
                        invalid={!isValid}
                    />
                    )}
                {dom && dom.type === 'radio' &&
                    Object.keys(options).map((key, index) => {
                        return (
                            <div className={`custom-control ${groupClass}`} key={key} >
                                <input type='radio' name={name} id={key} value={key} checked={value == key}
                                    onChange={event => {
                                        inputChange(event);
                                    }}
                                    className='custom-control-input' />
                                <label className='custom-control-label' htmlFor={key}>{options[key]}</label>
                            </div>
                        );
                    })
                }
                {dom && dom.type === 'toggle' && (
                <ButtonGroup className={groupClass}>
                    {Object.keys(options).map((key, index) => {
                    return (
                        <Button
                        key={key}
                        value={key}
                        name={name}
                        onClick={event => {
                            if(key == value){return ;}
                            inputChange(event);
                        }}
                        className={key == value ? 'active' : ''}
                        >
                        {options[key]}
                        </Button>
                    );
                    })}
                </ButtonGroup>
                )}
                {dom && dom.type === 'date' && (
                    <DatePicker popperClassName="custom-date"
                        placeholderText={dom.placeholder} className={groupClass ? "date-input" : "form-control input-style"}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        //maxDate={moment()}
                        //dateFormat="DD-MM-YYYY"
                        {...dom}
                        onChangeRaw={(e) => { e.preventDefault(); }}
                        selected={value && this.isValidDate(new Date(value)) ? new Date(value) : null}
                        onChange={this.handleDateChange}
                    />
                )}
                {dom && dom.type === 'time' && (
                    <TimePicker
                        placeholder={dom.placeholder}
                        className={groupClass}
                        showSecond={false}
                        value={value ? moment(value, 'h:mm a') : null}
                        onChange={this.handleTime}
                        format="h:mm a"
                        minuteStep={15}
                        use12Hours
                        inputReadOnly
                    />
                )}
                {dom && dom.type === 'file' && (
                    <Dropzone
                        style={{ position: 'relative' }}
                        accept={accept}
                        multiple={multiple}
                        onDrop={(accepted, rejected) => { this.onDrop(accepted, rejected) }}>
                        {children}
                    </Dropzone>
                )}
              {!isValid && <p className="error_msg"> {errorMsg}</p>}
            </React.Fragment>
        );
    }
}
function mapStateToProps({ auth: { token } }) {
    return { token }
}
export default connect(mapStateToProps, { uploadFile })(InputField);
