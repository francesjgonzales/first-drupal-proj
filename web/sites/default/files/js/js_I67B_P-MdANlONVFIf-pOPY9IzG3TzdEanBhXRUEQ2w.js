/* @license GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function($,Drupal,debounce){const cache={right:0,left:0,bottom:0,top:0};const cssVarPrefix='--drupal-displace-offset';const documentStyle=document.documentElement.style;const offsetKeys=Object.keys(cache);const offsetProps={};offsetKeys.forEach((edge)=>{offsetProps[edge]={enumerable:true,get(){return cache[edge];},set(value){if(value!==cache[edge])documentStyle.setProperty(`${cssVarPrefix}-${edge}`,`${value}px`);cache[edge]=value;}};});const offsets=Object.seal(Object.defineProperties({},offsetProps));function getRawOffset(el,edge){const $el=$(el);const documentElement=document.documentElement;let displacement=0;const horizontal=edge==='left'||edge==='right';let placement=$el.offset()[horizontal?'left':'top'];placement-=window[`scroll${horizontal?'X':'Y'}`]||document.documentElement[`scroll${horizontal?'Left':'Top'}`]||0;switch(edge){case 'top':displacement=placement+$el.outerHeight();break;case 'left':displacement=placement+$el.outerWidth();break;case 'bottom':displacement=documentElement.clientHeight-placement;break;case 'right':displacement=documentElement.clientWidth-placement;break;default:displacement=0;}return displacement;}function calculateOffset(edge){let edgeOffset=0;const displacingElements=document.querySelectorAll(`[data-offset-${edge}]`);const n=displacingElements.length;for(let i=0;i<n;i++){const el=displacingElements[i];if(el.style.display==='none')continue;let displacement=parseInt(el.getAttribute(`data-offset-${edge}`),10);if(isNaN(displacement))displacement=getRawOffset(el,edge);edgeOffset=Math.max(edgeOffset,displacement);}return edgeOffset;}function displace(broadcast=true){const newOffsets={};offsetKeys.forEach((edge)=>{newOffsets[edge]=calculateOffset(edge);});offsetKeys.forEach((edge)=>{offsets[edge]=newOffsets[edge];});if(broadcast)$(document).trigger('drupalViewportOffsetChange',offsets);return offsets;}Drupal.behaviors.drupalDisplace={attach(){if(this.displaceProcessed)return;this.displaceProcessed=true;$(window).on('resize.drupalDisplace',debounce(displace,200));}};Drupal.displace=displace;Object.defineProperty(Drupal.displace,'offsets',{value:offsets,writable:false});Drupal.displace.calculateOffset=calculateOffset;})(jQuery,Drupal,Drupal.debounce);;
(function($,Drupal,drupalSettings){let activeItem=Drupal.url(drupalSettings.path.currentPath);$.fn.drupalToolbarMenuHorizontal=function(){let currentPath=drupalSettings.path.currentPath;const menu=once('toolbar-menu-horizontal',this);if(menu.length){const $menu=$(menu);if(activeItem){const count=currentPath.split('/').length;for(let i=0;i<count;i++){const $menuItem=$menu.find(`a[data-drupal-link-system-path="${currentPath}"]`);if($menuItem.length!==0){$menuItem.closest('a').addClass('is-active');break;}const lastIndex=currentPath.lastIndexOf('/');currentPath=currentPath.slice(0,lastIndex);}}}};$.fn.drupalToolbarMenu=function(){const ui={handleOpen:Drupal.t('Extend'),handleClose:Drupal.t('Collapse')};function toggleList($item,switcher){const $toggle=$item.children('.toolbar-box').children('.toolbar-handle');switcher=typeof switcher!=='undefined'?switcher:!$item.hasClass('open');$item.toggleClass('open',switcher);$toggle.toggleClass('open',switcher);$toggle.find('.action').each((index,element)=>{element.textContent=switcher?ui.handleClose:ui.handleOpen;});}function toggleClickHandler(event){const $toggle=$(event.target);const $item=$toggle.closest('li');toggleList($item);const $openItems=$item.siblings().filter('.open');toggleList($openItems,false);}function linkClickHandler(event){if(!Drupal.toolbar.models.toolbarModel.get('isFixed'))Drupal.toolbar.models.toolbarModel.set('activeTab',null);event.stopPropagation();}function initItems($menu){const options={class:'toolbar-icon toolbar-handle',action:ui.handleOpen,text:''};$menu.find('li > a').wrap('<div class="toolbar-box">');$menu.find('li').each((index,element)=>{const $item=$(element);if($item.children('ul.toolbar-menu').length){const $box=$item.children('.toolbar-box');const $link=$box.find('a');options.text=Drupal.t('@label',{'@label':$link.length?$link[0].textContent:''});$item.children('.toolbar-box').append($(Drupal.theme('toolbarMenuItemToggle',options)).hide().fadeIn(150));}});}function markListLevels($lists,level){level=!level?1:level;const $lis=$lists.children('li').addClass(`level-${level}`);$lists=$lis.children('ul');if($lists.length)markListLevels($lists,level+1);}function openActiveItem($menu){let currentPath=drupalSettings.path.currentPath;const pathItem=$menu.find(`a[href="${window.location.pathname}"]`);if(pathItem.length&&!activeItem)activeItem=window.location.pathname;if(activeItem){const $activeItem=$menu.find(`a[href="${activeItem}"]`).addClass('menu-item--active');if(pathItem.length===0&&activeItem){const count=currentPath.split('/').length;for(let i=0;i<count;i++){const $menuItem=$menu.find(`a[data-drupal-link-system-path="${currentPath}"]`);if($menuItem.length!==0){const $activeTrail=$menuItem.parentsUntil('.root','li').addClass('menu-item--active-trail');toggleList($activeTrail,true);break;}const lastIndex=currentPath.lastIndexOf('/');currentPath=currentPath.slice(0,lastIndex);}}else{const $activeTrail=$activeItem.parentsUntil('.root','li').addClass('menu-item--active-trail');toggleList($activeTrail,true);}}}return this.each(function(selector){const menu=once('toolbar-menu-vertical',this);if(menu.length){const $menu=$(menu);$menu.on('click.toolbar','.toolbar-box',toggleClickHandler).on('click.toolbar','.toolbar-box a',linkClickHandler);$menu.addClass('root');initItems($menu);markListLevels($menu);openActiveItem($menu);}});};Drupal.theme.toolbarMenuItemToggle=function(options){return `<button class="${options.class}"><span class="action">${options.action}</span> <span class="label">${options.text}</span></button>`;};})(jQuery,Drupal,drupalSettings);;
(function($,Drupal,drupalSettings){(()=>{if(!sessionStorage.getItem('Drupal.toolbar.toolbarState'))return;const toolbarState=JSON.parse(sessionStorage.getItem('Drupal.toolbar.toolbarState'));const {activeTray,orientation,isOriented}=toolbarState;const activeTrayElement=document.querySelector(`.toolbar-tray[data-toolbar-tray="${activeTray}"]`);const activeTrayToggle=document.querySelector(`.toolbar-item[data-toolbar-tray="${activeTray}"]`);if(activeTrayElement){activeTrayElement.classList.add(`toolbar-tray-${orientation}`,'is-active');activeTrayToggle.classList.add('is-active');}if(isOriented)document.querySelector('#toolbar-administration').classList.add('toolbar-oriented');})();const options=$.extend({breakpoints:{'toolbar.narrow':'','toolbar.standard':'','toolbar.wide':''}},drupalSettings.toolbar,{strings:{horizontal:Drupal.t('Horizontal orientation'),vertical:Drupal.t('Vertical orientation')}});Drupal.behaviors.toolbar={attach(context){if(!window.matchMedia('only screen').matches)return;once('toolbar','#toolbar-administration',context).forEach((toolbar)=>{const model=new Drupal.toolbar.ToolbarModel({locked:JSON.parse(localStorage.getItem('Drupal.toolbar.trayVerticalLocked')),activeTab:document.getElementById(JSON.parse(localStorage.getItem('Drupal.toolbar.activeTabID'))),height:$('#toolbar-administration').outerHeight()});Drupal.toolbar.models.toolbarModel=model;Object.keys(options.breakpoints).forEach((label)=>{const mq=options.breakpoints[label];const mql=window.matchMedia(mq);Drupal.toolbar.mql[label]=mql;mql.addListener(Drupal.toolbar.mediaQueryChangeHandler.bind(null,model,label));Drupal.toolbar.mediaQueryChangeHandler.call(null,model,label,mql);});Drupal.toolbar.views.toolbarVisualView=new Drupal.toolbar.ToolbarVisualView({el:toolbar,model,strings:options.strings});Drupal.toolbar.views.toolbarAuralView=new Drupal.toolbar.ToolbarAuralView({el:toolbar,model,strings:options.strings});Drupal.toolbar.views.bodyVisualView=new Drupal.toolbar.BodyVisualView({el:toolbar,model});model.trigger('change:isFixed',model,model.get('isFixed'));model.trigger('change:activeTray',model,model.get('activeTray'));const menuModel=new Drupal.toolbar.MenuModel();Drupal.toolbar.models.menuModel=menuModel;Drupal.toolbar.views.menuVisualView=new Drupal.toolbar.MenuVisualView({el:$(toolbar).find('.toolbar-menu-administration').get(0),model:menuModel,strings:options.strings});Drupal.toolbar.setSubtrees.done((subtrees)=>{menuModel.set('subtrees',subtrees);const theme=drupalSettings.ajaxPageState.theme;localStorage.setItem(`Drupal.toolbar.subtrees.${theme}`,JSON.stringify(subtrees));model.set('areSubtreesLoaded',true);});Drupal.toolbar.views.toolbarVisualView.loadSubtrees();$(document).on('drupalViewportOffsetChange.toolbar',(event,offsets)=>{model.set('offsets',offsets);});model.on('change:orientation',(model,orientation)=>{$(document).trigger('drupalToolbarOrientationChange',orientation);}).on('change:activeTab',(model,tab)=>{$(document).trigger('drupalToolbarTabChange',tab);}).on('change:activeTray',(model,tray)=>{$(document).trigger('drupalToolbarTrayChange',tray);});const toolbarState=sessionStorage.getItem('Drupal.toolbar.toolbarState')?JSON.parse(sessionStorage.getItem('Drupal.toolbar.toolbarState')):{};if(Drupal.toolbar.models.toolbarModel.get('orientation')==='horizontal'&&Drupal.toolbar.models.toolbarModel.get('activeTab')===null&&!toolbarState.orientation)Drupal.toolbar.models.toolbarModel.set({activeTab:$('.toolbar-bar .toolbar-tab:not(.home-toolbar-tab) a').get(0)});window.addEventListener('dialog:aftercreate',(e)=>{const $element=$(e.target);const {settings}=e;const toolbarBar=document.getElementById('toolbar-bar');if(toolbarBar){toolbarBar.style.marginTop='0';if(settings.drupalOffCanvasPosition==='top'){const height=Drupal.offCanvas.getContainer($element).outerHeight();toolbarBar.style.marginTop=`${height}px`;$element.on('dialogContentResize.off-canvas',()=>{const newHeight=Drupal.offCanvas.getContainer($element).outerHeight();toolbarBar.style.marginTop=`${newHeight}px`;});}}});window.addEventListener('dialog:beforeclose',()=>{const toolbarBar=document.getElementById('toolbar-bar');if(toolbarBar)toolbarBar.style.marginTop='0';});});if(once('toolbarAntiFlicker','#toolbar-administration',context).length)Drupal.toolbar.models.toolbarModel.on('change:activeTab change:orientation change:isOriented change:isTrayToggleVisible change:offsets',function(){const userButton=document.querySelector('#toolbar-item-user');const hasActiveTab=!!$(this.get('activeTab')).length>0;const previousToolbarState=sessionStorage.getItem('Drupal.toolbar.toolbarState')?JSON.parse(sessionStorage.getItem('Drupal.toolbar.toolbarState')):{};const toolbarState={...previousToolbarState,orientation:Drupal.toolbar.models.toolbarModel.get('orientation'),hasActiveTab,activeTabId:hasActiveTab?this.get('activeTab').id:null,activeTray:$(this.get('activeTab')).attr('data-toolbar-tray'),isOriented:this.get('isOriented'),isFixed:this.get('isFixed'),userButtonMinWidth:userButton?userButton.clientWidth:0};sessionStorage.setItem('Drupal.toolbar.toolbarState',JSON.stringify(toolbarState));});}};Drupal.toolbar={views:{},models:{},mql:{},setSubtrees:new $.Deferred(),mediaQueryChangeHandler(model,label,mql){switch(label){case 'toolbar.narrow':model.set({isOriented:mql.matches,isTrayToggleVisible:false});if(!mql.matches||!model.get('orientation'))model.set({orientation:'vertical'},{validate:true});break;case 'toolbar.standard':model.set({isFixed:mql.matches});break;case 'toolbar.wide':model.set({orientation:mql.matches&&!model.get('locked')?'horizontal':'vertical'},{validate:true});model.set({isTrayToggleVisible:mql.matches});break;default:break;}}};Drupal.theme.toolbarOrientationToggle=function(){return ('<div class="toolbar-toggle-orientation"><div class="toolbar-lining">'+'<button class="toolbar-icon" type="button"></button>'+'</div></div>');};Drupal.AjaxCommands.prototype.setToolbarSubtrees=function(ajax,response,status){Drupal.toolbar.setSubtrees.resolve(response.subtrees);};})(jQuery,Drupal,drupalSettings);;
(function(Backbone,Drupal){Drupal.toolbar.MenuModel=Backbone.Model.extend({defaults:{subtrees:null}});})(Backbone,Drupal);;
(function(Backbone,Drupal){Drupal.toolbar.ToolbarModel=Backbone.Model.extend({defaults:{activeTab:null,activeTray:null,isOriented:false,isFixed:false,areSubtreesLoaded:false,isViewportOverflowConstrained:false,orientation:'horizontal',locked:false,isTrayToggleVisible:true,height:null,offsets:{top:0,right:0,bottom:0,left:0}},validate(attributes,options){if(attributes.orientation==='horizontal'&&this.get('locked')&&!options.override)return Drupal.t('The toolbar cannot be set to a horizontal orientation when it is locked.');}});})(Backbone,Drupal);;
(function($,Drupal,Backbone){Drupal.toolbar.BodyVisualView=Backbone.View.extend({initialize(){this.listenTo(this.model,'change:activeTray ',this.render);this.listenTo(this.model,'change:isFixed change:isViewportOverflowConstrained',this.isToolbarFixed);},isToolbarFixed(){const isViewportOverflowConstrained=this.model.get('isViewportOverflowConstrained');$('body').toggleClass('toolbar-fixed',isViewportOverflowConstrained||this.model.get('isFixed'));},render(){$('body').toggleClass('toolbar-tray-open',!!this.model.get('activeTray'));}});})(jQuery,Drupal,Backbone);;
(function($,Backbone,Drupal){Drupal.toolbar.MenuVisualView=Backbone.View.extend({initialize(){this.listenTo(this.model,'change:subtrees',this.render);this.render();},render(){this.renderVertical();this.renderHorizontal();},renderHorizontal(){if('drupalToolbarMenu' in $.fn)this.$el.children('.toolbar-menu').drupalToolbarMenuHorizontal();},renderVertical(){const subtrees=this.model.get('subtrees');if(!this.model.get('subtrees'))return;Object.keys(subtrees||{}).forEach((id)=>{$(once('toolbar-subtrees',this.$el.find(`#toolbar-link-${id}`))).after(subtrees[id]);});if('drupalToolbarMenu' in $.fn)this.$el.children('.toolbar-menu').drupalToolbarMenu();}});})(jQuery,Backbone,Drupal);;
(function(Backbone,Drupal){Drupal.toolbar.ToolbarAuralView=Backbone.View.extend({initialize(options){this.strings=options.strings;this.listenTo(this.model,'change:orientation',this.onOrientationChange);this.listenTo(this.model,'change:activeTray',this.onActiveTrayChange);},onOrientationChange(model,orientation){Drupal.announce(Drupal.t('Tray orientation changed to @orientation.',{'@orientation':orientation}));},onActiveTrayChange(model,tray){const relevantTray=tray===null?model.previous('activeTray'):tray;if(!relevantTray)return;const action=tray===null?Drupal.t('closed'):Drupal.t('opened');const trayNameElement=relevantTray.querySelector('.toolbar-tray-name');let text;if(trayNameElement!==null)text=Drupal.t('Tray "@tray" @action.',{'@tray':trayNameElement.textContent,'@action':action});else text=Drupal.t('Tray @action.',{'@action':action});Drupal.announce(text);}});})(Backbone,Drupal);;
(function($,Drupal,drupalSettings,Backbone){Drupal.toolbar.ToolbarVisualView=Backbone.View.extend({events(){const touchEndToClick=function(event){event.preventDefault();event.target.click();};return {'click .toolbar-bar .toolbar-tab .trigger':'onTabClick','click .toolbar-toggle-orientation button':'onOrientationToggleClick','touchend .toolbar-bar .toolbar-tab .trigger':touchEndToClick,'touchend .toolbar-toggle-orientation button':touchEndToClick};},initialize(options){this.strings=options.strings;this.listenTo(this.model,'change:activeTab change:orientation change:isOriented change:isTrayToggleVisible',this.render);this.listenTo(this.model,'change:mqMatches',this.onMediaQueryChange);this.listenTo(this.model,'change:offsets',this.adjustPlacement);this.listenTo(this.model,'change:activeTab change:orientation change:isOriented',this.updateToolbarHeight);this.$el.find('.toolbar-tray .toolbar-lining').has('.toolbar-menu').append(Drupal.theme('toolbarOrientationToggle'));this.model.trigger('change:activeTab');},updateToolbarHeight(){const toolbarTabOuterHeight=$('#toolbar-bar').find('.toolbar-tab').outerHeight()||0;const toolbarTrayHorizontalOuterHeight=$('.is-active.toolbar-tray-horizontal').outerHeight()||0;this.model.set('height',toolbarTabOuterHeight+toolbarTrayHorizontalOuterHeight);$('body')[0].style.paddingTop=`${this.model.get('height')}px`;$('html')[0].style.scrollPaddingTop=`${this.model.get('height')}px`;this.triggerDisplace();},triggerDisplace(){_.defer(()=>{Drupal.displace(true);});},render(){this.updateTabs();this.updateTrayOrientation();this.updateBarAttributes();$('[data-toolbar-anti-flicker-loading]').remove();$('html').removeClass(['toolbar-loading','toolbar-horizontal','toolbar-vertical','toolbar-tray-open','toolbar-fixed','toolbar-oriented','toolbar-anti-flicker']);$('body').removeClass('toolbar-loading');if(this.model.changed.orientation==='vertical'||this.model.changed.activeTab)this.loadSubtrees();return this;},onTabClick(event){if(event.currentTarget.hasAttribute('data-toolbar-tray')){const activeTab=this.model.get('activeTab');const clickedTab=event.currentTarget;this.model.set('activeTab',!activeTab||clickedTab!==activeTab?clickedTab:null);event.preventDefault();event.stopPropagation();}},onOrientationToggleClick(event){const orientation=this.model.get('orientation');const antiOrientation=orientation==='vertical'?'horizontal':'vertical';const locked=antiOrientation==='vertical';if(locked)localStorage.setItem('Drupal.toolbar.trayVerticalLocked','true');else localStorage.removeItem('Drupal.toolbar.trayVerticalLocked');this.model.set({locked,orientation:antiOrientation},{validate:true,override:true});event.preventDefault();event.stopPropagation();},updateTabs(){const $tab=$(this.model.get('activeTab'));$(this.model.previous('activeTab')).removeClass('is-active').prop('aria-pressed',false);$(this.model.previous('activeTray')).removeClass('is-active');localStorage.removeItem('Drupal.toolbar.activeTabID');if($tab.length>0){$tab.addClass('is-active').prop('aria-pressed',true);const name=$tab.attr('data-toolbar-tray');const id=$tab.get(0).id;if(id)localStorage.setItem('Drupal.toolbar.activeTabID',JSON.stringify(id));const $tray=this.$el.find(`[data-toolbar-tray="${name}"].toolbar-tray`);if($tray.length){$tray.addClass('is-active');this.model.set('activeTray',$tray.get(0));}else this.model.set('activeTray',null);}else{this.model.set('activeTray',null);localStorage.removeItem('Drupal.toolbar.activeTabID');}},updateBarAttributes(){const isOriented=this.model.get('isOriented');if(isOriented)this.$el.find('.toolbar-bar').attr('data-offset-top','');else this.$el.find('.toolbar-bar').removeAttr('data-offset-top');this.$el.toggleClass('toolbar-oriented',isOriented);},updateTrayOrientation(){const orientation=this.model.get('orientation');const antiOrientation=orientation==='vertical'?'horizontal':'vertical';$('body').toggleClass('toolbar-vertical',orientation==='vertical').toggleClass('toolbar-horizontal',orientation==='horizontal');const removeClass=antiOrientation==='horizontal'?'toolbar-tray-horizontal':'toolbar-tray-vertical';const $trays=this.$el.find('.toolbar-tray').removeClass(removeClass).addClass(`toolbar-tray-${orientation}`);const iconClass=`toolbar-icon-toggle-${orientation}`;const iconAntiClass=`toolbar-icon-toggle-${antiOrientation}`;const $orientationToggle=this.$el.find('.toolbar-toggle-orientation').toggle(this.model.get('isTrayToggleVisible'));const $orientationToggleButton=$orientationToggle.find('button');$orientationToggleButton[0].value=antiOrientation;$orientationToggleButton.attr('title',this.strings[antiOrientation]).removeClass(iconClass).addClass(iconAntiClass);$orientationToggleButton[0].textContent=this.strings[antiOrientation];const dir=document.documentElement.dir;const edge=dir==='rtl'?'right':'left';$trays.removeAttr('data-offset-left data-offset-right data-offset-top');$trays.filter('.toolbar-tray-vertical.is-active').attr(`data-offset-${edge}`,'');$trays.filter('.toolbar-tray-horizontal.is-active').attr('data-offset-top','');},adjustPlacement(){const $trays=this.$el.find('.toolbar-tray');if(!this.model.get('isOriented'))$trays.removeClass('toolbar-tray-horizontal').addClass('toolbar-tray-vertical');},loadSubtrees(){const $activeTab=$(this.model.get('activeTab'));const orientation=this.model.get('orientation');if(!this.model.get('areSubtreesLoaded')&&typeof $activeTab.data('drupal-subtrees')!=='undefined'&&orientation==='vertical'){const subtreesHash=drupalSettings.toolbar.subtreesHash;const theme=drupalSettings.ajaxPageState.theme;const endpoint=Drupal.url(`toolbar/subtrees/${subtreesHash}`);const cachedSubtreesHash=localStorage.getItem(`Drupal.toolbar.subtreesHash.${theme}`);const cachedSubtrees=JSON.parse(localStorage.getItem(`Drupal.toolbar.subtrees.${theme}`));const isVertical=this.model.get('orientation')==='vertical';if(isVertical&&subtreesHash===cachedSubtreesHash&&cachedSubtrees)Drupal.toolbar.setSubtrees.resolve(cachedSubtrees);else{if(isVertical){localStorage.removeItem(`Drupal.toolbar.subtreesHash.${theme}`);localStorage.removeItem(`Drupal.toolbar.subtrees.${theme}`);Drupal.ajax({url:endpoint}).execute();localStorage.setItem(`Drupal.toolbar.subtreesHash.${theme}`,subtreesHash);}}}}});})(jQuery,Drupal,drupalSettings,Backbone);;
(function($,Drupal,drupalSettings){const pathInfo=drupalSettings.path;const escapeAdminPath=sessionStorage.getItem('escapeAdminPath');const windowLocation=window.location;if(!pathInfo.currentPathIsAdmin&&!/destination=/.test(windowLocation.search))sessionStorage.setItem('escapeAdminPath',windowLocation);Drupal.behaviors.escapeAdmin={attach(){const toolbarEscape=once('escapeAdmin','[data-toolbar-escape-admin]');if(toolbarEscape.length&&pathInfo.currentPathIsAdmin&&escapeAdminPath!==null)$(toolbarEscape).attr('href',escapeAdminPath);}};})(jQuery,Drupal,drupalSettings);;
