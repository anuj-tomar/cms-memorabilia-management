import React, { Component } from 'react'
import { connect } from 'react-redux'


import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import Slider from 'react-slick';
import '../../style/photoUploader.scss';

import { getFileExtension } from '../../utils';
import { checkIfMobile, IMAGE_BOX_SIZE, Endpoint } from '../../utils/constants';
import { updateModalData } from '../../actions/page';
import { fetchService } from '../../utils/index';
import Addonmodal from '../modal/addonmodal';


const mapAspectRatio = { l: 16 / 9, p: 3 / 4, s: 1, l2: 4 / 3, p2: 3 / 4 }

class Uploader extends Component {

    constructor(props) {
        super(props);
        this.cropperRef = React.createRef();
        this.onDrop = this.onDrop.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.RotateR = this.RotateR.bind(this);
        this.cropImage = this.cropImage.bind(this);
        this.zoomImage = this.zoomImage.bind(this);
        this.genrateCroppedUrl = this.genrateCroppedUrl.bind(this);
        this.backToOrigin = this.backToOrigin.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.onCrop = this.onCrop.bind(this);
        this.setAspectRatio = this.setAspectRatio.bind(this);
        this.changeAspectRatio = this.changeAspectRatio.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
        this.setCropboxMinSize = this.setCropboxMinSize.bind(this);
        this.freeCropping = this.freeCropping.bind(this);
        this.setTags = this.setTags.bind(this);
        this.state = {
            r: 0,
            list: [],
            selected: null,
            selectedName: null,
            selectedIndex: '',
            selectedType: '',
            iType: '',
            sType: '',
            selectedP: {},
            tags: '',
            tagsError: false,
            isSaving: false,
            isActive: '',
            alertMsg: 'Uploading in progress.',
            buttons: ['l', 'p', 's', 'r', 'f'],
            minCropBoxWidth: IMAGE_BOX_SIZE['common']['w'],
            minCropBoxHeight: IMAGE_BOX_SIZE['common']['h'],
            aspectRatio: 16 / 9,
            initialAlert: 0,
            autoCropArea: 0,
            isTag: props.config && props.config.isTag ? props.config.isTag : false
        }
    };

    componentDidMount() {
        //$('body').addClass('uploaderLayout');
        const { buttons } = this.props;
        this.setState({ buttons: buttons && buttons.length ? buttons : this.state.buttons, autoCropArea: this.props.autoCropArea ? this.props.autoCropArea : 0 });
        this.onDrop(this.props.files);
    };

    componentWillUnmount() {
        const { list } = this.state;
        for (let i = list.length; i >= 0; i--) {
            const file = list[0];
            if (file) {
                URL.revokeObjectURL(file.preview);
            }
        }
        //$('body').removeClass('uploaderLayout');
    };

    //componentDidMount() {
    //var self = this;
    // history.pushState(null, null, location.href);
    // window.onpopstate = function () {
    //     // history.go(0);
    //     self.props.onBack();
    // };
    //}

    setTags(event) {
        this.setState({ tags: event.target.value, tagsError: !event.target.value ? true : false });
    }

    onCrop(e) {
        if (e) {
            let selectedP = this.state.selectedP;
            selectedP.cHeight = Math.floor(e.detail.height);
            selectedP.cwidth = Math.floor(e.detail.width);
            this.setState({ selectedP });
        }
    }

    setCropboxMinSize(iType) {
        let { config } = this.props, minCropBoxWidth, minCropBoxHeight;
        minCropBoxWidth = config && config.minCropBoxSize && config.minCropBoxSize[iType] && config.minCropBoxSize[iType]['w'] ?
            config.minCropBoxSize[iType]['w'] : this.state.minCropBoxWidth;
        minCropBoxHeight = config && config.minCropBoxSize && config.minCropBoxSize[iType] && config.minCropBoxSize[iType]['h'] ?
            config.minCropBoxSize[iType]['h'] : this.state.minCropBoxHeight;
        this.cropperRef.current.setCropBoxData({ width: minCropBoxWidth, heigth: minCropBoxHeight });
    }

