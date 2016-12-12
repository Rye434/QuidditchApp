"use strict";
var divs;
var teams = [];
var scores = [];
var button = document.getElementById("refresh");
document.querySelector("#refresh").addEventListener("click", restart);
// For Android and Cordova
document.addEventListener("DOMContentLoaded", function () {
    divs = document.getElementById("schedule");
    myApp.init();
});


let serverData = {
  url: "https://griffis.edumedia.ca/mad9014/sports/quidditch.php",
  httpRequest: "GET",
  getData: function () {
    // Add headers and options objects
    // Create an empty Request Headers instance
    let headers = new Headers();
    // Add a header(s)
    // key value pairs sent to the server
    headers.append("Content-Type", "text/plain");
    headers.append("Accept", "application/json; charset=utf-8");
    let options = {
      method: serverData.httpRequest,
      mode: "cors",
      headers: headers
    };
    // Create an request object so everything we need is in one package
    let request = new Request(serverData.url, options);

    fetch(request)
    .then(function (response) {

      return response.json();
    })
    .then(function (data) {
      var temp = JSON.stringify(data);
      localStorage.setItem("scores", temp);
      //var my_score_data = JSON.parse(localStorage.getItem("scores"));
      //console.log(my_score_data);
      teams = data.teams;
      scores = data.scores;
      console.log(teams);
      console.log(scores);
      
      displayData();
    })
    .catch(function (err) {
      alert("Error: " + err.message);
    });
  }
};


//************************************************************
//*************************SCHEDULE***************************
//************************************************************
function lookUp(id){
  var nm = "";
  teams.forEach(function(item){
    if(item.id == id){
       nm = item.name;
    }
  });
  return nm;
}

function displayData() {
  var standings = {};
  for(var i=0, num=teams.length; i<num; i++){
      standings[teams[i].name] = {"id":teams[i].id, "name":teams[i].name, "w":0, "l":0, "t":0} ;
      //  standings['Gryphindor'].w
      //  standings[teamName].w
  }
  for (var i=0, num=scores.length; i<num; i++) {
    let dateDiv = document.createElement("div");
    let game1Div = document.createElement("div");
    let game2Div = document.createElement("div");
    let vS1 = document.createElement("p");
        vS1.textContent = "VS"
    let vS = document.createElement("p");
        vS.textContent = "VS"
    let date = scores[i].date;
    let game1 = scores[i].games[0];
    let game2 = scores[i].games[1];
    let home1 = lookUp(game1.home);
    let away1 = lookUp(game1.away);
    let home2 = lookUp(game2.home);
    let away2 = lookUp(game2.away);
    let team1img = document.createElement("img");
        team1img.setAttribute("src", "img/"+ home1 +".svg")
    let team2img = document.createElement("img");
        team2img.setAttribute("src", "img/"+ away1 +".svg")
    let team3img = document.createElement("img");
        team3img.setAttribute("src", "img/"+ home2 +".svg")
    let team4img = document.createElement("img");
        team4img.setAttribute("src", "img/"+ away2 +".svg")
    dateDiv.textContent = date;
    //to append the name instead of the icon I would use game1Div or game2Div and append the home1 away1 home2 away2 variables to them.
    game1Div.appendChild(team1img);
      game1Div.appendChild(vS1);
    game1Div.appendChild(team2img);
    game2Div.appendChild(team3img);
      game2Div.appendChild(vS);
    game2Div.appendChild(team4img);
    dateDiv.classList.add("dates");
    game1Div.classList.add("games");
    game2Div.classList.add("games");
    schedule.appendChild(dateDiv);
    schedule.appendChild(game1Div);
    schedule.appendChild(game2Div);
    //************************************************************
    //************************STANDINGS***************************
    //************************************************************
    let homescore1 = game1.home_score;
    let awayscore1 = game1.away_score;
    let homescore2 = game2.home_score;
    let awayscore2 = game2.away_score;
    
    
    scores[i].games.forEach(function(g){
      if(g.home_score > g.away_score){
        //win for home, loss for away
        standings[lookUp(g.home)].w++;
        standings[lookUp(g.away)].l++;
      }else if(g.home_score < g.away_score){
        //win for away, loss for home
        standings[lookUp(g.home)].l++;
        standings[lookUp(g.away)].w++;
      }else{
        //tie for each team	
        standings[lookUp(g.home)].t++;
        standings[lookUp(g.away)].t++;
      }
    });
  }
  //convert the standings object into an array
  var scoreArr = [];
  for(var prop in standings){
    //  standings["hufflepuff"] = {"name","hufflepuff", "id":123, "w":3, "l":3, "t":0};
    //scoreArr = [{"name","hufflepuff", "id":123, "w":3, "l":3, "t":0},
    //{"name","ravenclaw", "id":123, "w":3, "l":3, "t":0},
    //{"name","syltherin", "id":123, "w":3, "l":3, "t":0},
    //{"name","gryphondor", "id":123, "w":3, "l":3, "t":0}]
    scoreArr.push( standings[prop] );
  }
  //sort the standings object
  scoreArr = scoreArr.sort(function(b, a){
			var result = a.w - b.w;
			if(result == 0){
				return a.t - b.t;	
			}else{
				return result;
			}
		});
  //build the standings table tbody
  scoreArr.forEach(function(item){
    //build a row for each "item"
    /**
    <tr>
        <td> Ravenclaw </td>
        <td>row-one column-three</td>
        <td>row-one column-three</td>
        <td>row-one column-three</td>
      </tr>
    **/
    
    let tr = document.createElement("tr");
    let name = document.createElement("td");
      name.classList.add(item.name)
    let img = document.createElement("img");
    let icon = document.createElement("td");
    let wins = document.createElement("td");
    let losses = document.createElement("td");
    let ties = document.createElement("td");
      img.setAttribute("src", "img/"+item.name+".svg") 
    name.textContent=item.name;
    wins.textContent=item.w;
    losses.textContent=item.l;
    ties.textContent=item.t;
    icon.appendChild(img);
    //tr.appendChild(name); *****This is how I would append the name instead of the icon
    tr.appendChild(icon);
    tr.appendChild(wins);
    tr.appendChild(losses);
    tr.appendChild(ties);
    document.querySelector("tbody").appendChild(tr);
  });
    
}




function restart(){
    document.querySelector("tbody").innerHTML=" ";
    document.getElementById("schedule").innerHTML=" ";
    serverData.getData();
}





















//************************************************************
//********************************NAVIGATION******************
//************************************************************
var myApp = {
  pages: [],
  links: [],
  init: function(){
    app.pages = document.querySelectorAll('[data-role="page"]');
    app.links = document.querySelectorAll('[data-role="links"]');
        
    [].forEach.call(app.links, function(item){
      item.addEventListener("click", myApp.nav);
    });
      
    if( localStorage.getItem("scores") == null){
     serverData.getData();
    }else{
      var temp = localStorage.getItem("scores");
      temp = JSON.parse(temp);
      
      teams = temp.teams;
      scores = temp.scores;
      
      displayData();
    }
  },
  nav: function(ev){
    ev.preventDefault();  //stop the link from doing anything
    var item = ev.currentTarget;  //the anchor tag
    var href = item.href;  //the href attribute
    var id = href.split("#")[1];  //just the letter to the right of "#"
    
    app.pages.forEach(function(item){
      if( item.id == id){
        item.className = "active";
      }else{
        item.className = "";
      }
        console.log(item);
    });
  }
  
};