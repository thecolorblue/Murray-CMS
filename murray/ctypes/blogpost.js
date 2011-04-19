exports.Form = ' \
<form method="post" action="/create/post"><fieldset> \
  <p> \
    <label for="title">title:</label> \
    <input type="text" name="title"/> \
  </p> \
  <p> \
    <label for="title">body:</label> \
    <textarea cols=20 rows=4 name="body">Enter the body of your post here.</textarea> \
  </p> \
  <fieldset> \
    <p> \
      <input type="submit" name="submit" value="blogpost"/> \
    </p> \
  </fieldset> \
</form>';
exports.View = '<div style="position:relative;" class="post"> \
  <h3 class="title"><: title :></h3> \
  <h4 class="author"><: author :></h4> \
  <p class="body"><: body :></p> \
  <p class="date"><: date :></p> \
  <p class="pid"><: pid :></p> \
</div>';
exports.Meta = {
  title:'blogpost',
  engineer:'Brad Davis'
};