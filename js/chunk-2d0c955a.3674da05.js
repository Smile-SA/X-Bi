(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c955a"],{5966:function(e,t,o){"use strict";o.r(t);var s=o("73b5");t["default"]={name:"edit",props:["modelId","structureType","refreshFunction","viewId"],data(){return{schema:[],model:{},controls:{}}},computed:{lookModel(){return this.model}},methods:{show(){this.getModel(),this.$modal.show("edit-modal-"+this.structureType+this.modelId)},cancel(){this.getModel(),this.$modal.hide("edit-modal-"+this.structureType+this.modelId)},getModel(){let e=s["getModel"](this.structureType,this.viewId,this.modelId);Object.keys(e).length>0&&(this.model=e)},showInput(e){return s["showInputInModel"](e,this.model)},submitForm(e){"view"===e&&(this.model.path="/"+this.model.name.replace(" ","")),!0===s["editModel"](e,this.viewId,this.model,this.modelId)&&(this.refreshFunction(),this.$modal.hide("edit-modal-"+this.structureType+this.modelId),"view"===e&&this.$router.go(this.$router.currentRoute))},getFormSchema(e){let t=s["getForm"](e);Object.keys(t).length>0&&(this.schema=t)}},watch:{lookModel(){s["updateValidation"](this.schema,this.model)}},beforeMount(){this.getFormSchema(this.structureType)}}}}]);
//# sourceMappingURL=chunk-2d0c955a.3674da05.js.map