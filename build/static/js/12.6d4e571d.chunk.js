(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{222:function(e,t,a){"use strict";a.r(t);var s=a(27),r=a(16),i=a(17),n=a(19),l=a(18),m=a(20),o=a(0),c=a.n(o),d=a(13),p=a(10),u=a(48),g=a(26),b=a(4),v=a(47),E=a(30),h=a(8),T=a(6),N=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(n.a)(this,Object(l.a)(t).call(this,e))).intialiseState=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return{memberId:Object(b.d)(e,"memberId",""),memberId_name:e.memberObj?[e.memberObj]:[],reservationType:Object(b.d)(e,"nature",""),rTypeId:Object(b.d)(e,"rTypeId",a.props.rTypeId),startTime:Object(b.d)(e,"startTime",null),endTime:Object(b.d)(e,"endTime",null),note:Object(b.d)(e,"note",""),guest:Object(b.d)(e,"guest",""),errorMessages:{},isValid:{},isinit:t}},a.validate=function(e,t){var s=a.state,r=s.isValid,i=s.errorMessages,n=Object(v.a)(e,t,{type:"text",errorMsg:"memberId"==e?"No member selected":""});r[e]=n.isValid,n.isValid?delete i[e]:i[e]=n.errorMsg,a.setState({isValid:r,errorMessages:i})},a.inputChange=function(e){var t=e.target,r=t.name,i=t.value,n=t.checked,l=t.type;a.setState(Object(s.a)({},r,"checkbox"==l?n:i),function(){a.validate(r,i)})},a.compareStartEndTime=function(){var e=a.state,t=e.startTime,s=e.endTime,r=e.error,i=new Date("1970-01-01 8:00 am").getTime(),n=new Date("1970-01-01 "+t).getTime(),l=new Date("1970-01-01 "+s).getTime();return r=n<i?"Start time must be greater than or equal to 08:00 am":n>l?"Start time must be less than end time":"",a.setState({error:r}),!r},a.onSubmit=function(e){e.preventDefault(),["memberId","rTypeId","startTime","endTime","guest"].forEach(function(e){a.validate(e,a.state[e])});var t=a.compareStartEndTime();if(0==Object.keys(a.state.errorMessages).length&&t){a.setState({error:"",isSaving:!0});var s=Object.assign({},a.state);s.token=a.props.token,s.date=Object(b.a)(a.props.date,"YYYY-MM-DD"),delete s.errorMessages,delete s.isValid,a.props.updatePageData({payload:s,url:"".concat(T.d.RESERVATION).concat(a.props.bookingId?"/"+a.props.bookingId:""),method:a.props.bookingId?"PUT":"POST",action:a.props.bookingId?"update":"add",page:"reserve"},function(e){e.status?(a.setState({error:"",isSaving:!1}),a.props.toastmessage(e.message),a.props.closeModal()):a.setState({error:e.message,isSaving:!1})})}},a.setChips=function(e,t){var r,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};a.setState((r={},Object(s.a)(r,t,i.id),Object(s.a)(r,t+"_name",e),r)),e.length?(a.state.isValid[t]=!0,delete a.state.errorMessages[t],a.setState({errorMessages:a.state.errorMessages,isValid:a.state.isValid})):(a.state.isValid[t]=!1,a.state.errorMessages[t]="This field is required.",a.setState({errorMessages:a.state.errorMessages,isValid:a.state.isValid}))},a.state=a.intialiseState(),a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){this.props.bookingId&&this.props.getIndividualItem({params:{token:this.props.token},url:"".concat(T.d.RESERVATION,"/").concat(this.props.bookingId)})}},{key:"componentWillUnmount",value:function(){this.props.resetPageStore("individualItem")}},{key:"componentDidUpdate",value:function(e,t){if(e.itemData!=this.props.itemData&&t.isinit&&Object(E.d)(this.props.itemData)&&!Object(E.c)(this.props.itemData)){var a=this.intialiseState(this.props.itemData,!1);this.setState(a)}}},{key:"render",value:function(){var e=this.state,t=(e.memberId,e.memberId_name),a=(e.rTypeId,e.reservationType),s=e.startTime,r=e.endTime,i=e.note,n=e.guest,l=e.errorMessages,m=e.isValid,o=e.error,d=e.isSaving,v=this.props,E=v.token,h=v.bookingId,N=v.itemLoader;return c.a.createElement("div",{className:"eventModal reservedModal"},c.a.createElement("div",{className:"d-flex justify-content-between"},c.a.createElement("div",{className:"title-txt"},this.props.room),c.a.createElement("div",{className:"title-txt"},Object(b.a)(this.props.date))),N&&c.a.createElement(g.default,null),!N&&c.a.createElement(c.a.Fragment,null,c.a.createElement("div",null,c.a.createElement("div",{className:"row no-gutters mb15"},c.a.createElement("div",{className:"col-2"},c.a.createElement("label",{className:"label-txt"},"MEMBER NAME")),c.a.createElement("div",{className:"col-10"},c.a.createElement(u.default,{placeholder:"Member Name",className:"",name:"memberId",namespace:"countryList",livesearch:!0,autocomplete:!1,service:"".concat(T.d.MEMBER,"?token=").concat(E),vk:"id",sk:"name",chips:t,maxCount:1,setChips:this.setChips}),!m.memberId&&c.a.createElement("p",{className:"error_msg"}," ",l.memberId))),c.a.createElement("div",{className:"row no-gutters mb15"},c.a.createElement("div",{className:"col-2"},c.a.createElement("label",{className:"label-txt"},"START TIME")),c.a.createElement("div",{className:"col-3"},c.a.createElement(p.default,{name:"startTime",value:s,isValid:m.startTime,errorMsg:l.startTime,inputChange:this.inputChange,dom:{placeholder:"START TIME",type:"time"}})),c.a.createElement("div",{className:"col-3"},c.a.createElement("label",{className:"label-txt pl35"},"NO. OF GUESTS")),c.a.createElement("div",{className:"col-4"},c.a.createElement(p.default,{name:"guest",groupClass:"input-style",value:n,isValid:m.guest,errorMsg:l.guest,inputChange:this.inputChange,dom:{placeholder:"NO. OF GUESTS",type:"number"}}))),c.a.createElement("div",{className:"row no-gutters mb15"},c.a.createElement("div",{className:"col-2"},c.a.createElement("label",{className:"label-txt"},"END TIME")),c.a.createElement("div",{className:"col-3"},c.a.createElement(p.default,{name:"endTime",value:r,isValid:m.endTime,errorMsg:l.endTime,inputChange:this.inputChange,dom:{placeholder:"END TIME",type:"time"}})),c.a.createElement("div",{className:"col-3"},c.a.createElement("label",{className:"label-txt pl35"},"RESERVATION TYPE")),c.a.createElement("div",{className:"col-4"},c.a.createElement(p.default,{name:"reservationType",groupClass:"input-style",value:a,isValid:m.reservationType,errorMsg:l.reservationType,inputChange:this.inputChange,dom:{placeholder:"RESERVATION TYPE"}})))),c.a.createElement("div",{className:"row no-gutters mb15"},c.a.createElement("div",{className:"col-1"},c.a.createElement("label",{className:"label-txt"},"NOTES")),c.a.createElement("div",{className:"col-11"},c.a.createElement("div",{className:"aboutEvent"},c.a.createElement("textarea",{className:"input-style h100px",name:"note",value:i,onChange:this.inputChange})))),o&&c.a.createElement("p",{className:"error_msg"}," ",o),c.a.createElement("div",{className:"text-right"},c.a.createElement("div",{onClick:this.onSubmit,className:"btn ".concat(d?"btndisabled":"")},h?"update":"Save"))))}}]),t}(o.Component);t.default=Object(d.b)(function(e){var t=e.auth.token,a=e.page,s=a.individualItem.data,r=void 0===s?{}:s,i=a.itemLoader;return{token:t,itemData:r,itemLoader:void 0!==i&&i}},{updatePageData:h.g,getIndividualItem:h.b,resetPageStore:h.d})(N)}}]);
//# sourceMappingURL=12.6d4e571d.chunk.js.map