var nc_dictionary = new Comment_Dictionary();
var nc_content = new Comment_Content();
nc_content.addFilter(function( content ){
    content = sanitizeNaverComment( nc_dictionary, content );
    return content;
});

function sanitizeNaverComment( dictionary, content )
{
    for( index in dictionary.corpora ) {
        var entry = dictionary.corpora[index];
        if( entry.type == 'normal' ) {
            content = content.replace( entry.search, entry.replace );
        } else if( entry.type == "regexp" ) {
            var regExp = new RegExp( entry.search );
            content = content.replace( regExp, entry.replace );
        }
    }

    return content;
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

    chrome.storage.local.get(['copt'], function(result) {
        console.log( result );
        //console.log('Value currently is ' + result.key);
    });

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

                var contents = document.getElementsByClassName('u_cbox_contents');
                for( var j = 0, k = contents.length; j < k; j++ ) {
                    var content = contents[j].innerHTML;

                    //console.log( content );
                    contents[j].innerHTML = nc_content.getSanitizedContent( content );
                    if( content != contents[j].innerHTML ) {
                        //console.warn( '[Change] : ' + contents[j].innerHTML );
                    }
                }
            }
        }
    );
}, 2000);