    setAspectRatio(h, w) {
        let iType = 'l', sType;
        if (h > w) {
            iType = 'p';
        } else if (h < w) {
            iType = 'l';
        } else if (h === w) {
            iType = 's';
        }
        let aspectRatio = mapAspectRatio[iType];

        this.setCropboxMinSize(iType);
        this.setState({ iType, sType, isActive: iType })
        this.cropperRef.current.setAspectRatio(aspectRatio);
    }

    changeAspectRatio(iType) {
        if (!iType) { return; }
        this.setState({ isActive: iType });
        this.setCropboxMinSize(iType);
        this.cropperRef.current.setAspectRatio(mapAspectRatio[iType]);
    }
    freeCropping() {
        this.setState({ isActive: 'f' });
        this.cropperRef.current.setCropBoxData({
            width: this.state.selectedP.iwidth + 'px', top: '0px', left: '0px',
            heigth: this.state.selectedP.iHeight + 'px'
        });
        this.cropperRef.current.setAspectRatio(NaN);
    }

    getImageSize(url) {
        if (!url) {
            return;
        }
        let image = new Image;
        image.src = url;
        image.onload = () => {
            let selectedP = this.state.selectedP;
            selectedP.iHeight = image.height;
            selectedP.iwidth = image.width;

            if (this.props.config && this.props.config.aspectRatio) {
                this.changeAspectRatio(this.props.config.aspectRatio);
            } else {
                this.setAspectRatio(selectedP.iHeight, selectedP.iwidth);
            }
            this.setState({ selectedP });
        }
    }



    onSelect(fileObj, index) {
        if (this.state.selectedIndex === index) return;
        if (this.cropperRef.current) this.cropperRef.current.clear();
        this.setState({ r: 0 })
        let file, selectedName, isReturn = false;
        if (fileObj.thumbnail) {
            file = fileObj.thumbnail;
            selectedName = fileObj.fileName;
            isReturn = true;
        } else if (fileObj.file && fileObj.file.thumbnail) {
            file = fileObj.file.thumbnail;
            selectedName = fileObj.file.fileName;
            isReturn = true;
        }
        if (isReturn) {
            this.getImageSize(file);
            let fileType = getFileExtension(file);
            fileType = fileType == 'jpg' ? 'jpeg' : fileType;
            this.setState({ selected: file, selectedName, selectedType: 'image/' + fileType, selectedIndex: index, tags: fileObj.tags || '', tagsError: false, isSaving: false }, () => {
                this.cropperRef.current.replace(file);
                //this.cropImage(200);
            });
            return;
        }
        let reader = new FileReader();
        file = fileObj.file;
        reader.onload = () => {
            this.getImageSize(reader.result);
        }
        reader.onloadend = () => {
            this.setState({ selected: reader.result, selectedName: file.name, selectedType: file.type, selectedIndex: index, tags: '', tagsError: false, isSaving: false }, () => {
                this.cropperRef.current.replace(reader.result);
                // this.cropImage();
            });
        }
        reader.readAsDataURL(file);
    }

    RotateR() {
        this.cropperRef.current.clear();
        this.cropperRef.current.replace(this.state.selected);

        let r = this.state.r + 90;
        this.setState({ r: r == 360 ? 0 : r })
        setTimeout(() => {
            this.cropperRef.current.rotate(r);

            let cType, cData = this.cropperRef.current.getData();
            if (cData.rotate === 90 || cData.rotate === 270) {
                cType = this.state.iType == 'l' ? 'p' : this.state.iType == 'p' ? 'l' : this.state.iType;
            } else {
                cType = this.state.iType;
            }
            this.changeAspectRatio(cType);
            //this.cropImage(0);
        }, 100);
    }

    cropImage(timeout) {
        timeout = !timeout ? 0 : timeout;
        setTimeout(() => {
            this.cropperRef.current.crop();
        }, 100);
    }
    zoomImage(flag) {
        const containerData = this.cropperRef.current.getContainerData();
        const imageData = this.cropperRef.current.getImageData();
        let currentZoomlevel = imageData.width / imageData.naturalWidth;
        if ((flag && currentZoomlevel >= 1.5) || (!flag && currentZoomlevel <= 1)) {
            return;
        }
        currentZoomlevel = flag ? currentZoomlevel + 0.1 : currentZoomlevel - 0.1;
        // Zoom to 50% from the center of the container.
        this.cropperRef.current.zoomTo(currentZoomlevel, {
            x: containerData.width / 2,
            y: containerData.height / 2,
        });
        //this.cropperRef.current.zoom(0.1);
    }

