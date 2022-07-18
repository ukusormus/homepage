const main = document.querySelector("body > main");

// Get links in header and loop over them, 
//  adding a click event listener to each of them
const navLinks = document.querySelectorAll("header > nav a");
for (let link of navLinks) {
    link.addEventListener("click", function (event) {
        event.preventDefault(); // Override link click default behavior
        setNavBackground(link.parentElement.id);
        getPageAndUpdate(link.href);
    });
}

// "Navigate" to given url by changing page's <main>
function getPageAndUpdate(url) {
    // If clicking on current page, don't do nothing
    if (url == document.location) {
        console.log("Already here.");
        return
    }
    
    // TODO: don't fetch when we already browsed
    //  or better yet, prefetch

    fetch(url)
        .then(function (response) {
            // The API call was successful!
            if (response.status != 200) {
                throw new Error("Page not found: " + url)
            }
            return response.text();
        })
        .then(function (htmlAsString) {
            console.log("Got html.")

            // Convert the HTML string into a document object
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlAsString, 'text/html');

            // Get & set the new main
            const newMain = doc.querySelector('main').innerHTML;
            main.innerHTML = newMain;

            // Get & set the new page title
            const newTitle = doc.querySelector('title').innerText;
            document.title = newTitle;

            // Add page to history and modify page URL
            window.history.pushState({ "title": newTitle, "innerHTML": newMain }, "", url);

            // setNavBackground() // moved to top for better feeling of response
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
        setNavBackground();
    }
};

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

    // Get pathname and replace 
    //  / -> "", /about / -> "about"
    const pathname = document.location.pathname.replaceAll("/", "");

    if (pathname === "") {
        document.querySelector("#home").setAttribute("data-current", "current item");
    } else {
        document.querySelector("#" + pathname).setAttribute("data-current", "current item");
    }
}