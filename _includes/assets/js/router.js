/*
Client-side routing, without visible reload. For the smooth experience(tm).

This script is loaded only on the first visit 
 (if user doesn't refresh page manually).
*/

const main = document.querySelector("body > main");

// Replace current page in history, so we can navigate back here
window.history.replaceState({ "title": document.title, "innerHTML": main.innerHTML }, "", location);

// Get links in header and loop over them, 
//  adding a click event listener to each of them
const navLinks = document.querySelectorAll("header > nav a");
for (let link of navLinks) {
    link.addEventListener("click", function (e) {
        e.preventDefault(); // Override link click default behavior
        // setNavBackground(link.parentElement.id);
        getPageAndUpdate(link.href);
    });
    fetch(link.href); // fetch each link to save in cache
}

setNavBackground();

// If we've gotten directly to some blog post, or tag archive,
//  still highlight the Blog nav-item
function isBlogRelatedPage() {
    if (location.pathname.substring(0, 7) === "/posts/" ||
        location.pathname.substring(0, 6) === "/tags/") {
        return true
    }

    return false
}

// Get links in main and loop over them,
//  adding a click event listener to each of them
// First at page load, then at every page change
getMainLinks();
function getMainLinks() {
    const mainLinks = main.querySelectorAll("a");
    for (let link of mainLinks) {
        // Don't touch external links
        if (link.host != location.host) {
            continue;
        }

        link.addEventListener("click", function (e) {
            e.preventDefault(); // Override link click default behavior
            getPageAndUpdate(link.href);
            // setNavBackground();
        });
        fetch(link.href); // fetch to save in cache. if link is already fetched, content will be returned from cache
    }
}


// "Navigate" to given url by changing page's <main>
function getPageAndUpdate(url) {
    // If clicking on current page, do nothing
    if (url == location) {
        console.log("Already here.");
        return
    }

    // Could do a check here if already visited page (localStorage)
    //  and skip the fetching part.
    //  But if link has already been fetched before, then
    //  the content will be returned from cache anyways
    //  and we need to do the other stuff. KISS.

    fetch(url)
        .then(function (response) {
            // The API call was successful!
            if (response.status != 200) {
                throw new Error("Page not found: " + url)
            }
            return response.text();
        })
        .then(function (htmlAsString) {
            console.log("Got html for " + url)

            // Convert the HTML string into a document object
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlAsString, 'text/html');

            // Get & set the new main
            const newMain = doc.querySelector('main').innerHTML;
            main.innerHTML = newMain;

            // Get & set the new page title
            const newTitle = doc.querySelector('title').innerText;
            document.title = newTitle;
            // TODO? Should we modify meta description? It shouldn't matter, because
            //  if the link is shared, it will be the "right" HTML head

            // Add page to history and modify page URL
            window.history.pushState({ "title": newTitle, "innerHTML": newMain }, "", url);

            // isBlogRelatedPage();
            setNavBackground();

            // Look for new links in new main
            getMainLinks();
        })
        .catch(function (err) {
            // There was an error
            console.error("Something went wrong.", err);
        });
}


// Enable browser navigation
window.onpopstate = function (e) {
    if (e.state) {
        document.title = e.state.title;
        main.innerHTML = e.state.innerHTML;
        getMainLinks();
        setNavBackground();
    }
}

// Set background to current nav button (by adding HTML attribute "data-current='current item'"")
function setNavBackground(id) {
    // Reset
    for (let link of navLinks) {
        link.parentElement.removeAttribute("data-current");
    }

    if (id) {
        document.querySelector("#" + id).setAttribute("data-current", "current item");
        return;
    }

    if (isBlogRelatedPage()) {
        document.querySelector("#blog").setAttribute("data-current", "current item");
        return;
    }

    // Get pathname and remove slashes 
    //  / -> "", /about / -> "about"
    const pathname = location.pathname.replaceAll("/", "");

    if (pathname === "") {
        document.querySelector("#home").setAttribute("data-current", "current item");
    } else {
        document.querySelector("#" + pathname).setAttribute("data-current", "current item");
    }
}