    onDrop(files) {
        if (files && files.length) {
            let list = files.map((file, i) => {
                let fObj = {
                    imgId: i,
                    type: 'queue',
                    file: file,
                    preview: !file.thumbnail && !file.file ? URL.createObjectURL(file) : '',
                    fileName: file.name,
                    fileType: file.type,
                    tags: file.tags || ''
                };
                return fObj;
            });
            this.setState({ list: this.state.list.concat(list), folder: this.props.folder || 'profile', folderId: this.props.id || '', tgas: list[0].tags }, () => {
                this.onSelect(list[0], 0);
            });
        }
    }

    checkIfFilesInProgress() {
        let progressList = this.state.list.filter((s, _idx) => s.type === 'saving');
        return (progressList && progressList.length > 0)
    }

    successCallBack(data, status) {
        let fileList = this.state.list.map((file, i) => {
            data = data || {};
            data.imgId = data.imgId || 0;
            if ((data.imgId || data.imgId === 0) && i != data.imgId) {
                return file;
            } else {
                if (!status) {
                    file.type = 'error';
                    return file;
                }
                file.croppedSize = this.state.selectedP;
                file.thumbnail = data.imageUrl;
                file.fileName = data.imageName;
                file.uniqueCode = data.uniqueCode;
                file.type = 'selected';
                file.tags = this.state.tags;
                file.tempId = data.tempId;
                if (!this.state.folderId) { this.setState({ folderId: data.tempId }) }
                return file;
            }
        });
        this.setState({ list: fileList }, () => {
            if (this.state.selectedIndex + 1 >= this.state.list.length && this.state.isSaving) {
                if (this.checkIfFilesInProgress()) {
                    // if(this.state.initialAlert === 0){
                    //     this.setState({ initialAlert: 1 });
                    //     this.toggleAlert(true);
                    // }
                    return;
                }
                this.backToOrigin();
            }
        });

    }

    genrateCroppedUrl() {
        const payload = {
            imageName: this.state.selectedName,
            image: this.cropperRef.current.getCroppedCanvas().toDataURL(this.state.selectedType, 0.8),
            imgId: this.state.selectedIndex,
            uploadType: this.props.uploadType,
            token: this.props.token
        }
        if (this.state.folder) {
            payload.id = this.state.folderId || '';
            payload.section = this.state.folder;
        }
        let fileList = this.state.list.map((file, i) => {
            if (i != this.state.selectedIndex) {
                return file;
            } else {
                file.type = this.props.not_upload ? 'selected' : 'saving'
                file.thumbnail = this.cropperRef.current.getCroppedCanvas().toDataURL(this.state.selectedType, 0.8);
                return file;
            }
        });
        if (this.state.selectedIndex + 1 >= this.state.list.length) this.setState({ isSaving: true })
        this.setState({ tagsError: false, list: fileList }, () => {
            if (this.state.selectedIndex + 1 >= this.state.list.length) {
                if (this.props.not_upload) this.backToOrigin();
                return;
            }
            let nIndex = this.state.selectedIndex + 1;
            let thumb = document.getElementById('thumb-' + nIndex)
            thumb.click();
            //this.onSelect(this.state.list[nIndex], nIndex);
        });
        if (this.props.not_upload) return;
        fetchService({
            payload: payload,
            method: 'POST',
            url: `${this.props.apiurl ? this.props.apiurl : Endpoint.UPLOAD}`,
        }).then((data) => {
            let response = data && data.response ? data.response : {};
            this.successCallBack(response.data, response.status);
        });
    }

    removeImage(e, index) {
        return;
        if (e) {
            e.preventDefault();
            this.setState({ list: this.state.list.filter((s, _idx) => _idx !== index) }, () => {
                if (!this.state.list.length) {
                    this.setState({ selected: null, selectedName: null, selectedIndex: 0, tags: '', tagsError: false });
                }
            });
        }
    }

