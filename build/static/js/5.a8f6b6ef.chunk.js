(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{216:function(e,a,t){"use strict";t.r(a);var n=t(14),s=t(27),i=t(16),l=t(17),r=t(19),c=t(18),d=t(20),o=t(0),u=t.n(o),p=t(13),m=t(8),b=t(10),g=t(4),h=t(47),f=function(e){function a(e){var t;return Object(i.a)(this,a),(t=Object(r.a)(this,Object(c.a)(a).call(this,e))).intialiseState=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{fb:Object(g.d)(e,"fb",""),tw:Object(g.d)(e,"tw",""),insta:Object(g.d)(e,"insta",""),linkedIn:Object(g.d)(e,"linkedIn",""),index:Object(g.d)(e,"index",0),type:Object(g.d)(e,"type",""),errorMessages:{},isValid:{}}},t.validate=function(e,a){var n=t.state,s=n.isValid,i=n.errorMessages,l=Object(h.a)(e,a,{type:"text",regexType:"linkedIn"==e?"url":e});s[e]=l.isValid,l.isValid?delete i[e]:i[e]=l.errorMsg,t.setState({isValid:s,errorMessages:i})},t.inputChange=function(e,a){var n=e.target,i=n.name,l=n.value,r=n.checked,c=n.type;t.setState(Object(s.a)({},i,"checkbox"==c?r:l),function(){t.validate(i,l)})},t.onSubmit=function(){if(0==Object.keys(t.state.errorMessages).length){var e=t.state;delete e.errorMessages,delete e.isValid,t.props.setPageData(Object(n.a)({},e,{page:"anioisocial"})),t.props.closeModal()}},t.state=t.intialiseState(),t}return Object(d.a)(a,e),Object(l.a)(a,[{key:"componentDidMount",value:function(){this.props.data&&this.setState(Object(n.a)({},this.intialiseState(this.props.data)))}},{key:"render",value:function(){var e=this.state,a=e.fb,t=e.tw,n=e.insta,s=e.linkedIn,i=e.errorMessages,l=e.isValid;return u.a.createElement("div",{className:"eventModal share-link"},u.a.createElement("div",{className:"mb15 pr"},u.a.createElement("span",null,u.a.createElement("i",{className:"fa fa-facebook-square"})),u.a.createElement(b.default,{name:"fb",groupClass:"input-style",value:a,isValid:l.fb,errorMsg:i.fb,inputChange:this.inputChange,dom:{placeholder:""}})),u.a.createElement("div",{className:"mb15 pr"},u.a.createElement("span",null,u.a.createElement("i",{className:"fa fa-twitter"})),u.a.createElement(b.default,{name:"tw",groupClass:"input-style",value:t,isValid:l.tw,errorMsg:i.tw,inputChange:this.inputChange,dom:{placeholder:""}})),u.a.createElement("div",{className:"mb15 pr"},u.a.createElement("span",null,u.a.createElement("i",{className:"fa fa-instagram"})),u.a.createElement(b.default,{name:"insta",groupClass:"input-style",value:n,isValid:l.insta,errorMsg:i.insta,inputChange:this.inputChange,dom:{placeholder:""}})),u.a.createElement("div",{className:"mb15 pr"},u.a.createElement("span",null,u.a.createElement("i",{className:"fa fa-link"})),u.a.createElement(b.default,{name:"linkedIn",groupClass:"input-style",value:s,isValid:l.linkedIn,errorMsg:i.linkedIn,inputChange:this.inputChange,dom:{placeholder:""}})),u.a.createElement("div",{className:"text-right"},u.a.createElement("div",{className:"btn",onClick:this.onSubmit},"add")))}}]),a}(o.Component);a.default=Object(p.b)(null,{setPageData:m.e})(f)}}]);
//# sourceMappingURL=5.a8f6b6ef.chunk.js.map