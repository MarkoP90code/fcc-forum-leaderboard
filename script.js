
//In this project, you will build a freeCodeCamp forum leaderboard that displays the latest topics, users, and replies from the freeCodeCamp forum. The HTML and CSS have been provided for you. Feel free to explore them.

//1.
const forumLatest = "https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json";
const forumTopicUrl = "https://forum.freecodecamp.org/t/";
const forumCategoryUrl ="https://forum.freecodecamp.org/c/";
const avatarUrl = "https://sea1.discourse-cdn.com/freecodecamp";

const postsContainer = document.getElementById("posts-container");

//6. 
const allCategories = {         //Step 39. - Each of the forum topics includes a category like Python or JavaScript. In the next few steps, you will build out a category object which holds all of the forum categories and classNames for the styling. Start by creating a new constant called allCategories and assign it the value of an empty object.
    299: { category: "Career Advice", className: "career" },       //Ovde imam objekat unutar objecta.
    409: { category: "Project Feedback", className: "feedback" },
    417: { category: "freeCodeCamp Support", className: "support" },
    421: { category: "JavaScript", className: "javascript" },
    423: { category: "HTML - CSS", className: "html-css" },
    424: { category: "Python", className: "python" },
    432: { category: "You Can Do This!", className: "motivation" },
    560: { category: "Backend Development", className: "backend" },
};

//7.
const forumCategory = (id) => {         //*Ispod.
    let selectedCategory = {};
    if (allCategories.hasOwnProperty(id)){      //izbacuje true ili false. Proverava da li objekat ima taj property.
        const {category, className} = allCategories[id];   //destructuring.
        selectedCategory.className = className;
        selectedCategory.category = category;
    } else {
        selectedCategory.className = "general";
        selectedCategory.category = "General";
        selectedCategory.id = 1;
    }
    const url = `${forumCategoryUrl}${selectedCategory.className}/${id}`;       
    const linkText = selectedCategory.category;                         //This will display the name of the category in the anchor element.            
    const linkClass = `category ${selectedCategory.className}`;         //These class names will be used to apply styles for the anchor element.
    return `<a href="${url}" class="${linkClass}" target="_blank">${linkText}</a>`;
};

//2.
const fetchData = async () => {     //To populate the forum leaderboard with data, you will need to request the data from an API. This is known as an asynchronous operation, which means that tasks execute independently of the main program flow.
    try{
        const res = await fetch(forumLatest);
        const data = await res.json();
        showLatestPosts(data);
        // console.log(data)
        // console.log(data.topic_list.topics[0])
        // console.log(data.topic_list.topics[0].bumped_at)
        // console.log(new Date())
        // console.log(new Date(data.topic_list.topics[0].bumped_at))
    } catch(err) {
        console.log(err)
    }
};

fetchData();

//3.
const showLatestPosts = (data) => {
    const {topic_list, users} = data;
    const {topics} = topic_list;        //Ovo je isto destructuring.  Step 13. - The topic_list object contains a topics array which contains the latest topics posted to the forum. Destructure the topics array from the topic_list object.
    postsContainer.innerHTML = topics.map((item) => {
        const {
            id,
            title,
            views,
            posts_count,
            slug,
            posters,
            category_id,
            bumped_at,
          } = item;         //Destrukturing.
          //Ovde radim return jer imam {} tako da nemam implicit return pa moram ovako explicitno da zadam. I onda je postsContainer.innerHTML jednako return od topics.map().
          //U postsContainer dodajem elemente sto je <tbody> u HTML-u.
          //Kod post counts ne znam sto id -1. Skontao sam da je valjda zato sto "Replies" kolona je broj odgovora. Tako da se prvi post ne racuna kao reply, a svi ostali jesu reply.
          return `<tr>
                    <td>
                    <a target="_blank" href="${forumTopicUrl}${slug}/${id}" class="post-title">${title}</a>
                    ${forumCategory(category_id)}           
                    </td>
                    <td>
                    <div class="avatar-container">
                    ${avatars(posters, users)}
                    </div>
                    </td>
                    <td>${posts_count - 1}</td>
                    <td>${viewCount(views)}</td>
                    <td>${timeAgo(bumped_at)}</td>     
                  </tr>`;
    }).join("");
};

//4. 
const timeAgo = (time) => {     //Step 22. - To display data in the Activity column, you need to use the bumped_at property of each topic, which is a timestamp in the ISO 8601 format. You need to process this data before you can show how much time has passed since a topic had any activity. Create a new arrow function called timeAgo with a parameter called time.
    const currentTime = new Date()
    const lastPost = new Date(time);
    const timeDifference = currentTime - lastPost;          //Valjda koliko je proslo vremena od kad je post postavljen.
    const msPerMinute = 1000 * 60;                          //Broj milisekundi u minuti.
    const minutesAgo = Math.floor(timeDifference / msPerMinute);    //Pre koliko minuta je post postavljen.
    const hoursAgo = Math.floor(minutesAgo / 60);           //Koliko je sati proslo od proslog post-a.
    const daysAgo = Math.floor(hoursAgo / 24);              //Koliko je dana proslo od proslog post-a.

    if (minutesAgo < 60)  {             //Ovde mogu ovako sa if stejtmentima jer ako je prvi tacan onda se izvrsava return i dalje se kod ne izvrsava.
        return `${minutesAgo}m ago`;
    }

    if (hoursAgo < 24) {
    return `${hoursAgo}h ago`
    }

    return `${daysAgo}d ago`;       //Ako prva dva if nisu ispunjena znaci da nije izvrsen return i kod se i dalje nastavlja i onda se odradi ovaj return.
};

