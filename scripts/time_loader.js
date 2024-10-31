(function load_time() {
    var before_loadtime = new Date().getTime();
    document.addEventListener('DOMContentLoaded', () => {
        var loadTime = performance.now();
        document.getElementById("load_time").innerHTML = "Page load time is <b>" + Math.round(loadTime) + "</b> mc";
    })
}());
