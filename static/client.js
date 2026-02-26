/* global document */
const sendReq = async () => {
  const target = "https://www.example.com/";
  const response = await fetch(`/api/scrape?url=${encodeURIComponent(target)}`);

  document.getElementById("msg").textContent =
    `${response.status} ${response.statusText}`;

  const data = await response.json();
  document.getElementById("body").textContent = JSON.stringify(data, null, 2);
};

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btn").addEventListener("click", sendReq);
});
