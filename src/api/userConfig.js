const urlParams = new URLSearchParams(window.location.search);
var USERID = urlParams.get("userId");
var condition = urlParams.get("c");

if (!USERID) {
  USERID =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  window.location.search = "?userId=" + USERID;
}

if (condition == "C") {
  USERID += "-CONTROL";
} else {
  USERID += "-TREATMENT";
}

export { USERID };