//5.
const viewCount = (views) => {      //Step 34. - You need a function to convert view counts to a more readable format. For example, if the view count is 1000, it should display as 1k and if the view count is 100,000 it should display as 100k.
    const thousands = Math.floor(views / 1000);
    if (views >= 1000) {
        return `${thousands}k`
    }

    return views;
};


//8.
const avatars = (posters, users) => {   //** Ispod.
    return posters.map((poster) => {
        const user = users.find((user) => user.id === poster.user_id);
        if (user) {     //proverava da li user posto jel ako find ni jedan user ne nadje izbacice undefined.
            const avatar = user.avatar_template.replace(/{size}/, 30);
            const userAvatarUrl = avatar.startsWith("/user_avatar/") ? avatarUrl.concat(avatar) : avatar;
            return `<img src="${userAvatarUrl}" alt="${user.name}">`;
        }
    }).join("");
};



// *
// const forumCategory = (id) => {     //Ova funkcije se poziva unutar funkcije showLatestPosts() i tu se prosledjuje id sto je u stvari category_id. Radi se map tako da prolazi kroz sve clanove topics array-a.
//     let selectedCategory = {};
//     if (allCategories.hasOwnProperty(id)){     //Ovde se proverava prosledjeni id. Ako taj id postoji unutar allCategories objekta onda se radi sledece.
//         const {category, className} = allCategories[id];   //Radi se destrukturing. Ali ovde imam objekat unutar objekta pa treba obratiti paznju.
//         selectedCategory.className = className;         //Ako if zadovoljava ovo se ubacuje u selectedCategory.
//         selectedCategory.category = category;           //Ako if zadovoljava ovo se ubacuje u selectedCategory.
//     } else {
//         selectedCategory.className = "general";         //Ako ne zadovoljava if onda se u selectedCategory dodaje key className sa properijem general.
//         selectedCategory.category = "General";          //Ako ne zadovoljava if onda se u selectedCategory dodaje key category sa properijem General.
//         selectedCategory.id = 1;            ////Ako ne zadovoljava if onda se u selectedCategory dodaje key id sa properijem 1.
//     }
//     const url = `${forumCategoryUrl}${selectedCategory.className}/${id}`;   //Ovde pravi url    
//     const linkText = selectedCategory.category;                         //This will display the name of the category in the anchor element.            
//     const linkClass = `category ${selectedCategory.className}`;         //These class names will be used to apply styles for the anchor element.
//     return `<a href="${url}" class="${linkClass}" target="_blank">${linkText}</a>`;     
// };



// **
// const avatars = (posters, users) => {   //** Ispod.
//     return posters.map((poster) => {
//         const user = users.find((user) => user.id === poster.user_id);
//         if (user) {     //proverava da li user posto jel ako find ni jedan user ne nadje izbacice undefined.
//             const avatar = user.avatar_template.replace(/{size}/, 30);
//             const userAvatarUrl = avatar.startsWith("/user_avatar/") ? avatarUrl.concat(avatar) : avatar;
//             return `<img src="${userAvatarUrl}" alt="${user.name}">`;
//         }
//     }).join("");
// };

// Funkciju avatar() pozivam unutar funkcije showLatestPosts(). prosledjuju se parametri posters i users.
// users je array ispunjen sa objektima usera. posters posto se mapira unutar showLatestPosts() je za
// svaku iteraciju drugacije.
// U prvoj iteraciji (unutar showLatestPosts) posters je array sa pet objekata. Tako da se u prvoj iteraciji u 
// avatars() prosledjuje posters sto je array sa pet objekat i users sto je array sa 56 objekata. 
// users je isti za svaku iteraciju. Onda mapiram posters. Uzima se prvi poster i radim sledece.
// U prvoj iteraciji uzimam poster[0] (sto je u stvari posters[0]). Onda find trazi usera koji isti id 
// kao poster.user.id. Kad ga nadje to dodeljuje const user.
// user je objekat koji je pronadjen unutar array-a users.
// Ako find nadje usera znaci nije undefined onda je if statement truthy i desava se sledece.
// const avatar postaje ovaj avatar_template od usera ali mu zadajemo za size da je 30. Ovde mi nije najjasnije
// kako je sve ovo iskordinisano. Onda userAvatarUrl kad se sve odradi postaje Url od slike koju treba da 
// ubacim. I onda radim return.
