document.addEventListener("DOMContentLoaded", async (ev) => {

    // get your trackers
    let create_tracker_button = document.getElementById("create-tracker-button");
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
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            window.location.reload();
        });
    }

    let update_tracker_button = document.getElementById("update-tracker-button");
    if (update_tracker_button) {
        update_tracker_button.addEventListener("click", async(event) => {
            // get ALL the figures somehow
            // then make the request
            let trackers_list = document.getElementById("tracker-list").getElementsByTagName("div");
            console.log(trackers_list);
            for(let i = 0; i < trackers_list.length; i++){
                let labels = trackers_list[i].getElementsByTagName("label");
                for(let j = 0; j < labels.length; j++) {
                    let checkmark = labels[j].getElementsByClassName('checkmark')[0];
                    console.log(labels[j].id, checkmark.backgroundColor);  
                }
            }
        });
    }
});