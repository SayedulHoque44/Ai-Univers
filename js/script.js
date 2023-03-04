// Dom card
const sortDateBtn = document.getElementById("sortDateBtn");
const CardContainer = document.getElementById("CardContainer");
const showAllBtn = document.getElementById("showAllBtn");
const spinar = document.getElementById("spinar");

let storeUsedCardData = [];
// All Data Load
function mainDataLoad(limit) {
  let url = `https://openapi.programming-hero.com/api/ai/tools`;
  spinar.classList.remove("d-none");
  sortDateBtn.classList.add("d-none");
  fetch(url)
    .then((res) => res.json())
    .then((dataObj) => displayData(dataObj, limit));
}

// display data
function displayData(dataObj, limit) {
  let cardDataInArray;
  // sort or unsort contion
  if (dataObj.status === true) {
    cardDataInArray = dataObj.data.tools;
  } else if (dataObj.type === "sorted") {
    cardDataInArray = dataObj.data;
  }

  // clear card container
  CardContainer.innerHTML = "";

  // limit condition
  if (limit) {
    cardDataInArray = cardDataInArray.slice(0, limit);
    showAllBtn.classList.add("d-block");
  } else {
    showAllBtn.classList.add("d-none");
    showAllBtn.classList.remove("d-block");
  }
  cardDataInArray.forEach((cardData) => {
    // console.log(cardData);
    // new Element
    const divTag = document.createElement("div");
    divTag.classList.add("col");
    // innarHtml
    let cardInnarHtml = `
        <div class="card">
            <img  src="${cardData.image}" class="card-img-top" alt="img" />
            <div class="card-body">
              <h5 class="card-title">Features</h5>
              <div class="card-text">
                <ul class="list-unstyled">
                  <li>1. ${cardData.features[0]}</li>
                  <li>2. ${cardData.features[1]}</li>
                  <li>3. ${cardData.features[2]}</li>
                </ul>
              </div>
            </div>
            <div
              class="card-footer d-flex justify-content-between align-items-center"
            >
              <div>
                <h4>${cardData.name}</h4>
                <p>
                  <i class="fa-solid fa-calendar-days me-1"></i>
                  <span id="dateValue">${cardData.published_in}</span>
                </p>
              </div>
              <div>
                <span
                  onclick="singleCardDetails('${cardData.id}')"
                  class="p-3 rounded-circle text-bg-info cour"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#cardDetails"
                >
                  <i class="fa-solid fa-arrow-right"></i>
                </span>
              </div>
        </div>
`;
    divTag.innerHTML = cardInnarHtml;
    CardContainer.appendChild(divTag);
  });
  storeUsedCardData = [...cardDataInArray];
  spinar.classList.add("d-none");
  sortDateBtn.classList.remove("d-none");
}
// show All
showAllBtn.addEventListener("click", function () {
  mainDataLoad();
});
// singleCardDetails Load Data
async function singleCardDetails(id) {
  let url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
  let res = await fetch(url);
  let data = await res.json();
  displayCardDetails(data);
}
// Dom Card details
const detailsDescription = document.getElementById("detailsDescription");
const monthBasic = document.getElementById("monthBasic");
const monthPro = document.getElementById("monthPro");
const enterprice = document.getElementById("enterprice");
const detailsFeatures = document.getElementById("detailsFeatures");
const detailsIntegrations = document.getElementById("detailsIntegrations");
const detailsIntegrationsUl = document.getElementById("detailsIntegrationsUl");
const detailsAccuracy = document.getElementById("detailsAccuracy");
const detailsRightsideImg = document.getElementById("detailsRightsideImg");
const detailsAi = document.getElementById("detailsAi");
const aiAsk = document.getElementById("aiAsk");
const aiAnswer = document.getElementById("aiAnswer");
//  display Card Details
function displayCardDetails(data) {
  // dataObj
  let dataDetailsObj = data.data;

  //pricing procces
  detailsDescription.innerHTML = dataDetailsObj.description;
  monthBasic.innerHTML =
    (dataDetailsObj.pricing[0].price === "0"
      ? "Free of Cost"
      : dataDetailsObj.pricing[0].price) +
    "/ </br>" +
    dataDetailsObj.pricing[0].plan;
  monthPro.innerHTML =
    (dataDetailsObj.pricing[1].price === "0"
      ? "Free of Cost"
      : dataDetailsObj.pricing[1].price) +
    "</br>" +
    dataDetailsObj.pricing[1].plan;
  enterprice.innerHTML =
    (dataDetailsObj.pricing[2].price === "0"
      ? "Free of Cost"
      : dataDetailsObj.pricing[2].price) +
    "</br>" +
    dataDetailsObj.pricing[2].plan;

  // detailsFeatures
  detailsFeatures.innerHTML = `
    <ul>
        <li>${dataDetailsObj.features[1].feature_name}</li>
        <li>${dataDetailsObj.features[2].feature_name}</li>
        <li>${dataDetailsObj.features[3].feature_name}</li>
    </ul>
  `;
  //detailsIntegrations
  if (dataDetailsObj.integrations.length > 0) {
    detailsIntegrationsUl.innerHTML = "";
    dataDetailsObj.integrations.forEach((ele) => {
      const li = document.createElement("li");
      li.innerHTML = ele;
      detailsIntegrationsUl.appendChild(li);
    });
  } else {
    // if Dont get any data than it will be display
    detailsIntegrations.innerHTML = "No Data Found !";
  }
  // detailsAccuracy
  if (dataDetailsObj.accuracy.score) {
    detailsAccuracy.classList.remove("d-none");
    detailsAccuracy.innerText = dataDetailsObj.accuracy.score + "%";
  } else {
    detailsAccuracy.classList.add("d-none");
  }
  // detailsRightsideImg
  detailsRightsideImg.innerHTML = `
    <img style="width:100%" src="${dataDetailsObj.image_link[0]}" al="img">
  `;
  // aiAsk
  if (dataDetailsObj.input_output_examples.length > 0) {
    aiAsk.innerText = dataDetailsObj.input_output_examples[0].input;
    aiAnswer.innerText = dataDetailsObj.input_output_examples[0].output;
  } else {
    aiAsk.innerText = "Can you give any example?";
    aiAnswer.innerText = "No! Not Yet! Take a break!!!";
  }
}

//
// sorting funtion
sortDateBtn.addEventListener("click", function () {
  storeUsedCardData.sort(function (a, b) {
    return new Date(b.published_in) - new Date(a.published_in);
  });
  let sortedData = storeUsedCardData.reverse();
  let temoObj = { type: "sorted", data: [...sortedData] };
  displayData(temoObj, 12);
  // console.log(storeUsedCardData.reverse());
});

//main data
mainDataLoad(6);
