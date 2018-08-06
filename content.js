//class Comment_Content
function Comment_Content()
{
    this.filters = new Array();
}

Comment_Content.prototype.addFilter = function( callback, priority )
{
    var callback = typeof callback == 'undefined' ? '' : callback;
    var priority = typeof priority == 'undefined' ? 10 : priority;

    //callback 검증
    //반드시 function이어야 함
    //추후 string 형태로 확장
    if( callback == '' || typeof callback != 'function' )
        return;

    //priority
    //일단 입력되는 순서대로 추가
    this.filters.push( callback );
}

Comment_Content.prototype.getSanitizedContent = function( content )
{
    var content = typeof content == 'string' ? content : '';
    var _content = content;
    for( i in this.filters ) {
        _content = this.filters[i]( _content );
    }

    return _content;
}

function Comment_Dictionary()
{
    this.corpora = new Array();
}

Comment_Dictionary.prototype.addCorpus = function( corpus )
{
    this.corpora.push( corpus );
}