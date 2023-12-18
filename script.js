 const userTab=document.getElementById("leftTab");
 const searchTab=document.getElementById('rightTab');
 const userContainer=document.getElementsByClassName('weather-Container');
 const grantLocation=document.querySelector(".grant-Location-Container");
 const searchForm=document.querySelector("[data-searchform]");
const loadingScreen=document.querySelector('.locating-continer');
const userInfoContainer=document.querySelector('.userInfoContiner') 


let currentTab = userTab;
API_key="7de5f773210f72b834d8b448ba67949f";
currentTab.classList.add("currentTab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
       currentTab.classList.remove("currentTab");
       currentTab=clickedTab;
       currentTab.classList.add("currentTab") 


     if(!searchForm.classList.contains("active")){
       userInfoContainer.classList.remove("active");
       grantLocation.classList.remove("active");
       searchForm.classList.add("active");
     }
     else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        console.log("aa ja")
        getfromSessionStorage();
     } 

 
    }

}


userTab.addEventListener("click",()=>{
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates) {
      //agar local coordinates nahi mile
      grantLocation.classList.add("active");
      
    }
    else {
      const coordinates = JSON.parse(localCoordinates);
      fetchUserWeatherInfo(coordinates);
    }
    
  }
async function fetchUserWeatherInfo(coordinate){
  const {lat,lon}=coordinate;
  grantLocation.classList.remove("active");
  loadingScreen.classList.add("active"); 
    
  try {
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`)
     const data=await response.json();
     loadingScreen.classList.remove("active");
     userInfoContainer.classList.add("active");
     renderWeatherInfo(data);
  
  } catch (error) {
    loadingScreen.classList.remove("active")
    console.log(error)
    
  }
}

function renderWeatherInfo(weatherInfo){
   const cityName=document.querySelector("[data-cityName]");
   const countryImg=document.querySelector("[data-countryimg]");
   const desc=document.querySelector("[data-weatherDesc]");
   const watherIcon=document.querySelector("[data-weatherimg]");
   const temp=document.querySelector("[data-temp]");
   const wind=document.querySelector("[data-windSpeed]");
   const humidity=document.querySelector("[data-humiSpeed]");
   const cloud=document.querySelector("[data-cloudSpeed]");
   const minTemp=document.querySelector("[data-mintemp]");
   const maxtemp=document.querySelector("[data-maxtemp]")


   //display in ui all value
   cityName.innerHTML=weatherInfo?.name;
   countryImg.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerHTML=weatherInfo?.weather?.[0]?.description;
   watherIcon.innerHTML=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerHTML=`${weatherInfo?.main?.temp}°C`;
   wind.innerHTML=`${weatherInfo?.wind?.speed}m/s`;
   humidity.innerHTML=`${weatherInfo?.main?.humidity}%`;
   cloud.innerHTML=`${weatherInfo?.clouds?.all}%`;
   minTemp.innerHTML=`${weatherInfo?.main?.temp_min}°C`
   maxtemp.innerHTML=`${weatherInfo?.main?.temp_max}°C`

}

function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    // console.log("please allow to access for the location")
    alert("please allow for access for location")
  }
}
 
function showPosition(position){
  
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
}
 sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
 fetchUserWeatherInfo(userCoordinates);
}


const grantBtn=document.getElementById('data-grantAccessbtn');
grantBtn.addEventListener("click",getLocation);


let searchInputForm=document.querySelector("[ data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  let cityName=searchInputForm.value;
  if(cityName === ""){
    return;
  }
  else{
    featchSearchWeatherInfo(cityName);
  }
})

async function featchSearchWeatherInfo(city){
   loadingScreen.classList.add("active");
   userInfoContainer.classList.remove("active");
   grantLocation.classList.remove("active");
   try {
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
    const data=await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
   } catch (error) {
    console.log("error aaya hai")
   }
}
