if (localStorage.getItem("DONOTSHARE-secretkey") === null) {
    window.location.replace("/login")
    document.body.innerHTML = "Redirecting.."
    throw new Error();
}
if (localStorage.getItem("DONOTSHARE-password") === null) {
    window.location.replace("/login")
    document.body.innerHTML = "Redirecting.."
    throw new Error();
}

if (localStorage.getItem("CACHE-username") !== null) {
    document.getElementById("usernameBox").innerText = localStorage.getItem("CACHE-username")
}

function formatBytes(a, b = 2) { if (!+a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1000)); return `${parseFloat((a / Math.pow(1000, d)).toFixed(c))} ${["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]}` }

function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

let secretkey = localStorage.getItem("DONOTSHARE-secretkey")
let password = localStorage.getItem("DONOTSHARE-password")

let usernameBox = document.getElementById("usernameBox")
let optionsCoverDiv = document.getElementById("optionsCoverDiv")
let optionsDiv = document.getElementById("optionsDiv")
let errorDiv = document.getElementById("errorDiv")
let errorMessageThing = document.getElementById("errorMessageThing")
let closeErrorButton = document.getElementById("closeErrorButton")
let cancelErrorButton = document.getElementById("cancelErrorButton")
let errorInput = document.getElementById("errorInput")
let exitThing = document.getElementById("exitThing")
let exitSessionsThing = document.getElementById("exitSessionsThing")
let exitMfaThing = document.getElementById("exitMfaThing")
let sessionManagerButton = document.getElementById("sessionManagerButton")
let sessionManagerDiv = document.getElementById("sessionManagerDiv")
let sessionDiv = document.getElementById("sessionDiv")
let mfaDiv = document.getElementById("mfaDiv")
let mfaCheckbox = document.getElementById("mfaCheckbox")
let deleteMyAccountButton = document.getElementById("deleteMyAccountButton")
let storageThing = document.getElementById("storageThing")
let storageProgressThing = document.getElementById("storageProgressThing")
let usernameThing = document.getElementById("usernameThing")
let passwordThing = document.getElementById("passwordThing")
let logOutButton = document.getElementById("logOutButton")
let notesBar = document.getElementById("notesBar")
let notesDiv = document.getElementById("notesDiv")
let newNote = document.getElementById("newNote")
let noteBox = document.getElementById("noteBox")
let loadingStuff = document.getElementById("loadingStuff")
let burgerButton = document.getElementById("burgerButton")
let exportNotesButton = document.getElementById("exportNotesButton")

let selectedNote = 0
let timer
let waitTime = 400