    renderFileList() {
        let list = this.state.list.map((file, i) => {
            let thumb = file.thumbnail ? file.thumbnail : file.file.thumbnail ? file.file.thumbnail : file.preview ? file.preview : '';
            const imagestyle = {
                backgroundImage: 'url(' + (thumb) + ')'
            };
            return (
                <div key={'_uploader_' + i}>
                    <div className={`img-thumb  ${file.type == 'saving' ? 'isSaving' : ''} ${this.state.selectedIndex == i ? 'active' : ''}`} key={i}>
                        <div onClick={(e) => this.onSelect(file, i)} id={`thumb-${i}`}>
                            <div style={imagestyle} className="image-style">
                                <img src={'./images/imagesize16_9.png'} className="w100per" alt="" />
                            </div>
                        </div>
                        <p className="icon-fot m0">
                            {file.type == 'selected' &&
                                <i className="fa fa-check-circle" aria-hidden="true"></i>
                            }
                            {file.type == 'queue' &&
                                <i className="fa fa-times-circle" aria-hidden="true" onClick={(e) => this.removeImage(e, i)}></i>
                            }
                            {file.type == 'error' &&
                                <i className="fa fa-times-circle red" aria-hidden="true" >error</i>
                            }
                        </p>

                    </div>
                </div>
            )
        });
        return list;
    }

    toggleAlert(flag) {
        // if(this.props.not_upload){
        //     return;
        // }
        flag = flag || false;
        this.props.updateModalData({
            addon: true,
            showCustomModal: flag,
            title: '',
            footer: true,
            path: '',
            body: this.state.alertMsg,
            className: ''
        });
        this.setState({ initialAlert: flag ? 1 : 0 });
    }

    backToOrigin(e) {
        if (!this.props.not_upload && this.checkIfFilesInProgress()) {
            this.toggleAlert(true);
            return;
        }
        if (e) e.preventDefault();
        this.toggleAlert();
        let newList = this.state.list.filter((s, _idx) => s.type === 'selected');
        this.props.onComplete(newList, this.state.folderId, this.props.uploadType);
        this.props.onBack(false);
    }

    showNoOfImage() {
        let item;
        if (checkIfMobile()) {
            item = this.state.list.length < 2 ? 1 : 2;
        } else {
            item = this.state.list.length < 4 ? this.state.list.length : 4;
        }
        return item
    }

