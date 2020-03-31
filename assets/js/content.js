/*
    Custom scripts for Music.Yandex.Ru
    (c) 2020, anchovy — No Limits for YaMusic
    //github.com/Anchovys/yandexmusic-adblocker
*/

var data = null; 
var lastInteract = Date.now();
var isPlaying = false;

window.addEventListener("load",  init, false);
window.addEventListener("click", onWindowClick );

function init() 
{
    data = getData(); // getting data about player

    if (data == null) // is null (run init loop)
    { 
        console.log("[yandex ad blocker] Can't init extension");
        setTimeout(init, 500); // looping 500 ms
        return;
    }
    else // success init
    {
        console.log("[yandex ad blocker] Success inited extension!");
        
        placeElement();

        atrTracking(document.getElementsByTagName("body")[0]);
    }
}

function onWindowClick()
{
    lastInteract = Date.now();
}

function atrTracking(element) 
{
    var observer = new MutationObserver(function(mutations)
    {
        mutations.forEach(function(mutation)
        {
            if (mutation.type == "attributes")
            {
                data = getData(); // update data to actual
                var diffInteractTime = (Date.now() - lastInteract) / 60000;

                console.log("[yandex ad blocker] MUTATE -- obj:" + JSON.stringify(data) + " -- t:" + diffInteractTime);

                // > 1 minute no interact
                if(data.playing == false && isPlaying && checkCrackdown())
                {
                    setTimeout(clickAction, 200);
                }

                isPlaying = data.playing;
            }
        });
    });
    
    observer.observe(element,
    {
        attributes: true
    });
}

function checkCrackdown()
{
    return document.getElementsByClassName("crackdown-popup").length > 0;
}

function clickAction() 
{
    if(checkCrackdown()) {
        setTimeout(function() 
        {
            document.getElementsByClassName("crackdown-popup__close")[0].click();
        }, 200);
        
        setTimeout(function() 
        {
            document.getElementsByClassName("player-controls__btn_play")[0].click();
        }, 200);
        
        lastInteract = Date.now();
    }

}

function placeElement()
{
    var elem = document.createElement('div');
        elem.id = "anc__ya-m_ad-blocker_loaded";
        elem.innerHTML = "YaMusic AD-blocker loaded!";
    document.body.appendChild(elem);

    elem.onclick = function()
    {
        elem.style.display = "none";
    }
}

function getData() 
{
    var jsonData = document.getElementsByTagName("body")[0].getAttribute("data-unity-state");

    var obj = JSON.parse(jsonData);
    return obj;
}