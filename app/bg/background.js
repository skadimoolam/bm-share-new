(function(chrome, Firebase) {

var data = {
  popupId: undefined,
  htmlPage: "./app/index.html",
  width: 800,
  height: 500,
  address: localStorage.getItem('bm-address') === "undefined" ? 'office' : localStorage.getItem('bm-address'),
  user: localStorage.getItem('bm-user') === "undefined" ? 'Default' : localStorage.getItem('bm-user'),
  iconUrl: "../../icon.png"
}

data.firebaseUrl = 'https://bm-share.firebaseio.com/bm-share/' + data.address;

chrome.browserAction.onClicked.addListener(function(tabs) {
  if (typeof data.popupId === "undefined") {
    chrome.windows.create({
      url: data.htmlPage,
      type: "panel",
      width: data.width,
      height: data.height
    }, function(popupWindow) { data.popupId = popupWindow.id; });
  } else {
    chrome.windows.update(data.popupId, {"focused": true});
  }
});


var firebaseRef = new Firebase(data.firebaseUrl);
firebaseRef.limitToLast(1).on('child_added', function(snapshot) {
  new_note(snapshot);
})


function add(info,tab) {
  firebaseRef.push({name: tab.title, url: tab.url, addedBy: data.user});
}

chrome.contextMenus.create({
  title: "Share this Page", 
  contexts:["all"],
  onclick: add
});

function new_note(snapshot) {
  var 
    msg = snapshot.val().name,
    addedBy = snapshot.val().addedBy || "",
    url = snapshot.val().url || "";

  var id = {
    type: "basic",
    title: "New Bookmark Added",
    message: msg + " - " + addedBy,
    iconUrl: data.iconUrl,
    isClickable: true
  }

  chrome.notifications.create('bm-share-notification', id);

  if (url != "") {
    chrome.notifications.onClicked.addListener(function(callback) {
      chrome.tabs.create({
        url: url,
        active: true
      });
    });
  }

  chrome.notifications.clear('bm-share-notification');
};

})(chrome, Firebase);