    render() {
        const { list, selected, aspectRatio, selectedP, minCropBoxWidth, minCropBoxHeight, isTag, autoCropArea } = this.state;
        const { isSideNav = true, isBackBotton = true, isMultiple = false, isPopup } = this.props;
        var settings = {
            focusOnSelect: true,
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: this.showNoOfImage(),
            slidesToScroll: 1,
            vertical: !checkIfMobile(),
            verticalSwiping: !checkIfMobile(),
            arrows: true,
            // nextArrow: <SampleNextArrow />,
            // prevArrow: <SamplePrevArrow />,
        };

        return (
            <div className="container uploader">
                <div className="photoUploader">
                    {isBackBotton &&
                        <div className="title_photouploader d-flex align-items-center justify-content-between">
                            <span className="txt-kalakalphoto">PHOTO UPLOADER</span>
                            {!isPopup &&
                                 <a href="javascript:void(0)" onClick={this.backToOrigin} className="btn-close">
                                    <span className="pclose" >+</span>
                                </a>
                            }
                        </div>
                    }
                    {!list.length &&
                        <Dropzone className="style-upload"
                            multiple={isMultiple}
                            accept="image/jpeg, image/png"
                            onDrop={(accepted, rejected) => { this.onDrop(accepted) }}>
                            <p id="file" className="icon-plus">+</p>
                            <p className="txt-fot">CLICK TO UPLOAD</p>
                        </Dropzone>
                    }
                    <div className={`loader-wrapper d-flex ${!isSideNav ? 'justify-content-center' : ''}`}>
                        {isSideNav && list.length > 0 &&
                            <div className="img-thumb-panel">
                                <a href="javascript:void(0)" className="toparrow" />
                                <a href="javascript:void(0)" className="downarrow" />
                                <div className="scrollouter">
                                    <Slider {...settings}>{this.renderFileList()}</Slider></div>
                            </div>
                        }
                        {selected &&
                            <div>
                                <span className="uploadtxt"><b>UPLOADED SIZE-</b> {selectedP.iwidth}x{selectedP.iHeight}</span>&nbsp;&nbsp;
                                <span className="uploadtxt"><b>CURRENT SIZE-</b> {selectedP.cwidth}x{selectedP.cHeight}</span>
                                <div className="panelcroparea">
                                    <Cropper
                                        ref={this.cropperRef}
                                        className="cropper"
                                        //src={selected}
                                        dragMode='move'
                                        viewMode={1}
                                        aspectRatio={aspectRatio}
                                        autoCropArea={autoCropArea}
                                        strict={false}
                                        responsive={true}
                                        restore={true}
                                        background={false}
                                        autoCrop={false}
                                        guides={false}
                                        movable={true}
                                        zoomable={false}
                                        zoomOnTouch={false}
                                        zoomOnWheel={false}
                                        center={true}
                                        highlight={true}
                                        toggleDragModeOnDblclick={false}
                                        minCropBoxWidth={minCropBoxWidth}
                                        minCropBoxHeight={minCropBoxHeight}
                                        minContainerWidth={minCropBoxWidth}
                                        minContainerHeight={minCropBoxHeight}
                                        crop={this.onCrop}
                                        ready={this.cropImage}
                                    />
                                    <p className='crop-txt'>Please Crop Your Image To Save</p>
                                    <div className="text-center btn-cropper-section d-flex">
                                        <a href="javascript:void(0)" className={`${this.state.isActive == 'f' ? 'active' : ''} ${this.state.buttons.indexOf('f') == -1 ? 'disabledlink' : ''}`} onClick={this.freeCropping} >As Is</a>
                                        <a href="javascript:void(0)" className={`${this.state.isActive == 'l' ? 'active' : ''} ${this.state.buttons.indexOf('l') == -1 ? 'disabledlink' : ''}`} onClick={e => this.changeAspectRatio('l')}>Landscape</a>
                                        <a href="javascript:void(0)" className={`${this.state.isActive == 'p' ? 'active' : ''} ${this.state.buttons.indexOf('p') == -1 ? 'disabledlink' : ''}`} onClick={e => this.changeAspectRatio('p')}>Portrait</a>
                                        <a href="javascript:void(0)" className={`${this.state.isActive == 's' ? 'active' : ''} ${this.state.buttons.indexOf('s') == -1 ? 'disabledlink' : ''}`} onClick={e => this.changeAspectRatio('s')}>Square</a>
                                        <a href="javascript:void(0)" className={`${this.state.buttons.indexOf('r') == -1 ? 'disabledlink' : ''}`} onClick={this.RotateR}>Rotate</a>
                                    </div>

                                    <div className="mt20 upload-tag d-flex justify-content-between">
                                        <div>
                                            {isTag &&
                                                <div className="upload-textbox d-flex">
                                                    <input type="text" className="form_control_" placeholder="Type" placeholder="Tag this photo, seperate tags by comma"
                                                        value={this.state.tags} name='tags' onChange={this.setTags} />
                                                    <a href=" javascript:void(0) " className="btn tag-btn w100">TAG</a>
                                                </div>
                                            }

                                            {this.state.tagsError && 1 === 2 && <p className="error_msg">This field is required.</p>}
                                        </div>
                                        <div>
                                        {isPopup && <a href="javascript:void(0)" className="btn savebtn w150 mr10" onClick={this.backToOrigin}>CANCEL</a>}
                                        <a href="javascript:void(0)" className={`${this.state.isSaving && this.state.list.length == this.state.selectedIndex + 1 ? 'inactiveBtn saving-loader btndisabled' : ''} btn savebtn w150`} onClick={this.genrateCroppedUrl}>{this.state.list.length == this.state.selectedIndex + 1 ? 'SAVE' : 'SAVE AND NEXT'}</a>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        }</div>
                    <Addonmodal toastmessage={this.props.toastmessage} />
                </div></div >
        );
    }
}
function mapStateToProps({ auth: { token } }) {
    return { token };
}
export default connect(mapStateToProps, { updateModalData })(Uploader);