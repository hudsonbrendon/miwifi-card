function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,p=globalThis,f=p.trustedTypes,m=f?f.emptyScript:"",_=p.reactiveElementPolyfillSupport,g=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},w=(t,e)=>!a(t,e),v={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??w)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[g("elementProperties")]=new Map,$[g("finalized")]=new Map,_?.({ReactiveElement:$}),(p.reactiveElementVersions??=[]).push("2.1.2");const b=globalThis,x=t=>t,A=b.trustedTypes,k=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,O=`<${C}>`,P=document,U=()=>P.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,H="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,z=/>/g,L=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,D=/"/g,W=/^(?:script|style|textarea|title)$/i,F=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),B=F(1),I=F(2),q=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),V=new WeakMap,Y=P.createTreeWalker(P,129);function K(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===N?"!--"===l[1]?r=T:void 0!==l[1]?r=z:void 0!==l[2]?(W.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=n??N,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?L:'"'===l[3]?D:j):r===D||r===j?r=L:r===T||r===z?r=N:(r=L,n=void 0);const h=r===L&&t[e+1].startsWith("/>")?" ":"";o+=r===N?i+O:d>=0?(s.push(a),i.slice(0,d)+E+i.slice(d)+S+h):i+S+(-2===d?e:h)}return[K(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,d]=J(t,e);if(this.el=Z.createElement(l,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Y.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=d[o++],i=s.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?st:"@"===r[1]?nt:et}),s.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(W.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),Y.nextNode(),a.push({type:2,index:++n});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===C)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)a.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===q)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=M(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=X(t,n._$AS(t,e.values),n,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);Y.currentNode=s;let n=Y.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new tt(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new ot(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=Y.nextNode(),o++)}return Y.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),M(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new Z(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new tt(this.O(U()),this.O(U()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=X(this,t,e,0),o=!M(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=X(this,s[i+r],e,r),a===q&&(a=this._$AH[r]),o||=!M(a)||a!==this._$AH[r],a===G?t=G:t!==G&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class nt extends et{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??G)===q)return;const i=this._$AH,s=t===G&&i!==G||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=b.litHtmlPolyfillSupport;rt?.(Z,tt),(b.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class lt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new tt(e.insertBefore(U(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const dt=at.litElementPolyfillSupport;dt?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ct={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:w},ht=(t=ct,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ut(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}const pt="miwifi-card",ft="ha_miwifi",mt={download_speed:{domain:"sensor",translation_key:"download_speed",suffix:"download_speed"},upload_speed:{domain:"sensor",translation_key:"upload_speed",suffix:"upload_speed"},connected_devices:{domain:"sensor",translation_key:"client_count",suffix:"connected_devices"},clients_24g:{domain:"sensor",translation_key:"clients_24g",suffix:"2_4_ghz_clients"},clients_5g:{domain:"sensor",translation_key:"clients_5g",suffix:"5_ghz_clients"},mesh_nodes:{domain:"sensor",translation_key:"mesh_node_count",suffix:"mesh_nodes"},wan_ip:{domain:"sensor",translation_key:"wan_ip",suffix:"wan_ip"},wan_type:{domain:"sensor",translation_key:"wan_type",suffix:"wan_type"},wan_uptime:{domain:"sensor",translation_key:"wan_uptime",suffix:"wan_connected_since"},firmware:{domain:"sensor",translation_key:"firmware_version",suffix:"firmware_version"},wan_link:{domain:"binary_sensor",translation_key:"wan_link",suffix:"wan_link"},led:{domain:"binary_sensor",translation_key:"led",suffix:"status_led"},wifi_24g:{domain:"switch",translation_key:"wifi_24g",suffix:"2_4_ghz_wi_fi"},wifi_5g:{domain:"switch",translation_key:"wifi_5g",suffix:"5_ghz_wi_fi"},reboot:{domain:"button",translation_key:"reboot",suffix:"reboot"},speed_test:{domain:"button",translation_key:"speed_test",suffix:"run_speed_test"}},_t=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)})`
  :host {
    --mw-fg: var(--primary-text-color, #2c2c2c);
    --mw-muted: var(--secondary-text-color, #8a8a8e);
    --mw-divider: var(--divider-color, rgba(0, 0, 0, 0.08));
    --mw-hover: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    --mw-online: #2e9e5b;
    --mw-error: #d32f2f;
    display: block;
  }
  :host([dark-mode]) {
    --mw-divider: var(--divider-color, rgba(255, 255, 255, 0.12));
    --mw-hover: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
  }
  ha-card {
    overflow: hidden;
    padding: 14px 14px 4px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--mw-fg);
    font-family: var(--primary-font-family, -apple-system, system-ui, sans-serif);
  }

  /* ── Header: status badges + kebab ───────────────────────────────── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 6px;
    font-size: 0.95rem;
    color: var(--mw-muted);
  }
  .header-left {
    display: flex;
    gap: 18px;
    align-items: center;
  }
  .header-item {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    font-variant-numeric: tabular-nums;
  }
  .header-item ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mw-muted);
  }
  .header-item.led.led-on {
    color: var(--mw-online);
  }
  .header-item.led.led-on ha-icon {
    color: var(--mw-online);
  }
  .menu {
    color: var(--mw-muted);
    cursor: default;
    padding: 0 4px;
    font-size: 1.1rem;
  }

  /* ── Hero: line-art router illustration ──────────────────────────── */
  .hero {
    display: flex;
    justify-content: center;
    margin: 4px 0 2px;
  }
  .hero svg {
    width: 100%;
    max-width: 248px;
    height: auto;
    display: block;
  }
  .hero.offline { opacity: 0.6; filter: grayscale(0.5); }
  .hero.unavailable { opacity: 0.4; }

  /* animated SVG parts are idle by default (clean static drawing) */
  .mw-wave { opacity: 0; }
  .mw-dot { opacity: 0; }

  /* run only when online */
  .hero.online .mw-wave { animation: mw-wave 2.4s ease-out infinite; }
  .hero.online .mw-wave-2 { animation-delay: 0.35s; }
  .hero.online .mw-wave-3 { animation-delay: 0.7s; }
  .hero.online .mw-led { animation: mw-led 1.8s ease-in-out infinite; }
  .hero.online .mw-dot-down { animation: mw-data-down 1.6s linear infinite; }
  .hero.online .mw-dot-down-2 { animation-delay: 0.8s; }
  .hero.online .mw-dot-up { animation: mw-data-up 1.6s linear infinite; }
  .hero.online .mw-dot-up-2 { animation-delay: 0.8s; }
  .hero.online.busy .mw-dot-down,
  .hero.online.busy .mw-dot-up { animation-duration: 0.8s; }

  /* ── Name + status line ──────────────────────────────────────────── */
  .name {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
    margin: 6px 0 2px;
    color: var(--mw-fg);
  }
  .state {
    text-align: center;
    font-size: 0.95rem;
    margin: 0 0 14px;
    min-height: 1.2em;
    color: var(--mw-muted);
  }
  .state.online { color: var(--mw-online); font-weight: 500; }
  .state.error { color: var(--mw-error); font-weight: 500; }

  /* ── Stats grid ──────────────────────────────────────────────────── */
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--mw-divider);
    border-bottom: 1px solid var(--mw-divider);
    padding: 14px 0;
  }
  .stat {
    text-align: center;
    border-right: 1px solid var(--mw-divider);
    padding: 0 4px;
    transition: transform 150ms ease;
  }
  .stat:last-child { border-right: none; }
  .stat:hover { transform: translateY(-1px); }
  .stat-value {
    font-size: 1.25rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--mw-fg);
  }
  .stat-label {
    font-size: 0.78rem;
    color: var(--mw-muted);
    margin-top: 2px;
  }

  /* ── Toolbar ─────────────────────────────────────────────────────── */
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 2px 4px;
  }
  .tool-group { display: flex; gap: 16px; }
  .tool {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mw-muted);
    cursor: pointer;
    border-radius: 8px;
    background: none;
    border: none;
    padding: 0;
    transition: transform 80ms ease, background 120ms ease, color 120ms ease;
  }
  .tool ha-icon { --mdc-icon-size: 20px; }
  .tool.active-radio { color: var(--mw-online); }
  .tool:hover { background: var(--mw-hover); color: var(--mw-fg); }
  .tool:active { transform: scale(0.92); }
  .tool:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); }
  .compact .stats, .compact .toolbar { display: none; }

  @keyframes mw-wave {
    0% { opacity: 0; }
    25% { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes mw-led {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
  @keyframes mw-data-down {
    0% { opacity: 0; transform: translateY(-12px); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translateY(0); }
  }
  @keyframes mw-data-up {
    0% { opacity: 0; transform: translateY(12px); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero.online .mw-wave,
    .hero.online .mw-led,
    .hero.online .mw-dot { animation: none; }
    .hero.online .mw-wave { opacity: 0.6; }
    .hero.online .mw-led { opacity: 1; }
    .stat, .tool { transition: none; }
  }
`,gt=I`
<svg viewBox="0 0 280 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MiWiFi router">
  <!-- six blade antennas in a fan (outline, symmetric about x=140) -->
  <g fill="#ffffff" stroke="#aaaaaa" stroke-width="1.6">
    <rect x="83" y="32" width="10" height="92" rx="5" transform="rotate(-26 88 122)"/>
    <rect x="101" y="32" width="10" height="92" rx="5" transform="rotate(-16 106 122)"/>
    <rect x="119" y="32" width="10" height="92" rx="5" transform="rotate(-8 124 122)"/>
    <rect x="151" y="32" width="10" height="92" rx="5" transform="rotate(8 156 122)"/>
    <rect x="169" y="32" width="10" height="92" rx="5" transform="rotate(16 174 122)"/>
    <rect x="187" y="32" width="10" height="92" rx="5" transform="rotate(26 192 122)"/>
  </g>

  <!-- body shell + subtle inner bezel -->
  <rect x="44" y="120" width="192" height="72" rx="14" ry="14"
        fill="#ffffff" stroke="#aaaaaa" stroke-width="2"/>
  <rect x="50" y="126" width="180" height="60" rx="10" ry="10"
        fill="none" stroke="#ececec" stroke-width="1"/>

  <!-- status indicator (blinks when online) + port lights -->
  <circle class="mw-led" cx="140" cy="136" r="3.6" fill="#6cc070"/>
  <circle cx="156" cy="136" r="2.4" fill="none" stroke="#bbbbbb" stroke-width="1.3"/>
  <circle cx="168" cy="136" r="2.4" fill="none" stroke="#bbbbbb" stroke-width="1.3"/>

  <!-- wordmark -->
  <text x="140" y="155" text-anchor="middle" font-family="sans-serif"
        font-size="11" letter-spacing="2.5" fill="#c2c2c6">MiWiFi</text>

  <!-- ventilation slots -->
  <g stroke="#d2d2d4" stroke-width="2" stroke-linecap="round">
    <line x1="78" y1="166" x2="202" y2="166"/>
    <line x1="78" y1="172" x2="202" y2="172"/>
    <line x1="78" y1="178" x2="202" y2="178"/>
  </g>

  <!-- feet + faint ground shadow -->
  <rect x="62" y="192" width="26" height="5" rx="2.5" fill="none" stroke="#bbbbbb" stroke-width="1.4"/>
  <rect x="192" y="192" width="26" height="5" rx="2.5" fill="none" stroke="#bbbbbb" stroke-width="1.4"/>
  <ellipse cx="140" cy="206" rx="104" ry="6" fill="rgba(0,0,0,0.05)"/>

  <!-- Wi-Fi waves above the antenna fan (emanate upward, centered) -->
  <g fill="none" stroke="#7ab7e0" stroke-width="2.6" stroke-linecap="round">
    <path class="mw-wave mw-wave-1" d="M122 26 a18 18 0 0 1 36 0"/>
    <path class="mw-wave mw-wave-2" d="M110 33 a30 30 0 0 1 60 0"/>
    <path class="mw-wave mw-wave-3" d="M98 40 a42 42 0 0 1 84 0"/>
  </g>

  <!-- data-flow dots (down = inbound, up = outbound) -->
  <g>
    <circle class="mw-dot mw-dot-down mw-dot-down-1" cx="92" cy="150" r="3" fill="#7ab7e0"/>
    <circle class="mw-dot mw-dot-down mw-dot-down-2" cx="106" cy="150" r="3" fill="#7ab7e0"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-1" cx="174" cy="150" r="3" fill="#6cc070"/>
    <circle class="mw-dot mw-dot-up mw-dot-up-2" cx="188" cy="150" r="3" fill="#6cc070"/>
  </g>
</svg>`;function yt(t,e){const i=t.entities??{},s=t.entity,n={};return Object.keys(mt).forEach(t=>{const o=i[t];if(o)return void(n[t]=o);if(!s)return void(n[t]="");const r=mt[t],a=e?function(t,e,i,s){const n=`${i}.${e}_`;for(const e of Object.values(t))if(e&&e.platform===ft&&e.translation_key===s&&"string"==typeof e.entity_id&&e.entity_id.startsWith(n))return e.entity_id}(e,s,r.domain,r.translation_key):void 0;n[t]=a??`${r.domain}.${s}_${r.suffix}`}),n}const wt={en:{state:{online:"Online",offline:"Offline",unavailable:"Unavailable"},stat:{download:"Download",upload:"Upload",devices:"Devices",clients_5g:"5 GHz",clients_24g:"2.4 GHz",mesh:"Mesh nodes"},action:{reboot:"Reboot",reboot_confirm:"Reboot the router now? Connectivity will drop for ~1 minute.",speedtest:"Run speed test",wifi_24g:"2.4 GHz Wi-Fi",wifi_5g:"5 GHz Wi-Fi"},led:{on:"Status LED on",off:"Status LED off"},error:{no_entity:"Missing required entity configuration",invalid_config:"Invalid configuration"},editor:{entity:"Entity prefix (device slug)",name:"Name",image:"Custom image URL",compact:"Compact view",language:"Language"}},"pt-BR":{state:{online:"Online",offline:"Offline",unavailable:"Indisponível"},stat:{download:"Download",upload:"Upload",devices:"Dispositivos",clients_5g:"5 GHz",clients_24g:"2.4 GHz",mesh:"Nós mesh"},action:{reboot:"Reiniciar",reboot_confirm:"Reiniciar o roteador agora? A conexão cai por ~1 minuto.",speedtest:"Teste de velocidade",wifi_24g:"Wi-Fi 2.4 GHz",wifi_5g:"Wi-Fi 5 GHz"},led:{on:"LED de status ligado",off:"LED de status desligado"},error:{no_entity:"Configuração de entidade obrigatória ausente",invalid_config:"Configuração inválida"},editor:{entity:"Prefixo das entidades (slug do dispositivo)",name:"Nome",image:"URL de imagem personalizada",compact:"Modo compacto",language:"Idioma"}}};function vt(t,e){let i=t;for(const t of e){if(!i||"object"!=typeof i||!(t in i))return;i=i[t]}return"string"==typeof i?i:void 0}function $t(t,e="en"){const i=t.split("."),s=wt[e],n=s?vt(s,i):void 0;if(void 0!==n)return n;const o=vt(wt.en,i);return void 0!==o?o:t}const bt=new Set(["","unknown","unavailable","none"]);const xt=new Set(["unavailable","unknown","none",""]);function At(t){if(void 0===t||xt.has(t))return"—";const e=Number(t);return!Number.isFinite(e)||e<0?"—":e<1024?`${Math.round(e)} B/s`:e<1048576?`${(e/1024).toFixed(1)} KB/s`:`${(e/1048576).toFixed(1)} MB/s`}const kt=new Set(["unavailable","unknown","none",""]);function Et(t,e){return e.suffix?`${t}${e.suffix}`:e.unit?`${t} ${e.unit}`:t}console.info("%c MIWIFI-CARD %c v0.4.0 ","color: white; background: #ff5722; font-weight: 700;","color: white; background: #23272e; font-weight: 700;");const St=window;St.customCards=St.customCards||[],St.customCards.push({type:pt,name:"MiWiFi Card",description:"Card for Xiaomi/MiWiFi routers via the ha_miwifi integration",preview:!1,documentationURL:"https://github.com/hudsonbrendon/miwifi-card",getEntitySuggestion:(t,e)=>{const i=t.entities?.[e];if(!i||i.platform!==ft||"wan_link"!==i.translation_key)return null;const s=function(t,e){const i=t[e];if(!i||i.platform!==ft)return;const s=Object.values(t).filter(t=>t.platform===ft&&(!i.device_id||t.device_id===i.device_id)).map(t=>t.entity_id.split(".")[1]??"");let n=s[0]??"";for(const t of s)for(;n&&!t.startsWith(n);)n=n.slice(0,-1);return n.replace(/_+$/,"")||void 0}(t.entities,e);return s?{config:{type:`custom:${pt}`,entity:s}}:null}});let Ct=class extends lt{constructor(){super(...arguments),this._busyThreshold=65536}static{this.styles=_t}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{text:{}}},{name:"name",selector:{text:{}}},{name:"image",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"compact",selector:{boolean:{}}},{name:"language",selector:{select:{options:["en","pt-BR"],mode:"dropdown"}}}]}],computeLabel:t=>$t(`editor.${t.name}`)}}static getStubConfig(){return{type:`custom:${pt}`,entity:"redmi_ax6000"}}setConfig(t){if(!t)throw new Error("invalid_config: config is empty");const e="string"==typeof t.entity&&t.entity.length>0,i=t.entities??{},s=!!i.wan_link&&!!i.download_speed;if(!e&&!s)throw new Error("missing required entity: provide `entity:` prefix or `entities.wan_link` + `entities.download_speed`");if(t.stats&&t.stats.length>4)throw new Error("invalid_config: stats can have at most 4 items");this._config=t}getCardSize(){return 5}getGridOptions(){return this._config?.compact?{columns:6,rows:3,min_columns:4,min_rows:3}:{columns:6,rows:5,min_columns:4,min_rows:4}}willUpdate(t){t.has("hass")&&this.toggleAttribute("dark-mode",Boolean(this.hass?.themes?.darkMode))}_stateOf(t){return t&&this.hass?this.hass.states[t]?.state??"unavailable":"unavailable"}_displayState(t){const e=this.hass?.states[t],i=e?.state??"unavailable";if(!e||["unavailable","unknown"].includes(i))return"—";try{return this.hass?.formatEntityState?.(e)??i}catch{return i}}_resolveLang(){return this._config?.language??this.hass?.locale?.language??"en"}_isOnline(t){return"on"===this._stateOf(t.wan_link)}_isAnyEssentialUnavailable(t){return"unavailable"===this._stateOf(t.wan_link)}_renderHeader(t){const e=At(this._stateOf(t.download_speed)),i=At(this._stateOf(t.upload_speed)),s="on"===this._stateOf(t.led),n=this._displayState(t.connected_devices);return B`
      <div class="header">
        <div class="header-left">
          <div class="header-item down">
            <ha-icon icon="mdi:download"></ha-icon>
            <span>${e}</span>
          </div>
          <div class="header-item up">
            <ha-icon icon="mdi:upload"></ha-icon>
            <span>${i}</span>
          </div>
          <div class="header-item devices">
            <ha-icon icon="mdi:devices"></ha-icon>
            <span>${n}</span>
          </div>
          <div
            class="header-item led ${s?"led-on":""}"
            title=${$t(s?"led.on":"led.off",this._resolveLang())}
          >
            <ha-icon icon="${s?"mdi:led-on":"mdi:led-off"}"></ha-icon>
          </div>
        </div>
        <div class="menu">⋮</div>
      </div>
    `}_isBusy(t){const e=Number(this._stateOf(t.download_speed)),i=Number(this._stateOf(t.upload_speed)),s=Number.isFinite(e)?e:0,n=Number.isFinite(i)?i:0;return s>this._busyThreshold||n>this._busyThreshold}_renderHero(t){const e=this._config.image,i=this._isAnyEssentialUnavailable(t),s=!i&&this._isOnline(t),n=i?"unavailable":s?"online":"offline",o=s&&this._isBusy(t)?"busy":"";return B`
      <div class="hero ${n} ${o}">
        ${e?B`<img src=${e} alt="MiWiFi Router" />`:gt}
      </div>
    `}_renderName(){const t=this._config?.name??"MiWiFi Router";return B`<div class="name">${t}</div>`}_renderStateLine(t,e){const i=function(t){if(t.anyUnavailable)return{text:$t("state.unavailable",t.lang),color:"error"};if("on"===t.wanLink){const e=$t("state.online",t.lang);return bt.has(t.wanType)?{text:`● ${e}`,color:"online"}:{text:`● ${e} · ${t.wanType}`,color:"online"}}return{text:`○ ${$t("state.offline",t.lang)}`,color:"muted"}}({wanLink:this._stateOf(t.wan_link),wanType:this._stateOf(t.wan_type),anyUnavailable:e,lang:this._resolveLang()});return B`<div class="state ${i.color}" aria-live="polite">${i.text}</div>`}_defaultStats(t){return[{entity:t.download_speed,rate:!0,subtitle:"stat.download"},{entity:t.upload_speed,rate:!0,subtitle:"stat.upload"},{entity:t.connected_devices,subtitle:"stat.devices"},{entity:t.clients_5g,subtitle:"stat.clients_5g"}]}_renderStats(t){const e=this._config.stats??this._defaultStats(t),i=this._resolveLang();return B`
      <div class="stats">
        ${e.map(t=>{const e=this._stateOf(t.entity),s=!t.unit&&!t.multiply&&void 0===t.precision&&!t.suffix,n=t.rate?At(e):s?this._displayState(t.entity):function(t,e){if(void 0===t||kt.has(t))return"—";if(void 0!==e.multiply||void 0!==e.precision){const i=Number(t);if(!Number.isFinite(i))return"—";const s=void 0!==e.multiply?i*e.multiply:i;return Et(void 0!==e.precision?s.toFixed(e.precision):String(s),e)}return Et(t,e)}(e,{unit:t.unit,multiply:t.multiply,precision:t.precision,suffix:t.suffix}),o=t.subtitle.startsWith("stat.")?$t(t.subtitle,i):t.subtitle;return B`
            <div class="stat">
              <div class="stat-value">${n}</div>
              <div class="stat-label">${o}</div>
            </div>
          `})}
      </div>
    `}_defaultActions(t){return[{service:"button.press",service_data:{entity_id:t.reboot},icon:"mdi:restart",name_key:"action.reboot",kind:"reboot"},{service:"button.press",service_data:{entity_id:t.speed_test},icon:"mdi:speedometer",name_key:"action.speedtest",kind:"speedtest"}]}_handleAction(t){if(!this.hass)return;if("reboot"===t.kind){if(!window.confirm($t("action.reboot_confirm",this._resolveLang())))return}const[e,i]=t.service.split(".");e&&i&&this.hass.callService(e,i,t.service_data,t.target)}_toggleRadio(t){this.hass&&t&&this.hass.callService("switch","toggle",{entity_id:t})}_kindClass(t){return"reboot"===t.kind?"reboot":"speedtest"===t.kind?"speedtest":""}_renderToolbar(t){const e=this._resolveLang(),i=this._config?.actions??this._defaultActions(t),s="on"===this._stateOf(t.wifi_24g),n="on"===this._stateOf(t.wifi_5g);return B`
      <div class="toolbar">
        <div class="tool-group">
          ${i.map(t=>{const i=t.name_key?$t(t.name_key,e):t.name??t.service;return B`
              <button
                class="tool ${this._kindClass(t)}"
                aria-label=${i}
                title=${i}
                @click=${()=>this._handleAction(t)}
              >
                <ha-icon icon=${t.icon??"mdi:flash"}></ha-icon>
              </button>
            `})}
        </div>
        <div class="tool-group">
          <button
            class="tool wifi24 ${s?"active-radio":""}"
            aria-label=${$t("action.wifi_24g",e)}
            title="${$t("action.wifi_24g",e)}"
            @click=${()=>this._toggleRadio(t.wifi_24g)}
          >
            <ha-icon icon="${s?"mdi:wifi":"mdi:wifi-off"}"></ha-icon>
          </button>
          <button
            class="tool wifi5 ${n?"active-radio":""}"
            aria-label=${$t("action.wifi_5g",e)}
            title="${$t("action.wifi_5g",e)}"
            @click=${()=>this._toggleRadio(t.wifi_5g)}
          >
            <ha-icon icon="${n?"mdi:wifi":"mdi:wifi-off"}"></ha-icon>
          </button>
        </div>
      </div>
    `}render(){if(!this._config||!this.hass)return G;const t=yt(this._config,this.hass.entities),e=this._isAnyEssentialUnavailable(t),i=this._config.compact?"compact":"";return B`
      <ha-card class=${i} role="article" aria-label=${this._config.name??"MiWiFi Router"}>
        ${this._renderHeader(t)}
        ${this._renderHero(t)}
        ${this._renderName()}
        ${this._renderStateLine(t,e)}
        ${this._renderStats(t)}
        ${this._renderToolbar(t)}
      </ha-card>
    `}};t([ut({attribute:!1})],Ct.prototype,"hass",void 0),t([function(t){return ut({...t,state:!0,attribute:!1})}()],Ct.prototype,"_config",void 0),Ct=t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})(pt)],Ct);export{Ct as MiWiFiCard};
//# sourceMappingURL=miwifi-card.js.map
