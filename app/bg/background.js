(function(chrome) {

var data = {
  htmlPage: "./app/index.html",
  width: 800,
  height: 500,
  address: localStorage.getItem('bm-address') === "undefined" ? 'office' : localStorage.getItem('bm-address'),
  user: localStorage.getItem('bm-user') === "undefined" ? 'Default' : localStorage.getItem('bm-user'),
  iconUrl: "../../icon.png"
}

data.firebaseUrl = 'https://bm-share.firebaseio.com/bm-share/' + data.address;

function createWindow() {
  chrome.windows.create({
      url: data.htmlPage,
      type: "panel",
      width: data.width,
      height: data.height
  });
};

chrome.browserAction.onClicked.addListener(function(tabs) {
  createWindow();
});

function add(info,tab) {
  var firebaseRef = new Firebase(data.firebaseUrl);
  firebaseRef.push({name: tab.title, url: tab.url, addedBy: data.user});
  firebaseRef.limitToLast(1).on('value', function(snapshot) {
    new_note(snapshot);
  })
}

chrome.contextMenus.create({
  title: "Share this Page", 
  contexts:["all"],
  onclick: add
});

function new_note(snapshot) {
  var 
    msg = null,
    addedBy = null,
    url = null;

  for (var key in snapshot.val()) {
    msg = snapshot.val()[key].name;
    url = snapshot.val()[key].url;
    addedBy = snapshot.val()[key].addedBy || "";
  }

  console.log(snapshot.val());
  console.log(typeof snapshot.val());

  var id = {
    type: "basic",
    title: "New Bookmark Added",
    message: msg + " - " + addedBy,
    iconUrl: data.iconUrl,
    isClickable: true
  }

  chrome.notifications.create('bm-share-notification', id);

  chrome.notifications.onClicked.addListener(function(callback) {
    chrome.tabs.create({
      url: url,
      active: true
    });
  });

  chrome.notifications.clear('bm-share-notification');
};

})(chrome);