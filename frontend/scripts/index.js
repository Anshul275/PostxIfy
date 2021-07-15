// Loading Values from Local DOM
let TOKEN = "";
let session_id = "";
let savedData = localStorage.getItem("session");
if(savedData) {
    data = JSON.parse(savedData);
    TOKEN = data.token;
    session_id = data.sessionId;
}
// Loading Values ends

const logo_reload = document.querySelector("#logo");

const back_btn = document.querySelector("#back_btn");

const login_btn = document.querySelector("#button-login");
const register_btn = document.querySelector("#button-register");
const forgot_pass_btn = document.querySelector("#forgot_btn");

const register_form = document.querySelector("#register-form");
const login_form = document.querySelector("#login-form");
const forgot_pass_form = document.querySelector("#forgot-pass-form");
const update_details_form = document.querySelector("#update-user-form");

const get_otp_btn = document.querySelector("#get_otp");
const reset_pass_btn = document.querySelector("#reset_btn");

const openLoggedInUserDetails = document.querySelector("#user_greet");
const logout = document.querySelector("#logout_user");
const update_details_btn = document.querySelector("#update_details_btn");
const delete_user_btn = document.querySelector("#delete_user_btn");

const latest_post_btn = document.querySelector("#latest_posts_btn");
const adored_post_btn = document.querySelector("#most_adored_btn");

const homePosts = document.querySelector("#latest_adored_posts");
const userPosts = document.querySelector("#user_posts");

const post_meme_homeScreen = document.querySelector("#make_a_post_homeScreen");
const post_meme_userScreen = document.querySelector("#make_a_post_userScreen");
const post_upload_form = document.querySelector("#upload-post-form");
const image_upload = document.querySelector("#image_upload");
const image_update = document.querySelector("#image_update");
const edit_post_form = document.querySelector("#edit-post-form");

function wait() {
    pop_msg.innerHTML = "Please WAIT............";
    msg_cont.style.background = "rgb(214, 145, 42)";
    show_msg.style.display = "block";
}

function loadLogin() {
    document.title = "Login | TrashHUB";
    document.querySelector("#login-register").style.display = "none";
    document.querySelector("#login-section").style.display = "block";
    document.querySelector("#register-section").style.display = "none";
}

function loadRegister() {
    document.title = "Register | TrashHUB";
    document.querySelector("#login-register").style.display = "none";
    document.querySelector("#login-section").style.display = "none";
    document.querySelector("#register-section").style.display = "block";
}

function loadForgotPass() {
    document.querySelector("#login-section").style.display = "none";
    document.querySelector("#forgot-password-section").style.display = "block";
}

