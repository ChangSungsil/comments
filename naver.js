var dict_data = [
    {
        "search": "해라$",
        "replace": "하세요",
        "type": "regexp"
    },
    {
        "search": "한다$",
        "replace": "합니다",
        "type": "regexp"
    },
    {
        "search": "말아라$",
        "replace": "하세요",
        "type": "regexp"
    },
    {
        "search": " 뭐함?",
        "replace": " 뭘 했나요?",
        "type": "normal"
    },
    {
        "search": "인듯",
        "replace": "인듯요",
        "type": "normal"
    },
    {
        "search": "거다",
        "replace": "겁니다",
        "type": "normal",
    }
];

var nc_dictionary = new Comment_Dictionary();
var nc_content = new Comment_Content();
nc_content.addFilter(function( content ){
    content = sanitizeNaverComment( nc_dictionary, content );
    return content;
});

var _text_data = {};

function sanitizeNaverComment( dictionary, content, uid )
{
    var origin_content = content;
    var _content = origin_content;
    var _highlight_content = origin_content;

    for( index in dictionary.corpora ) {
        var entry = dictionary.corpora[index];
        if( entry.type == 'normal' ) {

            _content = _content.replace( entry.search, entry.replace );
            _highlight_content = _highlight_content.replace( entry.search, '<span class="nc-replaced-item"><span class="nc-replaced-text">'+entry.replace+'</span><span class="nc-origin-text">'+entry.search+'</span>' );

            content_data = {
                origin: origin_content,
                replace: _content,
                replace_tip: _highlight_content
            };
        } else if( entry.type == "regexp" ) {
            var regExp = new RegExp( entry.search );

            _content = _content.replace( entry.search, entry.replace );
            _highlight_content = _highlight_content.replace( regExp, '<span class="nc-replaced-item"><span class="nc-replaced-text">'+entry.replace+'</span><span class="nc-origin-text">'+entry.search+'</span>' );

            content_data = {
                origin: origin_content,
                replace: _content,
                replace_tip: _highlight_content
            };
        }
    }

    return content_data;
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};



window.setTimeout(function() {
    //말뭉치 가져오기
    //말뭉치를 가져온 다음에 실행
    getJSON(
        'https://raw.githubusercontent.com/ChangSungsil/dict/master/dictionary.json',
        function(err, data) {
            if( err !== null ) {
                alert( 'Error' );
            } else {
                for ( var i in data ) {
                    nc_dictionary.addCorpus(data[i]);
                }

                if( nc_dictionary.corpora.length == 0 ) {
                    for( var i in dict_data ) {
                        nc_dictionary.addCorpus(dict_data[i]);
                    }
                }

                //var text_wrap = document.getElementsByClassName('u_cbox_text_wrap');
                var contents = document.getElementsByClassName('u_cbox_contents');
                for( var j = 0, k = contents.length; j < k; j++ ) {
                    var _dom = $(contents[j]);
                    _dom.addClass( 'processed' );

                    var list_item = _dom.parents('li.u_cbox_comment');

                    var content = contents[j].innerHTML;

                    var classList = list_item.attr('class').split(/\s+/);
                    var hasUserId = false;
                    var userId = 0;
                    $.each(classList, function(index, item) {
                        var _class = item;
                        if( _class.indexOf( '_user_id_no' ) == 0 ) {
                            hasUserId = true;
                            userId = _class.substr( 12, _class.length );
                        }
                    });

                    content_data = nc_content.getSanitizedContent( content );
                    contents[j].innerHTML = content_data.replace_tip;
                    if( content != contents[j].innerHTML ) {
                        if( hasUserId ) {
                            _text_data[userId] = content_data
                        }

                        var text_wrap = $(_dom).parents('.u_cbox_text_wrap');
                        text_wrap.addClass('changed');
                        console.warn( '[Change] : ' + contents[j].innerHTML );
                    }
                }
            }
        }
    );

    $('a.u_cbox_btn_more').on('click', function(e){
        window.setTimeout(function(e){
            var _contents = $('.u_cbox_contents');
            $.each(_contents, function(){
                var _this = $(this);
                if( _this.hasClass( 'processed' ) )
                    return;
                
                var cont = _this.text();
                var rep = nc_content.getSanitizedContent( cont );
                console.log( cont );
                if( cont != rep ) {
                    var rgxp = new RegExp('뭐함?', 'g');
                    var repl = '<span class="myClass">뭐함?</span>';
                    this.innerHTML = this.innerHTML.replace( rgxp, repl );

                    console.warn( '[Change] : ' + rep );
                }
            });
        }, 2000);
    });
}, 2000);






