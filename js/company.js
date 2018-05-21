(function(){
"use strict"
/*Get Data*/
var companyList = $.ajax({
	type:'POST',
	url:'http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList',	
	async:false
}).responseJSON;
var newsList = $.ajax({
	type:'POST',
	url:'http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList',	
	async:false
}).responseJSON;
/*Partners list and sort config*/
var partners, sortby;
/*function get more info companies => partners*/
function moreInfo(){
	$("a.list-group-item").off().on('click',(e)=>{
		$("a.list-group-item").removeClass('active');
		e.target.classList.add('active');
		partners = companyList.list.find((company)=>{return company.name===e.target.dataset.name});
		partners = partners.partners;
		sortInfo(sortby);
		setInfo(partners);
		$(".companyPartners").show();
	});
};
function setInfo(partners){
	$(".partners").html('');
	partners.forEach((partner)=>{
			$(".partners").append( `<div class="col-xs-6 col-sm-4 col-md-2 col-lg-2">
							                  <div class="percent"><span>${partner.value}%</span></div>
							                  <div class="name"><span class="cn">${partner.name}</span></div>
							                </div>
														`);
		});
}
function sortInfo(sortby){
	switch(sortby){
		case 'nameUp':
			partners.sort((a,b)=>{
				return a.name<b.name;
			});
			break;
		case 'nameDown':
			partners.sort((a,b)=>{
				return a.name>b.name;
			});
			break;
		case 'percUp':
			partners.sort((a,b)=>{
				return a.value>b.value;
			});
			break;
		case 'percDown':
			partners.sort((a,b)=>{
				return a.value<b.value;
			});
			break;
		default:
			partners.sort((a,b)=>{
				return a.value<b.value;
			});
	}
}
/*Total Companies*/
$(".tc").html(`<strong>${companyList.list.length}</strong>`);
/*List of Companies*/
companyList.list.forEach((company)=>{
	$(".loc>.list-group").append(`<a class='list-group-item' data-name='${company.name}'>${company.name}</a>`);
});
moreInfo();
/*Company Partners*/
/*Sort*/
function sort(e){
	e.target.firstElementChild.className = e.target.firstElementChild.className === "glyphicon glyphicon-triangle-bottom" 
		? "glyphicon glyphicon-triangle-top" : "glyphicon glyphicon-triangle-bottom";
	if(e.target.className==="sName"){
		if(e.target.firstElementChild.className==="glyphicon glyphicon-triangle-top"){
			sortby='nameUp'
		}else{
			sortby='nameDown'
		}
	}else
	if(e.target.className==="sPercent"){
		if(e.target.firstElementChild.className==="glyphicon glyphicon-triangle-top"){
			sortby='percUp'
		}else{
			sortby='percDown'
		}
	}
	sortInfo(sortby);
	setInfo(partners);
}
$(".sName").on('click',sort);
$(".sPercent").on('click',sort);

/*Companies by Location*/
// Creat Array of location companies to build graph
var loc=[['Location', 'Companies']];
companyList.list.forEach((company)=>{
	var i = loc.findIndex((val)=>{
		 return val[0]===company.location.name;
	})
	if(i!==-1){
		loc[i][1]++;

	}else{
		loc.push([company.location.name,1]);
	}
});
// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
function drawChart() {
  var data = google.visualization.arrayToDataTable(loc);

  // Optional; add a title and set the width and height of the chart
  var options = {'width':'100%', 'height':'100%'};

  // Display the chart inside the <div> element with id="cbl"
  var chart = new google.visualization.PieChart(document.getElementById('graph'));
 
  chart.draw(data, options);
  // Action 
  function selectHandler() {
    var selectedItem = chart.getSelection()[0];
    if (selectedItem) {
      var value = data.getValue(selectedItem.row, 0);
      var list = companyList.list.filter((val)=>{return val.location.name===value});
      $("#list>.list-group").html('');
      list.forEach((company)=>{
				$("#list>.list-group").append(`<a class='list-group-item' data-name='${company.name}'>${company.name}</a>`);
			});
			if(list){
				moreInfo();
				$("#graph").hide();
				$(".back").show();
				$("#list").show();
			}
    }
  }
  google.visualization.events.addListener(chart,'select',selectHandler)
}
// Back Button in Companies by Location
$(".back").on('click',()=>{
	$("#graph").show();
	$(".back").hide();
	$("#list").hide();
	$("#list>.list-group").html('');
})
/*News*/
newsList.list.forEach((news,index)=>{
	/*Get Date*/
	var date =  new Date(parseInt(news.date)*1000);
	/*Max length symbol*/
	var maxLengthDesc = 100;
	/*Item slider*/
	$(".news>.slider").append( `<div class="slide row">
				                        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
				                          <img src="${news.img}" alt="${news.description.substr(0,10)}...">
				                          <p class="author">Author : ${news.author}</p>
				                          <p class="date">Date : ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}</p>
				                        </div>
				                        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
				                          <a href="${news.link}"><h4>Title</h4></a>
				                          <p>${news.description.length>maxLengthDesc ? news.description.substr(0,100)+'...' : news.description}</p>
				                        </div>
				                      </div>`);
})

/*Slider , Slick Library*/
$(".slider").slick({
	autoplay: true,
	autoplaySpeed: 2000,
	speed: 2000,
	dots: true,
	arrows: false
});

/*Check if got all data then hide loader and show contents*/
if(companyList.status==="OK" && newsList.status==="OK"){
	$(".loader").hide();
	$(".content").show();
}

})();