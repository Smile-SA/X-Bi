(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-20e27b8e"],{"25d3":function(t,e,a){},"62f5":function(t,e,a){"use strict";a("25d3")},ff13:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"normal-case tracking-normal"},[e("a",{staticClass:"btn btn-sm btn-outline-behance text-capitalize",on:{click:function(e){return e.preventDefault(),t.show.apply(null,arguments)}}},[e("font-awesome-icon",{staticClass:"me-1",attrs:{icon:["fas","fa-eye"]}}),t._v(" Show")],1),e("modal",{staticClass:"white-space-initial",attrs:{name:"preview-modal-"+t.id+t.value,height:"auto",resizable:!0,width:"50%"}},[e("div",{staticClass:"modal-body"},[t._t("body",(function(){return[e("h3",{staticClass:"text-capitalize p-2"},[t._v(t._s(t.value+"  display"))]),e("textarea",{ref:"textAreaRef",staticClass:"form-control",attrs:{readonly:"",id:"value",name:"value"}})]}))],2)])],1)},s=[],n=a("97e3"),l=a("56b3"),o=a("d5a1");const r=o["apiInfo"];var c={name:"show",components:{},props:["url","refreshFunction","id","value","data"],data(){return{cmValue:"",cmOption:{tabSize:4,mode:"text/javascript",theme:"eclipse",lineNumbers:!0,line:!0,readOnly:"nocursor"}}},computed:{},mounted(){},methods:{getDate(){const t=JSON.parse(localStorage.getItem("x-bi:"+this.data.name));t?(this.value=this.data.name,this.cmValue=l["fromTextArea"](document.getElementById("value"),this.cmOption),this.cmValue.setValue(JSON.stringify(t.data.results,null,2)),this.cmValue.on("copy",(t,e)=>{e.codemirrorIgnore=!0})):n["getById"](this.url,this.id,this.value,"static"===r.dataType).then(t=>{this.cmValue=l["fromTextArea"](document.getElementById("value"),this.cmOption),this.cmValue.setValue(JSON.stringify(t.data.results,null,2)),this.cmValue.on("copy",(t,e)=>{e.codemirrorIgnore=!0})})},async show(){await this.$modal.show("preview-modal-"+this.id+this.value),this.$nextTick(()=>{this.getDate()})},hide(){this.$modal.hide("preview-modal-"+this.id+this.value)}}},u=c,d=(a("62f5"),a("2877")),m=Object(d["a"])(u,i,s,!1,null,"92f5b2ae",null);e["default"]=m.exports}}]);
//# sourceMappingURL=chunk-20e27b8e.c02fe05d.js.map