if (/Android|iPhone/i.test(navigator.userAgent)) {
    noteBox.style.width = "10px";
    notesBar.style.width = "calc(100% - 10px)"
    noteBox.readOnly = true
    noteBox.style.fontSize = "18px"
    noteBox.classList.add("hidden")

    notesBar.addEventListener("touchstart", function (event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);

    notesBar.addEventListener("touchend", function (event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture();
    }, false);

    noteBox.addEventListener("touchstart", function (event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);

    noteBox.addEventListener("touchend", function (event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture();
    }, false);

    function handleGesture() {
        if (touchendX > touchstartX + 75) {
            notesBar.style.width = "calc(100% - 10px)";
            noteBox.style.width = "10px"
            if (selectedNote != 0) {
                noteBox.readOnly = true
            }
            notesDiv.classList.remove("hidden")
            noteBox.classList.add("hidden")
            newNote.classList.remove("hidden")
        }

        if (touchendX < touchstartX - 75) {
            noteBox.style.width = "calc(100% - 30px)";
            notesBar.style.width = "10px"
            if (selectedNote != 0) {
                noteBox.readOnly = false
            }
            notesDiv.classList.add("hidden")
            noteBox.classList.remove("hidden")
            newNote.classList.add("hidden")
        }
    }
}

noteBox.value = ""
noteBox.readOnly = true

let noteCount = 0

function displayError(message) {
    errorDiv.classList.remove("hidden")
    optionsCoverDiv.classList.remove("hidden")

    errorMessageThing.innerText = message
}

closeErrorButton.addEventListener("click", (event) => {
    errorDiv.classList.add("hidden")
    optionsCoverDiv.classList.add("hidden")
});

function displayPrompt(message, placeholdertext, callback) {
    errorMessageThing.innerText = message
    errorInput.value = ""
    errorInput.placeholder = placeholdertext

    closeErrorButton.addEventListener("click", (event) => {
        if (callback) {
            callback(errorInput.value)
            callback = undefined
        }
    });
    errorInput.addEventListener("keyup", (event) => {
        if (event.key == "Enter") {
            callback(errorInput.value)
            callback = undefined

            errorDiv.classList.add("hidden")
            optionsCoverDiv.classList.add("hidden")
            errorInput.classList.add("hidden")
            cancelErrorButton.classList.add("hidden")
        }
    });
    cancelErrorButton.addEventListener("click", (event) => {
        callback = undefined
        errorDiv.classList.add("hidden")
        optionsCoverDiv.classList.add("hidden")
        errorInput.classList.add("hidden")
        cancelErrorButton.classList.add("hidden")
    });

    errorDiv.classList.remove("hidden")
    optionsCoverDiv.classList.remove("hidden")
    errorInput.classList.remove("hidden")
    cancelErrorButton.classList.remove("hidden")

    errorInput.focus()
}

closeErrorButton.addEventListener("click", (event) => {
    errorDiv.classList.add("hidden")
    optionsCoverDiv.classList.add("hidden")
    errorInput.classList.add("hidden")
    cancelErrorButton.classList.add("hidden")
});

function updateFont() {
    let currentFontSize = localStorage.getItem("SETTING-fontsize")
    noteBox.style.fontSize = currentFontSize + "px"
    textSizeBox.innerText = currentFontSize + "px"
}

if (localStorage.getItem("SETTING-fontsize") === null) {
    localStorage.setItem("SETTING-fontsize", "16")
    updateFont()
} else {
    updateFont()
}

textPlusBox.addEventListener("click", (event) => {
    localStorage.setItem("SETTING-fontsize", String(Number(localStorage.getItem("SETTING-fontsize")) + Number(1)))
    updateFont()
});
textMinusBox.addEventListener("click", (event) => {
    localStorage.setItem("SETTING-fontsize", String(Number(localStorage.getItem("SETTING-fontsize")) - Number(1)))
    updateFont()
});


function updateUserInfo() {
    fetch("/api/userinfo", {
        method: "POST",
        body: JSON.stringify({
            secretKey: secretkey
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response)
        .then((response) => {
            async function doStuff() {
                if (response.status == 500) {
                    displayError("Something went wrong. Signing you out..")
                    closeErrorButton.classList.add("hidden")
                    usernameBox.innerText = ""
                    setTimeout(function () {
                        window.location.replace("/api/logout")
                    }, 2500);
                } else {
                    let responseData = await response.json()
                    usernameBox.innerText = responseData["username"]
                    usernameThing.innerText = "username: " + responseData["username"]
                    passwordThing.innerText = "password: *************"
                    storageThing.innerText = "you've used " + formatBytes(responseData["storageused"]) + " out of " + formatBytes(responseData["storagemax"])
                    storageProgressThing.value = responseData["storageused"]
                    storageProgressThing.max = responseData["storagemax"]
                    noteCount = responseData["notecount"]
                    localStorage.setItem("CACHE-username", responseData["username"])
                }
            }
            doStuff()
        });
}
usernameBox.addEventListener("click", (event) => {
    optionsCoverDiv.classList.remove("hidden")
    optionsDiv.classList.remove("hidden")
    updateUserInfo()
});
logOutButton.addEventListener("click", (event) => {
    window.location.replace("/api/logout")
});
exitThing.addEventListener("click", (event) => {
    optionsDiv.classList.add("hidden")
    optionsCoverDiv.classList.add("hidden")
});
deleteMyAccountButton.addEventListener("click", (event) => {
    if (confirm("are you REALLY sure that you want to delete your account? there's no going back.") == true) {
        fetch("/api/deleteaccount", {
            method: "POST",
            body: JSON.stringify({
                secretKey: secretkey
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response)
            .then((response) => {
                if (response.status == 200) {
                    window.location.href = "/api/logout"
                } else {
                    displayError("failed to delete account (HTTP error code " + response.status + ")")
                }
            })
    }
});
sessionManagerButton.addEventListener("click", (event) => {
    optionsDiv.classList.add("hidden")
    sessionManagerDiv.classList.remove("hidden")

    fetch("/api/sessions/list", {
        method: "POST",
        body: JSON.stringify({
            secretKey: secretkey
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response)
        .then((response) => {
            async function doStuff() {
                let responseData = await response.json()
                document.querySelectorAll(".burgerSession").forEach((el) => el.remove());
                for (let i in responseData) {
                    let sessionElement = document.createElement("div")
                    let sessionText = document.createElement("p")
                    let sessionImage = document.createElement("img")
                    let sessionRemoveButton = document.createElement("button")
                    sessionText.classList.add("w300")
                    if (responseData[i]["thisSession"] == true) {
                        sessionText.innerText = "(current) " + truncateString(responseData[i]["device"], 18)
                    } else {
                        sessionText.innerText = truncateString(responseData[i]["device"], 27)
                    }
                    sessionText.title = responseData[i]["device"]
                    sessionRemoveButton.innerText = "X"

                    sessionImage.src = "/static/svg/device_other.svg"

                    ua = responseData[i]["device"]

                    if (ua.includes("NT") || ua.includes("Linux")) {
                        sessionImage.src = "/static/svg/device_computer.svg"
                    }
                    if (ua.includes("iPhone" || ua.includes("Android"))) {
                        sessionImage.src = "/static/svg/device_smartphone.svg"
                    }

                    sessionRemoveButton.addEventListener("click", (event) => {
                        fetch("/api/sessions/remove", {
                            method: "POST",
                            body: JSON.stringify({
                                secretKey: secretkey,
                                sessionId: responseData[i]["id"]
                            }),
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"
                            }
                        })
                            .then((response) => response)
                            .then((response) => {
                                if (responseData[i]["thisSession"] == true) {
                                    window.location.replace("/api/logout")
                                }
                            });
                        sessionElement.remove()
                    });

                    sessionElement.append(sessionImage)
                    sessionElement.append(sessionText)
                    sessionElement.append(sessionRemoveButton)

                    sessionElement.classList.add("burgerSession")

                    sessionDiv.append(sessionElement)
                }
            }
            doStuff()
        });
});
exitSessionsThing.addEventListener("click", (event) => {
    optionsDiv.classList.remove("hidden")
    sessionManagerDiv.classList.add("hidden")
});
mfaCheckbox.addEventListener("change", (event) => {
    if (mfaCheckbox.checked === true) {
        mfaCheckbox.checked = false
        optionsDiv.classList.add("hidden")
        mfaDiv.classList.remove("hidden")
    }
})
exitMfaThing.addEventListener("click", (event) => {
    optionsDiv.classList.remove("hidden")
    mfaDiv.classList.add("hidden")
});

updateUserInfo()

function updateWordCount() {
    let wordCount = noteBox.value.split(" ").length
    if (wordCount == 1) {
        wordCount = 0
    }
    wordCountBox.innerText = wordCount + " words"
}

function selectNote(nameithink) {
    document.querySelectorAll(".noteButton").forEach((el) => el.classList.remove("selected"));
    let thingArray = Array.from(document.querySelectorAll(".noteButton")).find(el => el.id == nameithink);
    thingArray.classList.add("selected")

    fetch("/api/readnote", {
        method: "POST",
        body: JSON.stringify({
            secretKey: secretkey,
            noteId: nameithink,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .catch((error) => {
            noteBox.readOnly = true
            noteBox.value = ""
            noteBox.placeholder = ""
            displayError("something went wrong, please try again later")
        })
        .then((response) => response)
        .then((response) => {
            selectedNote = nameithink
            noteBox.readOnly = false
            noteBox.placeholder = "type something.."

            async function doStuff() {
                let responseData = await response.json()

                let bytes = CryptoJS.AES.decrypt(responseData["content"], password);
                let originalText = bytes.toString(CryptoJS.enc.Utf8);

                noteBox.value = originalText
                updateWordCount()

                noteBox.addEventListener("input", (event) => {
                    updateWordCount()
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        let encryptedText = CryptoJS.AES.encrypt(noteBox.value, password).toString();

                        if (selectedNote == nameithink) {
                            fetch("/api/editnote", {
                                method: "POST",
                                body: JSON.stringify({
                                    secretKey: secretkey,
                                    noteId: nameithink,
                                    content: encryptedText,
                                }),
                                headers: {
                                    "Content-type": "application/json; charset=UTF-8"
                                }
                            })
                                .then((response) => response)
                                .then((response) => {
                                    if (response.status == 418) {
                                        displayError("you've ran out of storage :3 changes will not be saved until you free up storage!!! owo")
                                    }
                                })
                                .catch((error) => {
                                    displayError("failed to save changes, please try again later")
                                })
                        }
                    }, waitTime);
                });
            }
            doStuff()
        });
}

function updateNotes() {
    fetch("/api/listnotes", {
        method: "POST",
        body: JSON.stringify({
            secretKey: secretkey
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response)
        .then((response) => {
            async function doStuff() {
                document.querySelectorAll(".noteButton").forEach((el) => el.remove());
                noteBox.readOnly = true
                selectedNote = 0
                noteBox.placeholder = ""
                noteBox.value = ""
                clearTimeout(timer)
                updateWordCount()

                let responseData = await response.json()
                for (let i in responseData) {
                    let noteButton = document.createElement("button");
                    noteButton.classList.add("noteButton")
                    notesDiv.append(noteButton)

                    let bytes = CryptoJS.AES.decrypt(responseData[i]["title"], password);
                    let originalTitle = bytes.toString(CryptoJS.enc.Utf8);

                    noteButton.id = responseData[i]["id"]
                    noteButton.innerText = originalTitle

                    noteButton.addEventListener("click", (event) => {
                        if (event.ctrlKey) {
                            fetch("/api/removenote", {
                                method: "POST",
                                body: JSON.stringify({
                                    secretKey: secretkey,
                                    noteId: responseData[i]["id"]
                                }),
                                headers: {
                                    "Content-type": "application/json; charset=UTF-8"
                                }
                            })
                                .then((response) => response)
                                .then((response) => {
                                    updateNotes()
                                })
                                .catch((error) => {
                                    displayError("something went wrong! please try again later")
                                })
                        } else {
                            selectNote(responseData[i]["id"])
                        }
                    });
                }
                document.querySelectorAll(".loadingStuff").forEach((el) => el.remove());
            }
            doStuff()
        });
}

updateNotes()

newNote.addEventListener("click", (event) => {
    let noteName = displayPrompt("note name? :3", "e.g. shopping list", burgerFunction)
    function burgerFunction(noteName) {
        if (noteName != null) {
            let encryptedName = CryptoJS.AES.encrypt(noteName, password).toString();
            fetch("/api/newnote", {
                method: "POST",
                body: JSON.stringify({
                    secretKey: secretkey,
                    noteName: encryptedName,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .catch((error) => {
                    displayError("failed to create new note, please try again later")
                })
                .then((response) => {
                    if (response.status !== 200) {
                        updateNotes()
                        displayError("failed to create new note (HTTP error code " + response.status + ")")
                    } else {
                        updateNotes()
                    }
                });
        }
    }
});
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function exportNotes() {
    let noteExport = []
    fetch("/api/exportnotes", {
        method: "POST",
        body: JSON.stringify({
            secretKey: secretkey
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response)
        .then((response) => {
            async function doStuff() {
                let responseData = await response.json()
                for (let i in responseData) {
                    exportNotes.innerText = "decrypting " + i + "/" + noteCount

                    let bytes = CryptoJS.AES.decrypt(responseData[i]["title"], password);
                    let originalTitle = bytes.toString(CryptoJS.enc.Utf8);

                    responseData[i]["title"] = originalTitle

                    let bytesd = CryptoJS.AES.decrypt(responseData[i]["content"], password);
                    let originalContent = bytesd.toString(CryptoJS.enc.Utf8);

                    responseData[i]["content"] = originalContent
                }
                let jsonString = JSON.parse(JSON.stringify(responseData))

                exportNotesButton.innerText = "export notes"
                downloadObjectAsJson(jsonString, "data")
                optionsDiv.classList.add("hidden")
                displayError("exported notes!")

            }
            doStuff()
        })
}

exportNotesButton.addEventListener("click", (event) => {
    exportNotesButton.innerText = "downloading.."
    exportNotes()
});

removeBox.addEventListener("click", (event) => {
    if (selectedNote == 0) {
        displayError("you need to select a note first!")
    } else {
        fetch("/api/removenote", {
            method: "POST",
            body: JSON.stringify({
                secretKey: secretkey,
                noteId: selectedNote
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response)
            .then((response) => {
                updateNotes()
            })
            .catch((error) => {
                displayError("something went wrong! please try again later")
            })
    }
});