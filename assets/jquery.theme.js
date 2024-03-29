jQuery.ajaxSetup({
  async: false
});

/* Form Validation  */
(function(a){a.extend(a.fn,{validate:function(b){if(!this.length){if(b&&b.debug&&window.console){console.warn("Nothing selected, can't validate, returning nothing.")}return}var c=a.data(this[0],"validator");if(c){return c}this.attr("novalidate","novalidate");c=new a.validator(b,this[0]);a.data(this[0],"validator",c);if(c.settings.onsubmit){this.validateDelegate(":submit","click",function(d){if(c.settings.submitHandler){c.submitButton=d.target}if(a(d.target).hasClass("cancel")){c.cancelSubmit=true}if(a(d.target).attr("formnovalidate")!==undefined){c.cancelSubmit=true}});this.submit(function(d){if(c.settings.debug){d.preventDefault()}function e(){var f;if(c.settings.submitHandler){if(c.submitButton){f=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)}c.settings.submitHandler.call(c,c.currentForm,d);if(c.submitButton){f.remove()}return false}return true}if(c.cancelSubmit){c.cancelSubmit=false;return e()}if(c.form()){if(c.pendingRequest){c.formSubmitted=true;return false}return e()}else{c.focusInvalid();return false}})}return c},valid:function(){if(a(this[0]).is("form")){return this.validate().form()}else{var c=true;var b=a(this[0].form).validate();this.each(function(){c=c&&b.element(this)});return c}},removeAttrs:function(d){var b={},c=this;a.each(d.split(/\s/),function(e,f){b[f]=c.attr(f);c.removeAttr(f)});return b},rules:function(e,b){var g=this[0];if(e){var d=a.data(g.form,"validator").settings;var i=d.rules;var j=a.validator.staticRules(g);switch(e){case"add":a.extend(j,a.validator.normalizeRule(b));i[g.name]=j;if(b.messages){d.messages[g.name]=a.extend(d.messages[g.name],b.messages)}break;case"remove":if(!b){delete i[g.name];return j}var h={};a.each(b.split(/\s/),function(k,l){h[l]=j[l];delete j[l]});return h}}var f=a.validator.normalizeRules(a.extend({},a.validator.classRules(g),a.validator.attributeRules(g),a.validator.dataRules(g),a.validator.staticRules(g)),g);if(f.required){var c=f.required;delete f.required;f=a.extend({required:c},f)}return f}});a.extend(a.expr[":"],{blank:function(b){return !a.trim(""+a(b).val())},filled:function(b){return !!a.trim(""+a(b).val())},unchecked:function(b){return !a(b).prop("checked")}});a.validator=function(b,c){this.settings=a.extend(true,{},a.validator.defaults,b);this.currentForm=c;this.init()};a.validator.format=function(b,c){if(arguments.length===1){return function(){var d=a.makeArray(arguments);d.unshift(b);return a.validator.format.apply(this,d)}}if(arguments.length>2&&c.constructor!==Array){c=a.makeArray(arguments).slice(1)}if(c.constructor!==Array){c=[c]}a.each(c,function(d,e){b=b.replace(new RegExp("\\{"+d+"\\}","g"),function(){return e})});return b};a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusInvalid:true,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:true,ignore:":hidden",ignoreTitle:false,onfocusin:function(b,c){this.lastActive=b;if(this.settings.focusCleanup&&!this.blockFocusCleanup){if(this.settings.unhighlight){this.settings.unhighlight.call(this,b,this.settings.errorClass,this.settings.validClass)}this.addWrapper(this.errorsFor(b)).hide()}},onfocusout:function(b,c){if(!this.checkable(b)&&(b.name in this.submitted||!this.optional(b))){this.element(b)}},onkeyup:function(b,c){if(c.which===9&&this.elementValue(b)===""){return}else{if(b.name in this.submitted||b===this.lastElement){this.element(b)}}},onclick:function(b,c){if(b.name in this.submitted){this.element(b)}else{if(b.parentNode.name in this.submitted){this.element(b.parentNode)}}},highlight:function(d,b,c){if(d.type==="radio"){this.findByName(d.name).addClass(b).removeClass(c)}else{a(d).addClass(b).removeClass(c)}},unhighlight:function(d,b,c){if(d.type==="radio"){this.findByName(d.name).removeClass(b).addClass(c)}else{a(d).removeClass(b).addClass(c)}}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){this.labelContainer=a(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm);this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer);this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var b=(this.groups={});a.each(this.settings.groups,function(e,f){if(typeof f==="string"){f=f.split(/\s/)}a.each(f,function(h,g){b[g]=e})});var d=this.settings.rules;a.each(d,function(e,f){d[e]=a.validator.normalizeRule(f)});function c(g){var f=a.data(this[0].form,"validator"),e="on"+g.type.replace(/^validate/,"");if(f.settings[e]){f.settings[e].call(f,this[0],g)}}a(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ","focusin focusout keyup",c).validateDelegate("[type='radio'], [type='checkbox'], select, option","click",c);if(this.settings.invalidHandler){a(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)}},form:function(){this.checkForm();a.extend(this.submitted,this.errorMap);this.invalid=a.extend({},this.errorMap);if(!this.valid()){a(this.currentForm).triggerHandler("invalid-form",[this])}this.showErrors();return this.valid()},checkForm:function(){this.prepareForm();for(var b=0,c=(this.currentElements=this.elements());c[b];b++){this.check(c[b])}return this.valid()},element:function(c){c=this.validationTargetFor(this.clean(c));this.lastElement=c;this.prepareElement(c);this.currentElements=a(c);var b=this.check(c)!==false;if(b){delete this.invalid[c.name]}else{this.invalid[c.name]=true}if(!this.numberOfInvalids()){this.toHide=this.toHide.add(this.containers)}this.showErrors();return b},showErrors:function(c){if(c){a.extend(this.errorMap,c);this.errorList=[];for(var b in c){this.errorList.push({message:c[b],element:this.findByName(b)[0]})}this.successList=a.grep(this.successList,function(d){return !(d.name in c)})}if(this.settings.showErrors){this.settings.showErrors.call(this,this.errorMap,this.errorList)}else{this.defaultShowErrors()}},resetForm:function(){if(a.fn.resetForm){a(this.currentForm).resetForm()}this.submitted={};this.lastElement=null;this.prepareForm();this.hideErrors();this.elements().removeClass(this.settings.errorClass).removeData("previousValue")},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(d){var c=0;for(var b in d){c++}return c},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return this.size()===0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid){try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(b){}}},findLastActive:function(){var b=this.lastActive;return b&&a.grep(this.errorList,function(c){return c.element.name===b.name}).length===1&&b},elements:function(){var c=this,b={};return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){if(!this.name&&c.settings.debug&&window.console){console.error("%o has no name assigned",this)}if(this.name in b||!c.objectLength(a(this).rules())){return false}b[this.name]=true;return true})},clean:function(b){return a(b)[0]},errors:function(){var b=this.settings.errorClass.replace(" ",".");return a(this.settings.errorElement+"."+b,this.errorContext)},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=a([]);this.toHide=a([]);this.currentElements=a([])},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers)},prepareElement:function(b){this.reset();this.toHide=this.errorsFor(b)},elementValue:function(b){var c=a(b).attr("type"),d=a(b).val();if(c==="radio"||c==="checkbox"){return a("input[name='"+a(b).attr("name")+"']:checked").val()}if(typeof d==="string"){return d.replace(/\r/g,"")}return d},check:function(c){c=this.validationTargetFor(this.clean(c));var i=a(c).rules();var d=false;var h=this.elementValue(c);var b;for(var j in i){var g={method:j,parameters:i[j]};try{b=a.validator.methods[j].call(this,h,c,g.parameters);if(b==="dependency-mismatch"){d=true;continue}d=false;if(b==="pending"){this.toHide=this.toHide.not(this.errorsFor(c));return}if(!b){this.formatAndAdd(c,g);return false}}catch(f){if(this.settings.debug&&window.console){console.log("Exception occurred when checking element "+c.id+", check the '"+g.method+"' method.",f)}throw f}}if(d){return}if(this.objectLength(i)){this.successList.push(c)}return true},customDataMessage:function(b,c){return a(b).data("msg-"+c.toLowerCase())||(b.attributes&&a(b).attr("data-msg-"+c.toLowerCase()))},customMessage:function(c,d){var b=this.settings.messages[c];return b&&(b.constructor===String?b:b[d])},findDefined:function(){for(var b=0;b<arguments.length;b++){if(arguments[b]!==undefined){return arguments[b]}}return undefined},defaultMessage:function(b,c){return this.findDefined(this.customMessage(b.name,c),this.customDataMessage(b,c),!this.settings.ignoreTitle&&b.title||undefined,a.validator.messages[c],"<strong>Warning: No message defined for "+b.name+"</strong>")},formatAndAdd:function(c,e){var d=this.defaultMessage(c,e.method),b=/\$?\{(\d+)\}/g;if(typeof d==="function"){d=d.call(this,e.parameters,c)}else{if(b.test(d)){d=a.validator.format(d.replace(b,"{$1}"),e.parameters)}}this.errorList.push({message:d,element:c});this.errorMap[c.name]=d;this.submitted[c.name]=d},addWrapper:function(b){if(this.settings.wrapper){b=b.add(b.parent(this.settings.wrapper))}return b},defaultShowErrors:function(){var c,d;for(c=0;this.errorList[c];c++){var b=this.errorList[c];if(this.settings.highlight){this.settings.highlight.call(this,b.element,this.settings.errorClass,this.settings.validClass)}this.showLabel(b.element,b.message)}if(this.errorList.length){this.toShow=this.toShow.add(this.containers)}if(this.settings.success){for(c=0;this.successList[c];c++){this.showLabel(this.successList[c])}}if(this.settings.unhighlight){for(c=0,d=this.validElements();d[c];c++){this.settings.unhighlight.call(this,d[c],this.settings.errorClass,this.settings.validClass)}}this.toHide=this.toHide.not(this.toShow);this.hideErrors();this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(c,d){var b=this.errorsFor(c);if(b.length){b.removeClass(this.settings.validClass).addClass(this.settings.errorClass);b.html(d)}else{b=a("<"+this.settings.errorElement+">").attr("for",this.idOrName(c)).addClass(this.settings.errorClass).html(d||"");if(this.settings.wrapper){b=b.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()}if(!this.labelContainer.append(b).length){if(this.settings.errorPlacement){this.settings.errorPlacement(b,a(c))}else{b.insertAfter(c)}}}if(!d&&this.settings.success){b.text("");if(typeof this.settings.success==="string"){b.addClass(this.settings.success)}else{this.settings.success(b,c)}}this.toShow=this.toShow.add(b)},errorsFor:function(c){var b=this.idOrName(c);return this.errors().filter(function(){return a(this).attr("for")===b})},idOrName:function(b){return this.groups[b.name]||(this.checkable(b)?b.name:b.id||b.name)},validationTargetFor:function(b){if(this.checkable(b)){b=this.findByName(b.name).not(this.settings.ignore)[0]}return b},checkable:function(b){return(/radio|checkbox/i).test(b.type)},findByName:function(b){return a(this.currentForm).find("[name='"+b+"']")},getLength:function(c,b){switch(b.nodeName.toLowerCase()){case"select":return a("option:selected",b).length;case"input":if(this.checkable(b)){return this.findByName(b.name).filter(":checked").length}}return c.length},depend:function(c,b){return this.dependTypes[typeof c]?this.dependTypes[typeof c](c,b):true},dependTypes:{"boolean":function(c,b){return c},string:function(c,b){return !!a(c,b.form).length},"function":function(c,b){return c(b)}},optional:function(b){var c=this.elementValue(b);return !a.validator.methods.required.call(this,c,b)&&"dependency-mismatch"},startRequest:function(b){if(!this.pending[b.name]){this.pendingRequest++;this.pending[b.name]=true}},stopRequest:function(b,c){this.pendingRequest--;if(this.pendingRequest<0){this.pendingRequest=0}delete this.pending[b.name];if(c&&this.pendingRequest===0&&this.formSubmitted&&this.form()){a(this.currentForm).submit();this.formSubmitted=false}else{if(!c&&this.pendingRequest===0&&this.formSubmitted){a(this.currentForm).triggerHandler("invalid-form",[this]);this.formSubmitted=false}}},previousValue:function(b){return a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:true,message:this.defaultMessage(b,"remote")})}},classRuleSettings:{required:{required:true},email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},number:{number:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(b,c){if(b.constructor===String){this.classRuleSettings[b]=c}else{a.extend(this.classRuleSettings,b)}},classRules:function(c){var d={};var b=a(c).attr("class");if(b){a.each(b.split(" "),function(){if(this in a.validator.classRuleSettings){a.extend(d,a.validator.classRuleSettings[this])}})}return d},attributeRules:function(c){var e={};var b=a(c);for(var f in a.validator.methods){var d;if(f==="required"){d=b.get(0).getAttribute(f);if(d===""){d=true}d=!!d}else{d=b.attr(f)}if(d){e[f]=d}else{if(b[0].getAttribute("type")===f){e[f]=true}}}if(e.maxlength&&/-1|2147483647|524288/.test(e.maxlength)){delete e.maxlength}return e},dataRules:function(c){var f,d,e={},b=a(c);for(f in a.validator.methods){d=b.data("rule-"+f.toLowerCase());if(d!==undefined){e[f]=d}}return e},staticRules:function(c){var d={};var b=a.data(c.form,"validator");if(b.settings.rules){d=a.validator.normalizeRule(b.settings.rules[c.name])||{}}return d},normalizeRules:function(c,b){a.each(c,function(f,e){if(e===false){delete c[f];return}if(e.param||e.depends){var d=true;switch(typeof e.depends){case"string":d=!!a(e.depends,b.form).length;break;case"function":d=e.depends.call(b,b);break}if(d){c[f]=e.param!==undefined?e.param:true}else{delete c[f]}}});a.each(c,function(d,e){c[d]=a.isFunction(e)?e(b):e});a.each(["minlength","maxlength"],function(){if(c[this]){c[this]=Number(c[this])}});a.each(["rangelength"],function(){var d;if(c[this]){if(a.isArray(c[this])){c[this]=[Number(c[this][0]),Number(c[this][1])]}else{if(typeof c[this]==="string"){d=c[this].split(/[\s,]+/);c[this]=[Number(d[0]),Number(d[1])]}}}});if(a.validator.autoCreateRanges){if(c.min&&c.max){c.range=[c.min,c.max];delete c.min;delete c.max}if(c.minlength&&c.maxlength){c.rangelength=[c.minlength,c.maxlength];delete c.minlength;delete c.maxlength}}return c},normalizeRule:function(c){if(typeof c==="string"){var b={};a.each(c.split(/\s/),function(){b[this]=true});c=b}return c},addMethod:function(b,d,c){a.validator.methods[b]=d;a.validator.messages[b]=c!==undefined?c:a.validator.messages[b];if(d.length<3){a.validator.addClassRules(b,a.validator.normalizeRule(b))}},methods:{required:function(c,b,e){if(!this.depend(e,b)){return"dependency-mismatch"}if(b.nodeName.toLowerCase()==="select"){var d=a(b).val();return d&&d.length>0}if(this.checkable(b)){return this.getLength(c,b)>0}return a.trim(c).length>0},email:function(c,b){return this.optional(b)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(c)},url:function(c,b){return this.optional(b)||/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(c)},date:function(c,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(c).toString())},dateISO:function(c,b){return this.optional(b)||/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(c)},number:function(c,b){return this.optional(b)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(c)},digits:function(c,b){return this.optional(b)||/^\d+$/.test(c)},creditcard:function(f,c){if(this.optional(c)){return"dependency-mismatch"}if(/[^0-9 \-]+/.test(f)){return false}var g=0,e=0,b=false;f=f.replace(/\D/g,"");for(var h=f.length-1;h>=0;h--){var d=f.charAt(h);e=parseInt(d,10);if(b){if((e*=2)>9){e-=9}}g+=e;b=!b}return(g%10)===0},minlength:function(d,b,e){var c=a.isArray(d)?d.length:this.getLength(a.trim(d),b);return this.optional(b)||c>=e},maxlength:function(d,b,e){var c=a.isArray(d)?d.length:this.getLength(a.trim(d),b);return this.optional(b)||c<=e},rangelength:function(d,b,e){var c=a.isArray(d)?d.length:this.getLength(a.trim(d),b);return this.optional(b)||(c>=e[0]&&c<=e[1])},min:function(c,b,d){return this.optional(b)||c>=d},max:function(c,b,d){return this.optional(b)||c<=d},range:function(c,b,d){return this.optional(b)||(c>=d[0]&&c<=d[1])},equalTo:function(c,b,e){var d=a(e);if(this.settings.onfocusout){d.unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){a(b).valid()})}return c===d.val()},remote:function(f,c,g){if(this.optional(c)){return"dependency-mismatch"}var d=this.previousValue(c);if(!this.settings.messages[c.name]){this.settings.messages[c.name]={}}d.originalMessage=this.settings.messages[c.name].remote;this.settings.messages[c.name].remote=d.message;g=typeof g==="string"&&{url:g}||g;if(d.old===f){return d.valid}d.old=f;var b=this;this.startRequest(c);var e={};e[c.name]=f;a.ajax(a.extend(true,{url:g,mode:"abort",port:"validate"+c.name,dataType:"json",data:e,success:function(i){b.settings.messages[c.name].remote=d.originalMessage;var k=i===true||i==="true";if(k){var h=b.formSubmitted;b.prepareElement(c);b.formSubmitted=h;b.successList.push(c);delete b.invalid[c.name];b.showErrors()}else{var l={};var j=i||b.defaultMessage(c,"remote");l[c.name]=d.message=a.isFunction(j)?j(f):j;b.invalid[c.name]=true;b.showErrors(l)}d.valid=k;b.stopRequest(c,k)}},g));return"pending"}}});a.format=a.validator.format}(jQuery));(function(c){var a={};if(c.ajaxPrefilter){c.ajaxPrefilter(function(f,e,g){var d=f.port;if(f.mode==="abort"){if(a[d]){a[d].abort()}a[d]=g}})}else{var b=c.ajax;c.ajax=function(e){var f=("mode" in e?e:c.ajaxSettings).mode,d=("port" in e?e:c.ajaxSettings).port;if(f==="abort"){if(a[d]){a[d].abort()}a[d]=b.apply(this,arguments);return a[d]}return b.apply(this,arguments)}}}(jQuery));(function(a){a.extend(a.fn,{validateDelegate:function(d,c,b){return this.bind(c,function(e){var f=a(e.target);if(f.is(d)){return b.apply(f,arguments)}})}})}(jQuery));

jQuery(function($){
  
  // Drawer
  $('.toggle-drawer').click(function(){
    var collapse_content_selector = '#drawer';
    var toggle_switch = $('span.drawer-icon');
    $(collapse_content_selector).slideToggle(function(){
      if($(this).css('display')=='none'){
        toggle_switch.text('+'); //change the button label to be 'Show'
      }else{
        toggle_switch.text('-'); //change the button label to be 'Hide'
      }
    });
  });

  // Mobile Menu
  $('#toggle-menu').click(function(){
    var collapse_content_selector = '#main-menu';
    $(collapse_content_selector).slideToggle(function(){
    });
  });

  // Accordian
  $('.accordion-button').click(function() {
    var accordionContent = $(this).next(".accordion-content")
    if ($(accordionContent).is(':visible')) {
      $(this).find("span").text('+')
      $(accordionContent).slideUp(100)
    } else {
      $(this).find("span").text('-')
      $(accordionContent).slideDown(100)
    }
    return false;
  });

  // FancyBox
  $(".fancybox-media")
      .attr('rel', 'gallery')
      .fancybox({
          openEffect  : 'fade',
          closeEffect : 'fade',
          nextEffect  : 'elastic',
          prevEffect  : 'elastic',
          padding     : 0,
          wrapCSS   : 'mnml'  
   });
  
   // Product Zoom 
   if ($("#feature-image").length) {
     $("#feature-image").elevateZoom({
       zoomType : "inner",
     });
   }  
   
   // Product Tabs
   $('ul.tabs').each(function(){
     // For each set of tabs, we want to keep track of
     // which tab is active and it's associated content
     var $active, $content, $links = $(this).find('a');
   
     // If the location.hash matches one of the links, use that as the active tab.
     // If no match is found, use the first link as the initial active tab.
     $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
     $active.addClass('active');
     $content = $($active.attr('href'));
   
     // Hide the remaining content
     $links.not($active).each(function () {
       $($(this).attr('href')).hide();
     });
   
     // Bind the click event handler
     $(this).on('click', 'a', function(e){
       // Make the old tab inactive.
       $active.removeClass('active');
       $content.hide();
   
       // Update the variables with the new link and content
       $active = $(this);
       $content = $($(this).attr('href'));
   
       // Make the tab active.
       $active.addClass('active');
       $content.show();
   
       // Prevent the anchor's default click action
       e.preventDefault();
     });
   });
  
  // Form Validation
  $("form.mailing-list").validate();
  if(window.location.href.indexOf("?customer_posted=true") > -1) {
    $("span.success").addClass("show");
  }
    
  // Shopify AJAX api
  // (c) Copyright 2009 Jaded Pixel. Author: Caroline Schnapp. All Rights Reserved.

  /*
  
  IMPORTANT:

  Ajax requests that update Shopify's cart must be queued and sent synchronously to the server.
  Meaning: you must wait for your 1st ajax callback to send your 2nd request, and then wait
  for its callback to send your 3rd request, etc.

  */

  /**
   * Modified by Mitchell Amihod 
   *  We make some mods. consider them feedback :) See comments/commit messages
   * Changes include:
   *      addItemFromForm: allow for passing in of form element, OR string selector
   *      updateCartFromForm: allow for passing in of form element, OR string selector
   *
   * To see how I make use of these changes, see [link to ajaxify-shop.js] 
   * 
   * Sept 02, 2010
   */


  /* 

  Events (override!)

  Example override:
    ... add to your theme.liquid's script tag....

    Shopify.onItemAdded = function(line_item) {
      $('message').update('Added '+line_item.title + '...');
    }

  */

  Shopify.onError = function(XMLHttpRequest, textStatus) {
    // Shopify returns a description of the error in XMLHttpRequest.responseText.
    // It is JSON.
    // Example: {"description":"The product 'Amelia - Small' is already sold out.","status":500,"message":"Cart Error"}
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    alert(data.message + '(' + data.status  + '): ' + data.description);
  };

  Shopify.onCartUpdate = function(cart) {
    alert('There are now ' + cart.item_count + ' items in the cart.');
  };  

  Shopify.onItemAdded = function(line_item) {
    alert(line_item.title + ' was added to your shopping cart.');
  };

  Shopify.onProduct = function(product) {
    alert('Received everything we ever wanted to know about ' + product.title);
  };

  /* Tools */

  Shopify.resizeImage = function(image, size) {
    try {
      if(size == 'original') { return image; }
      else {      
        var matches = image.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
        return matches[1] + '_' + size + '.' + matches[2];
      }    
    } catch (e) { return image; }
  };

  /* Ajax API */

  // -------------------------------------------------------------------------------------
  // POST to cart/add.js returns the JSON of the line item associated with the added item.
  // -------------------------------------------------------------------------------------
  Shopify.addItem = function(variant_id, quantity, callback) {
    quantity = quantity || 1;
    var params = {
      type: 'POST',
      url: '/cart/add.js',
      data: 'quantity=' + quantity + '&id=' + variant_id,
      dataType: 'json',
      success: function(line_item) { 
        if ((typeof callback) === 'function') {
          callback(line_item);
        }
        else {
          Shopify.onItemAdded(line_item);
        }
      },
      error: function(XMLHttpRequest, textStatus) {
        Shopify.onError(XMLHttpRequest, textStatus);
      }
    };
    $.ajax(params);
  };

  // ---------------------------------------------------------
  // POST to cart/add.js returns the JSON of the line item.
  // ---------------------------------------------------------
  //Allow use of form element instead of id.
  //This makes it a bit more flexible. Every form doesn't need an id.
  //Once you are having someone pass in an id, might as well make it selector based, or pass in the element itself.
  //Since you are just wrapping it in a $(). The same rationale is behind the change for updateCartFromForm
  //@param HTMLElement the form element which was submitted. Or you could pass in a string selector such as the form id. 
  //@param function callback callback fuction if you like, but I just override Shopify.onItemAdded() instead
  Shopify.addItemFromForm = function(form, callback) {
      var params = {
        type: 'POST',
        url: '/cart/add.js',
        data: $(form).serialize(),
        dataType: 'json',
        success: function(line_item) { 
          if ((typeof callback) === 'function') {
            callback(line_item, form);
          }
          else {
            Shopify.onItemAdded(line_item, form);
          }
        },
        error: function(XMLHttpRequest, textStatus) {
      error(XMLHttpRequest);
          Shopify.onError(XMLHttpRequest, textStatus);
        }
      };
      $.ajax(params);
  };
  
  function error(XMLHttpRequest) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    $("#add").val("Sold Out");  
    //alert("Sorry, " + data.description);
      
  }

  // ---------------------------------------------------------
  // GET cart.js returns the cart in JSON.
  // ---------------------------------------------------------
  Shopify.getCart = function(callback) {
    
    $.getJSON('/cart.js', function (cart, textStatus) {
      if ((typeof callback) === 'function') {
        callback(cart);
      }
      else {
        Shopify.onCartUpdate(cart);
      }
    });
  };
  
  Shopify.onError = function(XMLHttpRequest, textStatus) {
    // Shopify returns a description of the error in XMLHttpRequest.responseText.
    // It is JSON.
    // Example: {"description":"The product 'Amelia - Small' is already sold out.","status":500,"message":"Cart Error"}
    // var data = eval('(' + XMLHttpRequest.responseText + ')');
    // errorMessage(data.message + '(' + data.status  + '): ' + data.description);
  
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    alert(data.message + '(' + data.status  + '): ' + data.description);
  };

  // ---------------------------------------------------------
  // GET products/<product-handle>.js returns the product in JSON.
  // ---------------------------------------------------------
  Shopify.getProduct = function(handle, callback) {
    $.getJSON('/products/' + handle + '.js', function (product, textStatus) {
      if ((typeof callback) === 'function') {
        callback(product);
      }
      else {
        Shopify.onProduct(product);
      }
    });
  };

  // ---------------------------------------------------------
  // POST to cart/change.js returns the cart in JSON.
  // ---------------------------------------------------------
  Shopify.changeItem = function(variant_id, quantity, callback) {
    var params = {
      type: 'POST',
      url: '/cart/change.js',
      data:  'quantity='+quantity+'&id='+variant_id,
      dataType: 'json',
      success: function(cart) { 
        if ((typeof callback) === 'function') {
          callback(cart);
        }
        else {
          Shopify.onCartUpdate(cart);
        }
      },
      error: function(XMLHttpRequest, textStatus) {
        Shopify.onError(XMLHttpRequest, textStatus);
      }
    };
    $.ajax(params);
  };

  // ---------------------------------------------------------
  // POST to cart/change.js returns the cart in JSON.
  // ---------------------------------------------------------
  Shopify.removeItem = function(variant_id, callback) {
    var params = {
      type: 'POST',
      url: '/cart/change.js',
      data:  'quantity=0&id='+variant_id,
      dataType: 'json',
      success: function(cart) { 
        if ((typeof callback) === 'function') {
          callback(cart);
        }
        else {
          Shopify.onCartUpdate(cart);
        }
      },
      error: function(XMLHttpRequest, textStatus) {
        Shopify.onError(XMLHttpRequest, textStatus);
      }
    };
    $.ajax(params);
  };

  // ---------------------------------------------------------
  // POST to cart/clear.js returns the cart in JSON.
  // It removes all the items in the cart, but does
  // not clear the cart attributes nor the cart note.
  // ---------------------------------------------------------
  Shopify.clear = function(callback) {
    var params = {
      type: 'POST',
      url: '/cart/clear.js',
      data:  '',
      dataType: 'json',
      success: function(cart) { 
        if ((typeof callback) === 'function') {
          callback(cart);
        }
        else {
          Shopify.onCartUpdate(cart);
        }
      },
      error: function(XMLHttpRequest, textStatus) {
        Shopify.onError(XMLHttpRequest, textStatus);
      }
    };
    $.ajax(params);
  };

  // ---------------------------------------------------------
  // POST to cart/update.js returns the cart in JSON.
  // ---------------------------------------------------------
  //Allow use of form element instead of id.
  //This makes it a bit more flexible. Every form doesn't need an id.
  //Once you are having someone pass in an id, might as well make it selector based, or pass in the element itself, 
  //since you are just wrapping it in a $().
  //@param HTMLElement the form element which was submitted. Or you could pass in a string selector such as the #form_id. 
  //@param function callback callback fuction if you like, but I just override Shopify.onCartUpdate() instead
  Shopify.updateCartFromForm = function(form, callback) {
    var params = {
      type: 'POST',
      url: '/cart/update.js',
      data: $(form).serialize(),
      dataType: 'json',
      success: function(cart) {
        if ((typeof callback) === 'function') {
          callback(cart, form);
        }
        else {
          Shopify.onCartUpdate(cart, form);
        }
      },
      error: function(XMLHttpRequest, textStatus) {
        Shopify.onError(XMLHttpRequest, textStatus);
      }
    };
    $.ajax(params);
  };

  // ---------------------------------------------------------
  // POST to cart/update.js returns the cart in JSON.
  // To clear a particular attribute, set its value to an empty string.
  // Receives attributes as a hash or array. Look at comments below.
  // ---------------------------------------------------------
  Shopify.updateCartAttributes = function(attributes, callback) {
    var data = '';
    // If attributes is an array of the form:
    // [ { key: 'my key', value: 'my value' }, ... ]
    if ($.isArray(attributes)) {
      $.each(attributes, function(indexInArray, valueOfElement) {
        var key = attributeToString(valueOfElement.key);
        if (key !== '') {
          data += 'attributes[' + key + ']=' + attributeToString(valueOfElement.value) + '&';
        }
      });
    }
    // If attributes is a hash of the form:
    // { 'my key' : 'my value', ... }
    else if ((typeof attributes === 'object') && attributes !== null) {
      $.each(attributes, function(key, value) {
          data += 'attributes[' + attributeToString(key) + ']=' + attributeToString(value) + '&';
      });
    }
    var params = {
      type: 'POST',
      url: '/cart/update.js',
      data: data,
      dataType: 'json',
      success: function(cart) {
        if ((typeof callback) === 'function') {
          callback(cart);
        }
        else {
          Shopify.onCartUpdate(cart);
        }
      },
      error: function(XMLHttpRequest, textStatus) {
        Shopify.onError(XMLHttpRequest, textStatus);
      }
    };
    $.ajax(params);
  };

  // ---------------------------------------------------------
  // POST to cart/update.js returns the cart in JSON.
  // ---------------------------------------------------------
  Shopify.updateCartNote = function(note, callback) {
    var params = {
      type: 'POST',
      url: '/cart/update.js',
      data: 'note=' + attributeToString(note),
      dataType: 'json',
      success: function(cart) {
        if ((typeof callback) === 'function') {
          callback(cart);
        }
        else {
          Shopify.onCartUpdate(cart);
        }
      },
      error: function(XMLHttpRequest, textStatus) {
        Shopify.onError(XMLHttpRequest, textStatus);
      }
    };
    $.ajax(params);
  };

  /* Used by API */

  function attributeToString(attribute) {
    if ((typeof attribute) !== 'string') {
      // Converts to a string.
      attribute += '';
      if (attribute === 'undefined') {
        attribute = '';
      }
    }
    // Removing leading and trailing whitespace.
    return $.trim(attribute);
  }
    
  // Ajaxify Shop
  
  /**
   * Shopify Ajaxify Shop. 
   * 
   * @uses Modified Shopify jQuery API (link to it)
   *
   */

  /**
   * Collection of Selectors for various pieces on the page we need to update 
   *
   * I've tried to keep these as general and flexible as possible, but 
   * if you are doing your own markup, you may find you need to change some of these.
   *
   */
  var selectors = {
      // Any elements(s) with this selector will have the total item count put there on add to cart.
      TOTAL_ITEMS: '.count', 

      SUBMIT_ADD_TO_CART: 'input.add-to-cart',

      FORM_ADD_TO_CART: 'form[action="/cart/add"]',

      //FORM_UPDATE_CART: 'form[name=cartform]',
      //The actual Update Button
      //FORM_UPDATE_CART_BUTTON: 'form[name=cartform] input[name=update]',
      //All the buttons on the form
      //FORM_UPDATE_CART_BUTTONS: 'input[type=image], input.button-update-cart',

      LINE_ITEM_ROW: '.cart-line-item',
      LINE_ITEM_QUANTITY_PREFIX: 'input#updates_',
      LINE_ITEM_PRICE_PREFIX: '.cart-line-item-price-',

      LINE_ITEM_REMOVE: '.remove a',

      EMPTY_CART_MESSAGE: '#empty'
  };


  /**
   * Collection of text strings. This is where you would change for a diff language, for example. 
   *
   */
  var text = {
      ITEM: 'Item', 
      ITEMS: 'Items'
  };

  var button = '';

  //Convenience method to format money. 
  //Can just transform the amount here if needed
  var formatMoney = function(price) {
      return Shopify.formatMoney(price, Shopify.money_format);
  };

  //Attach Submit Handler to all forms with the /cart/add action. 
  $(".quickAdd").submit(function(e) {
    e.preventDefault();
    button = $(e.target);

    //Disable the Add To Cart button, add a disabled class. 
    $(e.target).find(selectors.SUBMIT_ADD_TO_CART).attr('disabled', true).addClass('disabled');

    //Can't use updateCartFromForm since you need the item added before you can update (otherwise, would have been more convenient)
    //So, in onItemAdded, we Shopify.getCart() to force the repaint of items in cart. 
    Shopify.addItemFromForm(e.target);
  
    Shopify.getCart();
    
  });

  //We only want to interrupt the UPDATE, not the CHECKOUT process
  $(selectors.FORM_UPDATE_CART_BUTTON).click(function(e) {
      e.preventDefault();
      $(e.target.form).find(selectors.FORM_UPDATE_CART_BUTTONS).attr('disabled', true).addClass('disabled');
      Shopify.updateCartFromForm(e.target.form);
  });

  //Delegate the Remove Link functionality on the cart page.
  $(selectors.FORM_UPDATE_CART).delegate(selectors.LINE_ITEM_REMOVE, 'click', function(e) {
      e.preventDefault();
      //Get the variant ID from the URL
      var vid = this.href.split('/').pop().split('?').shift();
      Shopify.removeItem(vid);
      $(this).parents(selectors.LINE_ITEM_ROW).remove();
  });

  /**
   * Shopify.onItemAdded
   * 
   * Triggered by the response when something is added to the cart via the add to cart button.
   * This is where you would want to put any flash messaging, for example.
   * 
   * @param object line_item
   * @param HTMLelement/String Form HTMLElement, or selector
   */
  Shopify.onItemAdded = function(line_item, form) {
      //Default behaviour for this modification:
      //When a Add To Cart form is clicked, we disable the button and apply a class of disabled. 
      //Here is where we remove the disabled class, and reactivate the button.
      $(form).find(selectors.SUBMIT_ADD_TO_CART).attr('disabled', false).removeClass('disabled');

      //You can add any extra messaging you would want here. 
      // $('#added-to-cart-message').fadeIn(500).delay(2000).fadeOut(1500);
      //Get the state of the cart, which will trigger onCartUpdate
      Shopify.getCart();
  };

  /**
   * This updates the N item/items left in your cart
   * 
   * It's setup to match the HTML used to display the Cart Count on Load. If you change that (in your theme.liquid) 
   * you will probably want to change the message html here. 
   * This will update the HTML in ANY element with the class defined in selectors.TOTAL_ITEMS
   *
   * @param object the cart object. 
   * @param HTMLElement form. If included, we know its an Update of the CART FORM, which will trigger additional behaviour. 
   */
  Shopify.onCartUpdate = function(cart, form) {

      // Total Items Update
      var message = '<span class="count">('+cart.item_count+')</span>';
      $(selectors.TOTAL_ITEMS).html(message);
      var mini_message = '<a href="/cart"><span class="count">'+cart.item_count+'</span> Checkout</a>';
      $(selectors.MINI_ITEMS).html(mini_message);
      // Price update - any element matching the selector will have their contents updated with the cart price.
      var price = formatMoney(cart.total_price);
      $(selectors.TOTAL_PRICE).html(' | Total: ' + price);

    // show 'added to basket' message
      //$(button).children(".added-to-cart").fadeIn(500).delay(2000).fadeOut(1500);

      //If the EMPTY_CART_MESSAGE element exiss, we should show it, and hide the form. 
      if( ($(selectors.EMPTY_CART_MESSAGE).length > 0) &&  cart.item_count == 0) {
          $(selectors.FORM_UPDATE_CART).hide();
          $(selectors.EMPTY_CART_MESSAGE).show();
      }

      // A form was passed in?
      form = form || false;
      //so it's the cart page form update, trigger behaviours for that page
      if(form) {
          //Nothing left in cart, we reveal the Nothing in cart content, hide the form.
          if(cart.item_count > 0) {
              //Loops through cart items, update the prices.
              $.each(cart.items, function(index, cartItem) {
                  $(selectors.LINE_ITEM_PRICE_PREFIX + cartItem.id).html(formatMoney(cartItem.line_price));
                  $(selectors.LINE_ITEM_QUANTITY_PREFIX + cartItem.id).val(cartItem.quantity);
              });

              //And remove any line items with 0
              $(form).find('input[value=0]').parents(selectors.LINE_ITEM_ROW).remove();

              //Since we are on the cart page, reenable the buttons we disabled
              $(form).find(selectors.FORM_UPDATE_CART_BUTTONS).attr('disabled', false).removeClass('disabled');

          }    
          //You can add any extra messaging you would want here. 
          //successMessage('Cart Updated.');
      }
  
    /* Rebuild Cart Drawer when adding an item using ajax */
    var drawer = '';
    $("#drawer .container").css("min-height", $("#drawer .container").height());
    $("#drawer .spinner").remove();
    $("#drawer .container").prepend('<p class="spinner"></p>');
    $("#drawer form").remove();
    if ($("#drawer .container .empty").length) {
      $("#drawer .container .empty").parent().remove();
    }
    
    if(cart.item_count > 0) {
      
      $.each(cart.items, function(index, cartItem) {
        if (index == 0) { first = 'first'; } else { first = ''; }
        
        var product = null;
        $.getJSON('/products/'+cartItem.handle+'.js', function(data) {
          product = data;
        });
        var description = truncate(strip(product.description),20,'....');
        drawer += '<div class="row '+first+'"><div class="nine columns description"><img src="'+cartItem.image+'" alt="'+cartItem.title+'"/><div class="info"><h3><a href="'+cartItem.url+'">'+cartItem.title+'</a></h3><h4>'+cartItem.vendor+'</h4><p>'+description+'</p><p class="mobile">'+cartItem.quantity+' x '+formatMoney(cartItem.price)+'</p></div></div><div class="two columns price desktop">'+formatMoney(cartItem.price)+'</div><div class="two columns quantity desktop"><input type="text" name="updates[]" id="updates_'+cartItem.id+'" value="'+cartItem.quantity+'"/></div><div class="two columns total desktop">'+formatMoney(cartItem.line_price)+'</div><div class="one column remove desktop"><a href="/cart/change?line='+index+'&quantity=0" class="removeLine" rel="'+cartItem.variant_id+'">Remove</a></div></div>';
      
        if (index == (cart.items.length-1)) {
          $("#drawer .spinner").remove();
          $("#drawer .container").prepend('<form action="/cart" method="post">'+drawer+'<div class="actions"><input type="submit" value="Check Out" /></div></form>').hide().fadeIn(500);
          if ((typeof Currency === 'object') && (typeof Currency.convertAll === 'function') && jQuery('[name=currencies]').val()) {
            Currency.convertAll(shopCurrency, jQuery('[name=currencies]').val(), '#drawer span.money');
          }
        }
      });
      
      
    } else {
      
    }
  };
  
  function truncate(str, maxLength, suffix)
  {
      if(str.length > maxLength)
      {
          str = str.split(" ").splice(0,maxLength).join(" ") + suffix;
      }
      return str;
  }
  
  function strip(html)
  {
     var tmp = document.createElement("DIV");
     tmp.innerHTML = html;
     return tmp.textContent||tmp.innerText;
  }

  function disable(e) 
  {
     e.preventDefault(); 
     return false;
  };
  
  $(document).on("click", ".removeLine", function(e) { 
    e.preventDefault();
    $("#drawer .container").css("min-height", "50px").css("height", "auto");
    $(this).addClass("marked-delete");
    Shopify.removeItem($(this).attr("rel"), removeLine);
  });

  function removeLine(cart) {
    $(".marked-delete").parent().parent().fadeOut(1000, function() {
      $(".marked-delete").parent().parent().remove();
      $("#drawer .container form .row:first-child").addClass("first");      
      if ($("#drawer .row").length == 0) {
        $("#drawer .container").html('<div class="sixteen columns description"><p class="empty">Your cart is empty.</p></div>');
      }
    });
    $('#minicart .count').html('(' + cart.item_count + ')');    
  }

  //What to display when there is an error. You tell me?! I've left in a commented out example.
  // You can tie this in to any sort of flash messages, or lightbox, or whatnot you want.
  Shopify.onError = function(XMLHttpRequest, textStatus) {
    // Shopify returns a description of the error in XMLHttpRequest.responseText.
    // It is JSON.
    // Example: {"description":"The product 'Amelia - Small' is already sold out.","status":500,"message":"Cart Error"}
    // var data = eval('(' + XMLHttpRequest.responseText + ')');
    // errorMessage(data.message + '(' + data.status  + '): ' + data.description);
  };
    
  // Add to cart animation
  $(".add-to-cart").click(function(e){

      var elem = $(this);
      elem.prop("disabled", true);
 
	  $("body").on("click", ".checkout", disable);

      e.preventDefault();

      function animate() {

        $("#cart-animation").show()

        var addtocartWidth = elem.outerWidth() / 2;
        var addtocartHeight = elem.outerHeight() / 2;

        var addtocartLeft = elem.offset().left + addtocartWidth;
        var addtocartTop = elem.offset().top + addtocartHeight ;

        var buttonAreaWidth = $(".cart-target").outerWidth();
        var buttonAreaHeight = $(".cart-target").outerHeight();

        var buttonAreaLeft = $(".cart-target").offset().left + buttonAreaWidth / 2  - $("#cart-animation").outerWidth() / 2;

        var htmlMargin = $('html').css('margin-top')
        var htmlMarginTrim = parseInt(htmlMargin);

          if (htmlMargin !== 0 ) {
            var buttonAreaTop = $(".cart-target").offset().top + buttonAreaWidth / 2  - htmlMarginTrim - $("#cart-animation").outerHeight() / 2 ;
          } else {
            var buttonAreaTop = $(".cart-target").offset().top + buttonAreaWidth / 2  - $("#cart-animation").outerHeight() / 2 ;

          }

        var path = {
          start: {
            x: addtocartLeft,
            y: addtocartTop,
            angle: 190.012,
            length: 0.2
          },
          end: {
            x: buttonAreaLeft,
            y: buttonAreaTop,
            angle: 90.012,
            length: 0.50
          }
        };

        $('#cart-animation').animate(
          {
            path : new $.path.bezier(path)
          },
          1200,
          function() {
            $(elem).prop("disabled", false)
            $("#cart-animation").fadeOut(500);
            elem.closest('form').submit();
            $("body").off("click", ".checkout", disable);
        }
        );
      }

      animate();
    })
    
  // show or hide add to cart targets
  function windowResize() {
    if ($(window).width() < 782) {
      $(".cart.mobile").find(".count").addClass("cart-target")
      $(".cart.desktop").find(".count").removeClass("cart-target")
    } else {

      $(".cart.desktop").find(".count").addClass("cart-target")
      $(".cart.mobile").find(".count").removeClass("cart-target")
    }

  } 

  $(window).resize(function(){
    windowResize();
  })
  windowResize();

  // jQuery css bezier animation support -- Jonah Fox 
  ;(function($){

    $.path = {};

    var V = {
      rotate: function(p, degrees) {
        var radians = degrees * Math.PI / 180,
          c = Math.cos(radians),
          s = Math.sin(radians);
        return [c*p[0] - s*p[1], s*p[0] + c*p[1]];
      },
      scale: function(p, n) {
        return [n*p[0], n*p[1]];
      },
      add: function(a, b) {
        return [a[0]+b[0], a[1]+b[1]];
      },
      minus: function(a, b) {
        return [a[0]-b[0], a[1]-b[1]];
      }
    };

    $.path.bezier = function( params, rotate ) {
      params.start = $.extend( {angle: 0, length: 0.3333}, params.start );
      params.end = $.extend( {angle: 0, length: 0.3333}, params.end );

      this.p1 = [params.start.x, params.start.y];
      this.p4 = [params.end.x, params.end.y];

      var v14 = V.minus( this.p4, this.p1 ),
        v12 = V.scale( v14, params.start.length ),
        v41 = V.scale( v14, -1 ),
        v43 = V.scale( v41, params.end.length );

      v12 = V.rotate( v12, params.start.angle );
      this.p2 = V.add( this.p1, v12 );

      v43 = V.rotate(v43, params.end.angle );
      this.p3 = V.add( this.p4, v43 );

      this.f1 = function(t) { return (t*t*t); };
      this.f2 = function(t) { return (3*t*t*(1-t)); };
      this.f3 = function(t) { return (3*t*(1-t)*(1-t)); };
      this.f4 = function(t) { return ((1-t)*(1-t)*(1-t)); };

      /* p from 0 to 1 */
      this.css = function(p) {
        var f1 = this.f1(p), f2 = this.f2(p), f3 = this.f3(p), f4=this.f4(p), css = {};
        if (rotate) {
          css.prevX = this.x;
          css.prevY = this.y;
        }
        css.x = this.x = ( this.p1[0]*f1 + this.p2[0]*f2 +this.p3[0]*f3 + this.p4[0]*f4 +.5 )|0;
        css.y = this.y = ( this.p1[1]*f1 + this.p2[1]*f2 +this.p3[1]*f3 + this.p4[1]*f4 +.5 )|0;
        css.left = css.x + "px";
        css.top = css.y + "px";
        return css;
      };
    };

    $.path.arc = function(params, rotate) {
      for ( var i in params ) {
        this[i] = params[i];
      }

      this.dir = this.dir || 1;

      while ( this.start > this.end && this.dir > 0 ) {
        this.start -= 360;
      }

      while ( this.start < this.end && this.dir < 0 ) {
        this.start += 360;
      }

      this.css = function(p) {
        var a = ( this.start * (p ) + this.end * (1-(p )) ) * Math.PI / 180,
          css = {};

        if (rotate) {
          css.prevX = this.x;
          css.prevY = this.y;
        }
        css.x = this.x = ( Math.sin(a) * this.radius + this.center[0] +.5 )|0;
        css.y = this.y = ( Math.cos(a) * this.radius + this.center[1] +.5 )|0;
        css.left = css.x + "px";
        css.top = css.y + "px";
        return css;
      };
    };

    $.fx.step.path = function(fx) {
      var css = fx.end.css( 1 - fx.pos );
      if ( css.prevX != null ) {
        $.cssHooks.transform.set( fx.elem, "rotate(" + Math.atan2(css.prevY - css.y, css.prevX - css.x) + ")" );
      }
      fx.elem.style.top = css.top;
      fx.elem.style.left = css.left;
    };

    $.placeholder.shim();

  })(jQuery);
  
})  

