document.addEventListener('DOMContentLoaded', () => {

  refreshUserList();

  document.getElementById('block').addEventListener('click', ()=> {
    usernameBox = document.getElementById('profile');
    if(usernameBox.value=='block' || usernameBox.value=='profile' || usernameBox.value=='blockedUsers'){
      return alert('Sorry, my js is just proof of concept so you can\'t block this username');
    }
    if(usernameBox.value.length == 0){
      return alert('You gotta put in a username.');
    }
    username = escape(usernameBox.value);
    blockUsername(username);
    usernameBox.value = '';
  });
  document.getElementById("blockedUsers").addEventListener('DOMSubtreeModified', ()=>{
    document.querySelectorAll('li a').forEach((e)=>{
      e.addEventListener('click', (e)=> {
        unblockUsername(e.id);
      });
    });
  });
});
function refreshTabs(){
    chrome.tabs.query({url: "https://www.kickstarter.com/projects/*"}, function(tabs) {
      tabs.forEach((tab)=>{
        chrome.tabs.update(tab.id, {url: tab.url});
      });
    });
}

function getUsers(callback){
  chrome.storage.sync.get('blockedUsers', (users) => {
    callback((chrome.runtime.lastError && users.blockedUsers) ? [] : users.blockedUsers);
  });
}
function setUsers(blockedUsers){
  items = {};
  items.blockedUsers = blockedUsers;
  chrome.storage.sync.set(items);
  refreshUserList();
  refreshTabs();
  return true;
}

function refreshUserList(){
  getUsers((users)=>{
    banList = document.getElementById('blockedUsers');
    banList.innerHTML = '';
    users.forEach((e)=>{
      li = "<li><p>"+e+"</p><a id='"+e+"'>X</a></li>";
      banList.innerHTML += li;
    });
  });
}

function clearAll(){
  return setUsers([]);
}

function blockUsername(username){
  getUsers((users)=>{
    if(users.indexOf(username)!==-1){
      alert('Username is already blocked. ');
    } else {
      //save
      users.push(username);
      setUsers(users);
    }
  });
}
function unblockUsername(username){
  getUsers((users)=>{
    if(users.indexOf(username)!==-1){
      alert('Username is already unblocked. ');
    } else {
      //save
      users.splice(users.indexOf(username), 1);
      setUsers(users);
    }
  });
}