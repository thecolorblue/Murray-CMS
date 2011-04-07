$(document).ready(function(){
  $('body').append('<div id="toolbar">toolbar</div>');
  $('#toolbar').css({'position':'fixed','right':'50px'});
  $('#toolbar').append('<ul id="actions"><li id="createpostli"><a href="#" id="createpostlink">create post</a></li></ul>');
  $('#actions').css({'position':'relative','list-style-type':'none'}).append('<li><a href="logout">logout</a></li>');
  var postformstyle = {
    'position':'absolute',
    'right':'100px',
    'background':'#ddd',
    'display':'none',
    'padding':'15px'
  };
  $('#createpostli').append('<div id="createpostform"><form method="post" action="/create/post"><ul></ul></form></div>');
  $('#createpostform').css(postformstyle);
  $('#createpostform form ul').append('<li>title</li>');
  $('#createpostform form ul').append('<li><input type="text" name="title"></input></li>');
  $('#createpostform form ul').append('<li>Body</li>');
  $('#createpostform form ul').append('<li><input type="text" name="body"></input></li>');
  $('#createpostform form ul').append('<li><input type="submit" name="submit"></input></li>');
  $('#createpostlink').click(function(){
    $('#createpostform').show(700);
    console.log('opened');
  });
  
});