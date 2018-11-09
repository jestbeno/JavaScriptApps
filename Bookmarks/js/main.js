document.getElementById('myForm').addEventListener('submit', saveBookmark);

function saveBookmark(e){
  // get form values
  let siteName = document.getElementById('siteName').value;
  let siteUrl = document.getElementById('siteUrl').value;
  // console.log(siteName);

  if (!validForm(siteName,siteUrl)){
    return false;
  }

  var bookmark = {
    name:siteName,
    url: siteUrl
  }
  // local storage test
  // localStorage.setItem('test','hello world');
  // console.log(localStorage.getItem('test'));
  // localStorage.removeItem('test');
  // console.log(localStorage.getItem('test'));
  if (localStorage.getItem('bookmarks')===null){
      var bookmarks=[];
      // add to array
        bookmarks.push(bookmark);
        // set to local storage stringify returns JSON to string
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
  } else {
    // get bookmarks from locals Json.parse - > returns string into JSON
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    // add bookmark to array
    bookmarks.push(bookmark);
    // reset back to local localStorage
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    // add bookmark to array
  }
  document.getElementById('myForm').reset();
  fetchBookmarks();
// prevent form from submitting
  e.preventDefault();
  }

function deleteBookmark(url){
  // get bookmarks from localStorage
   var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  // loop through bookmarks
  for(var i = 0; i < bookmarks.length ;i++){
    if(bookmarks[i].url ==url){
      bookmarks.splice(i,1);
    }
  }
  localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
  // refetch bookmarks
  fetchBookmarks();
}

// fetch bookmarks
function fetchBookmarks(){
  var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  var bookmarksResults = document.getElementById('bookmarksResults');
  bookmarksResults.innerHTML = "";
  for(var i=0; i<bookmarks.length;i++){
    var name = bookmarks[i].name;
    var url = bookmarks[i].url;
    bookmarksResults.innerHTML += '<div class="well">'+
                                  '<h3>'+name+
                                  ' <a class="btn btn-default" target="_blank" href="'+url+'">Pojdi na spletno stran</a> ' +
                                  ' <a onclick="deleteBookmark(\''+url+'\')" class="btn btn-danger" href="#">Izbriši</a> ' +
                                  '</h3>'+
                                  '</div>';
  }
}

function validForm(siteName,siteUrl){
  if(!siteName || !siteUrl){
    alert('please fill in the form');
    return false;
  }

  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if(!siteUrl.match(regex)){
    alert('Please use a valid url!');
    return false;
  }
  return true;
}
