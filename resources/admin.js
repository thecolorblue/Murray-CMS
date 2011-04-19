$(document).ready(function(){
  $('#toolbar').css({'position':'fixed','right':'50px','width':'250px','top':'10px'});
  $('#createpostli').append('<a href="#" id="createpostlink">create post</a>');
  $('#actions').css({'position':'relative','list-style-type':'none'}).append('<li><a href="logout">logout</a></li>');
  var postformstyle = {
    'position':'absolute',
    'right':'230px',
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