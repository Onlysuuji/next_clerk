https://www.eigo-duke.com/tango/eikenjun2.html#

const a = document.getElementById("item_list").querySelectorAll("tbody > tr")
const data = []
const bb = Array.from(a).slice(1, 15)
bb.forEach((tr) => {
    const question = tr.querySelector("td:nth-child(3) > div").innerText
    const japanese = tr.querySelector("td:nth-child(4) > div").innerText
    data.push({ language: "english", question, japanese, tag: "eikenjun2" })
})
const output = JSON.stringify(data, null, 2)
console.log(output)