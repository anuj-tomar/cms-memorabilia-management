(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{225:function(e,t,a){"use strict";a.r(t);var n=a(14),s=a(27),i=a(16),l=a(17),r=a(19),c=a(18),d=a(20),o=a(0),u=a.n(o),p=a(13),m=a(8),b=a(10),h=a(4),f=a(47),g=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(r.a)(this,Object(c.a)(t).call(this,e))).intialiseState=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{fb:Object(h.d)(e,"fb",""),tw:Object(h.d)(e,"tw",""),insta:Object(h.d)(e,"insta",""),linkedIn:Object(h.d)(e,"linkedIn",""),index:Object(h.d)(e,"index",0),type:Object(h.d)(e,"type",""),errorMessages:{},isValid:{}}},a.validate=function(e,t){var n=a.state,s=n.isValid,i=n.errorMessages,l=Object(f.a)(e,t,{type:"text",regexType:"linkedIn"==e?"url":e});s[e]=l.isValid,l.isValid?delete i[e]:i[e]=l.errorMsg,a.setState({isValid:s,errorMessages:i})},a.inputChange=function(e,t){var n=e.target,i=n.name,l=n.value,r=n.checked,c=n.type;a.setState(Object(s.a)({},i,"checkbox"==c?r:l),function(){a.validate(i,l)})},a.onSubmit=function(){if(0==Object.keys(a.state.errorMessages).length){var e=a.state;delete e.errorMessages,delete e.isValid,a.props.setPageData(Object(n.a)({},e,{page:"anioisocial"})),a.props.closeModal()}},a.state=a.intialiseState(),a}return Object(d.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){this.props.data&&this.setState(Object(n.a)({},this.intialiseState(this.props.data)))}},{key:"render",value:function(){var e=this.state,t=e.fb,a=e.tw,n=(e.insta,e.linkedIn),s=e.errorMessages,i=e.isValid;return u.a.createElement("div",{className:"eventModal share-link"},u.a.createElement("p",{class:"title-txt"},"CONTACT THE EDITOR"),u.a.createElement("div",{className:"mb15"},u.a.createElement("span",null,u.a.createElement("i",{className:"fa fa-facebook-square"})),u.a.createElement(b.default,{name:"fb",groupClass:"input-style",value:t,isValid:i.fb,errorMsg:s.fb,inputChange:this.inputChange,dom:{placeholder:""}})),u.a.createElement("div",{className:"mb15"},u.a.createElement("span",null,u.a.createElement("i",{className:"fa fa-twitter"})),u.a.createElement(b.default,{name:"tw",groupClass:"input-style",value:a,isValid:i.tw,errorMsg:s.tw,inputChange:this.inputChange,dom:{placeholder:""}})),u.a.createElement("div",{className:"mb15"},u.a.createElement("span",null,u.a.createElement("i",{className:"fa fa-link"})),u.a.createElement(b.default,{name:"linkedIn",groupClass:"input-style",value:n,isValid:i.linkedIn,errorMsg:s.linkedIn,inputChange:this.inputChange,dom:{placeholder:""}})),u.a.createElement("div",{className:"text-right"},u.a.createElement("div",{className:"btn",onClick:this.onSubmit},"save")))}}]),t}(o.Component);t.default=Object(p.b)(null,{setPageData:m.e})(g)}}]);
//# sourceMappingURL=14.66fbbfdf.chunk.js.map