


let mainBody = document.querySelector(".main");
let searchButton = document.getElementById('searchButton');
let showButton = document.getElementById('showMore');
let footer = document.querySelector(".showmorefooter");

const searchCard = () => {
    // mainBody.removeChild('.container');
    // createCards(image,title,link);
    let Nodes = mainBody.childNodes.length;
    console.log(Nodes);
}
const createCards = (image,title,link) => {
    let container = document.createElement('div');
    container.classList.add('container');
    container.style.cssText = `
    width:300px;
    margin-top:15px;
    background-color: #3F3F3F;`;

    let imageCont = document.createElement('div');
    imageCont.classList.add('imageCont');
    imageCont.style.cssText = `
    width:100%;
    height:250px;
    overflow:hidden;
    padding:0px;`;

    let imagePic = document.createElement('img');
    imagePic.style.cssText = `
    width:100%;
    transition:0.4s;`;
    imagePic.setAttribute('src',image);
    imageCont.append(imagePic);
    // image.style.cssText = ``

    let anchor = document.createElement('a');
    anchor.setAttribute('target','_blank');
    anchor.setAttribute('href',link);
    anchor.style.cssText = `
    cursor:pointer;`;

    anchor.append(imagePic);
    imageCont.append(anchor);

    let para = document.createElement('div');
    para.classList.add('para');
    para.textContent = title;
    para.style.cssText=`
    padding: 8px 20px;
    background-color:whitesmoke;
    text-align:center;`;


    container.append(imageCont);
    container.append(para);
    mainBody.append(container);

}

// for(let i=0;i<5;i++){
//     createCards('testimage.jpg','Just Buildings for Test Image','youtube.com');
// }


//ACCESS ID = 4EGmevVOWPwFL3MXPRSO7xQnxm6DmhGCepWzPA_UKz8
let page;
const fetchData = (page) => {
    let data = document.getElementById('search').value;
    const URL = `https://api.unsplash.com/search/photos?query=${data}&page=${page}&content_filter=high&client_id=4EGmevVOWPwFL3MXPRSO7xQnxm6DmhGCepWzPA_UKz8`;

    fetch(URL)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        let totalPages = result['total_pages'];
        if(page<=totalPages){
            let len = result['results'].length;
            // console.log(len);
            for(let i=0;i<len;i++){
                let imageInserted = result['results'][i]['urls']['small'];
                let imageTitle = result['results'][i]['alt_description'];
                let imageLink = result['results'][i]['urls']['full'];

                createCards(imageInserted, imageTitle, imageLink);
            }
        }
        else{
            alert('No More Pictures');
        }
    });
}

const searchFunction = () => {
    footer.style.cssText = `display:block;
    text-align:center;`;
    page = 1;
    if(mainBody.childNodes.length == 1){
        fetchData(page);
    }
    else{
        let childDivs = document.querySelectorAll('.container')
        childDivs.forEach(divs => divs.remove());
        fetchData(page);
    }
}

searchButton.addEventListener('click',searchFunction);

const showMoreFunction = () => {
    page++;
    fetchData(page);
}

showButton.addEventListener('click',showMoreFunction);

//MADE WITH PURE LOVE AND PASSION BY ARPIT KUMAR PRAJAPATI :)


