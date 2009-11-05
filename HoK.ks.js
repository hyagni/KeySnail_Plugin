var PLUGIN_INFO =
    <KeySnailPlugin>
    <name>HoK</name>
    <name lang="ja">HoK</name>
    <description>HaH on KeySnail</description>
    <description lang="ja">KeySnailでHaH</description>
    <version>0.0.1</version>
    <updateURL>http://github.com/myuhe/KeySnail_Plugin/raw/master/HoK.ks.js</updateURL>
    <iconURL></iconURL>
    <author mail="yuhei.maeda_at_gmail.com" homepage="http://sheephead.homelinux.org/">myuhe</author>
    <license>The MIT License</license>
    <license lang="ja">MIT ライセンス</license>
    <minVersion>0.9.4</minVersion>
    <include>main</include>
    <provides>
    //    <ext>execute_HaH</ext>
    <ext>HoK</ext>
    </provides>
    <detail><![CDATA[
		       === Usage ===
		       ==== Suggestion ====
		       ==== Command ====
		       === 説明 ===
		       ==== サジェストによるインストール ====
		       HaHをKeysnailプラグインとして移植したものです。
		   
	       ]]></detail>
    </KeySnailPlugin>;



var hah = {
    hintKeys : new String('asdfghjkl'),
    selector: 'a[href], input:not([type="hidden"]), textarea, select, img[onclick], button',
    hintColorLink : 'rgba(255, 255, 0, 0.7)',
    hintColorForm : 'rgba(0, 255, 255, 0.7)',
    hintColorFocused : 'rgba(255, 0, 255, 0.7)',
    keyMap : {'8': 'Bkspc', '46': 'Delete'},

    hintKeysLength : null,
    fragment : null,
    hintContainer : null,
    hintContainerId : 'hintContainer',
    hintSpan : null,
    hintElements : [],
    html : null,
    body : null,
    inWidth : null,
    inHeight : null,
    inputKey : '',
    lastMatchHint : null,

    getAbsolutePosition : function (elem) {
        var style = getComputedStyle(elem, null);
	if (style.visibility === 'hidden' || style.opacity === '0') return false;
	var rect = elem.getClientRects()[0];
	if (rect && rect.right - rect.left && rect.left >= 0 && rect.top >= -5 && rect.bottom <= hah.inHeight + 5 && rect.right <= hah.inWidth) {
	    return {
	        top: (hah.body.scrollTop || hah.html.scrollTop) - hah.html.clientTop + rect.top,
	        left: (hah.body.scrollLeft || hah.html.scrollLeft) - hah.html.clientLeft + rect.left
                
	    };
        }
        return false;
    },

    createText : function (num) {
        var text = '';
        var l = hah.hintKeysLength;
        var iter = 0;
        while (num >= 0) {
            var n = num;
            num -= Math.pow(l, 1 + iter++);
        }
        for (var i = 0; i < iter; i++) {
            var r = n % l;
            n = Math.floor(n / l);
            text = hah.hintKeys.charAt(r) + text;
        }
        return text;
    },
    drawHints : function(){
        var k = 0;
        Array.slice(content.document.querySelectorAll(hah.selector)).forEach(
            function(elem, ind) {
		var pos = hah.getAbsolutePosition(elem);

		if (pos === false) return;
		var hint = hah.createText(k);
		var span = hah.hintSpan.cloneNode(false);
		span.appendChild(content.document.createTextNode(hint));
		var ss = span.style;
		ss.left = Math.max(0, pos.left - 8) + 'px';
		ss.top = Math.max(0, pos.top - 8) + 'px';
		if (elem.hasAttribute('href') === false){
		    ss.backgroundColor = hah.hintColorForm;
		}
		hah.hintElements[hint] = span;
		span.element = elem;
		hah.hintContainer.appendChild(span);
		k++;
            });
        content.document.body.appendChild(hah.fragment);
        document.addEventListener('keypress', this, true);
    },
    removeHints : function(){
	content.document.body.removeChild(hah.hintContainer);
	document.removeEventListener('keypress', this, true);            
	key.suspended = false;
    },
    blurHint : function(){
        if (hah.lastMatchHint){
            hah.lastMatchHint.style.backgroundColor = hah.lastMatchHint.element.hasAttribute('href')===true?
                hah.hintColorLink: hah.hintColorForm;
            hah.lastMatchHint = null;
        }
    },
    handleEvent : function(event){
        var key = event.keyCode || event.charCode;
        if (key in hah.keyMap === false){
            hah.removeHints();
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        var onkey = hah.keyMap[key];
        switch(onkey){
        case 'Bkspc' : 
        case 'Delete' :
            if (!hah.inputKey){
                hah.removeHints();
                return;
            }
            hah.inputKey ='';
            hah.blurHint();
            return;
        default :
            hah.inputKey += onkey;
        };
        hah.blurHint();
        if (hah.inputKey in hah.hintElements === true){
            hah.lastMatchHint = hah.hintElements[hah.inputKey];
            hah.lastMatchHint.style.backgroundColor = hah.hintColorFocused;
            hah.lastMatchHint.element.focus();
        }else{
            hah.lastMatchHint = null;
        }

    },
    init : function(){
        // if (!hah.hintContainer) {;
            hah.fragment = content.document.createDocumentFragment();
            hah.hintContainer = content.document.createElement('div');
            hah.fragment.appendChild(hah.hintContainer);
            hah.hintContainer.id = hah.hintContainerId;
            hah.hintSpan = content.document.createElement('span');
            var st = hah.hintSpan.style;
            st.position = 'absolute';
            st.zIndex = '2147483647';
            st.color = '#000';
            st.backgroundColor = hah.hintColorLink;
            st.fontSize = '10pt';
            st.fontFamily = 'monospace';
            st.lineHeight = '10pt';
            st.padding = '0px';
            st.margin = '0px';
            st.textTransform = 'uppercase';
        // }

        hah.inHeight = window.innerHeight;
        hah.inWidth = window.innerWidth;
        hah.html = content.document.documentElement;
        hah.body = content.document.body;
        hah.hintKeysLength = hah.hintKeys.length;
        
        hah.hintKeys.split('').forEach(function(l) { hah.keyMap[l.charCodeAt(0)] = l; });
    },
};


function lol(){
    key.suspended = true;
    hah.init();
    hah.drawHints();
}


ext.add("lol", lol,
        M({ja: "HoK",
	   en: "execute HaH"}));