let trackers = [];
let error_box;

document.addEventListener("DOMContentLoaded", async (ev) => {
    error_box = document.getElementById("tracker-errors");

    // create a new tracker
    let create_tracker_button = document.getElementById("create-tracker-button");
    document.getElementById("tracker-error").innerHTML  = ``;
    if (create_tracker_button) {
        create_tracker_button.addEventListener("click", async (event) => {
            let selector = document.getElementById("tracker-selector");
            if (selector) {
                let collection_id = selector.value;
                // send post to endpoint
                const response = await fetch(`/tracker/create/${collection_id.toString()}`, {
                    method: "POST"
                });
                if (!response.ok) {
                    let error = await response.json();
                    document.getElementById("tracker-error").innerHTML  = `${error.error}`;
                    return;
                }else {
                    // response was ok
                    window.location.reload();
                }
            }
        });
    }

    trackers = await getAllTrackers();

    let update_tracker_button = document.getElementById("update-tracker-button");
    if (update_tracker_button) {
        update_tracker_button.addEventListener("click", async(event) => {
            submitTrackerValues();
        });
    }
});

async function submitTrackerValues() {
    // read the current page's values, send those to the post for an update!
    let tracker_divs = document.getElementById("tracker-list").getElementsByTagName("div");
    if (tracker_divs.length === 0) {
        error_box.innerHTML = "No trackers to send!";
        return;
    }
    if (tracker_divs.length !== trackers.length) {
        window.location.reload();
    }
    let new_data = [];
    for(let i = 0; i < tracker_divs.length; i++) {
        let temp = {
            collectionId: tracker_divs[i].getAttribute("id"),
            figureList: []
        };
        let figures = tracker_divs[i].getElementsByClassName("tracker-figure-box");
        
        for(let k = 0; k < figures.length; k++) {
            let input = figures[k].getElementsByTagName("input")[0];
            temp.figureList.push(JSON.stringify({_id: figures[k].getAttribute('id'), owned: input.checked}));
        }
        new_data.push(temp);
    }
    let response = await fetch("/tracker/update", {
        method: "POST",
        headers: {
            "Accept" :"application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_data)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    document.getElementById("tracker-status").innerHTML = "Updated collections!";
}

async function getAllTrackers() {
    let trackers = [];
    let response = await fetch("/tracker/get");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    trackers = await response.json();
    return trackers;
}