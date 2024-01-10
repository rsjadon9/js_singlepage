import axios from "axios";

const breedSelect = document.getElementById("breedSelect");
const showImagesBtn = document.getElementById("showImagesBtn");
const clearImagesBtn = document.getElementById("clearImagesBtn");

const showVotesBtn = document.getElementById("showVotesBtn");
const deleteVotesBtn = document.getElementById("deleteVotesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
    "live_mgvFtfdZlfFKWUFIKFFJPw5MoYyYYmT7Z92zK7NfHzDKDWf2Ir4IHdZuTlVS1gOH";

axios.defaults.baseURL = "https://api.thecatapi.com/v1";

axios.defaults.headers.common["api_key"] = API_KEY;
axios.defaults.headers.common["x-api-key"] = API_KEY;

async function initialLoad() {
    try {
        const response = await axios.get(`/breeds`);
        if (response.status != 200) {
            throw new Error("Bad Status");
        }
        response.data.forEach((breed) => {
            const option = document.createElement("option");
            option.setAttribute("value", breed.id);
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });
    } catch (err) {
        console.log(err);
        console.log(err.message);
    }
    showImages();
}
initialLoad();

showImagesBtn.addEventListener("click", showImages);
clearImagesBtn.addEventListener("click", clearImages);

showVotesBtn.addEventListener("click", showVotes);
deleteVotesBtn.addEventListener("click", deleteVotes);

async function showVotes() {
    clearImages();
    const allVotes = await getVotes();
    const votedImages = [];
    allVotes.forEach((voteDtl) => {
        console.log(`Found VoteId ${voteDtl.id}`);
        votedImages.push(voteDtl.image);
    });
    displayCats(votedImages);
}

async function saveVote(imgId) {
    console.log('Vote for imgId ${imgId}');
    const voteOutput = await axios.post("/votes", {
        image_id: imgId,
        value: 1
    });
    console.log(`Voted for image_id ${imgId} vote_id ${voteOutput.id}`);
}

async function getVotes() {
    const response = await axios.get(
        `/votes`
    );
    console.log(`Total Votes Found ${response.data.length}`);
    return response.data;
}

async function deleteVotes() {
    const allVotes = await getVotes();
    allVotes.forEach((voteDtl) => {
        console.log(voteDtl);
        console.log(`Deleting VoteId ${voteDtl.id}`);
        const response = axios.get(
            `/votes/` + voteDtl.id
        );
        response.then((success) => {
            console.log("success deleting");
        });
    });
    document.getElementById("btnActionResults").innerHTML = "All Votes Deleted !";
}

function clearImages() {
    document.getElementById("btnActionResults").innerHTML = "";
}

async function showImages() {
    clearImages();
    const response = await getImages();
    displayCats(response.data);
}

function displayCats(catImages) {
    catImages.forEach((catImage) => {
        const newImageElement = document.createElement("img");
        newImageElement.src = catImage.url;
        newImageElement.onclick = function () { saveVote(catImage.id); };
        document.getElementById("btnActionResults").appendChild(newImageElement);
    });
}

async function getImages() {
    const selectedBreed = breedSelect.value;
    const numberOfImages = document.getElementById("numberOfImages").value;
    const response = await axios.get(
        `/images/search?limit=${numberOfImages}&breed_ids=${selectedBreed}`
    );
    return response;
}
