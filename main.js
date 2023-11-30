	//DO NOT TOUCH ANY OF THIS OR IM GONNA GO CRAZYYYYY PLEASE PLEASE PLEASE PLEASE
  const clientId = "239c02e71a50471c92930526f206636f"
  const scope = 'user-read-playback-state user-modify-playback-state';
  const authUrl = new URL("https://accounts.spotify.com/authorize")
  const redirectUri = 'http://localhost:5173/callback';

  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }
  
  const codeVerifier  = generateRandomString(64);
  
  const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);

  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }
  
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
  
  

//const params = new URLSearchParams(window.location.search);
const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');

var items;
var playback;




// generated in the previous step
window.localStorage.setItem('code_verifier', codeVerifier);

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    items = await fetchProfile(accessToken);
    populateUI(items);
    playback = await getPlayback(accessToken);
    console.log(playback);

  }

//DO NOT TOUCH
export async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");	
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("scope", "user-read-private user-read-email");
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

const getToken = async code => {

  // stored in the previous step
  let codeVerifier = localStorage.getItem('code_verifier');

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(url, payload);
  const response =await body.json();

  localStorage.setItem('access_token', response.access_token);
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
/* export async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
  });

  const { access_token } = await result.json();
  return access_token;
} */

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

//console.log(uri);

/*
$.ajax({
  url: 'https://api.spotify.com/v1/me/player/queue?uri=' + uri, //figure out how to call this variable correctly. 
  crossDomain: true,
  method: 'post',
  headers: {
      'Authorization': `Bearer ${accessToken}`
  }
}).done(function(response) {
  console.log(response);
});
*/
} 

async function getPlayback(accessToken) {
    // determine playstate of track

    const playstate = await fetch('https://api.spotify.com/v1/me/player', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    return await playstate.json();
}

//something isn't right here. idk what.
function PlayPause(accessToken, playback) {

  // if track is playing, pause
  if (is_playing = true) {

    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/pause',
      crossDomain: true,
      method: 'put',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).done(function(response) {
      console.log(response);
    });

  }

  // if track is paused, play
  else {

    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/play',
      crossDomain: true,
      method: 'put',
      headers: {
        'Authorization':  `Bearer ${accessToken}`
      },
      contentType: 'application/json',
      // data: '{\n    "context_uri": "spotify:playlist:1udqwx26htiKljZx4HwVxs",\n    "position_ms": 0\n}',
      data: JSON.stringify({
        'context_uri': 'spotify:playlist:1udqwx26htiKljZx4HwVxs',
        'position_ms': 0
      })
    }).done(function(response) {
      console.log(response);
    });

  }
}

function playNext(accessToken) {
  $.ajax({
    url: 'https://api.spotify.com/v1/me/player/next',
    crossDomain: true,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }).done(function(response) {
    console.log(response);
  });
}

function playPrev(accessToken) {

$.ajax({
  url: 'https://api.spotify.com/v1/me/player/previous',
  crossDomain: true,
  method: 'post',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
}).done(function(response) {
  console.log(response);
});


}




