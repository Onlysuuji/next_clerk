//https://machibun.co.jp/china/hsk-word-fifth-level/

const aa = document.getElementById("entry")
const bb = Array.from(aa.querySelectorAll("section > table > tbody > tr")).slice(1, 11)
const data = [];
bb.forEach(row => {
    const question = row.querySelector("th").innerText;
    const japanese = row.querySelector("td:nth-child(3)").innerText;
    data.push({ language: "chinese", question, japanese, tag: "hsk5" })
})
const output = JSON.stringify(data, null, 2)
console.log(output)