async function handleLogin(event) {
    event.preventDefault();
    const raw_data = new FormData(event.target);
    let login_data = Object.fromEntries(raw_data.entries());
    try {
        wait();
        const res = await fetch('https://trash-hub.herokuapp.com/api/v1.0/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login_data)
            });
        const login_confirm = await res.json();
        if(res.status === 500) {
            pop_msg.innerHTML = "INTERNAL SERVER ERROR";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
        else if(res.status === 400) {
            pop_msg.innerHTML = login_confirm.message;
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
        else {
            document.title = "Home | TrashHUB";
            session_id = login_confirm.userId;
            TOKEN = login_confirm.TOKEN;
            let DATA = {
                sessionId: session_id,
                token: TOKEN
            };
            localStorage.setItem("session", JSON.stringify(DATA));
            document.querySelector("#login-section").style.display = "none";
            document.querySelector("#user-data").style.display = "block";
            document.querySelector("#posts_section").style.display = "block";
            setLoggedInUserButton();
            loadLatestPosts(homePosts);
            pop_msg.innerHTML = login_confirm.message + " " + login_data.userId;
            msg_cont.style.background = "#258b69";
            show_msg.style.display = "block";
        }
    } catch(err) {
        pop_msg.innerHTML = "Some error happened...";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
    document.getElementById("login-form").reset();
}

async function handleForgotPass(event) {
    event.preventDefault();
}

async function getOtp() {
    const user_id = document.getElementById("userID_forgot").value;

    if(user_id === "") {
        pop_msg.innerHTML = "Please provide the user_id.....";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
    else {
        const raw_data = new FormData();
        raw_data.append("userId", user_id);
        let forgot_pass_data = Object.fromEntries(raw_data.entries());
        try {
            wait();
            const res = await fetch('https://trash-hub.herokuapp.com/api/v1.0/forgotPassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(forgot_pass_data)
                });
            const otp_sent = await res.json();
            if(res.status === 500) {
                pop_msg.innerHTML = "INTERNAL SERVER ERROR";
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
            else if(res.status === 400) {
                pop_msg.innerHTML = otp_sent.message;
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
            else {
                pop_msg.innerHTML = otp_sent.message;
                msg_cont.style.background = "#258b69";
                show_msg.style.display = "block";
            }
        } catch (err) {
            pop_msg.innerHTML = "Some error happened...";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
    }
}

async function resetPass() {
    const user_id = document.getElementById("userID_forgot").value;
    const otp = document.getElementById("otp_verify").value;
    const new_pass = document.getElementById("new_password").value;

    const raw_data = new FormData();
    raw_data.append("userId", user_id);
    raw_data.append("otp", otp);
    raw_data.append("password", new_pass);
    let reset_pass_data = Object.fromEntries(raw_data.entries());
    try {
        wait();
        const res = await fetch('https://trash-hub.herokuapp.com/api/v1.0/resetPassword', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reset_pass_data)
            });
        const reset_confirm = await res.json();
        if(res.status === 500) {
            pop_msg.innerHTML = "INTERNAL SERVER ERROR";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
        else if(res.status === 400) {
            pop_msg.innerHTML = reset_confirm.message;
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
        else {
            pop_msg.innerHTML = reset_confirm.message;
            msg_cont.style.background = "#258b69";
            show_msg.style.display = "block";
            setTimeout(function(){
                window.location.reload(1);
                }, 2000
            );
        }
    } catch (err) {
        pop_msg.innerHTML = "Some error happened...";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
    document.getElementById("forgot-pass-form").reset();
}

async function handleRegister(event) {
    event.preventDefault();
    const raw_data = new FormData(event.target);
    let register_data = Object.fromEntries(raw_data.entries());
    let new_lines = 0;
    if(register_data.bio === ""){
        delete register_data.bio;
    }
    else {
        register_data.bio = register_data.bio.replace(/\n/g,'<br />');
        new_lines = (register_data.bio.match(/\n/g) || []).length;
    }

    if(new_lines > 3) {
        pop_msg.innerHTML = "BIO not more than 4 lines : RESTRICTED";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
    else {
        try {
            wait();
            const res = await fetch('https://trash-hub.herokuapp.com/api/v1.0/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': TOKEN
                    },
                    body: JSON.stringify(register_data)
                });
            const register_confirm = await res.json();
            if(res.status === 500) {
                pop_msg.innerHTML = "INTERNAL SERVER ERROR";
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
            else if(res.status === 201) {
                pop_msg.innerHTML = register_confirm.message;
                msg_cont.style.background = "#258b69";
                show_msg.style.display = "block";
                setTimeout(function(){
                    window.location.reload(1);
                    }, 2000
                );
            }
            else {
                pop_msg.innerHTML = register_confirm.message;
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
        } catch(err) {
            pop_msg.innerHTML = "Some error happened...";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
    }
    document.getElementById("register-form").reset();
}

function setLoggedInUserButton() {
    document.getElementById("user_greet").innerHTML = "Hola " + session_id + "!";
}

function loadHomePage() {
    window.scrollTo(0, 0);
    back_btn.style.display = "none";
    document.querySelector("#user-data").style.display = "block";
    document.querySelector("#update_details_btn").style.display = "none";
    document.querySelector("#delete_user_btn").style.display = "none";
    document.querySelector("#user_section").style.display = "none";
    document.querySelector("#userPost_btn").style.display = "none";
    document.querySelector("#posts_section").style.display = "block";
    document.querySelector("#update-user-details-section").style.display = "none";
    document.querySelector("#postMeme").style.display = "none";
    document.querySelector("#editPost").style.display = "none";
}

function postDuration(date){
    let seconds = Math.floor((Date.now() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        if(Math.floor(interval) === 1)
            return Math.floor(interval) + " yr ago";
        return Math.floor(interval) + " yrs ago";
    }

    interval = seconds / 2592000;
    if (interval > 1) {
        if(Math.floor(interval) === 1)
            return Math.floor(interval) + " month ago";
        return Math.floor(interval) + " months ago";
    }

    interval = seconds / 86400;
    if (interval > 1) {
        if(Math.floor(interval) === 1)
            return Math.floor(interval) + " day ago";
        return Math.floor(interval) + " days ago";
    }

    interval = seconds / 3600;
    if (interval > 1) {
        if(Math.floor(interval) === 1)
            return Math.floor(interval) + " hr ago";
        return Math.floor(interval) + " hrs ago";
    }

    interval = seconds / 60;
    if (interval > 1) {
        if(Math.floor(interval) === 1)
            return Math.floor(interval) + " min ago";
        return Math.floor(interval) + " mins ago";
    }

    return Math.floor(seconds) + " secs ago";
}

function addPostsToHTML(post, addLoc){
    let suitable_image = "./images/edits/unliked.png";
    let liked_data = "false";
    if(post.likedBy.includes(session_id)) {
        suitable_image = "./images/edits/liked.png";
        liked_data = "true";
    }

    const post_dur = postDuration(post.date);
    const def_imgUrl = "https://hernitriko.cz/wp-content/uploads/2019/04/This-meme-is-not-available-in-your-country-design.jpg";
    let postStruct = `
                <article class = "card">
                    <br>
                `;
    if(post.userId === session_id) {
        postStruct +=    ` 
                        <div>
                            <button type="text" class="editBtn" value="${post._id}">
                                <img class="editImg" src="./images/edits/edit.png">
                            </button>
                        </div>
                    `;
    }
    postStruct += `
                <p class="userId_card"><a class="userId_links"><b>${post.userId}</b></a></p>
                <p class="postDur">${post_dur}</p>
            `;
    if(post.userId === session_id) {
        postStruct += `
                    <div class="controls">
                        <button type="text" class="deleteBtn" value="${post._id}">
                            <div class="deleteText">Delete</div>
                            <img class="deleteImg" src="./images/edits/delete.png" />
                        </button>
                    </div>
                `;
    }
    // insted of keeping in "value" attribute of button, we can also keep it in "id" attribute
    postStruct += `
                    <img class="pop_img" src="${post.url}" onerror="this.onerror=null; this.src='${def_imgUrl}';" />
                    <div class="likes">
                        <button type="text" class="likeBtn" value="${post._id}">
                            <div class="like_content"><b class="likes_data">${post.likes}</b> Likes </div>
                            <img class="likeImg" liked="${liked_data}" src="${suitable_image}" />
                        </button>
                    </div>
                    <p class="postCaption">
                        <i>${post.caption}</i>
                    </p>
                </article>
            `;
    const position = "beforeend";
    addLoc.insertAdjacentHTML(position, postStruct);
}

async function loadLatestPosts(addLoc) {
    try {
        const url = 'https://trash-hub.herokuapp.com/api/v1.0/posts/latestPosts';
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': TOKEN
            }
        });
        const data = await res.json();
        if(res.status === 500) {
            pop_msg.innerHTML = "INTERNAL SERVER ERROR";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
        else if(res.status === 200) {
            show_msg.style.display = "none";
            data.forEach( function(post) {
                addPostsToHTML(post, addLoc);
            });
            initiate_edit_delete_like_popupImg_userLinks();   
        }
        else {
            pop_msg.innerHTML = data.message;
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
    } catch(err) {
        pop_msg.innerHTML = "Some error happened...";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
}

async function loadAdoredPosts(addLoc) {
    try {
        const url = 'https://trash-hub.herokuapp.com/api/v1.0/posts/mostAdored';
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': TOKEN
            }
        });
        const data = await res.json();
        if(res.status === 500) {
            pop_msg.innerHTML = "INTERNAL SERVER ERROR";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
        else if(res.status === 200) {
            show_msg.style.display = "none";
            data.forEach( function(post) {
                addPostsToHTML(post, addLoc);
            });
            initiate_edit_delete_like_popupImg_userLinks();   
        }
        else {
            pop_msg.innerHTML = data.message;
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
    } catch(err) {
        pop_msg.innerHTML = "Some error happened...";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
}

function initiate_edit_delete_like_popupImg_userLinks() {
    const editBtns = document.querySelectorAll(".editBtn");
    const deleteBtns = document.querySelectorAll(".deleteBtn");
    const likeBtns = document.querySelectorAll(".likeBtn");
    const images = document.querySelectorAll(".pop_img");
    const userLinks = document.querySelectorAll(".userId_links");
    editBtns.forEach( function(post) {
        post.addEventListener("click", openEditPostScreen);
    });
    deleteBtns.forEach( function(post) {
        post.addEventListener("click", deletePost);
    });
    likeBtns.forEach( function(post) {
        post.addEventListener("click", like_unlike_Post);
    });
    images.forEach( function (post) {
        post.addEventListener("click", displayPopupImg);
    });
    userLinks.forEach( function (post) {
        post.addEventListener("click", userSection);
    });
}

async function like_post(post_id, like_image, likes) {
    const raw_data = new FormData();
    raw_data.append("userId", session_id);
    let like_data = Object.fromEntries(raw_data.entries());
    try {
        wait();
        const url = 'https://trash-hub.herokuapp.com/api/v1.0/posts/like/' + post_id;
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': TOKEN
            },
            body: JSON.stringify(like_data)
        });
        const post_update = await res.json();
        if(res.status === 500) {
            pop_msg.innerHTML = "INTERNAL SERVER ERROR";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
        else if(res.status === 200) {
            show_msg.style.display = "none";
            like_image.setAttribute("liked", "true");
            like_image.src = "./images/edits/liked.png";
            likes.innerHTML++;
        }
        else {
            pop_msg.innerHTML = post_update.message;
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
    } catch(err) {
        pop_msg.innerHTML = "Some error happened...";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
}

async function unlike_post(post_id, like_image, likes) {
    const raw_data = new FormData();
    raw_data.append("userId", session_id);
    let like_data = Object.fromEntries(raw_data.entries());
    try {
        wait();
        const url = 'https://trash-hub.herokuapp.com/api/v1.0/posts/unlike/' + post_id;
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': TOKEN
            },
            body: JSON.stringify(like_data)
        });
        const post_update = await res.json();
        if(res.status === 500) {
            pop_msg.innerHTML = "INTERNAL SERVER ERROR";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
        else if(res.status === 200) {
            show_msg.style.display = "none";
            like_image.setAttribute("liked", "false");
            like_image.src = "./images/edits/unliked.png";
            likes.innerHTML--;
        }
        else {
            pop_msg.innerHTML = post_update.message;
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
    } catch(err) {
        pop_msg.innerHTML = "Some error happened...";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
}

function like_unlike_Post() {
    let likes = this.querySelector(".likes_data");
    let like_image = this.querySelector(".likeImg");
    const if_liked = like_image.getAttribute("liked");
    if(if_liked === "true") {
        unlike_post(this.value, like_image, likes);
    }
    else {
        like_post(this.value, like_image, likes);
    }
}

async function deletePost() {
    if(confirm("Are you sure you want to delete this post????")) {
        try {
            wait();
            const url = 'https://trash-hub.herokuapp.com/api/v1.0/posts/' + this.value;
            const res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': TOKEN
                },
                body: JSON.stringify({ userId: session_id})
            });
            const delete_confirm = await res.json();
            if(res.status === 500) {
                pop_msg.innerHTML = "INTERNAL SERVER ERROR";
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
            else if(res.status == 200) {
                if(delete_confirm.n == 1) {
                    open_logged_user_details();
                    pop_msg.innerHTML = "POST Deleted...";
                    msg_cont.style.background = "#258b69";
                    show_msg.style.display = "block";
                }
                else {
                    pop_msg.innerHTML = "POST doesn't exists...";
                    msg_cont.style.background = "#b13636";
                    show_msg.style.display = "block";
                    setTimeout(function(){
                        window.location.reload(1);
                        }, 2000
                    );
                }
            }
            else {
                pop_msg.innerHTML = delete_confirm.message;
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
                setTimeout(function(){
                    window.location.reload(1);
                    }, 2000
                );
            }
        } catch(err) {
            pop_msg.innerHTML = "Some error happened...";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
            setTimeout(function(){
                window.location.reload(1);
                }, 2000
            );
        }
    }
}

function latestPosts() {
    latest_post_btn.style.color = "whitesmoke";
    latest_post_btn.style.background = "rgb(63, 120, 134)";
    adored_post_btn.style.color = "rgb(63, 120, 134)";
    adored_post_btn.style.background = "whitesmoke";
    homePosts.innerHTML = "";
    wait();
    loadLatestPosts(homePosts);
}

function adoredPosts() {
    adored_post_btn.style.color = "whitesmoke";
    adored_post_btn.style.background = "rgb(63, 120, 134)";
    latest_post_btn.style.color = "rgb(63, 120, 134)";
    latest_post_btn.style.background = "whitesmoke";
    homePosts.innerHTML = "";
    wait();
    loadAdoredPosts(homePosts);
}

async function loadUserDetails(user_id) {
    const addLoc = document.getElementById("user_text_details");
    addLoc.innerHTML = "";
    try {
        const url = 'https://trash-hub.herokuapp.com/api/v1.0/users/' + user_id;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': TOKEN
            }
        });
        const data = await res.json();
        if(res.status === 500) {
            pop_msg.innerHTML = "INTERNAL SERVER ERROR";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
            setTimeout(function(){
                window.location.reload(1);
                }, 2000
            );
        }
        else if(res.status === 200) {
            if(!data.bio)   data.bio = "";
            let userDetails = `
                        <br />
                        <div class="userId_section"><b>${data.userId}</b></div>
                        <div class="userName_section"><i>${data.name}</i></div>
                        <div class="userEmail_section">${data.email}</div>
                        <p class="userBio_section">${data.bio}</p>
                    `;
            const position = "beforeend";
            addLoc.insertAdjacentHTML(position, userDetails);
        }
        else {
            pop_msg.innerHTML = data.message;
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
            setTimeout(function(){
                window.location.reload(1);
                }, 2000
            );
        }
    } catch(err) {
        pop_msg.innerHTML = "Some error happened...";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
        setTimeout(function(){
            window.location.reload(1);
            }, 2000
        );
    }
}

async function loadUserPosts(user_id) {
    userPosts.innerHTML = "";
    try {
        const url = 'https://trash-hub.herokuapp.com/api/v1.0/posts/users/' + user_id;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': TOKEN
            }
        });
        const data = await res.json();
        if(res.status === 500) {
            pop_msg.innerHTML = "INTERNAL SERVER ERROR";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
            setTimeout(function(){
                window.location.reload(1);
                }, 2000
            );
        }
        else if(res.status === 200) {
            show_msg.style.display = "none";
            data.forEach( function(post) {
                addPostsToHTML(post, userPosts);
            });
            initiate_edit_delete_like_popupImg_userLinks();
        }
        else {
            pop_msg.innerHTML = data.message;
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
            setTimeout(function(){
                window.location.reload(1);
                }, 2000
            );
        }
    } catch(err) {
        pop_msg.innerHTML = "Some error happened...";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
        setTimeout(function(){
            window.location.reload(1);
            }, 2000
        );
    }
}

function updateUserDetails() {
    document.getElementById("user-data").style.display = "none";
    document.getElementById("user_section").style.display = "none";
    document.getElementById("update-user-details-section").style.display = "block";
    back_btn.style.display = "block";
    pop_msg.innerHTML = "Only enter values in the fields you want to update....";
    msg_cont.style.background = "#258b69";
    show_msg.style.display = "block";
}

async function handleDetailsUpdate(event) {
    event.preventDefault();
    const raw_data = new FormData(event.target);
    let update_data = Object.fromEntries(raw_data.entries());

    let new_lines = 0;
    if(update_data.name === "") {
        delete update_data.name;
    }
    if(update_data.email === "") {
        delete update_data.email;
    }
    if(update_data.password === "") {
        delete update_data.password;
    }
    if(update_data.bio === "") {
        delete update_data.bio;
    }
    else {
        update_data.bio = update_data.bio.replace(/\n/g,'<br />');
        new_lines = (update_data.bio.match(/\n/g) || []).length;
    }
    
    if(new_lines > 3) {
        pop_msg.innerHTML = "BIO not more than 4 lines : RESTRICTED";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
    else {
        try {
            wait();
            const res = await fetch('https://trash-hub.herokuapp.com/api/v1.0/users/' + session_id, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': TOKEN
                    },
                    body: JSON.stringify(update_data)
                });
            const update_confirm = await res.json();
            if(res.status === 500) {
                pop_msg.innerHTML = "INTERNAL SERVER ERROR";
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
            else if(res.status === 200) {
                pop_msg.innerHTML = "Your details are successfully updated....";
                msg_cont.style.background = "#258b69";
                show_msg.style.display = "block";
                setTimeout(function(){
                    open_logged_user_details()
                    }, 2000
                );
            }
            else {
                pop_msg.innerHTML = update_confirm.message;
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
        } catch (err) {
            pop_msg.innerHTML = "Some error happened...";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
    }
    document.getElementById("update-user-form").reset();
}

async function deleteUser() {
    if(confirm("Are you sure you want to delete your profile????")) {
        try {
            wait();
            let url = "https://trash-hub.herokuapp.com/api/v1.0/users/" + session_id;
            const res = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': TOKEN
                    },
                });
            const deleteUserData = await res.json();
            if(res.status === 500) {
                pop_msg.innerHTML = "INTERNAL SERVER ERROR";
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
            else if(res.status === 200) {
                pop_msg.innerHTML = deleteUserData.message;
                msg_cont.style.background = "#258b69";
                show_msg.style.display = "block";
                localStorage.setItem("session", "");
                setTimeout(function(){
                    window.location.reload(1);
                    }, 2000
                );
            }
            else {
                pop_msg.innerHTML = deleteUserData.message;
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
        }
        catch(err) {
            pop_msg.innerHTML = "Some error happened...";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
        setTimeout(function(){
            window.location.reload(1);
            }, 2000
        );
    }
}

function userSection() {
    window.scrollTo(0, 0);
    document.getElementById("posts_section").style.display="none";
    document.getElementById("user_section").style.display="block";
    back_btn.style.display = "block";
    if(this.text === session_id) {
        document.getElementById("userPost_btn").style.display = "block";
        document.getElementById("delete_user_btn").style.display = "block";
        document.getElementById("update_details_btn").style.display = "block";
    }
    wait();
    loadUserDetails(this.text);
    loadUserPosts(this.text);
}

function open_logged_user_details() {
    document.querySelector("#posts_section").style.display = "none";
    document.querySelector("#postMeme").style.display = "none";
    document.querySelector("#editPost").style.display = "none";
    document.querySelector("#user_section").style.display = "block";
    document.querySelector("#user-data").style.display = "block";
    document.querySelector("#userPost_btn").style.display = "block";
    document.querySelector("#delete_user_btn").style.display = "block";
    document.querySelector("#update_details_btn").style.display = "block";
    document.querySelector("#update-user-details-section").style.display = "none";
    back_btn.style.display = "block";
    wait();
    loadUserDetails(session_id);
    loadUserPosts(session_id);
}

async function addImgUrl(loc_to_load, fileList) {
    const url_loc = document.getElementById(loc_to_load);
    url_loc.value = "image is being uploaded...";
    let formData = new FormData();
    formData.append("image", fileList[0]);
    try {
        const res = await fetch("https://api.imgur.com/3/image",{
            method: "POST",
            headers: {
                "Authorization": "Client-ID 8d71c644e385869"
            },
            body: formData,
            redirect: "follow"
        });
        const img_uploadData = await res.json();
        url_loc.value = img_uploadData["data"]["link"];
    } catch (err) {
        pop_msg.innerHTML = "Some error happened...";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
}

function addUploadImgUrl() {
    const fileList = this.files;
    addImgUrl("meme_upload_url", fileList);
}

function addUpdatedImgUrl() {
    const fileList = this.files;
    addImgUrl("meme_update_url", fileList);
}

async function handlePost(event) {
    event.preventDefault();

    const raw_data = new FormData(event.target);
    raw_data.append("userId", session_id);
    let post_data = Object.fromEntries(raw_data.entries());
    delete post_data.image;
    const new_lines = (post_data.caption.match(/\n/g) || []).length;
    if(new_lines > 3) {
        pop_msg.innerHTML = "Caption not more than 4 lines : RESTRICTED";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
    else {
        post_data.caption = document.getElementById("postMeme_caption").value.replace(/\n/g,'<br />');

        let check = post_data.url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if(check == null) {
            post_data.url = "https://hernitriko.cz/wp-content/uploads/2019/04/This-meme-is-not-available-in-your-country-design.jpg";
        }

        try {
            wait();
            const res = await fetch('https://trash-hub.herokuapp.com/api/v1.0/posts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': TOKEN
                },
                body: JSON.stringify(post_data)
            });
            const post_confirmation = await res.json();
            if(res.status === 500) {
                pop_msg.innerHTML = "INTERNAL SERVER ERROR";
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
            else if(res.status === 201) {
                pop_msg.innerHTML = "POST UPLOADED!";
                msg_cont.style.background = "#258b69";
                show_msg.style.display = "block";
                setTimeout(function(){
                    open_logged_user_details();
                    }, 2000
                );
            }
            else {
                pop_msg.innerHTML = post_confirmation.message;
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
        } catch(err) {
            pop_msg.innerHTML = "Some error happened...";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
    }
    document.getElementById("upload-post-form").reset();
}

function openPostHomeScreen() {
    document.querySelector("#posts_section").style.display = "none";
    document.querySelector("#postMeme").style.display = "block";
    back_btn.style.display = "block";
}

function openPostUserScreen() {
    document.querySelector("#user_section").style.display = "none";
    document.querySelector("#delete_user_btn").style.display = "none";
    document.querySelector("#update_details_btn").style.display = "none";
    document.querySelector("#postMeme").style.display = "block";
    back_btn.style.display = "block";
}

async function handleEditPost(event) {
    event.preventDefault();
    const post_id = document.querySelector("#post_id").value;
    const raw_data = new FormData(event.target);
    raw_data.append("userId", session_id);
    let edit_post_data = Object.fromEntries(raw_data.entries());
    delete edit_post_data.image;

    let new_lines = 0;
    if(edit_post_data.url === "") {
        delete edit_post_data.url;
    }
    else {
        let check = edit_post_data.url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if(check == null) {
            edit_post_data.url = "https://hernitriko.cz/wp-content/uploads/2019/04/This-meme-is-not-available-in-your-country-design.jpg";
        }
    }
    if(edit_post_data.caption === "") {
        delete edit_post_data.caption;
    }
    else {
        edit_post_data.caption = edit_post_data.caption.replace(/\n/g,'<br />');
        new_lines = (edit_post_data.caption.match(/\n/g) || []).length;
    }
    
    if(new_lines > 3) {
        pop_msg.innerHTML = "Caption not more than 4 lines : RESTRICTED";
        msg_cont.style.background = "#b13636";
        show_msg.style.display = "block";
    }
    else {
        try {
            wait();
            const url = 'https://trash-hub.herokuapp.com/api/v1.0/posts/' + post_id;
            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': TOKEN
                },
                body: JSON.stringify(edit_post_data)
            });
            const post_update = await res.json();

            if(res.status === 500) {
                pop_msg.innerHTML = "INTERNAL SERVER ERROR";
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
            else if(res.status === 200) {
                pop_msg.innerHTML = "POST UPDATED!";
                msg_cont.style.background = "#258b69";
                show_msg.style.display = "block";
                setTimeout(function(){
                    open_logged_user_details();
                    }, 2000
                );
                
            }
            else {
                pop_msg.innerHTML = post_update.message;
                msg_cont.style.background = "#b13636";
                show_msg.style.display = "block";
            }
        } catch(err) {
            pop_msg.innerHTML = "Some error happened...";
            msg_cont.style.background = "#b13636";
            show_msg.style.display = "block";
        }
    }
    document.getElementById("edit-post-form").reset();
}

function openEditPostScreen() {
    document.querySelector("#posts_section").style.display="none";
    document.querySelector("#user_section").style.display = "none";
    document.querySelector("#delete_user_btn").style.display = "none";
    document.querySelector("#update_details_btn").style.display = "none";
    document.querySelector("#editPost").style.display = "block";
    document.querySelector("#post_id").value = this.value;
    back_btn.style.display = "block";
    pop_msg.innerHTML = "Only enter values in the fields you want to update....";
    msg_cont.style.background = "#258b69";
    show_msg.style.display = "block";
}

function logoutUser() {
    localStorage.setItem("session", "");
    location.reload();
}

function refresh() {
    location.reload();
}




logo_reload.addEventListener("click", refresh);

back_btn.addEventListener("click", loadHomePage);

login_btn.addEventListener("click", loadLogin);
register_btn.addEventListener("click", loadRegister);
forgot_pass_btn.addEventListener("click", loadForgotPass);

login_form.addEventListener("submit", handleLogin);
register_form.addEventListener("submit", handleRegister);
forgot_pass_form.addEventListener("submit", handleForgotPass);
update_details_form.addEventListener("submit", handleDetailsUpdate);

get_otp_btn.addEventListener("click", getOtp);
reset_pass_btn.addEventListener("click", resetPass);

openLoggedInUserDetails.addEventListener("click", open_logged_user_details);

delete_user_btn.addEventListener("click", deleteUser);
update_details_btn.addEventListener("click", updateUserDetails);

post_meme_homeScreen.addEventListener("click", openPostHomeScreen);
post_meme_userScreen.addEventListener("click", openPostUserScreen);
post_upload_form.addEventListener("submit", handlePost);

edit_post_form.addEventListener("submit", handleEditPost);

image_upload.onchange = addUploadImgUrl;
image_update.onchange = addUpdatedImgUrl;

latest_post_btn.addEventListener("click", latestPosts);
adored_post_btn.addEventListener("click", adoredPosts);

logout.addEventListener("click", logoutUser);



// Popups managed here (Images as well as Messages)
const show_pop_img = document.getElementById("show_pop_img");
const show_msg = document.getElementById("show_msg");
const msg_cont = document.querySelector(".msg_cont");
const pop_msg = document.getElementById("pop_msg");
const img_close = document.getElementById("pop_img_close");
const msg_close = document.getElementById("pop_msg_close");

img_close.onclick = function() {
    show_pop_img.style.display = "none";
};

msg_close.onclick = function() {
    show_msg.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == show_pop_img) {
        show_pop_img.style.display = "none";
    }
    if(event.target == show_msg) {
        show_msg.style.display = "none";
    }
}

function displayPopupImg() {
    const image = document.getElementById("pop_img");
    image.src = this.src;
    show_pop_img.style.display = "block";
}


// Check for any user_sessions
if(TOKEN != "") {
    document.querySelector("#login-register").style.display = "none";
    document.querySelector("#user-data").style.display = "block";
    document.querySelector("#posts_section").style.display = "block";
    loadLatestPosts(homePosts);
    setLoggedInUserButton();
    pop_msg.innerHTML = "Logged In!! " + session_id;
    msg_cont.style.background = "#258b69";
    show_msg.style.display = "block";
}



document.getElementById("login-form").reset();
document.getElementById("forgot-pass-form").reset();
document.getElementById("register-form").reset();
document.getElementById("update-user-form").reset();
document.getElementById("upload-post-form").reset();
document.getElementById("edit-post-form").reset();