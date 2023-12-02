//DO NOT TOUCH ANY OF THIS OR IM GONNA GO CRAZYYYYY PLEASE PLEASE PLEASE PLEASE
const clientId = "239c02e71a50471c92930526f206636f"
var redirect_uri = 'https://localhost:5173/callback';
var clientSecret = '5414e5c0b6554023a148d1607955048d';
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
var items;
var playback;

if (!code) {
  redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    items = await fetchProfile(accessToken);
    populateUI(items);

  var allButtons = document.querySelectorAll('button[class^=playlistItem]');
  console.log("Found", allButtons.length, "div which class starts with playlistItem.");
  var uriList = document.querySelectorAll('button[uri]');
  console.log(uriList);

  allButtons.forEach(btn => {
   btn.addEventListener('click', function() {
    AddtoQueue(btn.getAttribute('uri'), accessToken);
  })})



}

//DO NOT TOUCH
export async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");	
  params.append("redirect_uri", "https://localhost:5173/callback");
  params.append("scope", "user-read-playback-state user-modify-playback-state");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

//DO NOT TOUCH
function generateCodeVerifier(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// DO NOT TOUCH
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
} 

//DO NOT TOUCH 
export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://maxwellerman.github.io/spotifyjukebox/");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

// THIS WORKS
async function fetchProfile(accessToken) {
 const result = await fetch("https://api.spotify.com/v1/playlists/1udqwx26htiKljZx4HwVxs/tracks?fields=items%28track%28name%2C+artists%2C+explicit%2C+uri%2C+name%29%29&limit=100&offset=0", {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }, data: {
        'fields': 'items(track(name, artists, explicit, uri, album(name, images(url))))',
        'limit': '100',
        'offset': '0'
      }
  } );

return await result.json(); 
  
} 

//convert api to html . WORKS
function populateUI(items) {

  //console.log(items.items[0].track.name);
  //console.log(items);
  //console.log(items[0]);

  // button for loop
  for (var i=0; i < items.items.length ; i++){
    var name = items.items[i].track.name.toString();
    var uri = items.items[i].track.uri.toString();
    //var artists = items.items[i].track.artist[0].toString();

    const newButton = document.createElement('button');
    newButton.textContent = name;
    //newButton.setAttribute('class', 'col text-center');
    newButton.setAttribute('class', 'playlistItem');
    //newButton.setAttribute(artist, artists);
    document.body.appendChild(newButton);
    newButton.setAttribute('uri', uri);
    //console.log(uri);

  }

}


function AddtoQueue(uri, accessToken) {

/*
// add to queue
curl --request POST \
  --url 'https://api.spotify.com/v1/me/player/queue?uri=' + uri \
  --header 'Authorization: Bearer' + token
*/



$.ajax({
  url: 'https://api.spotify.com/v1/me/player/queue?uri=' + uri, 
  crossDomain: true,
  method: 'post',
  headers: {
      'Authorization': `Bearer ${accessToken}`
  }
}).done(function(response) {
  console.log(response);
});

console.log(uri);


} 

