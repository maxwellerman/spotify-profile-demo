	//DO NOT TOUCH ANY OF THIS OR IM GONNA GO CRAZYYYYY PLEASE PLEASE PLEASE PLEASE

const clientId = "239c02e71a50471c92930526f206636f"
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
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

//DO NOT TOUCH
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
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
  });

  const { access_token } = await result.json();
  return access_token;
}

// api call for profile info
async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${token}` } 
  } );

  return await result.json();
  
} 

//convert api to html text
function populateUI(profile) {
  document.getElementById("displayName").innerText = profile.display_name;
  if (profile.images[0]) {
      const profileImage = new Image(200, 200);
      profileImage.src = profile.images[0].url;
      document.getElementById("avatar").appendChild(profileImage);
      document.getElementById("imgUrl").innerText = profile.images[0].url;
  }
  document.getElementById("id").innerText = profile.id;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("uri").innerText = profile.uri;
  document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url").innerText = profile.href;
  document.getElementById("url").setAttribute("href", profile.href);
}


/*
API CURL LIST!

// get playlist items
curl --request GET \
  --url 'https://api.spotify.com/v1/playlists/1udqwx26htiKljZx4HwVxs/tracks?fields=items%28track%28name%2C+artists%2C+explicit%2C+uri%2C+name%29%29&limit=100&offset=0' \
  --header 'Authorization: Bearer' + token
*/
  var os = require('os');
if (os.platform() == 'win32') {  
    if (os.arch() == 'ia32') {
        var chilkat = require('@chilkat/ck-node17-win-ia32');
    } else {
        var chilkat = require('@chilkat/ck-node17-win64'); 
    }
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('@chilkat/ck-node17-arm');
    } else if (os.arch() == 'x86') {
        var chilkat = require('@chilkat/ck-node17-linux32');
    } else {
        var chilkat = require('@chilkat/ck-node17-linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('@chilkat/ck-node17-macosx');
}

function chilkatExample() {

    var rest = new chilkat.Rest();
    var success;

    // URL: token
    var bTls = false;
    var port = 80;
    var bAutoReconnect = true;
    success = rest.Connect("token",port,bTls,bAutoReconnect);
    if (success !== true) {
        console.log("ConnectFailReason: " + rest.ConnectFailReason);
        console.log(rest.LastErrorText);
        return;
    }

    // Note: The above code does not need to be repeatedly called for each REST request.
    // The rest object can be setup once, and then many requests can be sent.  Chilkat will automatically
    // reconnect within a FullRequest* method as needed.  It is only the very first connection that is explicitly
    // made via the Connect method.

    rest.AddHeader("Authorization","Bearer");

    var sbResponseBody = new chilkat.StringBuilder();
    success = rest.FullRequestNoBodySb("GET","/",sbResponseBody);
    if (success !== true) {
        console.log(rest.LastErrorText);
        return;
    }

    var respStatusCode = rest.ResponseStatusCode;
    console.log("response status code = " + respStatusCode);
    if (respStatusCode >= 400) {
        console.log("Response Status Code = " + respStatusCode);
        console.log("Response Header:");
        console.log(rest.ResponseHeader);
        console.log("Response Body:");
        console.log(sbResponseBody.GetAsString());
        return;
    }


}

chilkatExample();


/*
// add to queue
curl --request POST \
  --url 'https://api.spotify.com/v1/me/player/queue?uri=' + uri \
  --header 'Authorization: Bearer' + token
*/

var os = require('os');
if (os.platform() == 'win32') {  
    if (os.arch() == 'ia32') {
        var chilkat = require('@chilkat/ck-node17-win-ia32');
    } else {
        var chilkat = require('@chilkat/ck-node17-win64'); 
    }
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('@chilkat/ck-node17-arm');
    } else if (os.arch() == 'x86') {
        var chilkat = require('@chilkat/ck-node17-linux32');
    } else {
        var chilkat = require('@chilkat/ck-node17-linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('@chilkat/ck-node17-macosx');
}

function chilkatExample() {

    var rest = new chilkat.Rest();
    var success;

    // URL: token
    var bTls = false;
    var port = 80;
    var bAutoReconnect = true;
    success = rest.Connect("token",port,bTls,bAutoReconnect);
    if (success !== true) {
        console.log("ConnectFailReason: " + rest.ConnectFailReason);
        console.log(rest.LastErrorText);
        return;
    }

    // Note: The above code does not need to be repeatedly called for each REST request.
    // The rest object can be setup once, and then many requests can be sent.  Chilkat will automatically
    // reconnect within a FullRequest* method as needed.  It is only the very first connection that is explicitly
    // made via the Connect method.

    rest.AddHeader("Authorization","Bearer");

    var sbResponseBody = new chilkat.StringBuilder();
    success = rest.FullRequestNoBodySb("POST","/",sbResponseBody);
    if (success !== true) {
        console.log(rest.LastErrorText);
        return;
    }

    var respStatusCode = rest.ResponseStatusCode;
    console.log("response status code = " + respStatusCode);
    if (respStatusCode >= 400) {
        console.log("Response Status Code = " + respStatusCode);
        console.log("Response Header:");
        console.log(rest.ResponseHeader);
        console.log("Response Body:");
        console.log(sbResponseBody.GetAsString());
        return;
    }


}

chilkatExample();
