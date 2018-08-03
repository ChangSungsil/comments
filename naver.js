var j_list = [
    /*
    {
        "search": "해라",
        "replace": "하세요",
        "type": "normal"
    },
    */
    {
        "search": "해라$",
        "replace": "하세요",
        "type": "regexp"
    },
    {
        "search": "가$",
        "replace": "요",
        "type": "regexp"
    }
];


window.setTimeout(function() {
    var contents = document.getElementsByClassName('u_cbox_contents');
    for( var j = 0, k = contents.length; j < k; j++ ) {
        sanitizeNaverComment( j_list, contents[j] );
    }
}, 2000);





function sanitizeNaverComment( list, dom )
{
    var origin = dom.innerHTML;

    for( index in list ) {
        var entry = list[index];
        if( entry.type == 'normal' ) {
            var replace = replaceComment( entry.search, entry.replace, origin );
            dom.innerHTML = replace;
        } else if( entry.type == "regexp" ) {
            var regExp = new RegExp( entry.search );
            var res = regExp.exec( origin );
            var replace = origin.replace( regExp, entry.replace );
            dom.innerHTML = replace;
        }
    }
}

/*
function replaceNaverComment( dom )
{
    var origin = dom.innerHTML;

    if( origin.indexOf( '해라', 0 ) != -1 ) {
        var replace = replaceComment( '해라', '하세요', origin );
        dom.innerHTML = replace;
    } else {
        dom.innerHTML = 'Test';
    }
}
*/

function replaceComment( search, replace, text )
{
    var _text = text.replace( search, replace );
    return _text;
}