// hide zoom window if the image is to small
$(window).load(function() {
  
  if ($("#feature-image").length) {
    
    var zoom = $("#feature-image").attr("data-zoom-image");
    var img = new Image();
    img.src = zoom;
    if (img.width < 540) {
      $(".zoomContainer").hide();
    }
  }
  
});

/* html5 placehodler shim */
(function($) {

  $.extend($,{ placeholder: {
      browser_supported: function() {
        return this._supported !== undefined ?
          this._supported :
          ( this._supported = !!('placeholder' in $('<input type="text">')[0]) );
      },
      shim: function(opts) {
        var config = {
          color: '#888',
          cls: 'placeholder',
          selector: 'input[placeholder], textarea[placeholder]'
        };
        $.extend(config,opts);
        return !this.browser_supported() && $(config.selector)._placeholder_shim(config);
      }
  }});

  $.extend($.fn,{
    _placeholder_shim: function(config) {
      function calcPositionCss(target)
      {
        var op = $(target).offsetParent().offset();
        var ot = $(target).offset();

        return {
          top: ot.top - op.top,
          left: ot.left - op.left,
          width: $(target).width()
        };
      }
      function adjustToResizing(label) {
        var $target = label.data('target');
        if(typeof $target !== "undefined") {
          label.css(calcPositionCss($target));
          $(window).one("resize", function () { adjustToResizing(label); });
        }
      }
      return this.each(function() {
        var $this = $(this);

        if( $this.is(':visible') ) {

          if( $this.data('placeholder') ) {
            var $ol = $this.data('placeholder');
            $ol.css(calcPositionCss($this));
            return true;
          }

          var possible_line_height = {};
          if( !$this.is('textarea') && $this.css('height') != 'auto') {
            possible_line_height = { lineHeight: $this.css('height'), whiteSpace: 'nowrap' };
          }

          var ol = $('<label />')
            .text($this.attr('placeholder'))
            .addClass(config.cls)
            .css($.extend({
              position:'absolute',
              display: 'inline',
              float:'none',
              overflow:'hidden',
              textAlign: 'left',
              color: config.color,
              cursor: 'text',
              paddingTop: $this.css('padding-top'),
              paddingRight: $this.css('padding-right'),
              paddingBottom: $this.css('padding-bottom'),
              paddingLeft: $this.css('padding-left'),
              fontSize: $this.css('font-size'),
              fontFamily: $this.css('font-family'),
              fontStyle: $this.css('font-style'),
              fontWeight: $this.css('font-weight'),
              textTransform: $this.css('text-transform'),
              backgroundColor: 'transparent',
              zIndex: 99
            }, possible_line_height))
            .css(calcPositionCss(this))
            .attr('for', this.id)
            .data('target',$this)
            .click(function(){
              $(this).data('target').focus();
            })
            .insertBefore(this);
          $this
            .data('placeholder',ol)
            .focus(function(){
              ol.hide();
            }).blur(function() {
              ol[$this.val().length ? 'hide' : 'show']();
            }).triggerHandler('blur');
          $(window).one("resize", function () { adjustToResizing(ol); });
        }
      });
    }
  });
})(jQuery);

jQuery(document).add(window).bind('ready load', function() {
  if (jQuery.placeholder) {
    jQuery.placeholder.shim();
  }
});