window.setTimeout(function(e){
    //console.log( 'Test' );

    var blockUserList = localStorage.getItem( 'blockUserList' );
    if( blockUserList == null ) {
        blockUserList = {};
    } else {
        blockUserList = JSON.parse( blockUserList );
    }

    var info = $('.u_cbox_info');
    $.each(info, function(){
        var _this = $(this);
        var u_cbox_comment = _this.parents('.u_cbox_comment');
        u_cbox_comment.addClass('processed');

        var classList = u_cbox_comment.attr('class').split(/\s+/);
        var hasUserId = false;
        var userId = 0;
        $.each(classList, function(index, item) {
            var _class = item;
            if( _class.indexOf( '_user_id_no' ) == 0 ) {
                hasUserId = true;
                userId = _class.substr( 12, _class.length );
            }
        });
    
        if( hasUserId ) {
            if( blockUserList.hasOwnProperty( userId ) ) {
                //u_cbox_comment.hide();
                u_cbox_comment.addClass('blocked-user');
                u_cbox_comment.append('<div class="dark-layer">차단</div>');
            }
        }


        var _ex = $('<span class="naver_comment_exit">차단</span>');
        _this.append(_ex);

        if( _text_data.hasOwnProperty( userId ) ) {
            var _ex2 = $('<span class="naver_comment_report">제보</span>');
            _this.append(_ex2);
        }
    });


    $('a.u_cbox_btn_more').on('click', function(e){
        window.setTimeout(function(e){
            var info = $('.u_cbox_info');

            $.each(info, function(){
                var _this = $(this);
                var u_cbox_comment = _this.parents('.u_cbox_comment');

                if( u_cbox_comment.hasClass('processed') )
                    return;
                    
                u_cbox_comment.addClass('processed');
        
                var classList = u_cbox_comment.attr('class').split(/\s+/);
                var hasUserId = false;
                var userId = 0;
                $.each(classList, function(index, item) {
                    var _class = item;
                    if( _class.indexOf( '_user_id_no' ) == 0 ) {
                        hasUserId = true;
                        userId = _class.substr( 12, _class.length );
                    }
                });
            
                if( hasUserId ) {
                    if( blockUserList.hasOwnProperty( userId ) ) {
                        //u_cbox_comment.hide();
                        u_cbox_comment.addClass('blocked-user');
                        u_cbox_comment.append('<div class="dark-layer">차단</div>');
                    }
                }
        
        
                var _ex = $('<span class="naver_comment_exit">차단</span>');
                _this.append(_ex);

                if( _text_data.hasOwnProperty( userId ) ) {
                    var _ex2 = $('<span class="naver_comment_report">제보</span>');
                    _this.append(_ex2);
                }
            });

        }, 2100);
    });
}, 2500);

$(document).on('click', '.naver_comment_report', function(e){
    //var origin_text = '';
    var _this = $(this);
    var _list = _this.parents('.u_cbox_comment');

    var classList = _list.attr('class').split(/\s+/);
    var hasUserId = false;
    var userId = 0;
    $.each(classList, function(index, item) {
        var _class = item;
        if( _class.indexOf( '_user_id_no' ) == 0 ) {
            hasUserId = true;
            userId = _class.substr( 12, _class.length );
        }
    });

    if( hasUserId ) {
        if( _text_data.hasOwnProperty( userId ) ) {
            /*
            Email.send("from@you.com",
                "siluniv@bloter.net",
                "네이버 댓글 크롬 익스텐션 - Report",
                _text_data[userId].origin + "////" + _text_data[userId].replace,
                {
                    token: "b13c56d5-8851-47c2-9cfe-d4a16f29d2a3",
                    callback: function done (message ) { alert("sent"); }
                }
            );
            */
        }
    }


    
});

$(document).on('click', '.naver_comment_exit', function(e){
    var _this = $(this);
    var u_cbox_comment = _this.parents('.u_cbox_comment');

    var classList = u_cbox_comment.attr('class').split(/\s+/);
    var hasUserId = false;
    var userId = 0;
    $.each(classList, function(index, item) {
        var _class = item;
        if( _class.indexOf( '_user_id_no' ) == 0 ) {
            hasUserId = true;
            userId = _class.substr( 12, _class.length );
        }
    });

    if( !hasUserId )
        return;

    u_cbox_comment.addClass('blocked-user');
    u_cbox_comment.append('<div class="dark-layer">차단</div>');

    var blockUserList = localStorage.getItem( 'blockUserList' );
    if( blockUserList == null ) {
        blockUserList = {};
    } else {
        blockUserList = JSON.parse( blockUserList );
    }

    blockUserList[userId] = {
        "blocked": true
    };
    console.log( blockUserList );

    localStorage.setItem( 'blockUserList', JSON.stringify( blockUserList ) );


});