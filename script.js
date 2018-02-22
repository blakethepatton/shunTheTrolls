var totalRemoved = {};
var commentLength = document.querySelectorAll(".comments li").length;

function getUsers(callback){
  chrome.storage.sync.get('blockedUsers', (users) => {
    callback((chrome.runtime.lastError && users.blockedUsers) ? [] : users.blockedUsers);
  });
}

function hideComments(profileName, total){
  var profile = document.querySelectorAll(".avatar a[href='/profile/"+profileName+"']");
  total[profileName] = profile.length;
  profile.forEach(function (e){
    e.parentElement.parentElement.parentElement.style.display = "none";
  });
}

getUsers((users)=>{
  users.forEach((user)=>{
    console.log(user);
    hideComments(user, totalRemoved);
  });
});
console.log(totalRemoved);

//upon update of the comments section (clicking of load more)
document.querySelector(".comments").addEventListener('DOMSubtreeModified', ()=>{
  if(document.querySelectorAll(".comments li").length != commentLength){

    commentLength = document.querySelectorAll(".comments li").length
    getUsers((users)=>{
      users.forEach((user)=>{
        hideComments(user, totalRemoved);
      });
    });
    //hideComments('nevertrump', totalRemoved);
    console.log(totalRemoved);
  }
});
