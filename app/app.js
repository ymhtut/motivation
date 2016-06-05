(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dob) {
    this.renderAgeLoop();
  } else {
    this.renderChoose();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var value;

  if (value = localStorage.dob)
    this.dob = new Date(parseInt(value));
};

App.fn.save = function(){
  if (this.dob)
    localStorage.dob = this.dob.getTime();
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  this.dob = input.valueAsDate;
  this.save();
  this.renderAgeLoop();
};

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
};

App.fn.renderAgeLoop = function(){
  this.interval = setInterval(this.renderAge.bind(this), 100);
};

App.fn.renderAge = function(){
  var now       = new Date
  var duration  = now - this.dob;
  var years     = duration / 31556900000;

  var majorMinor = years.toFixed(9).toString().split('.');

  requestAnimationFrame(function(){
    this.html(this.view('age')({
      year:         majorMinor[0],
      milliseconds: majorMinor[1]
    }));
  }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('app'))

})();

var uni = document.querySelector("#unicode");
var zg = document.querySelector("#zawgyi");

$("#unicode").on("change keyup paste", function(){
    convert(uni);
});

$("#zawgyi").on("change keyup paste", function(){
    convert(zg);
});

var copyFacebook = document.querySelector('.copyFacebook');
var open = document.querySelector('.open');

open.addEventListener('click', function(event) {
  controlConverter();
});

function controlConverter(){
  var converter = document.querySelector('.converter');
  if(open.classList.contains('is-opened')){
    open.classList.remove('is-opened');
    open.innerHTML = "Open Converter";
    converter.style.marginLeft = "-450px";
  }else{
    open.classList.add('is-opened');
    open.innerHTML = "Close Converter";
    converter.style.marginLeft = "0px";
  }
}

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        controlConverter();
    }
}

copyFacebook.addEventListener('click', function(event) {
  var copyTextarea = document.querySelector('.copy-textarea');
  var copyResult = document.querySelector('.copy-result');
  var str = "Error";
  copyTextarea.value = "[Zawgyi]\n"+zg.value+"\n[Unicode]\n"+uni.value;
  copyTextarea.hidden = false;
  copyTextarea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    copyResult.style.color = "#4CAF50";
    str = "Done";
    copyTextarea.hidden = "hidden";
  } catch (err) {
    copyResult.style.color = "#DD2C00";
    str = "Error";
    copyTextarea.hidden = "hidden";
  }
  copyResult.innerHTML = str;
  copyResult.classList.remove('is-paused');
  setTimeout(function(){
    if(!copyResult.classList.contains('is-paused')){
      copyResult.classList.add('is-paused');
    }
  },2000);

});

function convert(textbox){
  switch (textbox.id) {
    case "unicode":
      zg.value = uni2zg(uni.value);
      break;
    case "zawgyi":
      uni.value = zg2uni(zg.value);
      break;
    default: break;
  }
}
