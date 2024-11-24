var websiteNameInput = document.getElementById("websiteNameInput");
var websiteURLInput = document.getElementById("websiteURLInput");
var websiteNotesInput = document.getElementById("websiteNotesInput");
var bookmarkList = document.getElementById("bookmarkList");
var addBookmarkBtn = document.getElementById("addBookmarkBtn");
var unpinAllBtn = document.getElementById("unpinAllBtn");
var deleteAllBtn = document.getElementById("deleteAllBtn");
var bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

displayBookmarks();

function isValidURL(url) {
    var pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(:\d+)?(\/\S*)?$/i;
    return pattern.test(url);
}

function formatURL(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `http://${url}`;
    }
    return url;
}

function isValidName(name) {
    return name.length >= 3;
}

function addBookmark() {
    var name = websiteNameInput.value.trim();
    var url = websiteURLInput.value.trim();
    var notes = websiteNotesInput.value.trim();

    if (!name || !url) {
        alert("Both website name and URL are required!");
        return;
    }

    if (!isValidName(name)) {
        alert("Website name must be at least 3 characters long!");
        return;
    }

    if (!isValidURL(url)) {
        alert("Please enter a valid URL!");
        return;
    }

    url = formatURL(url);

    var bookmark = {
        name: name,
        url: url,
        notes: notes,
        pinned: false,
        addedAt: new Date().toLocaleString(),
    };
    bookmarks.push(bookmark);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();

    websiteNameInput.value = "";
    websiteURLInput.value = "";
    websiteNotesInput.value = "";
}

function displayBookmarks() {
    bookmarkList.innerHTML = "";
    bookmarks.forEach(function (bookmark, index) {
        var card = document.createElement("div");
        card.className = "card bookmark-card shadow-sm";
        card.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">${bookmark.name}</h5>
                    <p class="card-text">${bookmark.url}</p>
                    <p class="text-muted">Added on: ${bookmark.addedAt}</p>
                    ${bookmark.notes ? `<p class="text-muted">Notes: ${bookmark.notes}</p>` : ''}
                </div>
                <div>
                    <a href="${bookmark.url}" target="_blank" class="btn btn-success me-2">Visit</a>
                    <button class="btn btn-warning me-2" id="pinBtn${index}" onclick="togglePin(${index})">${bookmark.pinned ? "Unpin" : "Pin"}</button>
                    <button class="btn btn-danger" id="deleteBtn${index}" onclick="deleteBookmark(${index})">Delete</button>
                </div>
            </div>
        `;
        bookmarkList.appendChild(card);
    });
}

function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
}

function togglePin(index) {
    var bookmark = bookmarks[index];
    if (bookmark.pinned) {
        unpinBookmark(index);
    } else {
        pinBookmark(index);
    }
}

function pinBookmark(index) {
    var pinnedBookmark = bookmarks[index];
    pinnedBookmark.pinned = true;
    bookmarks.splice(index, 1);
    bookmarks.unshift(pinnedBookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
}

function unpinBookmark(index) {
    var unpinnedBookmark = bookmarks[index];
    unpinnedBookmark.pinned = false;

    var originalIndex = bookmarks.findIndex(function (b) {
        return b.name === unpinnedBookmark.name && b.url === unpinnedBookmark.url && b.pinned === true;
    });

    bookmarks.splice(index, 1);

    if (originalIndex !== -1) {
        bookmarks.splice(originalIndex, 0, unpinnedBookmark);
    } else {
        bookmarks.push(unpinnedBookmark);
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
}

function unpinAll() {
    bookmarks.forEach(function (bookmark) {
        if (bookmark.pinned) {
            bookmark.pinned = false;
        }
    });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
}

function deleteAllBookmarks() {
    bookmarks = [];
    localStorage.removeItem("bookmarks");
    displayBookmarks();
}

document.addEventListener("DOMContentLoaded", function () {
    unpinAllBtn.onclick = unpinAll;
    deleteAllBtn.onclick = deleteAllBookmarks;
    addBookmarkBtn.onclick = addBookmark;
});

// ----------------------------------------------------------------------------------------------------------------------